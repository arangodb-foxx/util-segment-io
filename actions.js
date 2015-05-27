/*global require, module */
var _ = require('underscore');
var joi = require('joi');

var commonSchemas = {
  userId: joi.string().required(),
  context: joi.object().optional(),
  traits: joi.object().optional(),
  integrations: joi.object().pattern(/.*/, joi.boolean().strict()).optional(),
  timestamp: joi.date().optional(),
  properties: joi.object().optional()
};

var actions = {
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
  batch: joi.array().items(_.map(actions, function (schema, action) {
    var actionSchema = joi.any().allow(action);
    if (action === 'track') {
      actionSchema = actionSchema.optional();
    } else {
      actionSchema = actionSchema.required();
    }
    return schema.keys({action: actionSchema});
  })).required()
});

module.exports = actions;