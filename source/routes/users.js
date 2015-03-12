'use strict'

var User = require('../models/user')

function routes (server) {
  var prefix = '/v1'

  server.route({
    method: 'POST',
    path: prefix + '/users',
    handler: function (request, reply) {

      var query = {
        email: request.payload.email,
        name: request.payload.name,
        username: request.payload.username
      }

      User.register(new User(query), request.payload.password, function userRegisterCb(err, user) {
        if (err) {
          return reply(err)
        }

        reply(user);
      })
    }
  })

  server.route({
    method: 'GET',
    path: prefix + '/users/{id}',
    handler: function (request, reply) {
      User.findOne({_id: request.params.id}, function (err, user) {
        if (err) {
          return reply(err)
        }

        reply(user)
      })
    }
  })
}

module.exports = routes;
