'use strict';

const joi = require('joi');
const User = require('../models/user');

function routes (server) {
  var baseUrl = '/v1';

  server.route({
    method: 'POST',
    path: baseUrl + '/login',
    config: {
      validate: {
        payload: {
          email: joi.string().email(),
          password: joi.string()
        }
      }
    },
    handler: function (request, reply) {
      User.authenticate(request.payload, function (err, user) {
        if (err) return reply(err);

        reply(user);
      });
    }
  });

  server.route({
    method: 'POST',
    path: baseUrl + '/logout',
    handler: function (request, reply) {
      User.logout(request.payload, function (err) {
        if (err) return reply(err);

        reply('Success');
      });
    }
  });
}

module.exports = routes;
