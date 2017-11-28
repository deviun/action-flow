[![just-mongo](https://img.shields.io/npm/v/action-flow.svg?style=flat-square)](https://www.npmjs.com/package/action-flow/)

# Action flow

Flow activity manager.

## Why?

Suppose we have in the application there are operations that must be performed simultaneously for only one initiator. This can be not only access to the database, but also a full-fledged big operation. Action flow can help solve this problem.

## How does it work

Everything is very simple. You describe the operation that you want to limit, wait for permission to execute it, do your thing, quit the queue for this operation.

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

[Detailed example](https://github.com/deviun/action-flow/blob/master/test/action.flow.js)

[Detailed example with multi](https://github.com/deviun/action-flow/blob/master/test/action.flow.multi.js)