'use strict';

const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,  // Password hash
  permissions: { type: Number, default: config.get('users.roles.User') },
});

module.exports = mongoose.model('User', userSchema);
