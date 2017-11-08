const $AF = require('../');

const $Promise = require('bluebird');

const dbConfig = {
  db: 'af_test',
  host: '127.0.0.1',
  port: 27017
};

const users = ['Anton Danilov', 'Anton Deviun', 'Deviun', 'БезЪумный'];


(async () => {
  console.log('result with AF');
  
  const step1 = await $Promise.all(users.reduce((list, name) => {
    list.push(new $Promise(async (resolve, reject) => {
      const AF = new $AF({
        test: 'action.flow',
        dir: 'test',
        description: {
          flow: true,
          action: {
            manager: null
          }
        }
      }, dbConfig);
  
      await AF.await();
  
      console.log('action execution  %s (in moment %s)', 
                  name, 
                  String(Math.floor((new Date()).getTime() / 1000)).substr(-2)
                );
  
      setTimeout(() => {
        AF.end();
        resolve(name);
      }, 1000);
    }));
  
    return list;
  }, []));

  // console.log({
  //   step1
  // });

  console.log('result without AF');

  const step2 = await $Promise.all(users.reduce((list, name) => {
    list.push(new $Promise(async (resolve, reject) => {
      console.log('action execution %s (in moment %s)', 
                   name, 
                   String(Math.floor((new Date()).getTime() / 1000)).substr(-2)
                 );
  
      setTimeout(() => {
        resolve(name);
      }, 1000);
    }));
  
    return list;
  }, []));

  // console.log({
  //   step2
  // });

})();