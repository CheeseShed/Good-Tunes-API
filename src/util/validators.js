'use strict';

var boom = require('boom');
var accessLevels = require('../enums/accessLevels');
var User = require('../models/user');
var validators = {};

function isUser(request, reply) {
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

function doesAccountExist(request, reply) {
  User
    .find({_id: request.params.id})
    .exec(function (err, user) {
      if (err) {
        return reply(err);
      } else if (!user.length) {
        return reply(boom.notFound());
      } else {
        return reply();
      }
    });
}

function doesResourceExist(request, reply) {
  console.log(request);
  return reply();
}

validators = {
  doesAccountExist: doesAccountExist,
  doesResourceExist: doesResourceExist,
  isUser: isUser
};

module.exports = validators;
