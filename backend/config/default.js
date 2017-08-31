'use strict';

module.exports = {
  site: {
    port: 3000,
    trustProxy: false,  // See https://expressjs.com/en/guide/behind-proxies.html
  },
  jwt: {
    secret: 'changeme',  // Secret key used for JWTs
    expiresIn: '5 days',
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
  redirect: {
    slug: {  // Passed to the randomstring module: https://www.npmjs.com/package/randomstring
      charset: 'alphanumeric',
      length: '5',
    },
    slugWarning: 5,  // Number of DB collisions for the slug before issuing an warning
    slugError: 100,  // Number of DB collisions for a slug before throwing an error
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
