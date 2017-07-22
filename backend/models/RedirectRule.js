'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const redirectRuleSchema = new Schema({
  name: String,  // Name of the rule
  condition: Schema.Types.Mixed,  // JSON logic rule or special string
  isLogicRule: Boolean,  // Whether or not condition is a JSON logic rule
  enabled: Boolean,  // Whether or not the rule is active
  stats: {
    matches: Number,  // Number of rule matches
    fails: Number,  // Number of rule fails
  },
});

module.exports = mongoose.model('RedirectRule', redirectRuleSchema);
