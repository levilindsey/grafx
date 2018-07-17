/**
 * This module defines a collection of static general utility functions for WebGL.
 */

import {HashMap} from './hash-map';
import {HALF_PI, TWO_PI} from './geometry';
import {debounce, isInDevMode, loadText} from './util';
import {programWrapperStore} from '../../program-wrapper/src/program-wrapper-store';

let viewportWidth = 10;
let viewportHeight = 10;

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {?WebGLRenderingContext}
 * @throws If unable to get a WebGL context.
 */
function getWebGLContext(canvas) {
  const params = {alpha: false};
  // Try to grab the standard context. If it fails, fallback to the experimental context.
  return canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {?WebGLBuffer}
 * @throws If unable to create a buffer object.
 */
function createBuffer(gl) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('An error occurred creating the buffer object');
  }
  return buffer;
}
// TODO: use all this helper stuff in the programWrapper logic?
/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {string} locationName
 * @returns {number}
 * @throws If unable to get an attribute location for the given name.
 */
function getAttribLocation(gl, program, locationName) {
  const attribLocation = gl.getAttribLocation(program, locationName);
  if (attribLocation < 0) {
    throw new Error(`An error occurred getting the attribute location: ${locationName}`);
  }
  return attribLocation;
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns {WebGLProgram}
 * @throws If unable to link the program.
 */
function buildProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const infoLog = gl.getProgramInfoLog(program);
    console.error('An error occurred linking the shader program', infoLog);
    throw new Error('An error occurred linking the shader program');
  }

  return program;
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} shaderSource
 * @param {boolean} isFragmentShader
 * @returns {WebGLShader}
 * @throws If unable to compile the shader.
 */
function buildShader(gl, shaderSource, isFragmentShader) {
  const shaderType = isFragmentShader ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER;
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const infoLog = gl.getShaderInfoLog(shader);
    console.error('An error occurred compiling the shader', infoLog);
    throw new Error('An error occurred compiling the shader');
  }

  return shader;
}

/**
 * Loads a shader program by scouring the current document, looking for a script with the specified
 * ID.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} url
 * @returns {Promise.<WebGLShader, Error>}
 */
function loadShader(gl, url) {
  return loadText(url)
      .then(shaderSource => buildShader(gl, shaderSource, url.endsWith('.frag')));
}

/**
 * Loads the shader source code from the given URLs, compiles the shader source code, and creates
 * a program from the resulting shaders.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderUrl
 * @param {string} fragmentShaderUrl
 * @returns {Promise.<WebGLProgram, Error>}
 * @throws If any error occurs while loading and building the shaders and program.
 */
function loadProgram(gl, vertexShaderUrl, fragmentShaderUrl) {
  return Promise.all([
        vertexShaderUrl,
        fragmentShaderUrl
      ].map(url => loadShader(gl, url)))
      .then(shaders => {
        const vertexShader = shaders[0];
        const fragmentShader = shaders[1];

        return buildProgram(gl, vertexShader, fragmentShader);
      });
}

/**
 * Create, bind, and move the given raw data into a WebGL buffer.
 *
 * @param {WebGLRenderingContext} gl
 * @param {Array.<Number>} rawData A plain, flat array containing the data to bind to a buffer.
 * @param {number} [target=gl.ARRAY_BUFFER] An enum describing the type of this buffer; one of:
 *   - gl.ARRAY_BUFFER,
 *   - gl.ELEMENT_ARRAY_BUFFER.
 * @param {number} [usage=gl.STATIC_DRAW] An enum describing how this buffer is going to be used;
 * one of:
 *   - gl.STATIC_DRAW,
 *   - gl.DYNAMIC_DRAW,
 *   - gl.STREAM_DRAW.
 * @returns {WebGLBuffer}
 */
function createBufferFromData(gl, rawData, target, usage) {
  target = target || gl.ARRAY_BUFFER;
  usage = usage || gl.STATIC_DRAW;
  const typedArray = target === gl.ARRAY_BUFFER ? new Float32Array(rawData) : new Uint16Array(rawData);

  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, typedArray, usage);

  // Making the original data visible on the buffer object is helpful for debugging.
  if (isInDevMode) {
    buffer.rawData = typedArray;
  }

  return buffer;
}

/**
 * Adjusts the dimensions of the given element to match those of the viewport. Also, when the
 * viewport is resized, the given element will also be resized to match.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {WebGLRenderingContext} gl
 * @param {Function} onGLResized
 * @param {?Number} [updateInterval=150]
 */
function bindGLContextToViewportDimensions(canvas, gl, onGLResized, updateInterval = 150) {
  _resizeGLContextToMatchViewportDimensions(canvas, gl);
  const debouncedResize =
      debounce(_ => {
        _resizeGLContextToMatchViewportDimensions(canvas, gl);
        onGLResized();
      }, updateInterval);
  window.addEventListener('resize', debouncedResize);
}

/**
 * Resizes the given element to match the dimensions of the viewport components.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {WebGLRenderingContext} gl
 * @private
 */
function _resizeGLContextToMatchViewportDimensions(canvas, gl) {
  // Account for high-definition DPI displays.
  const devicePixelToCssPixelRatio = window.devicePixelRatio || 1;
  viewportWidth = Math.floor(canvas.clientWidth * devicePixelToCssPixelRatio);
  viewportHeight = Math.floor(canvas.clientHeight * devicePixelToCssPixelRatio);
  canvas.width = viewportWidth;
  canvas.height = viewportHeight;
  gl.viewport(0, 0, viewportWidth, viewportHeight);
}

/**
 * @returns {number}
 */
function getViewportWidth() {
  return viewportWidth;
}

/**
 * @returns {number}
 */
function getViewportHeight() {
  return viewportHeight;
}

/**
 * Binds a framebuffer to the GL context.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLFramebuffer} framebuffer
 */
function bindFramebuffer(gl, framebuffer, width, height) {
  // FIXME: Remove or add back in?
  // width = width || getViewportWidth();
  // height = height || getViewportHeight();

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  // FIXME: Remove or add back in?
  // gl.viewport(0, 0, width, height);
}

/**
 * Creates a framebuffer and attaches a texture to the framebuffer.
 *
 * This means that when we bind to the framebuffer, draw calls will render to the given texture.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLTexture} texture
 * @param {WebGLRenderBuffer} [renderBuffer]
 * @returns {WebGLFramebuffer}
 */
function createFramebuffer(gl, texture, renderBuffer) {
  const framebuffer = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (renderBuffer) {
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
  }

  return framebuffer;
}

/**
 * Creates a texture for rendering to.
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} [width] Defaults to the viewport width stored in gl-util.
 * @param {number} [height] Defaults to the viewport height stored in gl-util.
 * @returns {WebGLTexture}
 */
function createTextureForRendering(gl, width, height) {
  width = width || getViewportWidth();
  height = height || getViewportHeight();

  // TODO: Double-check these params
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  return texture;
}

/**
 * Creates a render buffer.
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} [width] Defaults to the viewport width stored in gl-util.
 * @param {number} [height] Defaults to the viewport height stored in gl-util.
 * @returns {WebGLRenderBuffer}
 */
function createRenderBuffer(gl, width, height) {
  width = width || getViewportWidth();
  height = height || getViewportHeight();

  const renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

  return renderBuffer;
}

const _SQUARE_COORDINATES_2D = [
  0, 0,
  1, 0,
  0, 1,

  1, 0,
  1, 1,
  0, 1,
];

/**
 * @param {WebGLRenderingContext} gl
 * @returns {AttributeConfig}
 */
function create2DSquarePositionsConfig(gl) {
  const positionsBuffer = createBufferFromData(gl, _SQUARE_COORDINATES_2D);
  return {
    buffer: positionsBuffer,
    size: 2,
    type: gl.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0
  };
}

//
// Geometrical calculations.
//

/**
 * Given an array of individual vertex positions and an array of vertex indices, creates an expanded
 * array of the positions grouped by the triangles they form.
 *
 * @param {Array.<Number>} individualVertexPositions
 * @param {Array.<Number>} vertexIndices
 * @returns {Array.<Number>}
 */
function expandVertexIndicesToDuplicatePositions(individualVertexPositions, vertexIndices) {
  const expandedVertexPositions = [];

  for (let i = 0, j = 0, k = 0, count = vertexIndices.length; i < count; i++, k += 3) {
    j = vertexIndices[i] * 3;

    expandedVertexPositions[k] = individualVertexPositions[j];
    expandedVertexPositions[k + 1] = individualVertexPositions[j + 1];
    expandedVertexPositions[k + 2] = individualVertexPositions[j + 2];
  }

  return expandedVertexPositions;
}

/**
 * Computes normal vectors that are each orthogonal to the triangles they are a part of.
 *
 * The given vertices should represent individual triangles whose vertices are defined in clockwise
 * order (as seen when looking at the exterior side).
 *
 * @param {Array.<Number>} vertices
 * @returns {Array.<Number>}
 */
function calculateOrthogonalVertexNormals(vertices) {
  const vertex1 = vec3.create();
  const vertex2 = vec3.create();
  const vertex3 = vec3.create();
  const vectorA = vec3.create();
  const vectorB = vec3.create();
  const normal1 = vec3.create();
  const normal2 = vec3.create();
  const normal3 = vec3.create();

  const normals = [];

  // Loop over each triangle in the flattened vertex array.
  for (let i = 0, count = vertices.length; i < count; i += 9) {
    // Get the vertices of the current triangle from the flattened array.
    vec3.set(vertex1, vertices[i + 0], vertices[i + 1], vertices[i + 2]);
    vec3.set(vertex2, vertices[i + 3], vertices[i + 4], vertices[i + 5]);
    vec3.set(vertex3, vertices[i + 6], vertices[i + 7], vertices[i + 8]);

    // Compute the normals.
    vec3.subtract(vectorA, vertex3, vertex1);
    vec3.subtract(vectorB, vertex2, vertex1);
    vec3.cross(normal1, vectorA, vectorB);
    vec3.normalize(normal1, normal1);

    vec3.subtract(vectorA, vertex1, vertex2);
    vec3.subtract(vectorB, vertex3, vertex2);
    vec3.cross(normal2, vectorA, vectorB);
    vec3.normalize(normal2, normal2);

    vec3.subtract(vectorA, vertex2, vertex3);
    vec3.subtract(vectorB, vertex1, vertex3);
    vec3.cross(normal3, vectorA, vectorB);
    vec3.normalize(normal3, normal3);

    // Save the normal vectors in a flattened array.
    normals[i + 0] = normal1[0];
    normals[i + 1] = normal1[1];
    normals[i + 2] = normal1[2];
    normals[i + 3] = normal2[0];
    normals[i + 4] = normal2[1];
    normals[i + 5] = normal2[2];
    normals[i + 6] = normal3[0];
    normals[i + 7] = normal3[1];
    normals[i + 8] = normal3[2];
  }

  return normals;
}

const MAX_TEXTURE_V_COORDINATE_DELTA = 0.5;

/**
 * Calculates lat-long texture coordinates for the given vertex positions.
 *
 * @param {Array.<Number>} vertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function calculateLatLongTextureCoordinates(vertexPositions) {
  const currentVertexPosition = vec3.create();
  const currentTextureCoordinates = vec2.create();
  const textureCoordinates = [];

  // Calculate the texture coordinates of each vertex.
  for (let i = 0, j = 0, count = vertexPositions.length; i < count; i += 3, j += 2) {
    vec3.set(currentVertexPosition,
        vertexPositions[i], vertexPositions[i + 1], vertexPositions[i + 2]);
    _getTextureCoordinatesOfLatLongPosition(currentTextureCoordinates, currentVertexPosition);
    textureCoordinates[j] = currentTextureCoordinates[0];
    textureCoordinates[j + 1] = currentTextureCoordinates[1];
  }

  _correctTextureForTrianglesAroundSeam(textureCoordinates);

  return textureCoordinates;
}

/**
 * Calculates cylindrical texture coordinates for the given vertex positions.
 *
 * This assumes the cylinder is aligned with the z-axis and centered at the origin.
 *
 * @param {Array.<Number>} vertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function calculateCylindricalTextureCoordinates(vertexPositions) {
  const currentVertexPosition = vec3.create();
  const currentTextureCoordinates = vec2.create();
  const textureCoordinates = [];

  // Calculate the texture coordinates of each vertex.
  for (let i = 0, j = 0, count = vertexPositions.length; i < count; i += 3, j += 2) {
    vec3.set(currentVertexPosition,
        vertexPositions[i], vertexPositions[i + 1], vertexPositions[i + 2]);
    _getTextureCoordinatesOfCylindricalPosition(currentTextureCoordinates, currentVertexPosition);
    textureCoordinates[j] = currentTextureCoordinates[0];
    textureCoordinates[j + 1] = currentTextureCoordinates[1];
  }

  _correctTextureForTrianglesAroundSeam(textureCoordinates);

  return textureCoordinates;
}

/**
 * @param {Array.<Number>} textureCoordinates
 */
function _correctTextureForTrianglesAroundSeam(textureCoordinates) {
  let v1;
  let v2;
  let v3;

  // Determine which triangles span the seam across 0/2PI, and correct their textures.
  for (let i = 0, count = textureCoordinates.length; i < count; i += 6) {
    v1 = textureCoordinates[i];
    v2 = textureCoordinates[i + 2];
    v3 = textureCoordinates[i + 4];

    if (v3 - v1 > MAX_TEXTURE_V_COORDINATE_DELTA || v2 - v1 > MAX_TEXTURE_V_COORDINATE_DELTA) {
      textureCoordinates[i]++;
    }
    if (v3 - v2 > MAX_TEXTURE_V_COORDINATE_DELTA || v1 - v2 > MAX_TEXTURE_V_COORDINATE_DELTA) {
      textureCoordinates[i + 2]++;
    }
    if (v2 - v3 > MAX_TEXTURE_V_COORDINATE_DELTA || v1 - v3 > MAX_TEXTURE_V_COORDINATE_DELTA) {
      textureCoordinates[i + 4]++;
    }
  }
}

/**
 * Calculate the texture coordinates for a normalized point on a globe.
 *
 * @param {vec2} textureCoordinates Output parameter.
 * @param {vec3} vertexPosition Input parameter.
 * @private
 */
function _getTextureCoordinatesOfLatLongPosition(textureCoordinates, vertexPosition) {
  const x = vertexPosition[0];
  const y = vertexPosition[1];
  const z = vertexPosition[2];

  let longitude;
  if (y !== 0) {
    longitude = Math.atan2(x, y);
  } else if (x > 0) {
    longitude = HALF_PI;
  } else {
    longitude = -HALF_PI;
  }

  const u = (longitude + Math.PI) / TWO_PI;

  // TODO: Should I instead be calculating the v value from wrapping the texture around the globe
  // curvature rather than simply projecting it directly?

  // This assumes that the texture has been vertically distorted so that it can be directly
  // projected onto the curvature of the globe.
  const v = (z + 1) * 0.5;

  textureCoordinates[0] = u;
  textureCoordinates[1] = v;
}

/**
 * Calculate the texture coordinates for a normalized point on a cylinder.
 *
 * This assumes the cylinder is aligned with the z-axis and centered at the origin.
 *
 * @param {vec2} textureCoordinates Output parameter.
 * @param {vec3} vertexPosition Input parameter.
 * @private
 */
function _getTextureCoordinatesOfCylindricalPosition(textureCoordinates, vertexPosition) {
  const x = vertexPosition[0];
  const y = vertexPosition[1];
  const z = vertexPosition[2];

  let longitude;
  if (y !== 0) {
    longitude = Math.atan2(x, y);
  } else if (x > 0) {
    longitude = HALF_PI;
  } else {
    longitude = -HALF_PI;
  }

  const u = (longitude + Math.PI) / TWO_PI;

  const v = z > 0 ? 1 : 0;

  textureCoordinates[0] = u;
  textureCoordinates[1] = v;
}

/**
 * Expands the given vertices around the seam where longitude switches from 0 to 2PI.
 *
 * This is useful because, when applying a spherical texture using lat-long coordinates, any
 * triangle that spans the seam (from longitude 2PI to 0) would otherwise show the wrong result.
 *
 * @param {Array.<Number>} oldVertexPositions
 * @param {Array.<Number>} oldVertexIndices
 * @returns {{vertexPositions: Array.<Number>, vertexIndices: Array.<Number>}}
 */
function expandVertexIndicesAroundLongitudeSeam(oldVertexPositions, oldVertexIndices) {
  // const newVertexPositions = [];
  // const newVertexIndices = [];
  //
  // ****
  // // TODO: loop over triangles, use _getTextureCoordinatesOfLatLongPosition on each vertex,
  // // check if two vertices in a triangle span the seam; to check the span, just check if both are
  // // within a distance from the seam, but on opposite ends;
  //
  // return {
  //   vertexPositions: newVertexPositions,
  //   vertexIndices: newVertexIndices
  // };

  return {
    vertexPositions: oldVertexPositions,
    vertexIndices: oldVertexIndices
  };
}

/**
 * Subdivides the triangles of a shape and projects all resulting vertices to a radius of one.
 *
 * @param {number} divisionFactor
 * @param {Array.<Number>} oldPositions
 * @param {Array.<Number>} [oldIndices]
 * @returns {{vertexPositions: Array.<Number>, vertexIndices: Array.<Number>}}
 */
function tesselateSphere(divisionFactor, oldPositions, oldIndices) {
  const newPositions = _expandAndTesselateTriangles(divisionFactor, oldPositions, oldIndices);

  // Convert the expanded positions array into a unique positions array with a corresponding indices
  // array.
  const positionsAndIndices = dedupVertexArrayWithPositionsAndIndicesArrays(newPositions);

  // Project the given positions to a distance of one.
  _normalizePositions(positionsAndIndices.vertexPositions, positionsAndIndices.vertexPositions);

  return positionsAndIndices;
}

/**
 * Subdivides triangles.
 *
 * This has the side-effect of flattening the given vertices into an expanded list that can contain
 * duplicate positions.
 *
 * @param {number} divisionFactor
 * @param {Array.<Number>} oldPositions
 * @param {Array.<Number>} [oldIndices]
 * @returns {Array.<Number>}
 * @private
 */
function _expandAndTesselateTriangles(divisionFactor, oldPositions, oldIndices) {
  const expandedOldPositions = oldIndices
      ? expandVertexIndicesToDuplicatePositions(oldPositions, oldIndices)
      : oldPositions;

  const newPositions = [];
  const a = vec3.create();
  const b = vec3.create();
  const c = vec3.create();
  const aToB = vec3.create();
  const aToC = vec3.create();
  const bToC = vec3.create();
  const rowDelta = vec3.create();
  const columnDelta = vec3.create();
  const backwardsDelta = vec3.create();
  const rowStartPoint = vec3.create();
  const rowColumnStartPoint = vec3.create();
  const tempVec = vec3.create();

  let oldIndex;
  let count;
  let newIndex;
  let rowIndex;
  let columnIndex;

  //
  // The basic tesselation algorithm:
  // - Iterate across the original triangles that we are sub-dividing.
  // - A, B, and C are the vertices of the current, original triangle.
  // - Consider "rows" to iterate across the a-to-b direction and "columns" to iterate across the
  //   a-to-c direction.
  // - First calculate the distance between one row and one column.
  // - Then loop over the rows and columns and create a the new triangle for each "cell".
  //
  //                   /\
  //                 B   \--- A "column"
  //                 o    \
  //                / \   /
  //               /   \             rowDelta:      columnDelta:     backwardsDelta:
  //              o-----o                 o             o
  //             / \   / \               /               \              o-----o
  //            /   \ /   \             /                 \
  //           o-----o-----o           o                   o
  //          / \   / \   / \
  //         /   \ /   \ /   \
  //        o-----o-----o-----o
  //       / \   / \   / \   / \
  //      /   \ /   \ /   \ /   \
  //  A  o-----o-----o-----o-----o  C
  //
  //       \_____\
  //           \
  //         A "row"
  //

  // Loop over the old triangles.
  for (oldIndex = 0, newIndex = 0, count = expandedOldPositions.length;
       oldIndex < count;
       oldIndex += 9) {
    // Pull out the three vertices of the current triangle.
    vec3.set(a,
        expandedOldPositions[oldIndex],
        expandedOldPositions[oldIndex + 1],
        expandedOldPositions[oldIndex + 2]);
    vec3.set(b,
        expandedOldPositions[oldIndex + 3],
        expandedOldPositions[oldIndex + 4],
        expandedOldPositions[oldIndex + 5]);
    vec3.set(c,
        expandedOldPositions[oldIndex + 6],
        expandedOldPositions[oldIndex + 7],
        expandedOldPositions[oldIndex + 8]);

    vec3.subtract(aToB, b, a);
    vec3.subtract(bToC, c, b);
    vec3.subtract(aToC, c, a);

    vec3.scale(rowDelta, aToB, 1 / divisionFactor);
    vec3.scale(columnDelta, bToC, 1 / divisionFactor);
    vec3.scale(backwardsDelta, aToC, 1 / divisionFactor);

    // Loop over each new division (row) for the current triangle.
    for (rowIndex = 0; rowIndex < divisionFactor; rowIndex++) {
      vec3.scaleAndAdd(rowStartPoint, a, rowDelta, rowIndex);

      // Create the first triangle in the row (address the fence-post problem).
      newPositions[newIndex++] = rowStartPoint[0];
      newPositions[newIndex++] = rowStartPoint[1];
      newPositions[newIndex++] = rowStartPoint[2];
      vec3.add(tempVec, rowStartPoint, rowDelta);
      newPositions[newIndex++] = tempVec[0];
      newPositions[newIndex++] = tempVec[1];
      newPositions[newIndex++] = tempVec[2];
      vec3.add(tempVec, rowStartPoint, backwardsDelta);
      newPositions[newIndex++] = tempVec[0];
      newPositions[newIndex++] = tempVec[1];
      newPositions[newIndex++] = tempVec[2];

      // Loop over the new triangles in the current division.
      for (columnIndex = 1; columnIndex <= rowIndex; columnIndex++) {
        vec3.scaleAndAdd(rowColumnStartPoint, rowStartPoint, columnDelta, columnIndex);

        newPositions[newIndex++] = rowColumnStartPoint[0];
        newPositions[newIndex++] = rowColumnStartPoint[1];
        newPositions[newIndex++] = rowColumnStartPoint[2];
        vec3.subtract(tempVec, rowColumnStartPoint, columnDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];
        vec3.add(tempVec, rowColumnStartPoint, rowDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];

        newPositions[newIndex++] = rowColumnStartPoint[0];
        newPositions[newIndex++] = rowColumnStartPoint[1];
        newPositions[newIndex++] = rowColumnStartPoint[2];
        vec3.add(tempVec, rowColumnStartPoint, rowDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];
        vec3.add(tempVec, rowColumnStartPoint, backwardsDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];
      }
    }
  }

  return newPositions;
}

/**
 * Projects the given positions to a distance of one.
 *
 * @param {Array.<Number>} out
 * @param {Array.<Number>} positions
 * @private
 */
function _normalizePositions(out, positions) {
  const tempVec = vec3.create();

  for (let i = 0, count = positions.length; i < count; i += 3) {
    vec3.set(tempVec, positions[i], positions[i + 1], positions[i + 2]);

    vec3.normalize(tempVec, tempVec);

    out[i] = tempVec[0];
    out[i + 1] = tempVec[1];
    out[i + 2] = tempVec[2];
  }
}

/**
 * Given a collection of vertices that possibly contains duplicates, creates an array of the unique
 * vertex positions and an array of the indices of the original, duplicated vertices in the unique
 * array.
 *
 * This is useful for rendering using gl.drawElements (with gl.ELEMENT_ARRAY_BUFFER) instead of
 * gl.drawArrays.
 *
 * NOTE: Although this function does partially address floating-point round-off errors within the
 * given positions, it does not guarantee correctness.
 *
 * @param {Array.<Number>} oldVertexPositions
 * @returns {{vertexPositions: Array.<Number>, vertexIndices: Array.<Number>}}
 */
function dedupVertexArrayWithPositionsAndIndicesArrays(oldVertexPositions) {
  const vertexPositions = [];
  const vertexIndices = [];

  const vertexToIndexMap = new HashMap(_vertexHashFunction);
  const vertex = vec3.create();
  let oldCoordinateIndex;
  let oldCoordinateCount;
  let newVertexIndex;

  // Loop over the original, duplicated vertex positions.
  for (oldCoordinateIndex = 0, oldCoordinateCount = oldVertexPositions.length;
       oldCoordinateIndex < oldCoordinateCount;
       oldCoordinateIndex += 3) {
    vec3.set(vertex,
        oldVertexPositions[oldCoordinateIndex],
        oldVertexPositions[oldCoordinateIndex + 1],
        oldVertexPositions[oldCoordinateIndex + 2]);

    // Has this position already been recorded?
    if (!vertexToIndexMap.has(vertex)) {
      // Record the index of the unique vertex position.
      newVertexIndex = vertexPositions.length / 3;
      vertexToIndexMap.set(vertex, newVertexIndex);

      // Record the unique vertex position.
      vertexPositions.push(vertex[0]);
      vertexPositions.push(vertex[1]);
      vertexPositions.push(vertex[2]);
    }

    newVertexIndex = vertexToIndexMap.get(vertex);

    // Record the index of the unique position.
    vertexIndices.push(newVertexIndex);
  }

  return {
    vertexPositions: vertexPositions,
    vertexIndices: vertexIndices
  };
}

const _VERTEX_COORDINATE_BUCKET_SIZE_DIGITS = 4;

// This offset is important for preventing bucket-aligned numbers from being placed in inconsistent
// buckets. For example, whole integer values could easily be placed in lower or higher buckets
// depending on round-off error.
const _OFFSET = Math.random();

/**
 * Calculates a hash code for the given vertex.
 *
 * NOTE: This does not guarantee correct results. Due to round-off error, "equal" coordinates could
 * be calculated is being in different buckets. Larger bucket sizes might reduce the rate of false
 * negatives, but with the trade-off of potentially introducing false positives.
 *
 * @param {vec3} vertex
 * @returns {string}
 * @private
 */
function _vertexHashFunction(vertex) {
  return `${(vertex[0] + _OFFSET).toFixed(_VERTEX_COORDINATE_BUCKET_SIZE_DIGITS)},` +
      `${(vertex[1] + _OFFSET).toFixed(_VERTEX_COORDINATE_BUCKET_SIZE_DIGITS)},` +
      `${(vertex[2] + _OFFSET).toFixed(_VERTEX_COORDINATE_BUCKET_SIZE_DIGITS)}`;
}

/**
 * Calculate the vertex positions for a section of a sphere.
 *
 * - These points will lie along latitude-longitude lines.
 * - The shape is centered around the origin with the poles aligned with the z-axis.
 * - The radius of the circle will be one.
 *
 * @param {number} startPitchIndex
 * @param {number} endPitchIndex
 * @param {number} deltaPitch
 * @param {number} startAzimuthIndex
 * @param {number} endAzimuthIndex
 * @param {number} deltaAzimuth
 * @return {Array.<Number>}
 * @private
 */
function calculateSphericalSection(startPitchIndex, endPitchIndex, deltaPitch,
                                   startAzimuthIndex, endAzimuthIndex, deltaAzimuth) {
  const vertexPositions = [];
  let vertexPositionsIndex = 0;

  let pitchIndex;
  let azimuthIndex;
  let lowerPitch;
  let upperPitch;
  let lowerAzimuth;
  let upperAzimuth;
  let x1;
  let y1;
  let z1;
  let x2;
  let y2;
  let z2;
  let x3;
  let y3;
  let z3;
  let x4;
  let y4;
  let z4;

  // TODO: This implementation calculates all coordinates multiple times. Refactor it to be more
  // efficient.

  // Loop over each latitudinal strip.
  for (pitchIndex = startPitchIndex; pitchIndex < endPitchIndex; pitchIndex++) {
    lowerPitch = deltaPitch * pitchIndex;
    upperPitch = deltaPitch + lowerPitch;

    // Create the triangles for the strip at the current pitch.
    for (azimuthIndex = startAzimuthIndex; azimuthIndex < endAzimuthIndex; azimuthIndex++) {
      lowerAzimuth = deltaAzimuth * azimuthIndex;
      upperAzimuth = deltaAzimuth + lowerAzimuth;

      // The corners of the current square.

      x1 = Math.sin(lowerPitch) * Math.cos(lowerAzimuth);
      y1 = Math.sin(lowerPitch) * Math.sin(lowerAzimuth);
      z1 = Math.cos(lowerPitch);

      x2 = Math.sin(upperPitch) * Math.cos(lowerAzimuth);
      y2 = Math.sin(upperPitch) * Math.sin(lowerAzimuth);
      z2 = Math.cos(upperPitch);

      x3 = Math.sin(lowerPitch) * Math.cos(upperAzimuth);
      y3 = Math.sin(lowerPitch) * Math.sin(upperAzimuth);
      z3 = Math.cos(lowerPitch);

      x4 = Math.sin(upperPitch) * Math.cos(upperAzimuth);
      y4 = Math.sin(upperPitch) * Math.sin(upperAzimuth);
      z4 = Math.cos(upperPitch);

      // The first triangle.

      vertexPositions[vertexPositionsIndex] = x1;
      vertexPositions[vertexPositionsIndex + 1] = y1;
      vertexPositions[vertexPositionsIndex + 2] = z1;
      vertexPositions[vertexPositionsIndex + 3] = x2;
      vertexPositions[vertexPositionsIndex + 4] = y2;
      vertexPositions[vertexPositionsIndex + 5] = z2;
      vertexPositions[vertexPositionsIndex + 6] = x3;
      vertexPositions[vertexPositionsIndex + 7] = y3;
      vertexPositions[vertexPositionsIndex + 8] = z3;

      // The second triangle.

      vertexPositions[vertexPositionsIndex + 9] = x4;
      vertexPositions[vertexPositionsIndex + 10] = y4;
      vertexPositions[vertexPositionsIndex + 11] = z4;
      vertexPositions[vertexPositionsIndex + 12] = x3;
      vertexPositions[vertexPositionsIndex + 13] = y3;
      vertexPositions[vertexPositionsIndex + 14] = z3;
      vertexPositions[vertexPositionsIndex + 15] = x2;
      vertexPositions[vertexPositionsIndex + 16] = y2;
      vertexPositions[vertexPositionsIndex + 17] = z2;

      vertexPositionsIndex += 18;
    }
  }

  return vertexPositions;
}

/**
 * Calculate the vertex positions for a section of a cylinder.
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 *
 * @param {number} cylinderBottom
 * @param {number} cylinderTop
 * @param {number} startIndex
 * @param {number} endIndex
 * @param {number} delta
 * @returns {Array.<Number>}
 * @private
 */
function calculateCylindricalSection(cylinderBottom, cylinderTop, startIndex, endIndex, delta) {
  const vertexPositions = [];
  let vertexPositionsIndex = 0;

  let index;
  let lowerAzimuth;
  let upperAzimuth;
  let x1;
  let y1;
  let z1;
  let x2;
  let y2;
  let z2;
  let x3;
  let y3;
  let z3;
  let x4;
  let y4;
  let z4;

  // Create the triangles for the cylindrical strip.
  for (index = startIndex; index < endIndex; index++) {
    lowerAzimuth = delta * index;
    upperAzimuth = delta + lowerAzimuth;

    // The corners of the current square.

    x1 = Math.cos(lowerAzimuth);
    y1 = Math.sin(lowerAzimuth);
    z1 = cylinderBottom;

    x2 = Math.cos(lowerAzimuth);
    y2 = Math.sin(lowerAzimuth);
    z2 = cylinderTop;

    x3 = Math.cos(upperAzimuth);
    y3 = Math.sin(upperAzimuth);
    z3 = cylinderBottom;

    x4 = Math.cos(upperAzimuth);
    y4 = Math.sin(upperAzimuth);
    z4 = cylinderTop;

    // The first triangle.

    vertexPositions[vertexPositionsIndex] = x1;
    vertexPositions[vertexPositionsIndex + 1] = y1;
    vertexPositions[vertexPositionsIndex + 2] = z1;
    vertexPositions[vertexPositionsIndex + 3] = x2;
    vertexPositions[vertexPositionsIndex + 4] = y2;
    vertexPositions[vertexPositionsIndex + 5] = z2;
    vertexPositions[vertexPositionsIndex + 6] = x3;
    vertexPositions[vertexPositionsIndex + 7] = y3;
    vertexPositions[vertexPositionsIndex + 8] = z3;

    // The second triangle.

    vertexPositions[vertexPositionsIndex + 9] = x4;
    vertexPositions[vertexPositionsIndex + 10] = y4;
    vertexPositions[vertexPositionsIndex + 11] = z4;
    vertexPositions[vertexPositionsIndex + 12] = x3;
    vertexPositions[vertexPositionsIndex + 13] = y3;
    vertexPositions[vertexPositionsIndex + 14] = z3;
    vertexPositions[vertexPositionsIndex + 15] = x2;
    vertexPositions[vertexPositionsIndex + 16] = y2;
    vertexPositions[vertexPositionsIndex + 17] = z2;

    vertexPositionsIndex += 18;
  }

  return vertexPositions;
}

/**
 * Scale and then translate the 3-dimensional positions in the given flattened array.
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 *
 * @param {Array.<Number>} vertexPositions Output.
 * @param {number} startIndex
 * @param {number} endIndex
 * @param {vec3} scale
 * @param {vec3} translate
 * @private
 */
function scaleThenTranslatePositions(vertexPositions, startIndex, endIndex, scale, translate) {
  const scaleX = scale[0];
  const scaleY = scale[1];
  const scaleZ = scale[2];
  const translateX = translate[0];
  const translateY = translate[1];
  const translateZ = translate[2];

  for (let i = startIndex; i < endIndex; i += 3) {
    vertexPositions[i] = vertexPositions[i] * scaleX + translateX;
    vertexPositions[i + 1] = vertexPositions[i + 1] * scaleY + translateY;
    vertexPositions[i + 2] = vertexPositions[i + 2] * scaleZ + translateZ;
  }
}

// Export this module's logic

export {
  getViewportWidth,
  getViewportHeight,
  getWebGLContext,
  createBuffer,
  getAttribLocation,
  buildProgram,
  buildShader,
  loadShader,
  loadProgram,
  createBufferFromData,
  bindGLContextToViewportDimensions,
  bindFramebuffer,
  createFramebuffer,
  createTextureForRendering,
  createRenderBuffer,
  create2DSquarePositionsConfig,

  expandVertexIndicesToDuplicatePositions,
  calculateOrthogonalVertexNormals,
  calculateLatLongTextureCoordinates,
  calculateCylindricalTextureCoordinates,
  expandVertexIndicesAroundLongitudeSeam,
  tesselateSphere,
  dedupVertexArrayWithPositionsAndIndicesArrays,
  calculateSphericalSection,
  calculateCylindricalSection,
  scaleThenTranslatePositions,
};

// Some type defs to make my editor's auto-complete happy.

/** @typedef {Object} WebGLProgram */
/** @typedef {Object} WebGLShader */
/** @typedef {Object} WebGLBuffer */
/** @typedef {Object} WebGLTexture */
/** @typedef {Float32Array|Array.<Number>} mat3 */
/** @typedef {Float32Array|Array.<Number>} mat4 */
/** @typedef {Float32Array|Array.<Number>} quat */
/** @typedef {Float32Array|Array.<Number>} vec2 */
/** @typedef {Float32Array|Array.<Number>} vec3 */
/** @typedef {Float32Array|Array.<Number>} vec4 */
