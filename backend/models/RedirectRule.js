'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const redirectRuleSchema = new Schema({
  name: String,  // Name of the rule
  info: { type: Schema.Types.Mixed, default: {} },  // Rule to evaluate
  type: { type: String, required: true },  // Statement type
  enabled: { type: Boolean, default: true },  // Whether or not the rule is active
  stats: {
    matches: Number,  // Number of rule matches
    fails: Number,  // Number of rule fails
  },
  target: {
    type: String,  // URL to redirect to if matched
    default: null,
  },
});

module.exports = mongoose.model('RedirectRule', redirectRuleSchema);
