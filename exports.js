/*global require, module, applicationContext */
'use strict';

var _ = require('underscore');
var joi = require('joi');
var actions = require('./actions');

module.exports = {
  mount: applicationContext.mount,
  name: 'segment',
  maxFailures: applicationContext.configuration.maxFailures,
  schema: joi.object().keys({
    0: _.reduce(actions, function (schema, actionSchema, actionName) {
      return schema.valid(actionName);
    }, joi.required()),
    1: _.reduce(actions, function (schema, actionSchema, actionName) {
      return schema.when('0', {is: actionName, then: actionSchema});
    }, joi.alternatives().required())
  }).unknown(true).required().meta({isTuple: true})
};
