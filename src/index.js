'use strict';

var hapi = require('hapi');
var server = new hapi.Server();
var db = require('./util/db');
var access = require('./util/access');

server.connection({port: process.env.PORT || 3000});

// connect to the database
db.connect();

// authentication strategies
access(server);

// routes
require('./routes/access')(server);
require('./routes/users')(server);

// ready, steady, go!
server.start(function () {
  console.log('Server running at', server.info.uri);
});
