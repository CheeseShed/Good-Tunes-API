'use strict';

var hapi = require('hapi');
var db = require('./util/db');
var access = require('./util/access');

function server() {
  var server = new hapi.Server();
  var connection = db.connect();

  server.connection({
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3010,
    routes: {
      cors: {
        origin: [process.env.CORS],
        credentials: true,
        additionalHeaders: ['Cache-Control', 'X-Requested-With']
      }
    }
  });

  // authorisation strategies
  access(server);

  // routes
  require('./routes/access')(server);
  require('./routes/users')(server);
  require('./routes/playlists')(server, connection);
  require('./routes/tracks')(server);

  return server;
}

module.exports = server;
