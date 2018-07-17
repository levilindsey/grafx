import {FollowCamera} from './follow-camera';

/**
 * This class defines a fixed-offset follow camera.
 *
 * This camera is positioned at a relative, fixed distance and rotation from the observed target
 * and follows the target's position and orientation at this fixed distance.
 *
 * A follow camera rotates in all three dimensions; it does not have a fixed roll.
 */
class FixedFollowCamera extends FollowCamera {
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
}

export {FixedFollowCamera};
