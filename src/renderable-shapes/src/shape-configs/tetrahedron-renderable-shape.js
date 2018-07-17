import {calculateOrthogonalVertexNormals} from '../../../util';
import {getCacheKey} from '../renderable-shape-store';

/**
 * This model defines a shape configuration factory for a regular tetrahedron.
 *
 * The shape is centered around the origin.
 */

// ||(VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE)|| = 1
const VERTEX_COORDINATE = 0.5773502588272095;

const vertexPositions = [
  // Left-top-near face
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  VERTEX_COORDINATE,
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  -VERTEX_COORDINATE,

  // Right-top-far face
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, -VERTEX_COORDINATE,

  // Right-bottom-near face
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,

  // Left-bottom-far face
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
  VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE
];

// 1 - Math.sqrt(3) / 2
const TEXTURE_BASE_COORDINATE = 0.13397459621;

const textureCoordinates = [
  // Left-top-near face
  0, TEXTURE_BASE_COORDINATE,
  0.5, 1,
  1, TEXTURE_BASE_COORDINATE,

  // Right-top-far face
  0, TEXTURE_BASE_COORDINATE,
  0.5, 1,
  1, TEXTURE_BASE_COORDINATE,

  // Right-bottom-near face
  0, TEXTURE_BASE_COORDINATE,
  0.5, 1,
  1, TEXTURE_BASE_COORDINATE,

  // Left-bottom-far face
  0, TEXTURE_BASE_COORDINATE,
  0.5, 1,
  1, TEXTURE_BASE_COORDINATE
];

const tetrahedronRenderableShapeFactory = {
  shapeId: 'TETRAHEDRON',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: params => {
    const vertexNormals = params.isUsingSphericalNormals
        ? vertexPositions
        : calculateOrthogonalVertexNormals(vertexPositions);

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: null,
      elementCount: vertexPositions.length / 3
    };
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {string}
   */
  getCacheId(params) {
    return getCacheKey(params);
  }
};

export {tetrahedronRenderableShapeFactory};
