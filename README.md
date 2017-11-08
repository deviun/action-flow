# Action flow

Flow activity manager.
Менеджер для потоков операций.

## Why? / Зачем?

Suppose we have in the application there are operations that must be performed simultaneously for only one initiator. This can be not only access to the database, but also a full-fledged big operation. Action flow can help solve this problem.

Допустим у нас в приложении есть операции, которые должны выполняться одновременно только для одного инициатора. Это может быть не только доступ к базе, но и полноценная большая операция. Action flow может помочь решить эту задачу. 

## How does it work / Как работает?

Everything is very simple. You describe the operation that you want to limit, wait for permission to execute it, do your thing, quit the queue for this operation.

Все очень просто. Вы описываете операцию, которую хотите ограничить, ожидаете разрешения на её выполнение, делаете свое дело, выходите из очереди для этой операции.

```javascript
const $AF = require('action-flow');

const AF = new $AF({
  description: 'update rating',
  meta: {
    propertyDescrition: 'meow'
  }
}, { // mongoDB connection
  db, user, password, host, port
});

await AF.await();

// code you operation

AF.end();
```
> Action Flow uses `MongoDB`. So far it is necessary to specify the connection data to the database every time it is used, in future versions it will be improved.

> Action Flow использует `MongoDB`. Пока-что необходимо указывать данные подключения к базе при каждом использовании, в будущих версиях это будет улучшено.

[Detailed example / Подробный пример](https://github.com/deviun/action-flow/blob/master/test/action.flow.js)

[Detailed example with multi / Подробный пример с multi](https://github.com/deviun/action-flow/blob/master/test/action.flow.multi.js)