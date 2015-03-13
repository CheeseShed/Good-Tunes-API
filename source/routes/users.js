'use strict'

var User = require('../models/user')

function routes (server) {
  var baseUrl = '/v1'

  server.route({
    method: 'POST',
    path: baseUrl + '/users',
    handler: function (request, reply) {

      var query = {
        email: request.payload.email,
        name: request.payload.name
      }

      User.register(new User(query), request.payload.password, function userRegisterCb(err, user) {
        if (err) {
          console.error(err)
          return reply(err)
        }

        reply(user);
      })
    }
  })

  server.route({
    method: 'GET',
    path: baseUrl + '/users/{id}',
    config: {
      auth: 'user'
    },
    handler: function (request, reply) {
      User.findOne({_id: request.params.id}, function (err, user) {
        if (err) {
          console.error(err)
          return reply(err)
        }

        reply(user)
      })
    }
  })
}

module.exports = routes;
