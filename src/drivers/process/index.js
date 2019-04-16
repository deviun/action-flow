const driverCore = require('../../driver-core');

const DRIVER_NAME = 'process';

const processOperations = global.afDriverProcessStore = {};

class ProcessDriver extends driverCore {
  constructor({
    clientId,
    descriptionHash,
  } = {}) {
    super({
      driver: DRIVER_NAME,
    });

    this.clientId = clientId;
    this.descriptionHash = descriptionHash;

    if (!processOperations[this.descriptionHash]) {
      processOperations[this.descriptionHash] = [];
    }
  }

  async join() {
    this.leave();
    processOperations[this.descriptionHash].push(this.clientId);
  }

  async isFirst() {
    return processOperations[this.descriptionHash][0] === this.clientId;
  }

  async leave() {
    processOperations[this.descriptionHash] = processOperations[this.descriptionHash]
      .filter(
        cid => this.clientId !== cid,
      );
  }
}

module.exports = ProcessDriver;
