## How create custom driver?

1) Require driver-core.

```javascript
const driverCore = require('action-flow/src/driver-core');
```

2) Create class based on **driverCore**.

```javascript
class CustomDriver extends driverCore {
  constructor(options) {
    super({
      driver: DRIVER_NAME,
    });
  }
}
```
Options has info about operation and global options.

- **clientId** - unique client id (uuid).
- **descriptionHash** - description hash of the operation.

Save the parameters to `this`, to get in the following methods.

Also, you can get another options that were passed when initialize action-flow.

```javascript
const AF = require('action-flow')({
  yourOption: true,
});
```

3) Create 3 required methods for storage info about queue of clients.

| Name 	| Description 	|
|---------	|-------------------------------------------------------------------------------	|
| join 	| Method to join the client to queue of operation. 	|
| isFirst 	| Method to check first position of the client in queue. Return boolean value.  	|
| leave 	| Method to remove the client from queue. 	|

See our [drivers](https://github.com/deviun/action-flow/tree/master/src/drivers) for examples.
