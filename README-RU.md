[![just-mongo](https://img.shields.io/npm/v/action-flow.svg?style=flat-square)](https://www.npmjs.com/package/action-flow/)

# Action flow

Менеджер для потоков операций.

## Зачем?

Допустим у нас в приложении есть операции, которые должны выполняться одновременно только для одного инициатора. Это может быть не только доступ к базе, но и полноценная большая операция. Action flow может помочь решить эту задачу. 

## Как работает?

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

> Action Flow использует `MongoDB`. Пока-что необходимо указывать данные подключения к базе при каждом использовании, в будущих версиях это будет улучшено.

[Подробный пример](https://github.com/deviun/action-flow/blob/master/test/action.flow.js)

[Подробный пример с multi](https://github.com/deviun/action-flow/blob/master/test/action.flow.multi.js)