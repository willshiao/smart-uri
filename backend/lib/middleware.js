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

mw.enableCrossOrigin = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.get('site.corsAllow'));
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

mw.asyncHelper = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

module.exports = mw;
