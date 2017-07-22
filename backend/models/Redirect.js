'use strict';

const mongoose = require('mongoose');
const redirectRuleSchema = require('./RedirectRule').schema;

const Schema = mongoose.Schema;

const redirectSchema = new Schema({
  slug: String,
  rules: [redirectRuleSchema],
  enabled: { type: Boolean, default: true },  // Whether or not the redirect is enabled
  // Whether or not to collect extra request information
  extraInfo: { type: Boolean, default: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  stats: {
    visits: { type: Number, default: 0 },
  },
  defaultTarget: String,  // Target to redirect to if all rules fail
});

redirectSchema.index({ owner: 1 });
redirectSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Redirect', redirectSchema);
