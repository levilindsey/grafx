import {
  animator,
  PersistentAnimationJob
} from '../../../animatex';
import {PhysicsEngine} from '../../../physx';
import {
  ProgramWrapper,
  programWrapperStore,
  textureStore
} from '../program-wrapper';
import {
  bindFramebuffer,
  bindGLContextToViewportDimensions,
  getWebGLContext,
  getViewportHeight,
  getViewportWidth,
} from '../util';

/**
 * This top-level Controller class initializes and runs the rest of the app.
 */
class GrafxController extends PersistentAnimationJob {
  constructor() {
    super();

    this._canvas = null;
    this._gl = null;
    this._scene = null;
    this._currentProgramWrapper = null;
  }

  /**
   * Initializes the app. After this completes successfully, call run to actually start the app.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Array.<ProgramWrapperConfig>} programConfigs Configurations for program wrappers that
   * should be pre-cached before starting the rest of the app.
   * @param {Array.<String>} texturePaths Texture images that should be pre-cached before
   * starting the rest of the app.
   * @param {Function.<Scene>} sceneFactory
   * @returns {Promise}
   */
  initialize(canvas, programConfigs, texturePaths, sceneFactory) {
    this._canvas = canvas;

    return Promise.resolve()
        .then(() => this._setUpWebGLContext())
        .then(() => Promise.all([
          this._preCachePrograms(programConfigs),
          this._preCacheTextures(texturePaths)
        ]))
        .then(() => this._setUpScene(sceneFactory));
  }

  destroy() {}

  reset() {
    // FIXME: Will it be easier to replace this with initialize?
    this._scene.reset();
  }

  /**
   * Runs the app. This should be called after initialize.
   *
   * A few things happen if this is run in dev mode:
   * - The draw and update steps of each frame are wrapped in a try/catch block.
   * - This method returns a Promise that rejects if an error is throw during any update or draw
   *   step and resolves when this controller has finished (currently never)
   */
  run() {
    this._startAnimator();
  }

  _startAnimator() {
    animator.startJob(PhysicsEngine.instance);
    animator.startJob(this);
  }

  /**
   * Updates the scene.
   *
   * This updates all of the current parameters for each component in the scene for the current
   * frame. However, this does not render anything. Rendering is done by a following call to the
   * draw function.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(currentTime, deltaTime) {
    this._scene.updateSelfAndChildren(currentTime, deltaTime);
  }

  /**
   * Draws the scene.
   *
   * This renders the current frame for all components in the scene. This assumes that all relevant
   * parameter updates for this frame have already been computed by a previous call to _updateScene.
   */
  draw() {
    // Clear the canvas before we start drawing on it.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // If we are using a post-processing program, then we need to render models to a framebuffer
    // rather than directly to the canvas.
    if (programWrapperStore.isUsingPostProcessingPrograms) {
      bindFramebuffer(this._gl, programWrapperStore.modelsFramebuffer);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }

    // Draw each program separately. This minimizes how many times we need to switch programs by
    // grouping all of the draw calls for models that use the same program/shaders.
    programWrapperStore.forEachModelProgram((programWrapper, drawFrameHandlers) =>
        this._drawModelProgram(programWrapper, drawFrameHandlers));
    programWrapperStore.forEachPostProcessingProgram(
        (programWrapper) => this._drawPostProcessingProgram(programWrapper));
  }

  /**
   * For the given program key, this binds the registered shader program to the GL rendering context
   * and calls each of the registered draw-frame handlers.
   *
   * @param {ProgramWrapper|GroupProgramWrapper} programWrapper
   * @param {Set.<Function>} [drawFrameHandlers]
   * @private
   */
  _drawModelProgram(programWrapper, drawFrameHandlers) {
    // Check whether we need to switch programs (always true if there is more than one program
    // registered).
    if (this._currentProgramWrapper !== programWrapper) {
      programWrapper.setProgram(this._gl);
      this._currentProgramWrapper = programWrapper;
    }

    // Call each of the draw-frame handlers that use the current rendering program.
    drawFrameHandlers.forEach(drawFrameHandler => drawFrameHandler());
  }

  /**
   * For the given program key, this binds the registered shader program to the GL rendering context
   * and calls each of the registered draw-frame handlers.
   *
   * @param {ProgramWrapper|GroupProgramWrapper} programWrapper
   * @private
   */
  _drawPostProcessingProgram(programWrapper) {
    this._currentProgramWrapper = programWrapper;
    programWrapper.draw(this._gl);
  }

  /**
   * Initializes the WebGL rendering context.
   *
   * @private
   */
  _setUpWebGLContext() {
    // Get the WebGL rendering context.
    try {
      this._gl = getWebGLContext(this._canvas);
    } catch (e) {
      alert('WebGL is not supported by your browser! :(');
      throw e;
    }

    // Have the canvas context match the resolution of the window's viewport.
    bindGLContextToViewportDimensions(this._canvas, this._gl, () => this._updateAspectRatio());

    // Clear everything to black.
    this._gl.clearColor(0, 0, 0, 1);
    this._gl.clearDepth(1);

    // Enable depth testing.
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);
  }

  /**
   * Loads, compiles, caches, and initializes some rendering programs.
   *
   * @param {Array.<ProgramWrapperConfig>} programConfigs
   * @returns {Promise}
   * @private
   */
  _preCachePrograms(programConfigs) {
    const promises =
        programConfigs.map(config => programWrapperStore.loadProgramWrapper(this._gl, config));
    return Promise.all(promises);
  }

  /**
   * Loads, compiles, and caches some textures.
   *
   * @param {Array.<String>} texturePaths
   * @returns {Promise}
   * @private
   */
  _preCacheTextures(texturePaths) {
    return Promise.all(texturePaths
        .map(texturePath => textureStore.loadTexture(this._gl, texturePath)));
  }

  /**
   * Initializes the scene.
   *
   * @param {Function.<Scene>} sceneFactory
   * @returns {Promise}
   * @abstract
   * @protected
   */
  _setUpScene(sceneFactory) {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * @protected
   */
  _updateAspectRatio() {
    this._scene.camera.aspectRatio = getViewportWidth() / getViewportHeight();
    _resizeFramebuffersToMatchViewportSize(this._gl);
  }

  /**
   * @returns {mat4}
   * @protected
   */
  _getViewMatrix() {
    return this._scene.camera.viewMatrix;
  }

  /**
   * @returns {mat4}
   * @protected
   */
  _getProjectionMatrix() {
    return this._scene.camera.projectionMatrix;
  }
}

/**
 * @param {WebGLRenderingContext} gl
 * @private
 */
function _resizeFramebuffersToMatchViewportSize(gl) {
  if (programWrapperStore.isUsingPostProcessingPrograms) {
    const width = getViewportWidth();
    const height = getViewportHeight();

    // Update the per-model framebuffer texture.
    const texture = programWrapperStore.modelsTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Update the per-model framebuffer depth render buffer.
    const renderBuffer = programWrapperStore.modelsRenderBuffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // Update the post-processing framebuffer textures.
    programWrapperStore.forEachPostProcessingProgram(programWrapper => {
      programWrapper.config.childrenFramebufferIds.forEach(id => {
        const texture = programWrapperStore.getTexture(id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      });
    });
  }
}

export {GrafxController};
