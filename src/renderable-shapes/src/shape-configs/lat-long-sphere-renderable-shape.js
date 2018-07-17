import {
  calculateLatLongTextureCoordinates,
  calculateOrthogonalVertexNormals,
  calculateSphericalSection,
  dedupVertexArrayWithPositionsAndIndicesArrays,
  TWO_PI,
} from '../../../util';
import {getCacheKey} from '../renderable-shape-store';

/**
 * This module defines a configuration factory for a spherical shape whose vertices lie along
 * latitude and longitude lines.
 *
 * This shape also is known as a "UV sphere".
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 */

/**
 * @param {number} divisionsCount
 * @returns {Array.<Number>}
 * @private
 */
function _calculateLatLongSpherePositions(divisionsCount) {
  const deltaPitch = Math.PI / divisionsCount;
  const deltaAzimuth = TWO_PI / divisionsCount;

  return calculateSphericalSection(
      0, divisionsCount, deltaPitch,
      0, divisionsCount, deltaAzimuth);
}

const latLongSphereRenderableShapeFactory = {
  shapeId: 'LAT_LONG_SPHERE',

  /**
   * @param {SphericalRenderableShapeParams} params
   * @returns {RenderableShape}
   */
  getRenderableShape: params => {
    // Calculate the positions.
    const individualVertexPositions = _calculateLatLongSpherePositions(params.divisionsCount);

    // Calculate the indices and normals.
    let vertexPositions;
    let vertexIndices;
    let vertexNormals;
    if (!params.isUsingSphericalNormals) {
      // If we use orthogonal normals, then we cannot use vertexIndices.
      vertexPositions = individualVertexPositions;
      vertexIndices = null;
      vertexNormals = calculateOrthogonalVertexNormals(vertexPositions);
    } else {
      ({vertexPositions, vertexIndices} = dedupVertexArrayWithPositionsAndIndicesArrays(
          individualVertexPositions));
      vertexNormals = vertexPositions;
    }

    const textureCoordinates = calculateLatLongTextureCoordinates(vertexPositions);

    const elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: elementCount
    };
  },

  /**
   * @param {SphericalRenderableShapeParams} params
   * @returns {string}
   */
  getCacheId(params) {
    return `${getCacheKey(params)}:${params.divisionsCount}`;
  }
};

export {latLongSphereRenderableShapeFactory};
