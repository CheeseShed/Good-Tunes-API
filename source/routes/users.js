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
        console.log(err)
        if (err) {
          return reply(err);
        }

        reply(user);
      })
    }
  })
}

module.exports = routes;
