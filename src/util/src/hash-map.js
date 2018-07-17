/**
 * A hash map that uses a custom hash function.
 */
class HashMap {
  /**
   * @param {Function} hashFunction
   */
  constructor(hashFunction) {
    this._hashFunction = hashFunction;
    this._map = new Map();
  }

  /**
   * @param {Object} key
   * @param {Object} value
   */
  set(key, value) {
    const hashCode = this._hashFunction(key);
    this._map.set(hashCode, value);
  }

  /**
   * @param {Object} key
   * @returns {Object}
   */
  get(key) {
    const hashCode = this._hashFunction(key);
    return this._map.get(hashCode);
  }

  /**
   * @param {Object} key
   * @returns {boolean}
   */
  has(key) {
    const hashCode = this._hashFunction(key);
    return this._map.has(hashCode);
  }

  /**
   * @param {Object} item
   * @returns {boolean}
   */
  remove(item) {
    return this._map.delete(item);
  }

  /**
   * @param {Function} callback
   */
  forEach(callback) {
    this._map.forEach(callback);
  }

  clear() {
    this._map.clear();
  }

  /**
   * @returns {number}
   */
  get size() {
    return this._map.size;
  }
}

export {HashMap};
