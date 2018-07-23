const $Promise = require('bluebird');

const dbConfig = require('../test/mongo-conf');

const $AF = require('../')(dbConfig);

const users = ['Anton Danilov', 'Anton Deviun', 'Deviun', 'БезЪумный'];

(async () => {
  console.log('result with AF');
  
  const step1 = await $Promise.all(users.reduce((list, name) => {
    list.push(new $Promise(async (resolve, reject) => {
      const actionFlow = $AF.create({
        test: 'action.flow',
        dir: 'test',
        description: {
          flow: true,
          action: {
            manager: null
          }
        }
      });
  
      await actionFlow.await();
  
      console.log(
        'action execution  %s (in moment %s)', 
        name, 
        String(Math.floor((new Date()).getTime() / 1000)).substr(-2)
      );
  
      setTimeout(() => {
        actionFlow.end();
        resolve(name);
      }, 1000);
    }));
  
    return list;
  }, []));

  console.log('result without AF');

  const step2 = await $Promise.all(users.reduce((list, name) => {
    list.push(new $Promise(async (resolve, reject) => {
      console.log(
        'action execution %s (in moment %s)', 
        name, 
        String(Math.floor((new Date()).getTime() / 1000)).substr(-2)
      );

      setTimeout(() => {
        resolve(name);
      }, 1000);
    }));
  
    return list;
  }, []));

  process.exit();

})();