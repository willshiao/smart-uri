'use strict';

const config = require('config');
const Promise = require('bluebird');

const mw = {};

mw.isAuthenticated = (req, res, next) => {
  if(req.user && req.user.role >= config.get('user.roles.User')) return next();
  res.failMsg('Must be authenticated.');
};

mw.isAdmin = (req, res, next) => {
  if(req.user && req.user.role >= config.get('user.roles.Admin')) return next();
  res.failMsg('Insufficient permissions');
};

mw.asyncHelper = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

module.exports = mw;
