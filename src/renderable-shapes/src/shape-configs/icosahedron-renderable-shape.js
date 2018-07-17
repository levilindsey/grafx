/**
 * This model defines a shape configuration factory for a regular icosahedron.
 *
 * The shape is centered around the origin.
 */

import {
  calculateLatLongTextureCoordinates,
  calculateOrthogonalVertexNormals,
  expandVertexIndicesAroundLongitudeSeam,
  expandVertexIndicesToDuplicatePositions,
} from '../../../util';
import {getCacheKey} from '../renderable-shape-store';

// The corners of a unit icosahedron with vertices aligned with the y-axis.
const individualVertexPositions = [
  -0.525731086730957, -0.7236068248748779, 0.4472135901451111,
  0.525731086730957, -0.7236068248748779, 0.4472135901451111,
  -0.525731086730957, 0.7236068248748779, -0.4472135901451111,
  0.525731086730957, 0.7236068248748779, -0.4472135901451111,
  0, 0, 1,
  0, 0.8944271802902222, 0.44721361994743347,
  0, -0.8944271802902222, -0.44721361994743347,
  0, 0, -1,
  0.8506508469581604, 0.27639320492744446, 0.4472135901451111,
  -0.8506508469581604, 0.27639320492744446, 0.4472135901451111,
  0.8506508469581604, -0.27639320492744446, -0.4472135901451111,
  -0.8506508469581604, -0.27639320492744446, -0.4472135901451111
];

const individualVertexIndices = [
  1,  4,  0,
  4,  9,  0,
  4,  5,  9,
  8,  5,  4,
  1,  8,  4,
  1,  10, 8,
  10, 3,  8,
  8,  3,  5,
  3,  2,  5,
  3,  7,  2,
  3,  10, 7,
  10, 6,  7,
  6,  11, 7,
  6,  0,  11,
  6,  1,  0,
  10, 1,  6,
  11, 0,  9,
  2,  11, 9,
  5,  2,  9,
  11, 2,  7
];

let vertexPositionsExpandedAroundSeam = null;
let vertexIndicesExpandedAroundSeam = null;
let textureCoordinates = null;

const icosahedronRenderableShapeFactory = {
  shapeId: 'ICOSAHEDRON',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: params => {
    let vertexPositions;
    let vertexIndices;

    if (!vertexPositionsExpandedAroundSeam) {
      // Calculate the modified positions and indices.
      const positionsAndIndices = expandVertexIndicesAroundLongitudeSeam(
          individualVertexPositions, individualVertexIndices);
      vertexPositionsExpandedAroundSeam = positionsAndIndices.vertexPositions;
      vertexIndicesExpandedAroundSeam = positionsAndIndices.vertexIndices;
    }

    vertexPositions = vertexPositionsExpandedAroundSeam;
    vertexIndices = vertexIndicesExpandedAroundSeam;

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

    textureCoordinates = textureCoordinates
        ? textureCoordinates
        : calculateLatLongTextureCoordinates(vertexPositions);

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
   * @param {RenderableShapeConfig} params
   * @returns {string}
   */
  getCacheId(params) {
    return getCacheKey(params);
  }
};

export {icosahedronRenderableShapeFactory};
