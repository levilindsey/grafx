import {loadImageSrc} from '../../util';

/**
 * This class loads, sets up, and stores WebGL texture objects.
 *
 * NOTE: Only textures whose side lengths are powers of two are supported.
 */
class TextureStore {
  constructor() {
    this.textureCache = {};
  }

  /**
   * @param {string} texturePath
   * @returns {WebGLTexture}
   */
  getTexture(texturePath) {
    return this.textureCache[texturePath].texture;
  }

  /**
   * Loads the texture image at the given path, creates a texture object from it, caches the
   * texture, and returns a promise for the texture.
   *
   * This method is idempotent; a given texture will only be loaded once.
   *
   * @param {WebGLRenderingContext} gl
   * @param {string} texturePath
   * @returns {Promise.<WebGLTexture, Error>}
   */
  loadTexture(gl, texturePath) {
    let textureCacheInfo = this.textureCache[texturePath];

    // Load, create, and cache the texture if it has not been previously registered.
    if (!textureCacheInfo) {
      textureCacheInfo = {
        texturePromise: null,
        texture: null,
        image: new Image()
      };
      this.textureCache[texturePath] = textureCacheInfo;
      textureCacheInfo.texturePromise = loadImageSrc(textureCacheInfo.image, texturePath)
          .then(_ => this._createTexture(gl, textureCacheInfo));
    }

    return textureCacheInfo.texturePromise;
  }

  // TODO: Make this more general/configurable by creating a new TextureConfig typedef with most of
  // the gl.xxx params included below (like the AttributeConfig typedef}, passing a textureConfig in
  // the register method, and saving it on the textureCacheInfo object.
  /**
   * @param {WebGLRenderingContext} gl
   * @param {TextureCacheInfo} textureCacheInfo
   * @returns {WebGLTexture}
   * @private
   */
  _createTexture(gl, textureCacheInfo) {
    console.info(`Texture loaded: ${textureCacheInfo.image.src}`);

    textureCacheInfo.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureCacheInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCacheInfo.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return textureCacheInfo.texture;
  }

  /**
   * WARNING: This will remove the texture from the store even if there are still other components
   * depending on this texture.
   *
   * @param {string} texturePath
   */
  deleteTexture(texturePath) {
    delete this.textureCache[texturePath];
  }
}

export const textureStore = new TextureStore();

/**
 * @typedef {Object} TextureCacheInfo
 * @property {Promise.<WebGLTexture, Error>} texturePromise
 * @property {WebGLTexture} [texture]
 * @property {HTMLImageElement} [image]
 */
