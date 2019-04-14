const driverCore = require('../../driver-core');
const { afModelsGetProp, models } = require('./models');
const jMongo = require('just-mongo');
const get = require('lodash/get');

const DB_QUEUE = afModelsGetProp('queue'); // by default
const DRIVER_NAME = 'mongodb';

/**
 * @description create mongodb connection by config
 * @param {Object} data
 * @param {String} data.db - database name for action flow
 * @param {String} data.host - hostname for mongodb
 * @param {String} data.port - port for mongodb
 * @param {String} data.user - username mongodb
 * @param {String} data.password - password mongodb
 * @param {Number} data.port - port mongodb
 * @param {String} data.logLevel - logLevel for mongo wrapper
 * @returns {Object} mongodb interface by just-mongo
 */
function createMongodb (data) {
  return new jMongo({
    models,
    log: get(data, 'logLevel', false), // use env LOG_LEVEL
    db: get(data, 'db', 'actionFlow'),
    host: get(data, 'host'),
    user: get(data, 'user'),
    password: get(data, 'password'),
    port: get(data, 'port')
  });
}

/**
 * @class mongodbDriver
 * @description storage driver for mongodb
 */
class MongodbDriver extends driverCore {
  /**
   * @constructor
   * @param {Object} data
   * @param {String} data.clientId
   * @param {String} data.descriptionHash
   * @param {Any} data. Data for createMongodb function
   */
  constructor (data) {
    super({
      driver: DRIVER_NAME,
    });

    this.mongo = createMongodb(data);
    this.db = this.mongo.collection(DB_QUEUE);
    
    Object.assign(this, {
      clientId: data.clientId,
      descriptionHash: data.descriptionHash,
    });
  }

  async join() {
    await this.leave();

    const me = {
      clientId: this.clientId,
      descriptionHash: this.descriptionHash,
      setTime: (new Date()).getTime(),
    };

    return await this.db.insert(me);
  }

  async isFirst() {
    const firstClient = await this.db.findOne({
      descriptionHash: this.descriptionHash,
    }, {
      limit: 1,
    });

    return (firstClient.clientId === this.clientId);
  }

  async leave() {
    return await this.db.deleteMany({
      clientId: this.clientId,
      descriptionHash: this.descriptionHash,
    });
  }
}

module.exports = MongodbDriver;
