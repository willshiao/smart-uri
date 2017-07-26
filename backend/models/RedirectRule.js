'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const redirectRuleSchema = new Schema({
  name: String,  // Name of the rule
  condition: { type: Schema.Types.Mixed, default: {} },  // JSON logic rule or special string
  isLogicRule: { type: Boolean, required: true },  // Whether or not condition is a JSON logic rule
  enabled: { type: Boolean, default: true },  // Whether or not the rule is active
  stats: {
    matches: Number,  // Number of rule matches
    fails: Number,  // Number of rule fails
  },
  target: String,  // URL to redirect to if matched
});

module.exports = mongoose.model('RedirectRule', redirectRuleSchema);
