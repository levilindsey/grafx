/**
 * This class stores a function for setting a value to a WebGL uniform variable.
 *
 * This is intended for use as a helper for the ProgramWrapper class.
 */
// TODO: Write tests for this class.
class UniformSetter {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLProgram} program
   * @param {WebGLActiveInfo} uniformInfo
   * @param {ProgramWrapper} programWrapper
   * @throws If the given uniformInfo specifies an unexpected uniform-value type.
   */
  constructor(gl, program, uniformInfo, programWrapper) {
    this._location = gl.getUniformLocation(program, uniformInfo.name);
    this._setter = this._getSetter(gl, uniformInfo, programWrapper);

    // TODO: Freeze this object after initializing
  }

  /**
   * @param {UniformData} uniformValue
   */
  setUniform(uniformValue) {
    uniformValue = uniformValue instanceof Array ? new Float32Array(uniformValue) : uniformValue;
    this._setter(uniformValue);
  }

  /** @returns {WebGLUniformLocation} */
  get location() {
    return this._location;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLActiveInfo} uniformInfo
   * @param {ProgramWrapper} programWrapper
   * @returns {Function.<*>}
   * @throws If the given uniformInfo specifies an unexpected uniform-value type.
   * @private
   */
  _getSetter(gl, uniformInfo, programWrapper) {
    const isArray = uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]';
    const setterMap = isArray ? {
      [gl.FLOAT]: value => gl.uniform1fv(this._location, value),
      [gl.INT]: value => gl.uniform1iv(this._location, value),
      [gl.SAMPLER_2D]: this._getUniformTextureArraySetter(gl, gl.TEXTURE_2D, uniformInfo.size,
          programWrapper),
      [gl.SAMPLER_CUBE]: this._getUniformTextureArraySetter(gl, gl.TEXTURE_CUBE_MAP,
          uniformInfo.size, programWrapper),
    } : {
      [gl.FLOAT]: value => gl.uniform1f(this._location, value),
      [gl.FLOAT_VEC2]: value => gl.uniform2fv(this._location, value),
      [gl.FLOAT_VEC3]: value => gl.uniform3fv(this._location, value),
      [gl.FLOAT_VEC4]: value => gl.uniform4fv(this._location, value),
      [gl.INT]: value => gl.uniform1i(this._location, value),
      [gl.INT_VEC2]: value => gl.uniform2iv(this._location, value),
      [gl.INT_VEC3]: value => gl.uniform3iv(this._location, value),
      [gl.INT_VEC4]: value => gl.uniform4iv(this._location, value),
      [gl.BOOL]: value => gl.uniform1i(this._location, value),
      [gl.BOOL_VEC2]: value => gl.uniform2iv(this._location, value),
      [gl.BOOL_VEC3]: value => gl.uniform3iv(this._location, value),
      [gl.BOOL_VEC4]: value => gl.uniform4iv(this._location, value),
      [gl.FLOAT_MAT2]: value => gl.uniformMatrix2fv(this._location, false, value),
      [gl.FLOAT_MAT3]: value => gl.uniformMatrix3fv(this._location, false, value),
      [gl.FLOAT_MAT4]: value => gl.uniformMatrix4fv(this._location, false, value),
      [gl.SAMPLER_2D]: this._getUniformTextureSetter(gl, gl.TEXTURE_2D,
          programWrapper.baseTextureUnitIndex++),
      [gl.SAMPLER_CUBE]: this._getUniformTextureSetter(gl, gl.TEXTURE_CUBE_MAP,
          programWrapper.baseTextureUnitIndex++),
    };
    return setterMap[uniformInfo.type];
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {number} target An enum describing the type of this buffer; one of:
   *   - gl.TEXTURE_2D,
   *   - gl.TEXTURE_CUBE_MAP.
   * @param {number} uniformSize
   * @param {ProgramWrapper} programWrapper
   * @returns {Function.<*>}
   * @private
   */
  _getUniformTextureArraySetter(gl, target, uniformSize, programWrapper) {
    const textureUnitIndices =
        Array.from({length: uniformSize}, _ => programWrapper.baseTextureUnitIndex++);

    return textures => {
      textures.forEach((texture, index) => {
        gl.activeTexture(gl.TEXTURE0 + textureUnitIndices[index]);
        gl.bindTexture(target, texture);
      });
      gl.uniform1iv(this._location, textureUnitIndices);
    };
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {number} target An enum describing the type of this buffer; one of:
   *   - gl.TEXTURE_2D,
   *   - gl.TEXTURE_CUBE_MAP.
   * @param {number} textureUnitIndex
   * @returns {Function.<*>}
   * @private
   */
  _getUniformTextureSetter(gl, target, textureUnitIndex) {
    return texture => {
      gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);
      gl.bindTexture(target, texture);
      gl.uniform1i(this._location, textureUnitIndex);
    };
  }
}

export {UniformSetter};
