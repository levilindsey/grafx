import {Camera} from './camera';

/**
 * This class defines a fixed camera.
 *
 * A fixed camera's position and orientation are updated manually and remain fixed until a later
 * update.
 */
class FixedCamera extends Camera {
  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {FixedCameraConfig} fixedCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  constructor(fixedCameraParams, cameraParams, oldCamera) {
    super(cameraParams, oldCamera);

    this._position = fixedCameraParams.position;
    this._viewDirection = fixedCameraParams.viewDirection;
    this._up = fixedCameraParams._up;
    this.__target = vec3.create();
  }

  reset() {
    super.reset();
    this._update();
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(currentTime, deltaTime) {}

  _update() {
    vec3.normalize(this._viewDirection, this._viewDirection);
    vec3.normalize(this._up, this._up);

    // Transform "up" to align with the camera's local z-axis.
    const right = vec3.create();
    vec3.cross(right, this._viewDirection, this._up);
    vec3.cross(this._up, right, this._viewDirection);

    this._setPositionAndLookAt(this._position, this._target, this._up, this._viewDirection);
  }

  /** @param {vec3} newDirection */
  set viewDirection(newDirection) {
    vec3.copy(this._viewDirection, newDirection);
    this._update();
  }

  /** @param {vec3} newUp */
  set up(newUp) {
    vec3.copy(this._up, newUp);
    this._update();
  }

  /** @param {vec3} newPosition */
  set position(newPosition) {
    vec3.copy(this._position, newPosition);
    this._update();
  }

  /** @returns {vec3} */
  // TODO: Look into whatever bug prevents the parent-class getter from working.
  get position() {
    return this._position;
  }

  /** @returns {vec3} */
  get viewDirection() {
    return this._viewDirection;
  }
  /** @returns {vec3} */
  get up() {
    return this._up;
  }
  /**
   * @returns {vec3}
   * @private
   */
  get _target() {
    return vec3.add(this.__target, this._position, this._viewDirection);
  }

  /**
   * @param {Camera} oldCamera
   * @protected
   */
  _matchOldCamera(oldCamera) {
    super._matchOldCamera(oldCamera);
    if (oldCamera instanceof FixedCamera) {
      vec3.copy(this._viewDirection, oldCamera._viewDirection);
      vec3.copy(this._up, oldCamera._up);
    }
  }
}

export {FixedCamera};
