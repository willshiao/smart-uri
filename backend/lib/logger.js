'use strict';

const logger = require('winston');

logger.level = 'debug';

logger.loggers.add('api', {
  console: {
    level: 'debug',
    colorize: true,
    label: 'API',
  },
});

logger.loggers.add('db', {
  console: {
    level: 'debug',
    colorize: true,
    label: 'DB',
  },
});

module.exports = logger;
