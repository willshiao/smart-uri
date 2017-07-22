'use strict';

module.exports = {
  site: {
    port: 3000,
  },
  request: {
    ttl: 60 * 60 * 24 * 7,  // One week, in seconds
  },
  users: {
    roles: {
      Banned: -1,
      User: 1,
      Admin: 10,
    },
  },
};
