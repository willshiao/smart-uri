'use strict';

const router = require('express').Router();

router.get('/test', (req, res) => res.successJson());

module.exports = router;
