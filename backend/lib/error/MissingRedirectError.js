'use strict';

module.exports = function MissingRedirectError(slug) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.slug = slug;
  this.message = `No redirect found for ${slug}`;
};

require('util').inherits(module.exports, Error);
