/**
 * This class caches renderable shape data.
 */
class RenderableShapeStore {
  constructor() {
    this._shapeCache = new Map();
  }

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getShape(params) {
    const key = _shapeIdsToCacheKeyCalculators[params.shapeId](params);
    return this._shapeCache.get(key);
  }

  /**
   * Caches the given shape info.
   *
   * @param {RenderableShape} shapeConfig
   * @param {RenderableShapeConfig} params
   */
  registerShape(shapeConfig, params) {
    const key = _shapeIdsToCacheKeyCalculators[params.shapeId](params);
    this._shapeCache.set(key, shapeConfig);
  }

  /**
   * @param {RenderableShapeFactory} shapeConfigFactory
   */
  registerRenderableShapeFactory(shapeConfigFactory) {
    _shapeIdsToCacheKeyCalculators[shapeConfigFactory.shapeId] = shapeConfigFactory.getCacheId;
  }

  // TODO: Add support for un-registering shapes.
}

/**
 * @param {RenderableShapeConfig} params
 * @returns {string}
 */
function getCacheKey(params) {
  const textureSpanStr = params.textureSpan
      ? `:${params.textureSpan.minX},${params.textureSpan.minY},${params.textureSpan.maxX},` +
  `${params.textureSpan.maxY}`
      : '';

  return `${params.shapeId}:${params.isUsingSphericalNormals}${textureSpanStr}`;
}

const _shapeIdsToCacheKeyCalculators = {};

const renderableShapeStore = new RenderableShapeStore();
export {renderableShapeStore, getCacheKey};
