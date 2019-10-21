[![just-mongo](https://img.shields.io/npm/v/action-flow.svg?style=flat-square)](https://www.npmjs.com/package/action-flow/)

# Action flow 2.2

Smart mutex manager.

## Example

You can pause the user's requests until the user's previous request is executed.

## How it works?

**1) Connect and configure the `action-flow`**

```javascript
// commonJS
const AF = require('action-flow')(options);
// es modules
import * as AF from 'action-flow';
```

**2) Describe the operation. Any objects will accepted to describing.**

```javascript
const userRequestFlow = AF.create({
  description: 'user-request',
  userId,
});
```

Or you can create a common thread for any threads.

```javascript
const anyFlow = AF.multi([
  {one: 1}, {two: 2},
]);
```

This way, only one client can executing these two operations at a time.

The thread of two operations will not start until these two threads of these operations are free. The expectation of a stream occurs sequentially to avoid deadlocks.

**3) Set the waiting the operation.**

```javascript
await userRequestFlow.await();
```

**4) Do your code.**

```javascript
// execute user request code
```

**5) Set the ending the operation.**

```javascript
await userRequestFlow.end();
```

## Drivers & Custom drivers

At now the action-flow have 3 drivers. To use specific driver, use **driverName** option.

- redis (default)
- process
- mongodb (just-mongo library is dev dependency, install that to use) 

### About each of drivers

**redis**

Queue storage in Redis lists.

**Options (optional)**: host, port, password.

```javascript
const AF = require('action-flow')({
  host: 'localhost',
  password: 'yourPwd',
});
```

-----

**process**

Storage in Node.js process memory. No specific options.

```javascript
const AF = require('action-flow')({
  driverName: 'process',
});
```

-----

**mongodb**

MongoDB storage. 

**Options (optional)**: user, password, host, port.

```javascript
const AF = require('action-flow')({
  host: 'localhost',
});
```

------

Use **driverClass** option to connect custom driver.

```javascript
const AF = require('action-flow')({
  driverName: 'custom',
  driverClass: someClass,
});
```

## More options

| Name 	| Description 	| Required 	| Default 	|
|-----------------	|----------------------	|:--------:	|:-------:	|
| awaitTimeoutSec 	| Maximum waiting time 	| false 	| 60 	|
| sessionName 	| Prefix for all descriptions	| false 	| null 	|
| noSHA | Turn off sha256 for description	| false 	| false |

### Other docs:

- [How create custom driver.](https://github.com/deviun/action-flow/tree/master/docs/create-custom-driver.md)
