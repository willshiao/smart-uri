'use strict';

const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  request: Schema.Types.Mixed,  // Express request object details
  ip: String,  // The source IP of the request
  slug: String,  // The URL slug the request was made for
  info: {  // Information generated from the request
    country: String,  // The country of the request
    isMobile: Boolean,
    isBot: Boolean,
  },
  createdAt: {
    type: Date,
    expires: config.get('request.ttl'),
  },
}, { autoIndex: false, timestamps: true });

// requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
requestSchema.index({ slug: 1 });

module.exports = mongoose.model('Request', requestSchema);
