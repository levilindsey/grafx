import {ThirdPersonCamera} from './third-person-camera';

/**
 * This class defines an overhead camera.
 *
 * An overhead camera sits above the observed character and moves relative to the character without
 * rotating.
 *
 * An overhead camera's rotation with the character includes only yaw; it has a fixed pitch and
 * roll.
 */
class OverheadCamera extends ThirdPersonCamera {
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
    super(cameraTarget, followCameraParams, cameraParams, oldCamera);

    this.reset();
  }

  reset() {
    super.reset();
  }

  // TODO: Implement this!
}

export {OverheadCamera};
