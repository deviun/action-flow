const $AF = require('../');

const $Promise = require('bluebird');

const dbConfig = {
  db: 'af_test',
  host: '127.0.0.1',
  port: 27017
};

const operationA = {
  description: 'example description operationA'
};

const operationB = {
  description: 'example description operationB'
};

const execution = [
  new $Promise( async (resolve, reject) => {
    const AF = $AF.multi([
      operationA,
      operationB
    ], dbConfig);

    await AF.await();

    console.log('start execution for multi operations');

    setTimeout(() => {
      AF.end();

      console.log('finish execution for multi operations');
    }, 1500);
  }),
  new $Promise( async (resolve, reject) => {
    const AF = new $AF(operationA, dbConfig);

    await AF.await();

    console.log('start execution for operation A');
    
    setTimeout(() => {
      AF.end();
      console.log('finish execution for operation A');
    }, 1500);
  }),
  new $Promise( async (resolve, reject) => {
    const AF = new $AF(operationB, dbConfig);

    await AF.await();

    console.log('start execution for operation B');

    setTimeout(() => {
      AF.end();
      
      console.log('finish execution for operation B');
    }, 1500);
  })
];

$Promise.all(execution)
.catch((err) => {
  console.log(err);
});