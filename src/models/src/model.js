/**
 * This class defines a top-level model.
 *
 * @abstract
 */
class Model {
  /**
   * @param {WebGLRenderingContext} gl
   */
  constructor(gl) {
    // Model is an abstract class. It should not be instantiated directly.
    if (new.target === Model) {
      throw new TypeError('Cannot construct Model instances directly');
    }

    this._gl = gl;
    this.bounds = null;

    this._vertexPositionsBuffer = null;
    this._vertexNormalsBuffer = null;
    this._textureCoordinatesBuffer = null;

    this._vertexPositionsConfig = null;
    this._textureCoordinatesConfig = null;
    this._vertexNormalsConfig = null;

    // If this is kept null, then gl.drawArrays will be used (with gl.ARRAY_BUFFER) instead of
    // gl.drawElements (with gl.ELEMENT_ARRAY_BUFFER).
    this._vertexIndicesBuffer = null;
  }

  /**
   * Updates the normals on this shape to either be spherical (point outwards from the center) or
   * orthogonal to the faces of their triangles.
   *
   * @param {boolean} isUsingSphericalNormals
   * @protected
   * @abstract
   */
  _setNormals(isUsingSphericalNormals) {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /** @returns {?AttributeConfig} */
  get vertexPositionsConfig() {
    return this._vertexPositionsConfig;
  }

  /** @returns {?AttributeConfig} */
  get textureCoordinatesConfig() {
    return this._textureCoordinatesConfig;
  }

  /** @returns {?AttributeConfig} */
  get vertexNormalsConfig() {
    return this._vertexNormalsConfig;
  }

  /** @returns {?WebGLBuffer} */
  get vertexIndicesBuffer() {
    return this._vertexIndicesBuffer;
  }

  /**
   * @returns {number}
   * @abstract
   */
  get elementCount() {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * @returns {number}
   * @abstract
   */
  get mode() {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }
}

export {Model};
