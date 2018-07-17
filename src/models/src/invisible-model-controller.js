import {ModelController} from './model-controller';

/**
 * This class defines an extension of the model-controller class that will maintain state but will
 * never render anything.
 */
class InvisibleModelController extends ModelController {
  /**
   * @param {ModelControllerConfig} params
   */
  constructor(params) {
    super(params);
  }

  destroy() {}

  update(currentTime, deltaTime) {}

  draw() {}

  /**
   * Initializes the program variables configuration.
   *
   * @protected
   */
  _setUpProgramVariablesConfig() {
    this._programVariablesConfig = {};
  }

  /**
   * Overrides the default method to instead do nothing.
   *
   * @param {string} id
   * @returns {Promise}
   */
  _setUpProgramWrapper(id) {
    this._programWrapperId = id;
    this._programWrapperPromise = Promise.resolve(null);
    return this._programWrapperPromise;
  }
}

export {InvisibleModelController};
