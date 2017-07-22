'use strict';

const router = require('express').Router();
const redirectHandler = require('../lib/redirectHandler');

router.get('/test', (req, res) => res.successJson());

router.get('/u/:slug', redirectHandler.handleRedirect);

module.exports = router;
