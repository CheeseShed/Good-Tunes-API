'use strict';

var async = require('async');
var mongoose = require('mongoose');
var joi = require('joi');
var Playlist = require('../models/Playlist');
var validators = require('../util/validators');
var baseUrl = '/v1';

function playlists(server, connection) {

  server.route({
    method: 'POST',
    path: baseUrl + '/playlists',
    config: {
      auth: 'user',
      validate: {
        payload: {
          title: joi.string().required(),
          description: joi.string().required()
        }
      }
    },
    handler: function (request, reply) {
      Playlist.create({
        title: request.payload.title,
        description: request.payload.description,
        createdBy: request.auth.credentials.id.toString()
      }, function (err, playlist) {

        if (err) {
          console.error(err);
          return reply(err);
        }

        reply(playlist);
      });
    }
  });

  server.route({
    method: 'GET',
    path: baseUrl + '/playlists',
    handler: function (request, reply) {
      Playlist.find({}, function (err, playlists) {

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
        Playlist.findOne({
          _id: request.params.id
        }, function (err, playlist) {
          if (err) {
            console.error(err);
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
    method: 'PUT',
    path: baseUrl + '/playlists/{id}',
    config: {
      auth: 'user',
      pre: [validators.isUser],
      validate: {
        payload: {
          title: joi.string().min(2).max(128).required().description('Title of the playlist'),
          description: joi.string().min(2).max(256).required().description('There must be a description for the playlist')
        }
      }
    },
    handler: function (request, reply) {
      var query = {
        _id: request.params.id
      };

      var data = {
        title: request.payload.title,
        description: request.payload.description
      };

      Playlist.findOneAndUpdate(query, data, function (err, playlist) {
        if (err) {
          return reply(err);
        }

        reply(playlist);
      });
    }
  });
}

module.exports = playlists;
