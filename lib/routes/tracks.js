'use strict';

const async = require('async');
const pick = require('lodash/pick');
const Joi = require('joi');
const Track = require('../models/track');
const baseUrl = '/v1';

function getArtists(artists) {
  return artists.map((artist) => {
    return {
      name: artist.name
    };
  });
}

function tracks(server) {

  server.route({
    method: 'POST',
    path: baseUrl + '/tracks',
    config: {
      auth: 'user',
      validate: {
        payload: {
          playlist: Joi.string().required(),
          spotify_id: Joi.string().required(),
          href: Joi.string().required(),
          name: Joi.string().required()
        }
      },
    },
    handler: (request, reply) => {
      const user = request.auth.credentials.id.toString();
      const {
        playlist,
        spotify_id,
        href,
        name
      } = request.payload;
      const data = {
        playlist,
        spotify_id,
        link: href,
        name,
        user
      };

      Track.create(data, (err, track) => {
        if (err) {
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
