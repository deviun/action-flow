const thenRedis = require('then-redis');
const DriverCode = require('../../driver-core');

const DRIVER_NAME = 'redis';
const COUNT_REMOVE_ITEMS = 1;

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
    const [first] = await this.redis.lrange(this.descriptionHash, -1, -1);
    
    if (!first) {
      return false;
    }

    const isFirst = first === this.clientId;
    return isFirst;
  }

  leave() {
    return this.redis.lrem(this.descriptionHash, COUNT_REMOVE_ITEMS, this.clientId);
  }
}

module.exports = RedisDriver;
