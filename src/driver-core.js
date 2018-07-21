const get = require('lodash/get');

/**
 * @class Driver
 * @description Provider between library and data storage
 */
class Driver {
  /**
   * @constructor 
   * @description Parent for each driver
   * @param {Object} data 
   * @param {String} data.name - driver name
   */
  constructor (data) {
    this.name = get(data, 'name', 'unknown driver');
  }

  /**
   * @description Join the client to queue 
   */
  async join () {
    // make in your driver
    // before join method, execute leave method (optional)
  }

  /**
   * @description Check queue status the client
   * @return {Boolean} Is the client first in queue
   */
  async isFirst () {
    // make in your driver
  }

  /**
   * @description Remove the client from queue 
   */
  async leave () {
    // make in your driver
  }
}

module.exports = Driver;