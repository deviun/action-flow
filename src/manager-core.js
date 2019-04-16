const has = require('lodash/has');
const get = require('lodash/get');

const uuid = require('uuid/v4');
const Queue = require('./queue');
const Description = require('./description');
const promise = require('bluebird');

const AWAIT_TIMEOUT_SEC = 60;

function getTimeSec () {
  return (new Date()).getTime() / 1000;
}

class MultiFlow {
  constructor(descriptionList, data) {
    this.multiBlock = new ManagerCore(descriptionList, data);

    this.flows = descriptionList.reduce((list, description) => {
      list.push(new ManagerCore(description, data));

      return list;
    }, []);
  }

  async await () {
    await this.multiBlock.await();

    for (const flow of this.flows) {
      await flow.await();
    }
  }

  async end () {
    await promise.all(
      this.flows.map(
        flow => flow.end(),
      )
    );

    await this.multiBlock.end();
  }
}

class ManagerCore {
  constructor (description, {
    awaitTimeoutSec,
    driverName,
    driverClass,
    ...moreOptions
  } = {}) {
    this.data = {
      awaitTimeoutSec,
      driverName,
      driverClass,
      ...moreOptions,
    };
    
    this.AWAIT_TIMEOUT_SEC = awaitTimeoutSec || AWAIT_TIMEOUT_SEC;
    this.descriptionHash = Description.parse(description, {
      noSHA: moreOptions.noSHA,
      prefix: moreOptions.sessionName,
    });
    this.clientId = uuid();
  }

  async await () {
    const {
      descriptionHash, clientId,
      data: {
        driverClass, driverName,
        ...moreOptions
      },
    } = this;
    this.queue = new Queue({
      driverClass,
      driverName,
      descriptionHash,
      clientId,
      ...moreOptions
    });

    await this.queue.join();

    await new promise((resolve, reject) => {
      const startTime = getTimeSec();
      const timeout = this.AWAIT_TIMEOUT_SEC;

      const _await = async () => {
        const isFirstInQueue = await this.queue.isFirst();
        const pointTime = getTimeSec();
        const timePassed = pointTime - startTime;

        if (isFirstInQueue) {
          return resolve();
        }

        if (timePassed < timeout) {
          return setTimeout(_await, (timePassed * 100));
        }

        return reject('(action flow) timeout: ' + this.descriptionHash);
      };

      _await();
    })
    .catch(async (err) => {
      await this.end();
      throw err;
    });
  }

  async end () {
    return this.queue.leave();
  }

  static multi (descriptionList, data) {
    return new MultiFlow(descriptionList, data);
  }
}

class Creator {
  /**
   * @param {object} data Options
   * @param {string} data.driverName driver name for using
   * @param {number} [data.awaitTimeoutSec] await timeout
   * @param {Driver} [data.driverClass] custom driver
   * @param {host} [data.host] mongodb/redis host
   * @param {host} [data.port] mongodb/redis port
   * @param {host} [data.user] mongodb user
   * @param {host} [data.password] mongodb/redis password
   * @param {string} [data.sessionName] prefix for all descriptions
   * @param {string} [data.noSHA=true] turn of sha256 for description
   */
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

module.exports = data => new Creator(data);
