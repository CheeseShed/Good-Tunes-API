'use strict';

var hapi = require('hapi');
var db = require('./util/db');
var access = require('./util/access');
var server = new hapi.Server();

server.connection({
  host: process.env.HOST,
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: [process.env.CORS],
      credentials: true,
      additionalHeaders: ['Cache-Control', 'X-Requested-With']
    }
  }
});

// connect to the database
var connection = db.connect();

// authentication strategies
access(server);

// server.route({
//   method: '*',
//   path: '/auth/facebook',
//   config: {
//     auth: {
//       strategy: 'facebook',
//       mode: 'try'
//     }
//   },
//   handler: function (request, reply) {
//     if (!request.auth.isAuthenticated) {
//         return reply('Authentication failed due to: ' + request.auth.error.message);
//     }
//     console.log(request.auth);
//     reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
//   }
// })

// routes
require('./routes/access')(server);
require('./routes/users')(server);
require('./routes/playlists')(server, connection);
require('./routes/tracks')(server);

// ready, steady, go!
server.start(function () {
  console.log('Server running at', server.info.uri);
});
