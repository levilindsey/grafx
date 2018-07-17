import {bindFramebuffer} from '../../util';

import {programWrapperStore} from './program-wrapper-store';

/**
 * This class wraps a collection of ProgramWrappers and supports drawing them as a group.
 */
class GroupProgramWrapper {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} config
   */
  constructor(gl, config) {
    this.config = config;
    this._childrenProgramWrappers = [];
    this._isReady = null;

    this._loadChildren(gl, config).then(() => {
      if (config.initialize) config.initialize(gl);
      if (config.isAPostProcessor) {
        _createChildrenFramebuffersAndTextures(gl, config);
      }
    });
  }

  /** @returns {string} */
  get programId() {
    return this.config.id;
  }

  /** @returns {Promise} */
  getIsReady() {
    return this._isReady;
  }

  /**
   * Renders shapes using this program.
   *
   * @param {WebGLRenderingContext} gl
   */
  draw(gl) {
    if (this.config.webGLStateSetter) this.config.webGLStateSetter(gl);
    this.config.childrenFramebufferIds.forEach(_clearFramebuffer.bind(this, gl));
    this.config.childrenProgramsToDraw.forEach(_drawChildProgramWrapper.bind(this, gl));
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} config
   * @private
   */
  _loadChildren(gl, config) {
    this._isReady = Promise.all(
        config.childrenProgramConfigs.map(config =>
            programWrapperStore.loadProgramWrapper(gl, config)
                .then(programWrapper => this._childrenProgramWrappers.push(programWrapper))));
    return this._isReady;
  }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} id
 * @private
 */
function _clearFramebuffer(gl, id) {
  const framebuffer = programWrapperStore.getFramebuffer(id);
  bindFramebuffer(gl, framebuffer);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {ProgramWrapperConfig} config
 * @private
 */
function _createChildrenFramebuffersAndTextures(gl, config) {
  config.childrenFramebufferIds.forEach(id =>
      programWrapperStore.createNewFramebufferAndTexture(gl, id, false));
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {ChildProgramAndFramebufferIds} childProgramAndFramebufferIds
 * @private
 */
function _drawChildProgramWrapper(gl, childProgramAndFramebufferIds) {
  const {programId, inputFramebufferIds, outputFramebufferId} = childProgramAndFramebufferIds;

  const framebuffer = outputFramebufferId ?
      programWrapperStore.getFramebuffer(outputFramebufferId) : null;
  const programWrapper = programWrapperStore.getProgramWrapper(programId);
  const programVariablesConfig =
      programWrapper.config.getProgramVariablesConfig(gl, inputFramebufferIds);

  bindFramebuffer(gl, framebuffer);
  programWrapper.setProgram(gl);
  programWrapper.draw(gl, programVariablesConfig);
}

export {GroupProgramWrapper};
