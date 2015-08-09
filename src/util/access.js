'use strict'

var User = require('../models/user');
var accessLevels = require('../enums/accessLevels');

function authentication(server) {
  // register the bearer token plugin with the server
  // https://github.com/johnbrett/hapi-auth-bearer-token
  server.register(require('hapi-auth-bearer-token'), function (err) {
    if (err) {
      return console.error(err);
    }

    // use a different strategy dependent on access privilege user/admin etc
    server.auth.strategy('admin', 'bearer-access-token', {
      allowQueryToken: false,
      validateFunc: function (token, cb) {
        User.findOneByTokenAndAccessLevel(token, accessLevels.ADMIN, cb);
      }
    });

    server.auth.strategy('user', 'bearer-access-token', {
      allowQueryToken: false,
      validateFunc: function (token, cb) {
        User.findOneByTokenAndAccessLevel(token, accessLevels.USER, cb);
      }
    });

  });
}

module.exports = authentication;
