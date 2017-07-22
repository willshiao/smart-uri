'use strict';

const mongoose = require('mongoose');
const redirectRuleSchema = require('./RedirectRule').schema;

const Schema = mongoose.Schema;

const redirectSchema = new Schema({
  slug: String,
  rules: [redirectRuleSchema],
  visits: Number,
  enabled: Boolean,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

redirectSchema.index({ owner: 1 });
redirectSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Redirect', redirectSchema);
