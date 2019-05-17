const sha256 = require('sha256');

class Description {
  /**
  * @description Create hash id for description object of operation
  * @param {object} description operation description
  * @param {any} params
  * @param {boolean} params.noSHA turn of sha256 for description
  * @param {string} params.prefix prefix for description
  * @returns {string} description summary
  */
  static parse(description, {
    noSHA = false,
    prefix = '',
  } = {}) {
    if (!(description instanceof Object)) {
      throw new Error(`{description} -> object is not found`, description);
    }

    function _parse(obj) {
      return Object.keys(obj).reduce((r, key, index) => {
        const value = obj[key] instanceof Object ? _parse(obj[key]) : String(obj[key]);
        const summary = `${key}.${value}.${index}`;

        r += noSHA ? summary : sha256(summary);

        return r;
      }, '');
    }

    const summary = prefix + _parse(description);
    return noSHA ? summary : sha256(summary);
  }
}

module.exports = Description;
