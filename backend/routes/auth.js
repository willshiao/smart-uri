'use strict';

const bodyParser = require('body-parser');
const router = require('express').Router();
const config = require('config');
const validator = require('validator');

const logger = require('../lib/logger').loggers.get('api');
const AuthError = require('../lib/error/AuthError');
const jwtCheck = require('../lib/jwtCheck');
const User = require('../models/User');

router.use(bodyParser.json());

router.post('/login', (req, res) => {
  if(!req.body) return res.failMsg('Invalid information');
  if(!req.body.email || !req.body.password) return res.failMsg('Email and password required.');

  let dbUser;
  User.findOne({ email: req.body.email })
    .lean()
    .exec()
    .then((user) => {
      if(!user) throw new AuthError('Invalid email or password');
      dbUser = user;
      return User.checkPasswords(req.body.password, user.password);
    })
    .then((valid) => {
      if(!valid) throw new AuthError('Invalid email or password');
      return jwtCheck.sign(dbUser);
    })
    .then((jwt) => {
      return res.successJson({ jwt });
    })
    .catch(AuthError, (authError) => {
      res.failMsg(authError.message);
    })
    .catch((error) => {
      logger.error('Login error:', error);
      res.errorMsg('An error occurred.');
    });
});

router.post('/register', (req, res) => {
  if(!req.body) return res.failMsg('Invalid information');
  if(!req.body.email || !req.body.password) return res.failMsg('Email and password are required.');
  if(!validator.isEmail(req.body.email)) return res.failMsg('Invalid email address.');
  if(req.body.password.length < config.get('user.password.minLength')) return res.failMsg('Password is too short.');
  if(req.body.password.length > config.get('user.password.maxLength')) return res.failMsg('Password is too long.');

  const user = new User({
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  });

  // Check if user exists, but even in the case of a race condition,
  //  MongoDB's unique index check should handle it
  User.count({ email: user.email })
    .then(count => {
      if(count > 0) throw new AuthError('User already exists.');
      return user.save();
    })
    .then((savedUser) => {
      logger.debug('New user: ', savedUser.email);
      return jwtCheck.sign(savedUser);
    })
    .then(jwt => res.successJson({ jwt }))
    .catch(AuthError, err => {
      return res.failMsg('User already exists.');
    })
    .catch((err) => {
      res.errorMsg('An error occurred.');
      console.log(err.message);
      logger.error('Registration error:', err);
    });
});

module.exports = router;
