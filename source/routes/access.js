'use strict'

var User = require('../models/user')

function routes (server) {
  var baseUrl = '/v1';

  server.route({
    method: 'POST',
    path: baseUrl + '/login',
    handler: function (request, reply) {
      User.authenticate(request.payload, function (err, user) {
        if (err) return reply(err)

        reply(user)
      })
    }
  })

  server.route({
    method: 'POST',
    path: baseUrl + '/logout',
    handler: function (request, reply) {
      User.logout(request.payload, function (err) {
        if (err) return reply(err)

        reply('Success')
      })
    }
  })
}

module.exports = routes;
