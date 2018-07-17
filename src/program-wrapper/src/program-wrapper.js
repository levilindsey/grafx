import {
  isInDevMode,
  getViewportHeight,
  getViewportWidth,
  loadProgram,
} from '../../util';

import {UniformSetter} from './uniform-setter';

/**
 * This class wraps a native WebGLProgram object and provides convenience methods for:
 * - setting the wrapped program for use on the WebGL rendering context,
 * - enabling the attribute variables for the program,
 * - setting the attribute and uniform variables for the program,
 * - drawing shapes with the program and its current configuration.
 */
class ProgramWrapper {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} config
   */
  constructor(gl, config) {
    this.config = config;
    this._program = null;
    this._uniformSetters = null;
    this._attributeEnablers = null;
    this._attributeSetters = null;

    // This is used for assigning different textures to different texture units.
    this.baseTextureUnitIndex = 0;

    this._buildWebGLProgramPromise = this._buildWebGLProgram(gl, config);

    // TODO: Freeze this object after initializing
  }

  /** @returns {string} */
  get programId() {
    return this.config.id;
  }

  /** @returns {Promise} */
  getIsReady() {
    return this._buildWebGLProgramPromise;
  }

  /**
   * Sets this program to use for rendering on the given WebGL context.
   *
   * This also enables all relevant attribute variables for this program.
   *
   * @param {WebGLRenderingContext} gl
   */
  setProgram(gl) {
    gl.useProgram(this._program);
    this._enableAttributes();
    if (this.config.webGLStateSetter) this.config.webGLStateSetter(gl);
  }

  /**
   * Renders shapes using this program with the given variables configuration.
   *
   * @param {WebGLRenderingContext} gl
   * @param {ProgramVariablesConfig} [programVariablesConfig]
   * @param {number} [offset=0] Offset into the element array buffer to render from.
   * @param {number} [count=programVariablesConfig.elementCount] The number of elements to render.
   */
  draw(gl, programVariablesConfig, offset, count) {
    programVariablesConfig = programVariablesConfig || this.config.getProgramVariablesConfig(gl);
    this._setVariables(gl, programVariablesConfig);
    this._draw(gl, programVariablesConfig, offset, count);
  }

  /**
   * Sets up this WebGL rendering program to draw shapes with the given program variables
   * configuration and the attribute/uniform setters that have been set up for this program.
   *
   * @param {WebGLRenderingContext} gl
   * @param {ProgramVariablesConfig} programVariablesConfig
   * @private
   */
  _setVariables(gl, programVariablesConfig) {
    this._setAttributes(programVariablesConfig.attributes);
    this._setUniforms(programVariablesConfig.uniforms);

    // Check whether we are set up to draw using gl.drawElements rather than gl.drawArrays.
    if (programVariablesConfig.vertexIndices) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programVariablesConfig.vertexIndices);
    }
  }

  /**
   * Renders shapes according to this program's current configuration.
   *
   * @param {WebGLRenderingContext} gl
   * @param {ProgramVariablesConfig} programVariablesConfig
   * @param {number} [offset=0] Offset into the element array buffer to render from.
   * @param {number} [count=programVariablesConfig.elementCount] The number of elements to render.
   * @private
   */
  _draw(gl, programVariablesConfig, offset, count) {
    offset = typeof offset === 'number' ? offset : 0;
    count = typeof count === 'number' ? count : programVariablesConfig.elementCount;

    if (isInDevMode) {
      this._checkThatGivenVariablesMatchProgram(programVariablesConfig);
    }

    // Check whether we are set up to draw using gl.drawElements or gl.drawArrays.
    if (programVariablesConfig.vertexIndices) {
      gl.drawElements(programVariablesConfig.mode, count, gl.UNSIGNED_SHORT, offset);
    } else {
      gl.drawArrays(programVariablesConfig.mode, offset, count);
    }
  }

  /**
   * Checks whether the attribute and uniform variables specified in the given config match those
   * defined in this program.
   *
   * @param {ProgramVariablesConfig} programVariablesConfig
   * @private
   */
  _checkThatGivenVariablesMatchProgram(programVariablesConfig) {
    if (Object.keys(programVariablesConfig.attributes).length !==
            Object.keys(this._attributeSetters).length ||
        Object.keys(programVariablesConfig.uniforms).length !==
            Object.keys(this._uniformSetters).length) {
      console.warn('The attribute/uniform variables in the ProgramVariablesConfig do not match ' +
          'those specified in the shaders.', programVariablesConfig, this);
    }
  }

  /**
   * Sets the uniform values for this program.
   *
   * Specifically, this calls `gl.uniform<...>(location, value)` for each
   * variable-name/variable-value key-value pair in the given map. As part of the setup process, the
   * uniform variable locations are stored in a map from their corresponding variable names. So only
   * the variable names are needed in order to call this function at render time.
   *
   * @param {Object.<String, UniformData>} uniformValues
   */
  _setUniforms(uniformValues) {
    Object.keys(uniformValues).forEach(uniformName => {
      const uniformSetter = this._uniformSetters[uniformName];
      const uniformValue = uniformValues[uniformName];
      uniformSetter.setUniform(uniformValue);
    });
  }

  /**
   * Sets the attribute buffers for this program.
   *
   * Specifically, this calls `gl.bindBuffer(...)` and `gl.vertexAttribPointer(...)` for each
   * variable-name/variable-value pair in the given attribute-info map. As part of the setup
   * process, the uniform variable locations are stored in a map from their corresponding variable
   * names. So only the variable names are needed in order to call this function at render time.
   *
   * @param {Object.<String, AttributeConfig>} attributeConfigs
   */
  _setAttributes(attributeConfigs) {
    Object.keys(attributeConfigs).forEach(attributeName => {
      const attributeSetter = this._attributeSetters[attributeName];
      const attributeConfig = attributeConfigs[attributeName];
      attributeSetter(attributeConfig);
    });
  }

  /**
   * @private
   */
  _enableAttributes() {
    this._attributeEnablers.forEach(attributeEnabler => attributeEnabler());
  }

  /**
   * Creates uniform setters for this program and saves them in the _uniformSetters property.
   *
   * @param {WebGLRenderingContext} gl
   * @private
   */
  _createUniformSetters(gl) {
    const uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);

    this._uniformSetters = {};

    for (let index = 0; index < uniformCount; index++) {
      const uniformInfo = gl.getActiveUniform(this._program, index);
      let uniformName = uniformInfo.name;

      // Remove any array suffix.
      // TODO: Is this removal redundant with the isArray check below??
      if (uniformName.substr(-3) === '[0]') {
        uniformName = uniformName.substr(0, uniformName.length - 3);
      }

      this._uniformSetters[uniformName] = new UniformSetter(gl, this._program, uniformInfo, this);
    }
  }

  /**
   * Creates attribute enablers and setters for this program and saves them in the
   * _attributeEnablers and _attributeSetters properties, respectively.
   *
   * @param {WebGLRenderingContext} gl
   * @private
   */
  _createAttributeEnablersAndSetters(gl) {
    this._attributeEnablers = [];
    this._attributeSetters = {};

    const attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);

    for (let index = 0; index < attributeCount; index++) {
      const attributeName = gl.getActiveAttrib(this._program, index).name;
      const location = gl.getAttribLocation(this._program, attributeName);

      this._attributeEnablers.push(ProgramWrapper._createAttributeEnabler(gl, location));
      this._attributeSetters[attributeName] = ProgramWrapper._createAttributeSetter(gl, location);
    }
  }

  /**
   * Loads the shader source code from the given URLs, compiles the shader source code, and creates
   * a program from the resulting shaders.
   *
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} config
   * @returns {Promise}
   * @private
   */
  _buildWebGLProgram(gl, config) {
    return loadProgram(gl, config.vertexShaderPath, config.fragmentShaderPath)
        .then(webGLProgram => {
          this._program = webGLProgram;
          this._createUniformSetters(gl);
          this._createAttributeEnablersAndSetters(gl);
          if (config.initialize) config.initialize(gl);
        })
        .then(() => console.info(`Program loaded: ${config.id}`));
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {number} location
   * @returns {Function}
   * @private
   */
  static _createAttributeEnabler(gl, location) {
    return () => gl.enableVertexAttribArray(location);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {number} location
   * @returns {Function.<AttributeConfig>}
   * @private
   */
  static _createAttributeSetter(gl, location) {
    return attributeConfig => {
      gl.bindBuffer(gl.ARRAY_BUFFER, attributeConfig.buffer);
      gl.vertexAttribPointer(
          location,
          attributeConfig.size,
          typeof attributeConfig.type !== 'undefined' ? attributeConfig.type : gl.FLOAT,
          typeof attributeConfig.normalized !== 'undefined' ? attributeConfig.normalized : false,
          typeof attributeConfig.stride !== 'undefined' ? attributeConfig.stride : 0,
          typeof attributeConfig.offset !== 'undefined' ? attributeConfig.offset : 0);
    };
  }
}

export {ProgramWrapper};

/**
 * @typedef {Object} ProgramWrapperConfig
 * @property {string} id
 * @property {Function} [initialize] A method for one-time initialization of the GL state for this
 * program.
 * @property {Function} [webGLStateSetter] A method for setting up the GL state for this program
 * wrapper in preparation for the current draw call.
 * @property {number} [renderPriority] Programs with lower priority will render first. This does not
 * need to be present for ProgramWrappers that are children of a GroupProgramWrapper.
 * @property {string} [vertexShaderPath] This will be present on configs for non-group
 * ProgramWrappers.
 * @property {string} [fragmentShaderPath] This will be present on configs for non-group
 * ProgramWrappers.
 * @property {boolean} [isAPostProcessor=false] A post-processing program is used for manipulating
 * the entire frame after all the models have rendered.
 * @property {boolean} [childrenProgramConfigs] A grouping program consists of multiple child
 * programs that are all rendered in sequence for a related purpose.
 * @property {Array.<ChildProgramAndFramebufferIds>} [childrenProgramsToDraw] The IDs for the
 * sequence of children ProgramWrappers to draw, as well as the IDs for the input and output
 * framebuffers/textures to use. This will be present on configs for GroupProgramWrappers.
 * @property {Array.<string>} [childrenFramebufferIds] The IDs of all the framebuffers/textures that
 * will need to be created for this program. This will be present on configs for
 * GroupProgramWrappers.
 * @property {Function} [getProgramVariablesConfig] A method for getting the variables needed for
 * drawing this program. This will be present on configs of programs that are children of a
 * GroupProgramWrapper.
 */

/**
 * @typedef {Object} ChildProgramAndFramebufferIds
 * @property {string} programId The ID of the program to draw with.
 * @property {Array.<string>} inputFramebufferIds The IDs of framebuffers whose textures will be
 * used as inputs for this program's shaders.
 * @property {string} outputFramebufferId Provide null in order to render to the canvas.
 */

/**
 * @typedef {Object} ProgramVariablesConfig
 * @property {Object.<String, AttributeConfig>} attributes A mapping from attribute names to
 * attribute info.
 * @property {Object.<String, UniformData>} uniforms A mapping from uniform names to uniform info.
 * @property {number} mode Specifies the type of primitives to render; one of:
 *   - gl.POINTS,
 *   - gl.LINES,
 *   - gl.LINE_STRIP,
 *   - gl.LINE_LOOP,
 *   - gl.TRIANGLES,
 *   - gl.TRIANGLE_STRIP,
 *   - gl.TRIANGLE_FAN.
 * @property {WebGLBuffer} [vertexIndices] The indices to use for retrieving the vertex info from
 * each of the other attribute variable buffers. If this property is present, then the rendering
 * pipeline will be set up to use gl.drawElements (with gl.ELEMENT_ARRAY_BUFFER) instead of
 * gl.drawArrays.
 * @property {number} elementCount The number of elements/vertices to render for this variables
 * configuration.
 */

/**
 * @typedef {Object} AttributeConfig
 * @property {WebGLBuffer} buffer The buffer containing this attribute's data.
 * @property {number} index Index of target attribute in the buffer bound to gl.ARRAY_BUFFER.
 * @property {number} size The number of components per attribute. Must be 1,2,3,or 4.
 * @property {number} type Specifies the data type of each component in the array. Use either
 * gl.FLOAT or gl.FIXED.
 * @property {boolean} normalized If true, then values will be normalized to a range of -1 or 0 to
 * 1.
 * @property {number} stride Specifies the offset in bytes between the beginning of consecutive
 * vertex attributes. Default value is 0, maximum is 255. Must be a multiple of type.
 * @property {number} offset Specifies an offset in bytes of the first component of the first
 * vertex attribute in the array. Default is 0 which means that vertex attributes are tightly
 * packed. Must be a multiple of type.
 */

/** @typedef {*} UniformData */
