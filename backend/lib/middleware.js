'use strict';

const config = require('config');
const h = require('./helpers');
const mw = {};

mw.isAuthenticated = (req, res, next) => {
  if(req.user.permissions >= config.get('permissions.user'))
    return next();
  else
    res.fail('Must be authenticated.', res);
};

mw.isAdmin = (req, res, next) => {
  if(req.user && req.user.permissions >= config.get('permissions.admin'))
    return next();
  else
    h.fail('Insufficient permissions', res);
};

mw.enableCrossOrigin = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

module.exports = mw;
