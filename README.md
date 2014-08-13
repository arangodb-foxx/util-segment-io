# The Segment.io Tracking App

The Segment.io tracking app provides `Foxx.queues` job types for tracking user behaviour with [Segment.io](https://segment.io/).

*Examples*

```js
var Foxx = require('org/arangodb/foxx')
    queue = Foxx.queues.create('my-queue', 1);

queue.push('segment-io.track', {
  "userId": "019mr8mf4r",
  "event": "Purchased Item",
  "properties": {
    "name": "Leap to Conclusions Mat",
    "revenue": 14.99
  },
  "context": {
    "ip": "24.5.68.47"
  },
  "timestamp": new Date(2012, 11, 2, 0, 30, 12, 984)
});

// or if you prefer not to hardcode the job type:

queue.push(Foxx.requireApp('/segment-io-mountpoint').types.track, {
    // ...
});
```

## Configuration

This app has the following configuration options:

* *apiKey*: Your Segment.io write key.
* *jobTypePrefix* (optional): The prefix for the names under which the app's job types will be available (should end with a dot). Default: *segment-io.*.
* *maxFailures* (optional): The maximum number of times each job will be retried if it fails. Default: *0* (don't retry).

## Job Data

For full documentation of all job types and job data options supported by Segment.io [the official Segment.io API documentation](https://segment.io/docs/tracking-api/reference/).
