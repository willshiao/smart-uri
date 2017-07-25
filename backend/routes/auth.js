'use strict';

const bodyParser = require('body-parser');
const router = require('express').Router();
const config = require('config');
const validator = require('validator');

const logger = require('../lib/logger').loggers.get('api');
const User = require('../models/User');

router.use(bodyParser.json());

router.post('/login', (req, res) => {
  if(!req.body) return res.failMsg('Invalid information');
  if(!req.body.email || !req.body.password) return res.failMsg('Email and password required.');

  User.findOne({ email: req.body.email })
    .lean()
    .exec()
    .then((user) => {
      if(!user) return res.failMsg('Invalid email or password');
      return User.checkPasswords(req.body.password, user.password);
    })
    .then((valid) => {
      if(!valid) return res.failMsg('Invalid email or password');
      return res.successJson();  // TODO: return JWT
    })
    .catch((error) => {
      logger.error('Login error:', error);
      res.errorJson({ error });
    });
});

router.post('/register', (req, res) => {
  if(!req.body) return res.failMsg('Invalid information');
  if(!req.body.email || !req.body.password) return res.failMsg('Email and password are required.');
  if(!validator.isEmail(req.body.email)) return res.failMsg('Invalid email address.');
  if(req.body.password < config.get('user.password.minLength')) return res.failMsg('Password is too short.');
  if(req.body.password > config.get('user.password.maxLength')) return res.failMsg('Password is too long.');

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
    .then(() => {
      logger.debug('New user: ', user.email);
      res.successJson();  // TODO: return JWT
    });
});

module.exports = router;
