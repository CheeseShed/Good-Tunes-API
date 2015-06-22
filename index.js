'use strict'

var Hapi = require('hapi')
var server = new Hapi.Server()
var db = require('./source/util/db')
var access = require('./source/util/access')

server.connection({port: process.env.PORT || 3000})

// connect to the database
db.connect()

// authentication strategies
access(server)

// routes
require('./source/routes/access')(server)
require('./source/routes/users')(server)

// ready, steady, go!
server.start(function () {
  console.log('Server running at', server.info.uri)
})
