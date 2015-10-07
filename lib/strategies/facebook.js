'use strict';

module.exports = function (server) {
  var getScope = function () {
    return process.env.FACEBOOK_SCOPE.split(',')
  }

  server.register(require('bell'), function (err) {
    server.auth.strategy('facebook', 'bell', {
      provider: 'facebook',
      password: 'password',
      isSecure: false,
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      location: server.info.uri,
      scope: ['email', 'public_profile']
    });
  });
};
