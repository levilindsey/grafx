import {renderableShapeFactory} from '../../renderable-shapes';

import {ModelController} from './model-controller';

/**
 * This class defines an extension of the model-controller class that uses a common set of program
 * variables and transformation matrices.
 */
class StandardModelController extends ModelController {
  /**
   * @param {ModelControllerConfig} params
   * @param {RenderableShapeConfig} shapeParams
   */
  constructor(params, shapeParams) {
    super(params);

    this.scale = shapeParams.scale || vec3.fromValues(1, 1, 1);
    this._mvMatrix = mat4.create();
    this._normalMatrix = mat4.create();
    this._model = renderableShapeFactory.createModel(this._gl, shapeParams);
  }

  update(currentTime, deltaTime) {}

  draw() {
    // Update the model-view matrix.
    mat4.multiply(this._mvMatrix, this._getViewMatrix(), this._worldTransform);

    // Update the normal matrix.
    mat4.invert(this._normalMatrix, this._mvMatrix);
    mat4.transpose(this._normalMatrix, this._normalMatrix);

    // Update the uniform variables.
    this._programVariablesConfig.uniforms['uPMatrix'] = this._getProjectionMatrix();
    this._programVariablesConfig.uniforms['uMVMatrix'] = this._mvMatrix;
    this._programVariablesConfig.uniforms['uNormalMatrix'] = this._normalMatrix;

    // Draw shapes using the current variables configuration.
    this._programWrapper.draw(this._gl, this._programVariablesConfig, 0, this._model.elementCount);
  }

  /**
   * Initializes the program variables configuration.
   *
   * @protected
   */
  _setUpProgramVariablesConfig() {
    this._programVariablesConfig = {
      attributes: {
        aVertexPosition: this._model.vertexPositionsConfig,
        aTextureCoord: this._model.textureCoordinatesConfig,
        aVertexNormal: this._model.vertexNormalsConfig,
      },
      uniforms: {
        uPMatrix: this._getProjectionMatrix(),
        uMVMatrix: this._mvMatrix,
        uNormalMatrix: this._normalMatrix,
        uSampler: this._texture,
      },
      mode: this._model.mode,
      vertexIndices: this._model.vertexIndicesBuffer,
      elementCount: this._model.elementCount,
    };
  }
}

export {StandardModelController};
