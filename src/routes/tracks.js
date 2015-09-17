'use strict';

var Track = require('../models/track');
var baseUrl = '/v1';

function tracks(server) {

  server.route({
    method: 'POST',
    path: baseUrl + '/tracks',
    config: {
      auth: 'user'
    },
    handler: function (request, reply) {
      Track.create({
        'spotify_id': request.payload.spotify_id,
        'spotify_uri': request.payload.spotify_uri,
        creator: request.payload.user,
        playlist: request.payload.playlist
      }, function (err, track) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        reply(track);
      });
    }
  });

  server.route({
    method: 'GET',
    path: baseUrl + '/tracks',
    handler: function (request, reply) {

      var query = {
        playlist: request.query.playlist
      };

      Track
        .find(query)
        // .populate('creator', 'id name')
        // .populate('playlist')
        .exec(function (err, tracks) {
          if (err) {
            console.error(err);
            return reply(err);
          }

          reply(tracks);
        });
    }
  });
}

module.exports = tracks;
