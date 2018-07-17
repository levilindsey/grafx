import {createFramebuffer, createRenderBuffer, createTextureForRendering} from '../../util';

import {GroupProgramWrapper} from './group-program-wrapper';
import {ProgramWrapper} from './program-wrapper';

/**
 * This class loads, compiles, and stores WebGL rendering programs.
 *
 * Also, this stores draw-frame handlers for a given program. This makes it easy for a top-level
 * controller to group together draw calls for a given program and therefore minimize program
 * switches.
 *
 * Also, this distinguishes between rendering programs that are used for rendering individual models
 * and post-processing programs that are used for manipulating the entire frame after all the models
 * have rendered.
 *
 * This also allows for grouping programs, which consist of multiple child programs that are all
 * rendered in sequence for a related purpose.
 */
class ProgramWrapperStore {
  constructor() {
    this._modelProgramCache = {};
    this._sortedModelPrograms = [];
    this._postProcessingProgramCache = {};
    this._sortedPostProcessingPrograms = [];
    this._frambuffers = {};
    this._textures = {};
    this._renderBuffers = {};
  }

  /**
   * Loads and caches a program wrapper using the given configuration.
   *
   * This method is idempotent; a given program will only be cached once.
   *
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} params
   * @returns {Promise.<ProgramWrapper|GroupProgramWrapper, Error>}
   * @private
   */
  loadProgramWrapper(gl, params) {
    let cache;
    let sortedList;
    if (params.isAPostProcessor) {
      cache = this._postProcessingProgramCache;
      sortedList = this._sortedPostProcessingPrograms;
    } else {
      cache = this._modelProgramCache;
      sortedList = this._sortedModelPrograms;
    }
    let cacheInfo = cache[params.id];

    // Cache the program if it has not been previously registered.
    if (!cacheInfo) {
      cacheInfo = {};

      cacheInfo.params = params;
      cacheInfo.renderPriority = params.renderPriority;

      let programWrapper = params.childrenProgramConfigs ?
          new GroupProgramWrapper(gl, params) : new ProgramWrapper(gl, params);

      cacheInfo.programWrapper = programWrapper;
      cacheInfo.promise = programWrapper.getIsReady().then(() => cacheInfo.programWrapper);

      if (params.isAPostProcessor) {
        // As soon as we know we'll use a post-processing program, make sure we create the default
        // framebuffer/texture for rendering models into.
        if (!this.modelsFramebuffer) {
          this.createNewFramebufferAndTexture(gl, MODELS_FRAMEBUFFER_ID, true);
        }
      } else {
        // Post-processing programs are not used for rendering individual models.
        cacheInfo.drawFrameHandlers = new Set();
      }

      // Store the program cache info in both a map and a list that is sorted by render priority.
      cache[params.id] = cacheInfo;
      sortedList.push(cacheInfo);
      sortedList.sort(_compareProgramCacheInfo);
    }

    return cacheInfo.promise;
  }

  /**
   * Registers the given draw-frame event handler for the given program.
   *
   * This method is idempotent; draw-frame handlers are stored in a set, so duplicate additions will
   * overwrite previous additions.
   *
   * @param {string} id
   * @param {Function} drawFrameHandler
   */
  registerDrawFrameHandler(id, drawFrameHandler) {
    const programCacheInfo = this._modelProgramCache[id];

    if (!programCacheInfo) {
      if (this._postProcessingProgramCache[id]) {
        // The program is not set up for rendering individual models.
        throw new Error(`Cannot register a draw-frame handler for a program that is not set up for 
                         rendering individual models registered: ${id}`);
      } else {
        // The program has not been registered.
        throw new Error(`Cannot register a draw-frame handler for a program that has not yet been 
                         registered: ${id}`);
      }
    }

    // Store the draw-frame handler.
    programCacheInfo.drawFrameHandlers.add(drawFrameHandler);
  }

  /**
   * WARNING: This will remove the program from the store even if there are still other components
   * depending on this program or its draw-frame handlers.
   *
   * @param {string} id
   */
  deleteProgramWrapper(id) {
    // Determine which collections we're removing the program from.
    let sortedPrograms;
    let programCache;
    if (this._modelProgramCache[id]) {
      sortedPrograms = this._sortedModelPrograms;
      programCache = this._modelProgramCache;
    } else {
      sortedPrograms = this._sortedPostProcessingPrograms;
      programCache = this._postProcessingProgramCache;
    }
    const programCacheInfo = programCache[id];

    // Remove the program.
    sortedPrograms.splice(sortedPrograms.indexOf(programCacheInfo), 1);
    delete programCache[id];
  }

  // TODO: Don't forget to unregister draw-frame handlers when destroying models (asteroids, UFOs,
  // etc.)
  /**
   * @param {string} id
   * @param {Function} drawFrameHandler
   */
  unregisterDrawFrameHandler(id, drawFrameHandler) {
    this._modelProgramCache[id].drawFrameHandlers.delete(drawFrameHandler);
  }

  /**
   * @param {string} id
   * @returns {Promise}
   * @throws If there is no program registered with the given ID.
   */
  getProgramWrapperPromise(id) {
    const cacheInfo = this._modelProgramCache[id] || this._postProcessingProgramCache[id];
    return cacheInfo.promise;
  }

  /**
   * @param {string} id
   * @returns {ProgramWrapper}
   * @throws If there is no program registered with the given ID.
   */
  getProgramWrapper(id) {
    const cacheInfo = this._modelProgramCache[id] || this._postProcessingProgramCache[id];
    return cacheInfo.programWrapper;
  }

  /**
   * Calls the given callback once for each registered per-model program wrapper.
   *
   * The callback is passed two arguments: the program wrapper and the registered draw-frame
   * handlers.
   *
   * @param {Function} callback
   */
  forEachModelProgram(callback) {
    this._sortedModelPrograms.forEach(programCacheInfo =>
        callback(programCacheInfo.programWrapper, programCacheInfo.drawFrameHandlers));
  }

  /**
   * Calls the given callback once for each registered post-processing program wrapper.
   *
   * @param {Function} callback
   */
  forEachPostProcessingProgram(callback) {
    this._sortedPostProcessingPrograms.forEach(
        programCacheInfo => callback(programCacheInfo.programWrapper));
  }

  /** @returns {boolean} */
  get isUsingPostProcessingPrograms() {
    return this._sortedPostProcessingPrograms.length > 0;
  }

  /**
   * Creates and stores a framebuffer with a texture.
   *
   * Both the framebuffer and texture can be accessed later using the given ID.
   *
   * @param {WebGLRenderingContext} gl
   * @param {string} id
   * @param {boolean} [shouldStoreDepthInfo=false]
   */
  createNewFramebufferAndTexture(gl, id, shouldStoreDepthInfo=false) {
    let renderBuffer;
    if (shouldStoreDepthInfo) {
      renderBuffer = createRenderBuffer(gl);
      this._renderBuffers[id] = renderBuffer;
    }

    const texture = createTextureForRendering(gl);
    this._textures[id] = texture;

    const framebuffer = createFramebuffer(gl, texture, renderBuffer);
    this._frambuffers[id] = framebuffer;
  }

  /**
   * @param {string} id
   * @returns {?WebGLFramebuffer}
   */
  getFramebuffer(id) {
    return this._frambuffers[id];
  }

  /**
   * @param {string} id
   * @returns {?WebGLTexture}
   */
  getTexture(id) {
    return this._textures[id];
  }

  /**
   * If we are using a post-processing program, then this is the default framebuffer for rendering
   * models into.
   *
   * @returns {?WebGLFramebuffer}
   */
  get modelsFramebuffer() {
    return this._frambuffers[MODELS_FRAMEBUFFER_ID];
  }

  /**
   * If we are using a post-processing program, then this is the default texture for rendering
   * models into.
   *
   * @returns {?WebGLTexture}
   */
  get modelsTexture() {
    return this._textures[MODELS_FRAMEBUFFER_ID];
  }

  /**
   * If we are using a post-processing program, then this is the default depth render buffer for
   * rendering models.
   *
   * @returns {?WebGLRenderBuffer}
   */
  get modelsRenderBuffer() {
    return this._renderBuffers[MODELS_FRAMEBUFFER_ID];
  }
}

function _compareProgramCacheInfo(a, b) {
  return a.renderPriority - b.renderPriority;
}

export const MODELS_FRAMEBUFFER_ID = 'models';

export const programWrapperStore = new ProgramWrapperStore();

/**
 * @typedef {Object} ProgramCacheInfo
 * @property {ProgramWrapperConfig} params
 * @property {ProgramWrapper|GroupProgramWrapper} [programWrapper]
 * @property {Set.<Function>} [drawFrameHandlers]
 * @property {Array.<ProgramWrapper>} [childrenProgramWrappers]
 */
