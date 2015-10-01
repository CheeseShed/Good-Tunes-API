'use strict';

const async = require('async');
const boom = require('boom');
const mongoose = require('mongoose');
const joi = require('joi');
const Playlist = require('../models/playlist');
const Fundraiser = require('../models/fundraiser');
const routeValidators = require('../util/validators');
const baseUrl = '/v1';

function playlists(server, connection) {

  // server.route({
  //   method: 'POST',
  //   path: baseUrl + '/playlists',
  //   config: {
  //     auth: 'user',
  //     // pre: [routeValidators.doesFundraiserExist],
  //     validate: {
  //       options: {
  //         abortEarly: false
  //       },
  //       payload: {
  //         fundraiser: joi.string().regex(/^[a-f\d]{24}$/i).required()
  //       }
  //     }
  //   },
  //   handler: function (request, reply) {
  //     const userId = request.auth.credentials.id.toString();
  //     const payload = request.payload;
  //
  //     payload.user = userId;
  //
  //     let doesFundraiserExist = function (next) {
  //       Fundraiser.findOne({_id: payload.fundraiser}, function (err, model) {
  //         if (err) {
  //           return next(err);
  //         } else if (!model) {
  //           return next(boom.badRequest('A fundraiser must be created before a Playlist'));
  //         } else if (!model.user.equals(userId)) {
  //           return next(boom.badRequest('The fundraiser must be created by the User making the Playlist'));
  //         } else {
  //           next();
  //         }
  //       });
  //     };
  //
  //     let createPlaylist = function (next) {
  //       Playlist.create(payload, next);
  //     };
  //
  //     async.waterfall([
  //       doesFundraiserExist,
  //       createPlaylist
  //     ], function (err, playlist) {
  //       if (err) {
  //         return reply(err);
  //       }
  //
  //       return reply(playlist);
  //     });
  //   }
  // });

  server.route({
    method: 'GET',
    path: baseUrl + '/playlists',
    handler: function (request, reply) {
      let query = request.query;
      let options = {};

      options.find = {};

      console.log(query.find);

      if (query.find) {
        options.find = JSON.parse(query.find);
      }

      options.select = query.select || '';
      options.populate = query.populate || '';
      options.sort = query.sort || '';
      options.limit = query.limit || '';
      options.skip = query.skip || '';

      Playlist.readAll(options, function (err, playlists) {

        if (err) {
          console.error(err);
          return reply(err);
        }

        reply(playlists);
      });
    }
  });

  server.route({
    method: 'GET',
    path: baseUrl + '/playlists/{id}',
    handler: function (request, reply) {

      var fetchPlaylist = function (next) {
        connection
          .model('Playlist')
          .findOne({_id: request.params.id})
          .exec(function (err, playlist) {
            if (err) {
              return next(err);
            }

            next(null, playlist);
          });
      };

      var fetchPlaylistTracks = function (playlist, next) {
        connection
          .model('Track')
          .find({playlist: playlist.id})
          .exec(function (err, tracks) {
            if (err) {
              console.error(err);
              return next(err);
            }

            next(null, playlist, tracks);
          });
      };

      async.waterfall([
        fetchPlaylist,
        fetchPlaylistTracks,
        function (playlist, tracks) {
          var response = {};

          response.links = {
            self: request.server.info.uri + request.path
          };

          response.data = {
            playlist: playlist,
            tracks: tracks
          };

          reply(response);
        }
      ], function (err, result) {
        console.log(result);
        return reply(err);
      });

    }
  });

  server.route({
    method: 'PATCH',
    path: '/v1/playlists/{id}',
    config: {
      auth: 'user',
      pre: [routeValidators.isPlaylistOwner],
      validate: {
        params: {
          id: joi.string().regex(/^[a-f\d]{24}$/i)
        },
        payload: {
          title: joi.string(),
          description: joi.string()
        }
      }
    },
    handler: function (request, reply) {
      const query = request.params.id;

      let data;
      let options = {
        new: true,
        upsert: false
      };

      data = request.payload;

      Playlist.findOneAndUpdate(query, data, options, function (err, playlist) {
        if (err) {
          return reply(err);
        }

        return reply(playlist);
      });
    }
  });
}

module.exports = playlists;
