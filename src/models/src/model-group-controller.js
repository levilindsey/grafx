import { PersistentAnimationJob } from '../../../../animatex';

/**
 * This class controls groups of models.
 *
 * This is useful for higher-level controllers that control other models and also transform them.
 *
 * @implements {ModelControllerInterface}
 * @abstract
 */
class ModelGroupController extends PersistentAnimationJob {
  /**
   * If either of the shader paths are omitted, then this model controller will not create a
   * rendering program configuration.
   *
   * @param {ModelGroupControllerConfig} params
   */
  constructor(params) {
    super();

    // ModelGroupController is an abstract class. It should not be instantiated directly.
    if (new.target === ModelGroupController) {
      throw new TypeError('Cannot construct ModelGroupController instances directly');
    }

    this._gl = params.gl;
    this._getViewMatrix = params.getViewMatrix;
    this._getProjectionMatrix = params.getProjectionMatrix;
    this._getParentWorldTransform = params.getParentWorldTransform || (() => mat4.create());
    this._localTransform = mat4.create();
    this._worldTransform = mat4.create();
    this._modelCtrls = [];
  }

  destroy() {
    this.clearModelControllers();
  }

  reset() {
    this._triggerOnAllModelControllers('reset');
  }

  clearModelControllers() {
    this._triggerOnAllModelControllers('destroy');
    this._modelCtrls = [];
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
  update(currentTime, deltaTime) {}

  /**
   * Updates the world-coordinate and local-coordinate model matrices.
   *
   * This is called after update and before updateChildren.
   *
   * NOTE: All implementations of this method should update [this._localTransform].
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
  updateChildren(currentTime, deltaTime) {
    this._triggerOnAllModelControllers('updateSelfAndChildren', [currentTime, deltaTime]);
  }

  draw() {
    // We don't call draw on the children model controllers, because they register themselves to be
    // drawn with their given shader program.
  }

  /**
   * @param {ModelControllerInterface} modelCtrl
   * @returns {Promise.<ModelControllerInterface>}
   * @protected
   */
  _startModelController(modelCtrl) {
    return modelCtrl.getIsReady().then(() => {
      modelCtrl.reset();
      this._modelCtrls.push(modelCtrl);
      return modelCtrl;
    });
  }

  /**
   * @param {ModelControllerInterface} modelCtrl
   * @protected
   */
  _onModelControllerDestroyed(modelCtrl) {
    const index = this._modelCtrls.indexOf(modelCtrl);
    this._modelCtrls.splice(index, 1);
    modelCtrl.destroy();
  }

  /**
   * @param {vec3} targetPosition
   * @param {number} maxSquaredDistance
   * @protected
   */
  _removeDistantModelControllers(targetPosition, maxSquaredDistance) {
    this._modelCtrls
      // Get the ModelControllers that are too far away.
      .filter(modelCtrl =>
        vec3.squaredDistance(modelCtrl.position, targetPosition) > maxSquaredDistance)
      // Remove the far-away ModelControllers.
      .forEach(modelCtrl => this._onModelControllerDestroyed(modelCtrl));
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
    return Promise.all(this._modelCtrls.map(controller => controller.getIsReady()));
  }

  /**
   * @param {string} methodName
   * @param {Array.<*>} [args]
   * @protected
   */
  _triggerOnAllModelControllers(methodName, args = []) {
    //this._demoObject[methodName](...args);
    this._modelCtrls.forEach(object => object[methodName](...args));
  }
}

export { ModelGroupController };
