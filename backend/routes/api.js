'use strict';

const router = require('express').Router();
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

const redirectHandler = require('../lib/redirectHandler');
const middleware = require('../lib/middleware');
const jwtCheck = require('../lib/jwtCheck');

router.use(bodyParser.json());
router.use(cors());
router.use(jwtCheck.express);
router.use(middleware.isAuthenticated);

router.route('/redirects')
  .post(redirectHandler.handleNew)
  .get(redirectHandler.handleGet);

router.route('/redirects/:id')
  .put(redirectHandler.handleUpdate)
  .delete(redirectHandler.handleDelete);

router.route('/requests')
  .get(middleware.isAdmin, compression(), redirectHandler.handleGetRequests);

module.exports = router;
