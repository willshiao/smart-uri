'use strict';

const router = require('express').Router();
const bodyParser = require('body-parser');

const redirectHandler = require('../lib/redirectHandler');
const middleware = require('../lib/middleware');
const jwtCheck = require('../lib/jwtCheck');

router.use(bodyParser.json());
router.use(jwtCheck.express);
router.use(middleware.isAuthenticated);

router.post('/redirect', redirectHandler.handleNew);

router.put('/redirect/:id', redirectHandler.handleUpdate);

module.exports = router;
