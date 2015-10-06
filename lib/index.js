'use strict';

var hapi = require('hapi');
var db = require('./util/db');
var access = require('./util/access');
var models = require('./models');

function server() {
  var server = new hapi.Server();
  var connection = db.connect();

  server.connection({
    host: process.env.HOST,
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
  require('./routes/authenticate')(server);
  require('./routes/access')(server);
  require('./routes/users')(server);
  require('./routes/playlists')(server, connection);
  require('./routes/tracks')(server);
  require('./routes/fundraisers')(server, connection);
  require('./routes/donations')(server, connection);
  require('./routes/aws')(server);

  return server;
}

module.exports = server;
