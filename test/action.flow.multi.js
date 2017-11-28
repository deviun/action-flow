const $Promise = require('bluebird');

const sleep = (ms) => new $Promise((resolve) => setTimeout(resolve, ms));

const dbConfig = {
  db: 'af_test',
  host: '127.0.0.1',
  port: 27017
};

const $AF = require('../')(dbConfig);

const operationA = {
  description: 'example description operationA'
};

const operationB = {
  description: 'example description operationB'
};

const execution = [
  async () => {
    const actionFlow = $AF.multi([
      operationA,
      operationB
    ]);
  
    await actionFlow.await();
  
    console.log('start execution for multi operations');

    await sleep(1500);
    await actionFlow.end();
  
    console.log('finish execution for multi operations');
  },
  async () => {
    const actionFlow = $AF.create(operationA);
  
    await actionFlow.await();
  
    console.log('start execution for operation A');

    await sleep(1500);
    await actionFlow.end();
    
    console.log('finish execution for operation A');
  },
  async () => {
    const actionFlow = $AF.create(operationB);
  
    await actionFlow.await();
  
    console.log('start execution for operation B');

    await sleep(1500);
    await actionFlow.end();
    
    console.log('finish execution for operation B');
  },
];

$Promise.all(execution.map((item) => item()))
.then(() => {
  process.exit();
})
.catch((err) => {
  console.log(err);
  process.exit();
});