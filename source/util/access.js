'use strict'
var User = require('../models/user')

function authentication(server) {
  // register the bearer token plugin with the server
  // https://github.com/johnbrett/hapi-auth-bearer-token
  server.register(require('hapi-auth-bearer-token'), function (err) {
    if (err) return console.error(err)

    server.auth.strategy('user', 'bearer-access-token', {
      allowQueryToken: false,
      validateFunc: function (token, cb) {
        User.findOneByToken(token, cb)
      }
    })
  })
}

module.exports = authentication
