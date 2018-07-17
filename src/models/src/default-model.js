import {createBufferFromData} from '../../util';
import {Model} from './model';

/**
 * This class defines a default implementation of the rigid model.
 *
 * This implementation accepts a RenderableShape and applies standard OpenGL binding logic on top
 * of it.
 */
class DefaultModel extends Model {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {RenderableShape} shapeConfig
   */
  constructor(gl, shapeConfig) {
    super(gl);
    this._shapeConfig = shapeConfig;
    this._initializeBuffers();
    this._initializeConfigs();
  }

  _initializeBuffers() {
    // Create, bind, and move data into buffers for the vertex positions, normals, texture
    // coordinates, and element array.
    this._vertexPositionsBuffer = createBufferFromData(this._gl, this._shapeConfig.vertexPositions);
    this._vertexNormalsBuffer = createBufferFromData(this._gl, this._shapeConfig.vertexNormals);
    this._textureCoordinatesBuffer =
        createBufferFromData(this._gl, this._shapeConfig.textureCoordinates);
    if (this._shapeConfig.vertexIndices) {
      this._vertexIndicesBuffer = createBufferFromData(this._gl, this._shapeConfig.vertexIndices,
          this._gl.ELEMENT_ARRAY_BUFFER);
    }
  }

  _initializeConfigs() {
    this._vertexPositionsConfig = {
      buffer: this._vertexPositionsBuffer,
      size: 3,
      type: this._gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0
    };
    this._textureCoordinatesConfig = {
      buffer: this._textureCoordinatesBuffer,
      size: 2,
      type: this._gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0
    };
    this._vertexNormalsConfig = {
      buffer: this._vertexNormalsBuffer,
      size: 3,
      type: this._gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0
    };
  }

  /** @returns {number} */
  get elementCount() {
    return this._shapeConfig.elementCount;
  }

  /** @returns {number} */
  get mode() {
    return this._gl.TRIANGLES;
    //return this._gl.LINE_STRIP;// TODO: REMOVE ME
  }
}

export {DefaultModel};
