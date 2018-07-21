const has = require('lodash/has');
const get = require('lodash/get');

const $uuid = require('uuid/v4');
const $Queue = require('./queue');
const $Description = require('./description');
const $Promise = require('bluebird');

const AWAIT_TIMEOUT_SEC = 30;

function getTimeSec () {
  return (new Date()).getTime() / 1000;
}

class MultiFlow {
  constructor (descriptionList, data) {
    this.flows = descriptionList.reduce((list, description) => {
      list.push(new ManagerCore(description, data));

      return list;
    }, []);
  }

  async await () {
    return await $Promise.all(this.flows.map((flow) => {
      return flow.await();
    }));
  }

  async end () {
    return await $Promise.all(this.flows.map((flow) => {
      return flow.end();
    }));
  }
}

class ManagerCore {
  constructor (flowDescription, data) {
    this.data = data;
  
    if (has(data, 'awaitTimeoutSec')) {
      this.AWAIT_TIMEOUT_SEC = get(data, 'awaitTimeoutSec');
    }

    this.descriptionHash = $Description.parse(flowDescription);
    this.createClientId();
  }

  async await () {
    this.queue = new $Queue(Object.assign({}, {
      descriptionHash: this.descriptionHash,
      clientId: this.clientId
    }, this.data));

    await this.queue.join();

    await new $Promise((resolve, reject) => {
      const startTime = getTimeSec();
      const timeout = this.AWAIT_TIMEOUT_SEC || AWAIT_TIMEOUT_SEC;

      const _await = async () => {
        const isFirstInQueue = await this.queue.isFirst();
        const pointTime = getTimeSec();
        const timePassed = pointTime - startTime;

        if (!isFirstInQueue) {
          if (timePassed < timeout) {
            setTimeout(_await, ( timePassed * 100 ));
          } else {
            reject('(action flow) timeout: ' + this.descriptionHash);
          }
        } else {
          resolve();
        }
      };

      _await();
    })
    .catch((err) => {
      this.end();

      throw err;
    });
  }

  async end () {
    return this.queue.leave();
  }

  createClientId () {
    this.clientId = $uuid();

    return this.clientId;
  }

  static multi (descriptionList, data) {
    return new MultiFlow(descriptionList, data);
  }
}

class Creator {
  constructor (data) {
    this.data = data;
  }

  create (flowDescription) {
    return new ManagerCore(flowDescription, this.data);
  }

  multi (descriptionList) {
    return ManagerCore.multi(descriptionList, this.data);
  }
}

module.exports = (data) => new Creator(data);