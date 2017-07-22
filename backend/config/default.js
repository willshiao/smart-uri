'use strict';

module.exports = {
  site: {
    port: 3000,
  },
  db: {
    url: 'mongodb://127.0.0.1:27017/smarturi',
    options: {
      useMongoClient: true,
    },
  },
  request: {
    ttl: 60 * 60 * 24 * 7,  // One week, in seconds
    properties: ['protocol', 'query', 'secure'],  // Properties of the request object to keep
  },
  users: {
    roles: {
      Banned: -1,
      User: 1,
      Admin: 10,
    },
  },
};
