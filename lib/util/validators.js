'use strict';

var boom = require('boom');
var accessLevels = require('../enums/accessLevels');
var User = require('../models/user');

const Playlist = require('../models/playlist');
const Fundraiser = require('../models/fundraiser');

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

function fetchResourceUserById(model, resourceId) {
  return model.findOne({_id: resourceId}).select('user');
}

function isFundraiserOwner(request, reply) {
  const fundraiser = require('../models/fundraiser');
  const userId = request.auth.credentials.id.toString();
  const resourceId = request.params.id;

  fetchResourceUserById(fundraiser, resourceId)
    .then(function (model) {
      if (!model.user.equals(userId)) {
        return reply(boom.unauthorized());
      } else {
        return reply();
      }
    }).catch(function (err) {
      reply(err);
    });
}

function isPlaylistOwner(requst, reply) {
  const userId = request.auth.credentials.id.toString();
  const resourceId = request.params.id;

  fetchResourceUserById(Playlist, resourceId)
    .then(function (model) {
      if (!model.user.equals(userId)) {
        return reply(boom.unauthorized());
      } else {
        return reply();
      }
    }).catch(function (err) {
      reply(err);
    });
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

function doesFundraiserExist(request, reply) {
  Fundraiser
    .find({_id: request.params.id})
    .exec(function (err, model) {
      if (err) {
        return reply(err);
      } else if (!model.length) {
        return reply(boom.notFound());
      } else {
        return reply();
      }
    });
}

validators = {
  doesAccountExist: doesAccountExist,
  doesFundraiserExist: doesFundraiserExist,
  isUser: isUser,
  isFundraiserOwner: isFundraiserOwner,
  isPlaylistOwner: isPlaylistOwner
};

module.exports = validators;
