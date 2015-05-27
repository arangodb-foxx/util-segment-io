# The Segment.io Tracking App

The Segment.io tracking app provides `Foxx.queues` job types for tracking user behaviour with [Segment.io](https://segment.io/).

**Note:** Version 2.0.0 and higher require ArangoDB 2.6 or later to work correctly.

*Examples*

First add this app to your dependencies:

```js
{
  ...
  "dependencies": {
    "segment": "segment-io:^2.0.0"
  }
  ...
}
```

Once you've configured both apps correctly, you can use it like this:

```js
var Foxx = require('org/arangodb/foxx');
var queue = Foxx.queues.get('default');

queue.push(applicationContext.dependencies.segment, ['track', {
  "userId": "019mr8mf4r",
  "event": "Purchased Item",
  "properties": {
    "name": "Jump to Conclusions Mat",
    "revenue": 14.99
  },
  "context": {
    "ip": "24.5.68.47"
  },
  "timestamp": new Date(2012, 11, 2, 0, 30, 12, 984)
}]);
```

## Configuration

This app has the following configuration options:

* *apiKey*: Your Segment.io write key.
* *maxFailures* (optional): The maximum number of times each job will be retried if it fails. Default: *0* (don't retry).

## Job Data

For full documentation of all job types and job data options supported by Segment.io [the official Segment.io API documentation](https://segment.io/docs/tracking-api/reference/).

## License

This code is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0) by ArangoDB GmbH.
