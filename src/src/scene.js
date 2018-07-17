import { ModelGroupController } from '../models';

/**
 * This class handles the overall scene.
 */
class Scene extends ModelGroupController {
  /**
   * @param {ModelGroupControllerConfig} modelControllerParams
   */
  constructor(modelControllerParams) {
    super(modelControllerParams);

    // Scene is an abstract class. It should not be instantiated directly.
    if (new.target === Scene) {
      throw new TypeError('Cannot construct Scene instances directly');
    }

    this._getWorldTransform = () => this.worldTransform;
    this._lights = [];
    this._camera = null;
  }

  reset() {
    super.reset();
    this._lights.forEach(light => light.reset());
    this._camera.reset();
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  updateChildren(currentTime, deltaTime) {
    super.updateChildren(currentTime, deltaTime);
    this._camera.update(currentTime, deltaTime);
  }

  /** @returns {Camera} */
  get camera() {
    return this._camera;
  }
}

export { Scene };
