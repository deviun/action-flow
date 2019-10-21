const test = require('ava');
const conf = require('./mongo-conf');

const sessionName = new Date().getTime();

const AF_MONGO = require('../').default({
  ...conf,
  sessionName,
  driverName: 'mongodb',
  noSHA: true,
});
const AF_PROCESS = require('../').default({
  driverName: 'process',
  awaitTimeoutSec: 900,
});

const AF_REDIS = require('../').default({
  driverName: 'redis',
  sessionName: `afredis.${sessionName}`,
  noSHA: true,
});

const someCustomClass = require('../src/drivers/mongodb');

const AF_CUSTOM = require('../').default({
  driverName: 'custom',
  driverClass: someCustomClass,
  sessionName,
  noSHA: true,
});

async function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function actionFlow (afProducer, t) {
  const steps = 5;
  const executeProducers = [];
  const timeline = [];
  
  t.plan(steps - 1);

  for (let i = 0; i < steps; ++i) {
    executeProducers.push(async function () {
      const af = afProducer();
      await af.await();
      await sleep(200);
      timeline.push((new Date()).getTime());
      await af.end();
    });
  }

  await Promise.all(executeProducers.map((fn) => fn()));

  let prevTime;
  timeline.forEach(((time) => {
    if (!prevTime) {
      prevTime = time;
      return;
    }

    const diff = time - prevTime;

    t.true(diff >= 200);
  }));
}

const FLOWS = [
  {
    test: 1
  }, {
    test: 2
  }, {
    test: 3
  }, {
    test: 4
  }
];

// tests

test('(mongodb) one action flow', async (t) => {
  const af = () => AF_MONGO.create(FLOWS[0]);

  await actionFlow(af, t);
});

test('(mongodb) multi action flow (all blocks)', async (t) => {
  const af = () => AF_MONGO.multi(FLOWS);

  await actionFlow(af, t);
});

test('(mongodb) multi action flow (last 2 blocks)', async (t) => {
  const af = () => AF_MONGO.multi([
    FLOWS[2], FLOWS[3]
  ]);

  await actionFlow(af, t);
});

test('(mongodb) multi action flow (first 2 blocks)', async (t) => {
  const af = () => AF_MONGO.multi([
    FLOWS[0], FLOWS[1]
  ]);

  await actionFlow(af, t);
});

test('(mongodb) multi action flow (last 3 blocks)', async (t) => {
  const af = () => AF_MONGO.multi([
   FLOWS[1],
   FLOWS[2],
   FLOWS[3]
  ]);

  await actionFlow(af, t);
});

test('(process) one action flow', async (t) => {
  const af = () => AF_PROCESS.create(FLOWS[0]);

  await actionFlow(af, t);
});

test('(process) multi action flow', async (t) => {
  const af = () => AF_PROCESS.multi(FLOWS);

  await actionFlow(af, t);
});

test('(custom) multi action flow', async (t) => {
  const af = () => AF_CUSTOM.multi(FLOWS);

  await actionFlow(af, t);
});

test('(redis) one action flow', async (t) => {
  const af = () => AF_REDIS.create(FLOWS[0]);

  await actionFlow(af, t);
});

test('(redis) multi action flow', async (t) => {
  const af = () => AF_REDIS.multi(FLOWS);

  await actionFlow(af, t);
});
