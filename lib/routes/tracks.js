'use strict';

const async = require('async');
const pick = require('lodash/pick');
const Track = require('../models/track');
const baseUrl = '/v1';

function tracks(server) {

  server.route({
    method: 'POST',
    path: baseUrl + '/tracks',
    config: {
      auth: 'user'
    },
    handler: function (request, reply) {
      var data = {};

      var getArtists = function (artists) {
        return artists.map(function (artist) {
          return {
            name: artist.name,
            href: artist.href,
            spotify_id: artist.id
          };
        });
      };

      data.artists = getArtists(request.payload.artists);
      data.user = request.auth.credentials.id.toString();
      data.playlist = request.payload.playlist;
      data.name = request.payload.name;
      data.spotify_id = request.payload.spotify_id;
      data.duration_ms = request.payload.duration_ms;
      data.uri = request.payload.uri;

      Track.create(data, function (err, track) {
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
