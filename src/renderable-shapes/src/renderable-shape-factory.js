import {DefaultModel} from '../../models';
import {renderableShapeStore} from './renderable-shape-store';

/**
 * This module defines a factory for DefaultRigidModal instances that are based on the various
 * pre-defined renderable shapes in this directory.
 */

const renderableShapeFactory = {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {RenderableShapeConfig} params
   * @returns {DefaultModel}
   */
  createModel: (gl, params) => {
    const shapeConfig = renderableShapeFactory.getRenderableShape(params);
    return new DefaultModel(gl, shapeConfig);
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: params => {
    params.isUsingSphericalNormals = params.isUsingSphericalNormals || false;
    params.divisionsCount = typeof params.divisionsCount === 'number' ? params.divisionsCount : 0;

    let shapeConfig = renderableShapeStore.getShape(params);
    if (!shapeConfig) {
      shapeConfig = _shapeIdsToRenderableShapeFactories[params.shapeId].getRenderableShape(params);
      _updateTextureCoordinatesSpan(shapeConfig, params.textureSpan);
      renderableShapeStore.registerShape(shapeConfig, params);
    }
    return shapeConfig;
  },

  /**
   * @param {RenderableShapeFactory} shapeConfigFactory
   */
  registerRenderableShapeFactory: shapeConfigFactory => {
    _shapeIdsToRenderableShapeFactories[shapeConfigFactory.shapeId] = shapeConfigFactory;
    renderableShapeStore.registerRenderableShapeFactory(shapeConfigFactory);
  }
};

const _shapeIdsToRenderableShapeFactories = {};

/**
 * @param {RenderableShape} shapeConfig
 * @param {TextureSpan} textureSpan
 * @private
 */
function _updateTextureCoordinatesSpan(shapeConfig, textureSpan) {
  if (!textureSpan) return;

  const minX = textureSpan.minX;
  const minY = textureSpan.minY;
  const rangeX = textureSpan.maxX - textureSpan.minX;
  const rangeY = textureSpan.maxY - textureSpan.minY;

  const textureCoordinates = shapeConfig.textureCoordinates.slice();
  shapeConfig.textureCoordinates = textureCoordinates;

  for (let i = 0, count = textureCoordinates.length; i < count; i += 2) {
    textureCoordinates[i] = minX + rangeX * textureCoordinates[i];
    textureCoordinates[i + 1] = minY + rangeY * textureCoordinates[i + 1];
  }
}

export {renderableShapeFactory};

/**
 * @typedef {Object} RenderableShapeFactory
 * @property {string} shapeId
 * @property {Function.<RenderableShape>} getRenderableShape
 * @property {Function.<String>} getCacheId
 */

/**
 * @typedef {Object} RenderableShape
 * @property {Array.<Number>} vertexPositions
 * @property {Array.<Number>} vertexNormals
 * @property {Array.<Number>} textureCoordinates
 * @property {Array.<Number>} [vertexIndices]
 * @property {number} elementCount
 */

/**
 * @typedef {Object} TextureSpan
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 */

/**
 * @typedef {Object} RenderableShapeConfig
 * @property {string} shapeId The ID of the type of renderable shape.
 * @property {boolean} [isUsingSphericalNormals=false] Whether light reflections should show sharp
 * edges.
 * @property {TextureSpan} [textureSpan] For indicating how much a texture should repeat in both axes.
 * A range of 0-0.5 should show half the texture. A range of 0-2 would show the texture twice. The
 * default is 0-1 in both directions.
 * @property {vec3} [scale]
 */

/**
 * @typedef {RenderableShapeConfig} SphericalRenderableShapeParams
 * @property {number} divisionsCount How many times to sub-divide the sphere.
 */
