const ROOT = `${__dirname}/../`;
const moduleName = 'ActionFlow.manager-core';

const _ = require('lodash');

const $path = require('path');
const $uuid = require('uuid/v4');
const $sha256 = require('sha256');
const $JMongo = require('just-mongo');
const $log = require($path.resolve(ROOT, 'src/libs/log'));
const $Queue = require($path.resolve(ROOT, 'src/queue'));
const $Promise = require('bluebird');

const AWAIT_TIMEOUT_SEC = 30;

const mongoConnections = {};
const actionFlowModels = require($path.resolve(ROOT, 'src/models')).models;

const Description = {
  parse (flowDescription) {
    if (!(flowDescription instanceof Object)) {
      throw new Error(`[${moduleName}] {flowDescription} -> object is not found`);
    } 

    function _p (obj) {
      return Object.keys(obj).reduce((r, key, index) => {
        const value = obj[key] instanceof Object ? _p(obj[key]) : String(obj[key]);

        r += $sha256(`${key}.${value}.${index}`);

        return r;
      }, 'start');
    }

    return $sha256( _p(flowDescription) );
  }
};

const Time = {
  getSec () {
    return (new Date()).getTime() / 1000;
  },
  getMsec () {
    return (new Date()).getTime();
  }
};

class MultiFlow {
  constructor (descriptionList, dbConfig) {
    this.flows = descriptionList.reduce((list, description) => {
      list.push(new ManagerCore(description, dbConfig));

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
  constructor (flowDescription, dbConfig, awaitTimeoutSec) {
    const checkDBConfig = [
      _.has(dbConfig, 'db'),
      _.has(dbConfig, 'host'),
      _.has(dbConfig, 'port')
    ];

    if (checkDBConfig.includes(false)) {
      throw new Error(`[${moduleName}] db config is invalid`);
    }

    if (awaitTimeoutSec) {
      this.AWAIT_TIMEOUT_SEC = awaitTimeoutSec;
    }

    const configHash = Description.parse(dbConfig);
    const dbConnection = mongoConnections[Symbol.for(configHash)];

    if (!dbConnection) {
      const newConnection = new $JMongo(Object.assign({}, {
        models: actionFlowModels
      }, dbConfig), (err, ok) => {
        if (err) {
          
          delete this;
        }
      });

      mongoConnections[Symbol.for(configHash)] = newConnection;

      this.db = newConnection;
    } else {
      this.db = dbConnection;
    }

   this.descriptionHash = Description.parse(flowDescription);
   this.createClientId();
  }

  async await () {
    this.queue = new $Queue({
      descriptionHash: this.descriptionHash,
      clientId: this.clientId,
      db: this.db
    });

    await this.queue.join();

    await new $Promise((resolve, reject) => {
      const startTime = Time.getSec();
      const timeout = this.AWAIT_TIMEOUT_SEC || AWAIT_TIMEOUT_SEC;

      const _await = async () => {
        const isFirstInQueue = await this.queue.isFirst();
        const pointTime = Time.getSec();
        const timePassed = pointTime - startTime;

        if (!isFirstInQueue) {
          if (timePassed < timeout) {
            setTimeout(_await, ( timePassed * 100 ));
          } else {
            reject('timeout');
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

  static multi (descriptionList, dbConfig) {
    return new MultiFlow(descriptionList, dbConfig);
  }
}

class Creator {
  constructor (dbConfig) {
    this.dbConfig = dbConfig;
  }

  create (flowDescription, awaitTimeoutSec) {
    return new ManagerCore(flowDescription, this.dbConfig, awaitTimeoutSec);
  }

  multi (descriptionList) {
    return ManagerCore.multi(descriptionList, this.dbConfig);
  }
}

module.exports = (dbConfig) => new Creator(dbConfig);