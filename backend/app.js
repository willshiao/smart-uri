'use strict';

const express = require('express');
const config = require('config');

const logger = require('./lib/logger').loggers.get('api');

const app = express();


app.listen(config.get('site.port'), () => {
  logger.debug(`Listening on port ${config.get('site.port')}`);
});
