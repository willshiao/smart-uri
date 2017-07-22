'use strict';

const express = require('express');
const config = require('config');

const logger = require('./lib/logger').loggers.get('api');

const indexRoute = require('./routes/index');

const app = express();
require('./lib/extendExpress').extendResponse(express.response);

app.use(indexRoute);

app.listen(config.get('site.port'), () => {
  logger.debug(`Listening on port ${config.get('site.port')}`);
});
