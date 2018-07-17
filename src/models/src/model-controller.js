import {PersistentAnimationJob} from '../../../../animatex';
import {
  programWrapperStore,
  textureStore,
} from '../../program-wrapper';

/**
 * This class defines a model-controller class.
 *
 * This should be extended by all components that handle models--i.e., anything that will be
 * rendering shapes.
 *
 * @implements {ModelControllerInterface}
 * @abstract
 */
class ModelController extends PersistentAnimationJob {
  /**
   * PRECONDITION: The ProgramWrapper referenced by the given params must have already been
   * registered.
   *
   * @param {ModelControllerConfig} params
   */
  constructor(params) {
    super();

    // ModelController is an abstract class. It should not be instantiated directly.
    if (new.target === ModelController) {
      throw new TypeError('Cannot construct ModelController instances directly');
    }

    this._gl = params.gl;
    this._getViewMatrix = params.getViewMatrix;
    this._getProjectionMatrix = params.getProjectionMatrix;
    this._getParentWorldTransform = params.getParentWorldTransform;
    this._localTransform = mat4.create();
    this._worldTransform = mat4.create();
    this._texture = null;
    this._programWrapper = null;
    this._programWrapperId = null;
    this._drawFrameHandler = () => this.draw();
    this._programVariablesConfig = null;

    this.position = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);

    this._setUpTexture(params.texturePath);
    this._setUpProgramWrapper(params.programWrapperId);

    this._isReadyPromise = Promise.all([
      this._texturePromise,
      this._programWrapperPromise,
    ]);
  }

  reset() {}

  /**
   * Called when this is done being used, and is being destroyed from memory.
   */
  destroy() {
    programWrapperStore.unregisterDrawFrameHandler(this._programWrapperId, this._drawFrameHandler);
  }

  /**
   * Calls update, updateTransforms, and updateChildren.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  updateSelfAndChildren(currentTime, deltaTime) {
    this.update(currentTime, deltaTime);
    this.updateTransforms();
    this.updateChildren(currentTime, deltaTime);
  }

  /**
   * Updates relevant state for the sub-class.
   *
   * - This does not recursively update descendant model controllers; that's handled by
   *   updateChildren.
   * - This does not update the local or world-coordinate transforms; that's handled by
   *   updateTransforms.
   * - This is called before updateLocalTransform and updateChildren.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(currentTime, deltaTime) {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * Updates the world-coordinate and local-coordinate model matrices.
   *
   * This is called after update and before updateChildren.
   *
   * NOTE: All overrides of this method should update [this._localTransform].
   */
  updateTransforms() {
    mat4.multiply(this._worldTransform, this._getParentWorldTransform(), this._localTransform);
  }

  /**
   * Updates relevant state for any children model controllers.
   *
   * This is called after update and updateLocalTransform.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  updateChildren(currentTime, deltaTime) {}

  /**
   * @abstract
   */
  draw() {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * Gets the model transform matrix, in local coordinates.
   *
   * @returns {mat4}
   */
  get localTransform() {
    return this._localTransform;
  }

  /**
   * Gets the model transform matrix, in world coordinates.
   *
   * @returns {mat4}
   */
  get worldTransform() {
    return this._worldTransform;
  }

  /**
   * Returns a promise that resolves when this model controller is ready for the app to run.
   *
   * @returns {Promise}
   */
  getIsReady() {
    return this._isReadyPromise;
  }

  /** @param {string} id */
  set programWrapperId(id) {
    programWrapperStore.unregisterDrawFrameHandler(this._programWrapperId, this._drawFrameHandler);
    this._setUpProgramWrapper(id);
  }

  /** @param {string} value */
  set texturePath(value) {
    this._setUpTexture(value);
  }

  /**
   * Initializes the program variables configuration.
   *
   * @protected
   * @abstract
   */
  _setUpProgramVariablesConfig() {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * @param {string} [texturePath]
   * @returns {Promise}
   * @private
   */
  _setUpTexture(texturePath) {
    this._texturePromise = texturePath
        ? textureStore.loadTexture(this._gl, texturePath)
        : Promise.resolve(null);

    // Assign the actual texture.
    this._texturePromise = this._texturePromise
        .then(texture => this._texture = texture)
        .then(() => this._setUpProgramVariablesConfig());

    return this._texturePromise;
  }

  /**
   * @param {string} id
   * @returns {Promise}
   * @private
   */
  _setUpProgramWrapper(id) {
    this._programWrapperId = id;
    this._programWrapperPromise = programWrapperStore.getProgramWrapperPromise(id)
        .then(programWrapper => this._programWrapper = programWrapper);
    Promise.all([this._programWrapperPromise, this._texturePromise])
        .then(() => programWrapperStore.registerDrawFrameHandler(id, this._drawFrameHandler));
    return this._programWrapperPromise;
  }
}

export {ModelController};

/**
 * @typedef {Object} ModelControllerInterface
 * @property {Function.<Promise>} getIsReady
 * @property {Function} reset
 * @property {Function} destroy
 * @property {mat4} localTransform
 * @property {mat4} worldTransform
 * @property {vec3} position
 */

/**
 * @typedef {Object} ModelControllerConfig
 * @property {WebGLRenderingContext} gl
 * @property {Function.<mat4>} getViewMatrix
 * @property {Function.<mat4>} getProjectionMatrix
 * @property {Function.<mat4>} getParentWorldTransform
 * @property {string} programWrapperId
 * @property {string} [texturePath]
 */

/**
 * @typedef {Object} ModelGroupControllerConfig
 * @property {WebGLRenderingContext} gl
 * @property {Function.<mat4>} getViewMatrix
 * @property {Function.<mat4>} getProjectionMatrix
 * @property {Function.<mat4>} getParentWorldTransform
 */
