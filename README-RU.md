[![just-mongo](https://img.shields.io/npm/v/action-flow.svg?style=flat-square)](https://www.npmjs.com/package/action-flow/)

# Action flow

Менеджер для потоков операций.

## Зачем?

Допустим у нас в приложении есть операции, которые должны выполняться одновременно только для одного инициатора. Это может быть не только доступ к базе, но и полноценная большая операция. Action flow может помочь решить эту задачу. 

## Как работает?

Все очень просто. Вы описываете операцию, которую хотите ограничить, ожидаете разрешения на её выполнение, делаете свое дело, выходите из очереди для этой операции.

```javascript
const $AF = require('action-flow')({ // mongoDB connection
  db, user, password, host, port
});

const actionFlow = $AF.create({
  description: 'update rating',
  meta: {
    propertyDescrition: 'meow'
  }
});

await actionFlow.await();

// code you operation

await actionFlow.end();
```

[Подробный пример](https://github.com/deviun/action-flow/blob/master/test/action.flow.js)

[Подробный пример с multi](https://github.com/deviun/action-flow/blob/master/test/action.flow.multi.js)