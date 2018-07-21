const get = require('lodash/get');
const has = require('lodash/has');

const DEFAULT_DRIVER = 'mongodb';

class Queue {
  constructor (options) {
    Object.assign(this, options);

    this.driverName = get(options.driver, 'driverName', DEFAULT_DRIVER);

    if (has(options, 'driverClass')) {
      Object.assign(this, options.driverClass);
    } else {
      // try connect exists driver
      const driverClass = require('./drivers/' + this.driverName);

      Object.assign(this, driverClass);
    }
  }
}

module.exports = Queue;