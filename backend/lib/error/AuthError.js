'use strict';

module.exports = function AuthError(msg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = msg;
};

require('util').inherits(module.exports, Error);
