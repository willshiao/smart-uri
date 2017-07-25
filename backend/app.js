'use strict';

const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const errorHandlers = require('./lib/errorHandlers');
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const logger = require('./lib/logger').loggers.get('api');


//-------------------
// Initialization
//-------------------

const app = express();
require('./lib/extendExpress').extendResponse(express.response);

app.use('/', indexRoute);
app.use('/auth', authRoute);

app.use(errorHandlers.JwtErrorHandler);
app.use(errorHandlers.ErrorHandler);

if(config.get('jwt.secret') === 'changeme') {
  logger.warn('Default JWT secret is set - change it before you use this app in production.');
}

mongoose.connect(config.get('db.url'), config.get('db.options'))
  .then(() => {
    app.listen(config.get('site.port'), () => {
      logger.info(`Listening on port ${config.get('site.port')}`);
    });
  });
