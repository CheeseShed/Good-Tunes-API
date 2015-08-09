'use strict';

var boom = require('boom');
var accessLevels = require('../enums/accessLevels');

var validators = {
  isUser: function (request, reply) {
    var isAuthenticated = request.auth.isAuthenticated;
    var credentials = request.auth.credentials;
    var requestedUser = request.params.user;

    if (isAuthenticated && credentials.accessLevel === accessLevels.ADMIN) {
      return reply();
    } else if (credentials.id === requestedUser && credentials.accessLevel === accessLevels.USER) {
      return reply();
    } else {
      return reply(boom.unauthorized());
    }
  }
};

module.exports = validators;
