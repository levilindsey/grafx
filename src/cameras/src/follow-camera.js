import {ThirdPersonCamera} from './third-person-camera';

/**
 * This class defines an abstract follow camera.
 *
 * This is a third-person type of camera whose roll always matches that of the target.
 */
class FollowCamera extends ThirdPersonCamera {
  /**
   * Update the camera's orientation using the "look at" method according to its position and the
   * position of its target.
   *
   * @protected
   */
  _updateOrientation() {
    const target = this._cameraTarget.position;

    const viewDirection = vec3.create();
    vec3.subtract(viewDirection, target, this._position);
    vec3.normalize(viewDirection, viewDirection);

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
}

export {FollowCamera};
