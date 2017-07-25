'use strict';

const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const indexRoute = require('./routes/index');
const logger = require('./lib/logger').loggers.get('api');


//-------------------
// Initialization
//-------------------

const app = express();
require('./lib/extendExpress').extendResponse(express.response);

app.use(indexRoute);

if(config.get('jwt.key') === 'changeme') {
  logger.warn('Default JWT key is set - change it before you use this app in production.');
}

mongoose.connect(config.get('db.url'), config.get('db.options'))
  .then(() => {
    app.listen(config.get('site.port'), () => {
      logger.info(`Listening on port ${config.get('site.port')}`);
    });
  });
