'use strict';

const router = require('express').Router();
const redirectHandler = require('../lib/redirectHandler');
const jwtCheck = require('../lib/jwtCheck');

router.get('/test', (req, res) => res.successJson());
router.get('/userInfo', jwtCheck.express, (req, res) => {
  res.successJson(req.user);
});

router.get('/u/:slug', redirectHandler.handleRedirect);

module.exports = router;
