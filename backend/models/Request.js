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
    model: String,
    deviceType: String,
  },
  createdAt: {
    type: Date,
    expires: config.get('request.ttl'),
    default: new Date(),
  },
  visit: Number,  // The visit number of the redirect
  result: String,  // The url that the user got redirected to
}, { timestamps: true });

// requestSchema.index({ createdAt: 1 }, { expireAfterSeconds: config.get('request.ttl') });
requestSchema.index({ slug: 1 });

module.exports = mongoose.model('Request', requestSchema);
