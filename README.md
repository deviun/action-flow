[![just-mongo](https://img.shields.io/npm/v/action-flow.svg?style=flat-square)](https://www.npmjs.com/package/action-flow/)

# Action flow 2.1

Action flows manager.

## Why?

Sometimes need to execute operations for only one client at a time. Examples: update operation of important data, check the authorization status.

## How it works?

**1) Connect and configure the action-flow**

```javascript
const AF = require('action-flow')(options);
```

**2) Describe the operation. Any objects are accept for describing.**

```javascript
const someActionFlow = AF.create({
  description: 'update rating',
  meta: {
    propertyDescrition: 'meow'
  }
});
```

You can create a single thread for multiple threads.

```javascript
const someActionFlow = AF.multi([
  {one: 1}, {two: 2}
]);
```

This way, only one client can executing these two operations at a time.

The thread of two operations will not start until these two threads of these operations are free. The expectation of a stream occurs sequentially to avoid deadlocks.

**3) Set the waiting for the operation.**

```javascript
await someActionFlow.await();
```

**4) Executing your code.**

```javascript
// code your operation
```

**5) Set the ending for the operation.**

```javascript
await someActionFlow.end();
```

## Drivers & Custom drivers

At now the action-flow have 2 drivers. To use specific driver, use **driverName** option.

- mongodb (default)
- process

```javascript
const AF = require('action-flow')({
  driverName: 'process'
});
```

### About each of drivers

**mongodb**

MongoDB storage. 

**Options (optional)**: user, password, host, port.

```javascript
const AF = require('action-flow')({
  host: 'somehost'
});
```

------

**proccess**

Storage in Node.js process memory. No specific options.

-----

To connect custom driver, use **driverClass** option.

```javascript
const AF = require('action-flow')({
  driverName: 'custom',
  driverClass: someClass
});
```

## More options


| Name 	| Description 	| Required 	| Default 	|
|-----------------	|----------------------	|:--------:	|:-------:	|
| awaitTimeoutSec 	| Maximum waiting time 	| false 	| 30 	|

// TODO: Add links to docs about create custom drivers