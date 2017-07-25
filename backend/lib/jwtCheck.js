'use strict';

const Promise = require('bluebird');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const config = require('config');

const verifyAsync = Promise.promisify(jwt.verify);
const signAsync = Promise.promisify(jwt.sign);


const JwtCheck = {
  express: expressJwt({ secret: config.get('jwt.secret') }),
  verify(token, cb) {
    return verifyAsync(token, config.get('jwt.secret')).asCallback(cb);
  },
  sign(user, cb) {
    return signAsync({
      _id: user._id,
      email: user.email,
      permissions: user.permissions,
    }, config.get('jwt.secret'), { expiresIn: config.get('jwt.expiresIn') })
      .asCallback(cb);
  },
};

module.exports = JwtCheck;
