/*global require, module, applicationContext */
'use strict';

var _ = require('underscore');
var internal = require('internal');
var request = require('org/arangodb/request');
var util = require('util');

var args = require('./exports').schema.validate(_.extend({}, applicationContext.argv));
if (args.error) {
  throw args.error;
}

var action = args.value[0];
var data = args.value[1];

var response = request.post('https://api.segment.io/v1/' + action, {
  body: data,
  json: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': 'Basic ' + internal.base64Encode(applicationContext.configuration.apiKey + ':')
  }
});

if (response.body) {
  if (response.body.error) {
    throw new Error(util.format(
      'Server returned error code %s with message: %s',
      response.body.error.type + (response.body.error.param ? ' at param ' + response.body.error.param : ''),
      response.body.error.message
    ));
  }
} else if (Math.floor(response.statusCode / 100) !== 2) {
  throw new Error('Server sent an empty response with status ' + response.statusCode);
}

module.exports = response.body;
