const get = require('lodash/get');
const has = require('lodash/has');

const DEFAULT_DRIVER = 'mongodb';

class Queue {
  constructor (options) {
    Object.assign(this, options);

    this.driverName = get(options.driver, 'driverName', DEFAULT_DRIVER);

    if (has(options, 'driverClass')) {
      this.driverClass = options.driverClass;
    } else {
      // try connect exists driver
      this.driverClass = require('./drivers/' + this.driverName);
    }

    this.driver = new this.driverClass(options);

    // connect required methods from driver
    this.join = this.driver.join.bind(this.driver);
    this.isFirst = this.driver.isFirst.bind(this.driver);
    this.leave = this.driver.leave.bind(this.driver);
  }
}

module.exports = Queue;