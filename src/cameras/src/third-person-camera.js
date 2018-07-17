import {Camera} from './camera';

/**
 * This class defines an abstract third-person camera.
 *
 * A third-person camera follows a target from a distance.
 *
 * @abstract
 */
class ThirdPersonCamera extends Camera {
  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {CameraTarget} cameraTarget
   * @param {FollowCameraConfig} followCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  constructor(cameraTarget, followCameraParams, cameraParams, oldCamera) {
    super(cameraParams, oldCamera);

    // ThirdPersonCamera is an abstract class. It should not be instantiated directly.
    if (new.target === ThirdPersonCamera) {
      throw new TypeError('Cannot construct ThirdPersonCamera instances directly');
    }

    this._followCameraParams = followCameraParams;
    this._cameraTarget = cameraTarget;
  }

  /**
   * The intended position for this camera to be in according to the position and orientation of the
   * camera target.
   *
   * @returns {vec3}
   * @protected
   * @abstract
   */
  _getIntendedPosition() {
    const intendedPosition = vec3.create();
    vec3.transformMat4(
        intendedPosition,
        this._followCameraParams._intendedTranslationFromTarget,
        this._cameraTarget.worldTransform);
    return intendedPosition;
  }

  /** @param {CameraTarget} cameraTarget */
  set cameraTarget(cameraTarget) {
    this._cameraTarget = cameraTarget;
  }
}

export {ThirdPersonCamera};

/**
 * @typedef {Object} CameraTarget
 * @property {vec3} position In world coordinates.
 * @property {quat} orientation Relative to the world axes.
 * @property {mat4} worldTransform The model transform matrix, in world coordinates.
 */
