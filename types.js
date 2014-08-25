/*jshint indent: 2, nomen: true, maxlen: 120 */
/*global require, exports, applicationContext */
var queues = require('org/arangodb/foxx').queues,
  internal = require('internal'),
  _ = require('underscore'),
  joi = require('joi'),
  commonSchemas, actions;

commonSchemas = {
  userId: joi.string().required(),
  context: joi.object().optional(),
  traits: joi.object().optional(),
  integrations: joi.object().pattern(/.*/, joi.boolean().strict()).optional(),
  timestamp: joi.date().optional(),
  properties: joi.object().optional()
};

actions = {
  identify: joi.object().keys({
    userId: commonSchemas.userId,
    timestamp: commonSchemas.timestamp,
    context: commonSchemas.context,
    traits: commonSchemas.traits,
    integrations: commonSchemas.integrations
  }).required(),
  group: joi.object().keys({
    userId: commonSchemas.userId,
    timestamp: commonSchemas.timestamp,
    context: commonSchemas.context,
    traits: commonSchemas.traits,
    integrations: commonSchemas.integrations,
    groupId: joi.string().required()
  }).required(),
  track: joi.object().keys({
    userId: commonSchemas.userId,
    timestamp: commonSchemas.timestamp,
    context: commonSchemas.context,
    properties: commonSchemas.properties,
    event: joi.string().required()
  }).required(),
  page: joi.object().keys({
    userId: commonSchemas.userId,
    timestamp: commonSchemas.timestamp,
    context: commonSchemas.context,
    properties: commonSchemas.properties,
    name: joi.string().optional(),
    category: joi.string().optional()
  }).required()
};

actions.screen = actions.page;
actions.import = joi.object().keys({
  context: commonSchemas.context,
  batch: joi.array().includes(_.map(actions, function (schema, action) {
    var actionSchema = joi.any().allow(action);
    if (action === 'track') {
      actionSchema = actionSchema.optional();
    } else {
      actionSchema = actionSchema.required();
    }
    return schema.keys({action: actionSchema});
  })).required()
});

_.each(actions, function (schema, action) {
  'use strict';
  queues.registerJobType(applicationContext.configuration.jobTypePrefix + action, {
    maxFailures: applicationContext.configuration.maxFailures,
    schema: schema,
    execute: function (data) {
      var response, body;
      response = internal.download(
        'https://api.segment.io/v1/' + action,
        JSON.stringify(data),
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': 'Basic ' + internal.base64Encode(applicationContext.configuration.apiKey + ':')
          }
        }
      );
      if (response.body) {
        body = JSON.parse(response.body);
        if (body.error) {
          throw new Error(
            'Server returned error code ' +
            body.error.type +
            (body.error.param ? ' at param ' + body.error.param : '') +
            ' with message: ' +
            body.error.message
          );
        }
        return body;
      } else if (Math.floor(response.code / 100) !== 2) {
        throw new Error('Server sent an empty response with status ' + response.code);
      }
    }
  });
  Object.defineProperty(exports, action, {
    get: function () {
      return applicationContext.configuration.jobTypePrefix + action;
    },
    configurable: false,
    enumerable: true
  });
});