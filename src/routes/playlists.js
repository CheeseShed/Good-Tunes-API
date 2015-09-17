'use strict';

var joi = require('joi');
var Playlist = require('../models/Playlist');
var validators = require('../util/validators');
var baseUrl = '/v1';

function playlists(server) {

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
        creator: request.auth.credentials.id.toString()
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
      Playlist.findOne({
        _id: request.params.id
      }, function (err, playlist) {
        if (err) {
          return reply(err);
        }

        reply(playlist);
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
