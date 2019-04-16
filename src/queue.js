const get = require('lodash/get');
const has = require('lodash/has');
const log = require('./libs/log');

// drivers
const processDriver = require('./drivers/process');
const mongodbDriver = require('./drivers/mongodb');
const redisDriver = require('./drivers/redis');

const DRIVER_MAP = {
  'process': processDriver,
  'mongodb': mongodbDriver,
  'redis': redisDriver,
};

const DEFAULT_DRIVER = 'redis';

class Queue {
  constructor ({
    driverName = DEFAULT_DRIVER,
    driverClass,
    clientId,
    descriptionHash,
    ...moreOptions
  } = {
    driverName: DEFAULT_DRIVER,
  }) {
    this.driverClass = driverClass;

    log.debug('[action-flow] options: %s', JSON.stringify({
      driverClass,
      driverName,
      moreOptions,
    }));

    this.driverName = driverName;

    if (driverClass) {
      this.driverClass = driverClass;
    } else {
      // try connect exists driver
      this.driverClass = DRIVER_MAP[driverName];
    }

    if (!this.driverClass) {
      throw new Error('Driver class not found');
    }

    this.driver = new this.driverClass({
      clientId,
      descriptionHash,
      ...moreOptions
    });

    log.debug('[action-flow] use driver "%s"', driverName);

    // connect required methods from driver
    this.join = this.driver.join.bind(this.driver);
    this.isFirst = this.driver.isFirst.bind(this.driver);
    this.leave = this.driver.leave.bind(this.driver);
  }
}

module.exports = Queue;
