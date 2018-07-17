import {PersistentAnimationJob} from '../../../../animatex';

// TODO: Make the rotation quaternion based with 6DoF.

// TODO: Add support for scripting the camera to follow a curve:
// (https://msdn.microsoft.com/en-us/library/bb203908(v=xnagamestudio.31).aspx)

/**
 * This class defines common camera logic.
 *
 * @abstract
 */
class Camera extends PersistentAnimationJob {
  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  constructor(cameraParams, oldCamera) {
    super();

    // Camera is an abstract class. It should not be instantiated directly.
    if (new.target === Camera) {
      throw new TypeError('Cannot construct Camera instances directly');
    }

    this._cameraParams = cameraParams;
    this._fovY = null;
    this._aspectRatio = null;
    this._zNear = null;
    this._zFar = null;
    this._position = vec3.create();
    this._orientation = quat.create();// TODO: Use this.
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
    this._viewProjectionMatrix = mat4.create();

    this._matchOldCamera(oldCamera);
  }

  reset() {
    this._setPerspective(this._cameraParams.fovY, this._cameraParams.defaultAspectRatio,
        this._cameraParams.zNear, this._cameraParams.zFar);
  }

  // TODO: Call this after adding support for dynamically switching cameras.
  destroy() {}

  /**
   * Set this camera's orientation and position.
   *
   * @param {vec3} eye The camera position.
   * @param {vec3} target The focal point.
   * @param {vec3} up The local up direction.
   * @param {vec3} viewDirection The (normalized) direction the camera is looking.
   * @protected
   */
  _setPositionAndLookAt(eye, target, up, viewDirection) {
    vec3.copy(this._position, eye);
    this._setLookAtFromCurrentPosition(target, up, viewDirection);
  }

  /**
   * Set this camera's orientation, but do not change its position.
   *
   * @param {vec3} target The focal point.
   * @param {vec3} up The local up direction.
   * @param {vec3} viewDirection The (normalized) direction the camera is looking.
   * @protected
   */
  _setLookAtFromCurrentPosition(target, up, viewDirection) {
    mat4.lookAt(this._viewMatrix, this._position, target, up);
    quat.rotationTo(this._orientation, this._cameraParams._defaultLookAtDirection, viewDirection);// TODO: Check this; might need to swap arguments.
    this._updateViewProjectionMatrix();
  }

  /**
   * Translate this camera by the given amount from its current position.
   *
   * @param {vec3} translation
   * @protected
   */
  _translate(translation) {
    vec3.add(this._position, this._position, translation);
  }

  /**
   * Rotate this camera by the given amount from its current orientation.
   *
   * @param {quat} rotation
   * @protected
   */
  _rotate(rotation) {
    // TODO
  }

  /**
   * @param {number} fovY In radians.
   * @param {number} aspectRatio Width / height.
   * @param {number} zNear
   * @param {number} zFar
   * @protected
   */
  _setPerspective(fovY, aspectRatio, zNear, zFar) {
    this._fovY = fovY;
    this._aspectRatio = aspectRatio;
    this._zNear = zNear;
    this._zFar = zFar;
    this._updateProjectionMatrix();
  }

  /**
   * Re-calculates the view-projection matrix. This should be called any time either the view or
   * projection matrices is updated.
   *
   * @protected
   */
  _updateProjectionMatrix() {
    mat4.perspective(
        this._projectionMatrix, this._fovY, this._aspectRatio, this._zNear, this._zFar);
    this._updateViewProjectionMatrix();
  }

  /**
   * Re-calculates the view-projection matrix. This should be called any time either the view or
   * projection matrices is updated.
   *
   * @protected
   */
  _updateViewProjectionMatrix() {
    mat4.multiply(this._viewProjectionMatrix, this._projectionMatrix, this._viewMatrix);
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   * @abstract
   */
  update(currentTime, deltaTime) {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  draw() {}

  /**
   * @param {number} fovY The vertical field of view, in radians.
   * @protected
   */
  set fov(fovY) {
    this._fovY = fovY;
    this._updateProjectionMatrix();
  }

  /**
   * @param {number} aspectRatio Width / height.
   */
  set aspectRatio(aspectRatio) {
    this._setPerspective(this._cameraParams.fovY, aspectRatio, this._cameraParams.zNear,
        this._cameraParams.zFar);
  }

  /** @returns {vec3} */
  get position() {
    return this._position;
  }
  /** @returns {quat} */
  get orientation() {
    return this._orientation;
  }
  /** @returns {mat4} */
  get viewMatrix() {
    return this._viewMatrix;
  }
  /** @returns {mat4} */
  get projectionMatrix() {
    return this._projectionMatrix;
  }
  /** @returns {mat4} */
  get viewProjectionMatrix() {// TODO: Stop using the above two getters and use this instead?
    return this._viewProjectionMatrix;
  }

  /**
   * Update this camera's state to match the given old camera.
   *
   * @param {Camera} oldCamera
   * @protected
   */
  _matchOldCamera(oldCamera) {
    if (!oldCamera) {
      return;
    }
    this._fovY = oldCamera._fovY;
    this._aspectRatio = oldCamera._aspectRatio;
    this._zNear = oldCamera._zNear;
    this._zFar = oldCamera._zFar;
    vec3.copy(this._position, oldCamera._position);
    vec3.copy(this._orientation, oldCamera._orientation);
    mat4.copy(this._viewMatrix, oldCamera._viewMatrix);
    mat4.copy(this._projectionMatrix, oldCamera._projectionMatrix);
    mat4.copy(this._viewProjectionMatrix, oldCamera._viewProjectionMatrix);
  }
}

export {Camera};

/**
 * @typedef {Function} CameraConfig
 * @property {number} fovY
 * @property {number} zNear
 * @property {number} zFar
 * @property {number} defaultAspectRatio
 * @property {vec3} _defaultLookAtDirection
 */

/**
 * @typedef {Object} FollowCameraConfig
 * @property {number} springCoefficient
 * @property {number} dampingCoefficient
 * @property {number} intendedDistanceFromTarget
 * @property {number} intendedRotationAngleFromTarget
 * @property {vec3} intendedRotationAxisFromTarget
 * @property {vec3} _intendedTranslationFromTarget
 */

/**
 * @typedef {Object} FirstPersonCameraConfig
 * @property {vec3} intendedDisplacementFromTarget
 * @property {vec3} viewDirection
 * @property {number} targetDistance
 */

/**
 * @typedef {Object} FixedCameraConfig
 * @property {vec3} position
 * @property {vec3} viewDirection
 * @property {vec3} _up
 */
