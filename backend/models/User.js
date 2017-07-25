'use strict';

const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcrypt-as-promised');
const Promise = require('bluebird');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: { type: String, required: true },  // Password hash
  permissions: { type: Number, default: config.get('user.roles.User') },
});


userSchema.pre('save', function preSaveUser(next) {
  if(!this.isModified('password')) return next();

  bcrypt.genSalt(config.get('db.bcryptSaltWorkFactor'))
    .then(salt => bcrypt.hash(this.password, salt))
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
});

userSchema.statics.checkPasswords = function checkPass(pass, storedPass) {
  return bcrypt.compare(pass, storedPass)
    .catch(err => Promise.resolve(false));
};

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
    .catch(err => Promise.resolve(false));
};

module.exports = mongoose.model('User', userSchema);

