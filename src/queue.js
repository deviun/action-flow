const {afModelsGetProp} = require('./models');

const DB_QUEUE = afModelsGetProp('queue');

const Time = {
  getSec () {
    return (new Date()).getTime() / 1000;
  },
  getMsec () {
    return (new Date()).getTime();
  }
};

class Queue {
  constructor (options) {
    Object.assign(this, options);

    this.queue = this.db.collection(DB_QUEUE);
  }

  async join () {
    await this.leave();

    const me = {
      clientId: this.clientId,
      descriptionHash: this.descriptionHash,
      setTime: Time.getMsec()
    };

    return await this.queue.insert(me);
  }

  async isFirst () {
    const firstClient = await this.queue.findOne({
      descriptionHash: this.descriptionHash
    });

    return ( firstClient.clientId === this.clientId );
  }

  async leave () {
    return await this.queue.deleteMany({
      clientId: this.clientId,
      descriptionHash: this.descriptionHash
    });
  }
}

module.exports = Queue;