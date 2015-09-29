'use strict';

var hapi = require('hapi');
var db = require('./util/db');
var access = require('./util/access');
var models = require('./models');

function server() {
  var server = new hapi.Server();
  var connection = db.connect();

  server.connection({
    port: process.env.PORT || 80,
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
  require('./routes/fundraisers')(server, connection);

  return server;
}

module.exports = server;
