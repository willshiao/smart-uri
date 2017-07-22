'use strict';

const logger = require('winston');
const config = require('config');

logger.level = 'debug';

logger.loggers.add('api', config.get('loggers.api'));

logger.loggers.add('db', config.get('loggers.db'));

module.exports = logger;
