'use strict';

var hapi = require('hapi');
var db = require('./util/db');
var access = require('./util/access');
var server = new hapi.Server();

server.connection({
  host: 'localhost',
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: ['http://localhost:7080'],
      credentials: true,
      additionalHeaders: ['Cache-Control', 'X-Requested-With']
    }
  }
});

// connect to the database
db.connect();

// authentication strategies
access(server);

server.register(require('bell'), function (err) {
  server.auth.strategy('facebook', 'bell', {
    provider: 'facebook',
    password: 'password',
    isSecure: false,
    clientId: '1443597999288135',
    clientSecret: 'c0414045e155ab7f6dfa2b8eb3d832fd',
    location: server.info.uri,
    scope: ['email']
  });
});

server.route({
  method: '*',
  path: '/bell/door',
  config: {
    auth: {
      strategy: 'facebook',
      mode: 'try'
    }
  },
  handler: function (request, reply) {
    if (!request.auth.isAuthenticated) {
        return reply('Authentication failed due to: ' + request.auth.error.message);
    }
    reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
  }
})

// routes
require('./routes/access')(server);
require('./routes/users')(server);
require('./routes/playlists')(server);
require('./routes/tracks')(server);

// ready, steady, go!
server.start(function () {
  console.log('Server running at', server.info.uri);
});
