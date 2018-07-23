const driverCore = require('../../driver-core');
const get = require('lodash/get');

const DRIVER_NAME = 'process';

const processOperations = global.afDriverProcessStore = {};

class processDriver extends driverCore {
  constructor (data) {
    super({
      driver: DRIVER_NAME
    });

    Object.assign(this, {
      clientId: data.clientId,
      descriptionHash: data.descriptionHash
    });

    if (!processOperations[this.descriptionHash]) {
      processOperations[this.descriptionHash] = [];
    }
  }

  async join () {
    this.leave();
    processOperations[this.descriptionHash].push(this.clientId);
  }

  async isFirst () {
    return processOperations[this.descriptionHash][0] === this.clientId;
  }

  async leave () {
    processOperations[this.descriptionHash] = processOperations[this.descriptionHash].filter((cid) => this.clientId !== cid);
  }
}

module.exports = processDriver;