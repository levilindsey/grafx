/**
 * This module defines a configuration factory for a capsule shape.
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 */

import {
  calculateSphericalSection,
  calculateOrthogonalVertexNormals,
  dedupVertexArrayWithPositionsAndIndicesArrays,
  calculateLatLongTextureCoordinates,
  calculateCylindricalSection,
  calculateCylindricalTextureCoordinates,
  TWO_PI,
} from '../../../util';
import {getCacheKey} from '../renderable-shape-store';

// TODO: Once I have a better camera in place, test that these texture coordinate calculations are
// correct.

/**
 * @param {CapsuleRenderableShapeParams} params
 * @returns {RenderableShape}
 */
function _calculateCapsuleTopShape(params) {
  // Calculate the positions.
  // TODO: This uses lat-long spheres for the ends of the capsule. Use icospheres instead.
  const individualVertexPositions = calculateSphericalSection(
      0, params.divisionsCount / 2, Math.PI / params.divisionsCount,
      0, params.divisionsCount, TWO_PI / params.divisionsCount);

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

  let scale;
  let translation;

  // Scale and translate the positions.
  scale = params.radius;
  translation = params.capsuleEndPointsDistance / 2;
  for (let i = 0, count = vertexPositions.length; i < count; i += 3) {
    vertexPositions[i] *= scale;
    vertexPositions[i + 1] *= scale;
    vertexPositions[i + 2] = vertexPositions[i + 2] * scale + translation;
  }

  // Scale and translate the texture coordinates.
  scale = params.radius / (params.radius + params.capsuleEndPointsDistance);
  translation = 1 - scale;
  for (let i = 1, count = textureCoordinates.length; i < count; i += 2) {
    textureCoordinates[i] = textureCoordinates[i] * scale + translation;
  }

  const elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    textureCoordinates: textureCoordinates,
    vertexIndices: vertexIndices,
    elementCount: elementCount
  };
}

/**
 * @param {CapsuleRenderableShapeParams} params
 * @returns {RenderableShape}
 */
function _calculateCapsuleBottomShape(params) {
  // Calculate the positions.
  // TODO: This uses lat-long spheres for the ends of the capsule. Use icospheres instead.
  const individualVertexPositions = calculateSphericalSection(
      params.divisionsCount / 2, params.divisionsCount, Math.PI / params.divisionsCount,
      0, params.divisionsCount, TWO_PI / params.divisionsCount);

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
    const positionsAndIndices = dedupVertexArrayWithPositionsAndIndicesArrays(
        individualVertexPositions);
    vertexPositions = positionsAndIndices.vertexPositions;
    vertexIndices = positionsAndIndices.vertexIndices;
    vertexNormals = vertexPositions;
  }

  const textureCoordinates = calculateLatLongTextureCoordinates(vertexPositions);

  let scale;
  let translation;

  // Scale and translate the positions.
  scale = params.radius;
  translation = -params.capsuleEndPointsDistance / 2;
  for (let i = 0, count = vertexPositions.length; i < count; i += 3) {
    vertexPositions[i] *= scale;
    vertexPositions[i + 1] *= scale;
    vertexPositions[i + 2] = vertexPositions[i + 2] * scale + translation;
  }

  // Scale and translate the texture coordinates.
  scale = params.radius / (params.radius + params.capsuleEndPointsDistance);
  translation = 0;
  for (let i = 1, count = textureCoordinates.length; i < count; i += 2) {
    textureCoordinates[i] = textureCoordinates[i] * scale + translation;
  }

  const elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    textureCoordinates: textureCoordinates,
    vertexIndices: vertexIndices,
    elementCount: elementCount
  };
}

/**
 * @param {CapsuleRenderableShapeParams} params
 * @returns {RenderableShape}
 */
function _calculateCapsuleMiddleShape(params) {
  let scale;
  let translation;

  // Calculate the positions.
  translation = params.capsuleEndPointsDistance / 2;
  const individualVertexPositions = calculateCylindricalSection(
      -translation, translation, 0, params.divisionsCount, TWO_PI / params.divisionsCount);

  let vertexPositions;
  let vertexIndices;
  let vertexNormals;

  // Calculate the vertex indices and normals.
  if (!params.isUsingSphericalNormals) {
    // If we use orthogonal normals, then we cannot use vertexIndices.
    vertexPositions = individualVertexPositions;
    vertexIndices = null;
    vertexNormals = calculateOrthogonalVertexNormals(vertexPositions);
  } else {
    const positionsAndIndices = dedupVertexArrayWithPositionsAndIndicesArrays(
        individualVertexPositions);
    vertexPositions = positionsAndIndices.vertexPositions;
    vertexIndices = positionsAndIndices.vertexIndices;

    // Calculate the vertex normals.
    vertexNormals = vertexPositions.map((coord, index) => index % 3 === 2 ? 0 : coord);
  }

  // Calculate the texture coordinates.
  const textureCoordinates = calculateCylindricalTextureCoordinates(vertexPositions);

  // Scale the x and y position coordinates.
  scale = params.radius;
  for (let i = 0, count = vertexPositions.length; i < count; i += 3) {
    vertexPositions[i] *= scale;
    vertexPositions[i + 1] *= scale;
  }

  // Scale and translate the texture coordinates.
  scale = params.capsuleEndPointsDistance / (params.radius + params.capsuleEndPointsDistance);
  translation = (1 - scale) / 2;
  for (let i = 1, count = textureCoordinates.length; i < count; i += 2) {
    textureCoordinates[i] = textureCoordinates[i] * scale + translation;
  }

  const elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    textureCoordinates: textureCoordinates,
    vertexIndices: vertexIndices,
    elementCount: elementCount
  };
}

const capsuleRenderableShapeFactory = {
  shapeId: 'CAPSULE',

  /**
   * @param {CapsuleRenderableShapeParams} params
   * @returns {RenderableShape}
   */
  getRenderableShape: (params) => {
    // Ensure the divisions count is even.
    if (params.divisionsCount % 2 === 1) {
      params.divisionsCount++;
    }

    // The capsule's sub-shapes.
    const topShape = _calculateCapsuleTopShape(params);
    const bottomShape = _calculateCapsuleBottomShape(params);
    const middleShape = _calculateCapsuleMiddleShape(params);

    // Concatenate positions, normals, texture coordinates, and indices.
    const vertexPositions = topShape.vertexPositions.concat(middleShape.vertexPositions, 
        bottomShape.vertexPositions);
    const vertexNormals = topShape.vertexNormals.concat(middleShape.vertexNormals,
        bottomShape.vertexNormals);
    const textureCoordinates = topShape.textureCoordinates.concat(middleShape.textureCoordinates,
        bottomShape.textureCoordinates);
    const vertexIndices = topShape.vertexIndices
        ? topShape.vertexIndices.concat(middleShape.vertexIndices, bottomShape.vertexIndices)
        : null;
    const elementCount = topShape.elementCount + middleShape.elementCount + bottomShape.elementCount;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: elementCount
    };
  },

  /**
   * @param {CapsuleRenderableShapeParams} params
   * @returns {string}
   */
  getCacheId(params) {
    return `${getCacheKey(params)}:${params.divisionsCount}`;
  }
};

export {capsuleRenderableShapeFactory};

/**
 * @typedef {SphericalRenderableShapeParams} CapsuleRenderableShapeParams
 * @property {number} radius
 * @property {number} capsuleEndPointsDistance The distance between the centers of the spheres on
 * either end of the capsule.
 */
