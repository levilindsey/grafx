/**
 * This model defines a shape configuration factory for a cube.
 *
 * This cube is one unit long on each side.
 */

import {getCacheKey} from '../renderable-shape-store';

const VERTEX_COORDINATE = 0.5;

const vertexPositions = [
  // Front face
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, VERTEX_COORDINATE,
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  VERTEX_COORDINATE,
  // Back face
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  // Top face
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  -VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  VERTEX_COORDINATE,
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  VERTEX_COORDINATE,
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  -VERTEX_COORDINATE,
  // Bottom face
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, VERTEX_COORDINATE,
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
  // Right face
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  -VERTEX_COORDINATE,
  VERTEX_COORDINATE,  VERTEX_COORDINATE,  VERTEX_COORDINATE,
  VERTEX_COORDINATE,  -VERTEX_COORDINATE, VERTEX_COORDINATE,
  // Left face
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE,
  -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  VERTEX_COORDINATE,
  -VERTEX_COORDINATE, VERTEX_COORDINATE,  -VERTEX_COORDINATE
];

const orthogonalVertexNormals = [
  // Front face
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  // Back face
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  // Top face
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  // Bottom face
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  // Right face
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  // Left face
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0
];

const textureCoordinates = [
  // Front face
  1, 0,
  0, 0,
  0, 1,
  1, 1,
  // Back face
  1, 0,
  0, 0,
  0, 1,
  1, 1,
  // Top face
  1, 0,
  0, 0,
  0, 1,
  1, 1,
  // Bottom face
  1, 0,
  0, 0,
  0, 1,
  1, 1,
  // Right face
  1, 0,
  0, 0,
  0, 1,
  1, 1,
  // Left face
  1, 0,
  0, 0,
  0, 1,
  1, 1
];

// This array defines each face as two triangles, using the indices into the vertex array
// to specify each triangle's position.
const vertexIndices = [
  // Front face
  0,  1,  2,
  0,  2,  3,
  // Back face
  4,  5,  6,
  4,  6,  7,
  // Top face
  8,  9,  10,
  8,  10, 11,
  // Bottom face
  12, 13, 14,
  12, 14, 15,
  // Right face
  16, 17, 18,
  16, 18, 19,
  // Left face
  20, 21, 22,
  20, 22, 23
];

const cubeRenderableShapeFactory = {
  shapeId: 'CUBE',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: params => {
    const vertexNormals = params.isUsingSphericalNormals ? vertexPositions : orthogonalVertexNormals;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: vertexIndices.length
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

export {cubeRenderableShapeFactory};
