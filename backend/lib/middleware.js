'use strict';

const config = require('config');

const mw = {};

mw.isAuthenticated = (req, res, next) => {
  if(req.user.role >= config.get('user.roles.User')) return next();
  res.fail('Must be authenticated.');
};

mw.isAdmin = (req, res, next) => {
  if(req.user && req.user.role >= config.get('user.user.Admin')) return next();
  res.fail('Insufficient permissions');
};

mw.enableCrossOrigin = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

module.exports = mw;
