'use strict';

function routes(server, dbConnection) {

  server.route({
    method: 'POST',
    path: '/v1/donations',
    config: {
      auth: 'user'
    },
    handler: function (request, reply) {
      return reply();
    }
  });
}

module.exports = routes;
