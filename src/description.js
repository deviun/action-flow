const $sha256 = require('sha256');

/**
 * @description Create hash id for description object of operation
 * @returns {String} sha256 hash string
 */
class Description {
  static parse(flowDescription) {
    if (!(flowDescription instanceof Object)) {
      throw new Error(`{flowDescription} -> object is not found`, flowDescription);
    }

    function _p(obj) {
      return Object.keys(obj).reduce((r, key, index) => {
        const value = obj[key] instanceof Object ? _p(obj[key]) : String(obj[key]);

        r += $sha256(`${key}.${value}.${index}`);

        return r;
      }, 'start');
    }

    return $sha256(_p(flowDescription));
  }
}

module.exports = Description;