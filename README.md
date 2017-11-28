[![just-mongo](https://img.shields.io/npm/v/action-flow.svg?style=flat-square)](https://www.npmjs.com/package/action-flow/)

# Action flow

Flow activity manager.

## Why?

Suppose we have in the application there are operations that must be performed simultaneously for only one initiator. This can be not only access to the database, but also a full-fledged big operation. Action flow can help solve this problem.

## How does it work

Everything is very simple. You describe the operation that you want to limit, wait for permission to execute it, do your thing, quit the queue for this operation.

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

[Detailed example](https://github.com/deviun/action-flow/blob/master/test/action.flow.js)

[Detailed example with multi](https://github.com/deviun/action-flow/blob/master/test/action.flow.multi.js)