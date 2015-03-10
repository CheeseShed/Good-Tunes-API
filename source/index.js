'use strict'

var Hapi = require('hapi')
var server = new Hapi.Server()
var db = require('./util/db')

server.connection({port: process.env.PORT || 3000})

db.connect()

require('./routes/users')(server)

server.start(function () {
  console.log('Server running at', server.info.uri)
})
