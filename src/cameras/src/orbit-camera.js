import {ThirdPersonCamera} from './third-person-camera';

/**
 * This class defines an orbit camera.
 *
 * An orbit camera sits behind and above the observed character and rotates around the character as
 * they turn.
 *
 * An orbit camera's rotation with the character includes yaw and pitch; it has a fixed roll.
 */
class OrbitCamera extends ThirdPersonCamera {
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

export {OrbitCamera};
