'use strict';

module.exports = {
  site: {
    port: 3000,
  },
  jwt: {
    key: 'changeme',  // Secret key used for JWTs
    options: {
      expiresIn: '5 days',
    },
  },
  db: {
    url: 'mongodb://127.0.0.1:27017/smarturi',
    options: {
      useMongoClient: true,
    },
    bcryptSaltWorkFactor: 10,
  },
  request: {
    ttl: '7d',
    properties: ['protocol', 'query', 'secure', 'headers'],  // Properties of the request object to keep
    device: {  // Settings passed to the device module
      unknownUserAgentDeviceType: 'desktop',
      parseUserAgent: true,
    },
  },
  user: {
    password: {
      minLength: 5,
      maxLength: 25,
    },
    roles: {
      Banned: -1,
      User: 1,
      Admin: 10,
    },
  },
  loggers: {
    api: {
      console: {
        level: 'debug',
        colorize: true,
        label: 'API',
      },
    },
    db: {
      console: {
        level: 'debug',
        colorize: true,
        label: 'DB',
      },
    },
  },
};
