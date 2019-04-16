const thenRedis = require('then-redis');
const last = require('lodash/last');
const DriverCode = require('../../driver-core');

const DRIVER_NAME = 'redis';
const COUNT_REMOVE_ITEMS = 1;
const RANGE_BORDER = 50; // -50... len ...+50

let redisClient;

function getRedis({
  host, port, password,
}) {
  if (redisClient) {
    return redisClient;
  }

  redisClient = thenRedis.createClient({
    host, port, password,
  });

  return redisClient;
}

class RedisDriver extends DriverCode {
  constructor({
    clientId,
    descriptionHash,
    host,
    port,
    password,
  }) {
    super({
      driver: DRIVER_NAME,
    });

    this.clientId = clientId;
    this.descriptionHash = descriptionHash;
    this.redis = getRedis({
      host, port, password,
    });
  }

  async join() {
    await this.leave();
    return this.redis.lpush(this.descriptionHash, this.clientId);
  }

  async isFirst() {
    const len = await this.redis.llen(this.descriptionHash);

    if (len === 0) {
      return false;
    }

    const range = await this.redis.lrange(this.descriptionHash, len - RANGE_BORDER, len + RANGE_BORDER);
    
    if (!range.length) {
      return false;
    }

    const firstAtList = last(range);
    const isFirst = firstAtList === this.clientId;
    return isFirst;
  }

  leave() {
    return this.redis.lrem(this.descriptionHash, COUNT_REMOVE_ITEMS, this.clientId);
  }
}

module.exports = RedisDriver;
