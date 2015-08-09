'use strict'

var User = require('../models/user');
var validators = require('../util/validators');
var validation = {
  users: require('../validators/users')
};

function routes (server) {
  var baseUrl = '/v1';

  server.route({
    method: 'GET',
    path: baseUrl + '/users',
    config: {
      auth: 'admin'
    },
    handler: function (request, reply) {
      User.readAll(function (err, users) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        if (!users) return reply([]);

        reply(users);
      });
    }
  });

  server.route({
    method: 'POST',
    path: baseUrl + '/users',
    config: {
      validate: {
        payload: validation.users.payload
      }
    },
    handler: function (request, reply) {

      var query = {
        email: request.payload.email,
        name: request.payload.name
      };

      User.register(new User(query), request.payload.password, function userRegisterCb(err, user) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        reply(user);
      });
    }
  });

  server.route({
    method: 'GET',
    path: baseUrl + '/users/{user}',
    config: {
      auth: 'user',
      pre: [validators.isUser]
    },
    handler: function (request, reply) {
      var query = {
        _id: request.params.user
      };

      User.findOne(query, function (err, user) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        reply(user);
      });
    }
  });
}

module.exports = routes;
