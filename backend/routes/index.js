'use strict';

const router = require('express').Router();
const config = require('config')
const redirectHandler = require('../lib/redirectHandler');
const jwtCheck = require('../lib/jwtCheck');

router.get('/test', (req, res) => res.successJson());
router.get('/userInfo', jwtCheck.express, (req, res) => {
  res.successJson(req.user);
});
router.get('/', (req, res) => {
  res.redirect(config.get('redirect.defaultRedirect'))
});

router.get('/:slug', redirectHandler.handleRedirect);

module.exports = router;
