/**
 * This module defines logic that creates a spherical shape configuration by taking a shape,
 * sub-dividing each of its triangles, and projecting each new vertex onto the edge of a sphere.
 *
 * This is technically only an "icosphere" if the starting shape is an icosahedron.
 *
 * This shape also is known as a "geosphere".
 *
 * The shape is centered around the origin.
 */

import {
  deepCopy,
  calculateLatLongTextureCoordinates,
  calculateOrthogonalVertexNormals,
  expandVertexIndicesAroundLongitudeSeam,
  expandVertexIndicesToDuplicatePositions,
  tesselateSphere,
} from '../../../util';
import {getCacheKey} from '../renderable-shape-store';
import {renderableShapeFactory} from '../renderable-shape-factory';

const icosphereRenderableShapeFactory = {
  shapeId: 'ICOSPHERE',

  /**
   * @param {IcosphereRenderableShapeParams} params
   * @returns {RenderableShape}
   */
  getRenderableShape: params => {
    params.divisionsCount = Math.max(params.divisionsCount, 1);

    const copyParams = deepCopy(params);
    copyParams.shapeId = params.baseShapeId || 'ICOSAHEDRON';
    const baseRenderableShape = renderableShapeFactory.getRenderableShape(copyParams);

    // Calculate the positions and indices.
    let {vertexPositions, vertexIndices} = tesselateSphere(params.divisionsCount,
        baseRenderableShape.vertexPositions, baseRenderableShape.vertexIndices);
    ({vertexPositions, vertexIndices} = expandVertexIndicesAroundLongitudeSeam(
        vertexPositions, vertexIndices));

    let vertexNormals;
    // If we use orthogonal normals, then we cannot use vertexIndices.
    if (!params.isUsingSphericalNormals) {
      vertexPositions = expandVertexIndicesToDuplicatePositions(vertexPositions,
          vertexIndices);
      vertexIndices = null;
      vertexNormals = calculateOrthogonalVertexNormals(vertexPositions);
    } else {
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
   * @param {IcosphereRenderableShapeParams} params
   * @returns {string}
   */
  getCacheId(params) {
    return `${getCacheKey(params)}:${params.divisionsCount}`;
  }
};

export {icosphereRenderableShapeFactory};

/**
 * @typedef {SphericalRenderableShapeParams} IcosphereRenderableShapeParams
 * @property {string} baseShapeId The ID of the base renderable shape that will be sub-divided to
 * create this icosphere shape.
 */
