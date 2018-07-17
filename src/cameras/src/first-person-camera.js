import { Camera } from './camera';

/**
 * This class defines a first-person camera.
 *
 * A first-person camera is positioned at a character and moves and rotates with the character.
 */
class FirstPersonCamera extends Camera {
  /**
   * @param {CameraTarget} cameraTarget
   * @param {FirstPersonCameraConfig} firstPersonCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  constructor(cameraTarget, firstPersonCameraParams, cameraParams, oldCamera) {
    super(cameraParams, oldCamera);
    this._cameraTarget = cameraTarget;
    this._firstPersonCameraParams = firstPersonCameraParams;
    this._cameraTarget = cameraTarget;
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(currentTime, deltaTime) {
    this._updatePosition();
    this._updateOrientation();
  }

  /**
   * @private
   */
  _updatePosition() {
    const intendedPosition = this._getIntendedPosition();
    vec3.copy(this._position, intendedPosition);
  }

  /**
   * Update the camera's orientation using the "look at" method according to its position and the
   * position of its target.
   *
   * @protected
   */
  _updateOrientation() {
    // Get the view direction, and transform it to align with the target's orientation.
    const viewDirection = vec3.create();
    vec3.copy(viewDirection, this._firstPersonCameraParams.viewDirection);
    vec3.transformQuat(viewDirection, viewDirection, this._cameraTarget.orientation);

    const target = vec3.create();
    vec3.scaleAndAdd(target, this._position, viewDirection,
      this._firstPersonCameraParams.targetDistance);

    // Initialize "up" as the world z-axis.
    const up = vec3.fromValues(0, 1, 0);

    // Transform "up" to align with the camera target's local z-axis.
    vec3.transformQuat(up, up, this._cameraTarget.orientation);

    const right = vec3.create();
    vec3.cross(right, viewDirection, up);

    // Transform "up" to align with the camera's local z-axis.
    vec3.cross(up, right, viewDirection);

    this._setPositionAndLookAt(this._position, target, up, viewDirection);
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
      this._firstPersonCameraParams.intendedDisplacementFromTarget,
      this._cameraTarget.worldTransform);
    return intendedPosition;
  }
}

export { FirstPersonCamera };
