'use strict';

const logger = require('./logger').loggers.get('api');

const handlers = {};

handlers.JwtErrorHandler = (err, req, res, next) => {
  if(err.name !== 'UnauthorizedError' &&
    err.name !== 'JsonWebTokenError') return next(err);
  logger.warn('Invalid JSON token used.');
  res.status(403);
  return res.failMsg('Invalid token');
};

handlers.ErrorHandler = (err, req, res, next) => {
  if(err instanceof SyntaxError) return res.failMsg('Invalid JSON.');
  logger.warn('Got error name: ', err);
  return res.errorMsg('An error occurred.');
};


module.exports = handlers;
