'use strict';

const async = require('async');
const boom = require('boom');
const joi = require('joi');
const Fundraiser = require('../models/fundraiser');
const Playlist = require('../models/playlist');
const routeValidators = require('../util/validators');
const pick = require('lodash/pick');
const omit = require('lodash/omit');
const includes = require('lodash/includes');

function routes(server, dbConnection) {

  server.route({
    method: 'POST',
    path: '/v1/fundraisers',
    config: {
      auth: 'user',
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          title: joi.string().max(128).required(),
          description: joi.string().required(),
          charity: joi.string().required(),
          currency: joi.string().required(),
          target: joi.number().required(),
          target_date: joi.date().format('YYYY/MM/DD').required(),
          raised: joi.number().required(),
          attributes: joi.object()
        }
      }
    },
    handler: (request, reply) => {
      const user = request.auth.credentials.id.toString();
      const payload = Object.assign({}, request.payload, { user });
      
      function createFundraiser (next) {
        return Fundraiser.create(payload, next);
      }

      function createPlaylist (fundraiser, next) {
        const playlistQuery = {
          fundraiser: fundraiser.id,
          user: fundraiser.user.toString()
        };

        Playlist.create(playlistQuery, (err, playlist) => {
          if (err) {
            return next(err);
          }

          return next(null, fundraiser, playlist);
        });
      }

      function updateFundraiserWithPlaylist (fundraiser, playlist, next) {
        fundraiser.playlist = playlist._id;
        fundraiser.save(next);
      };

      async.waterfall([
        createFundraiser,
        createPlaylist,
        updateFundraiserWithPlaylist
      ], (err, fundraiser) => {
        if (err) {
          return reply(err);
        }

        return reply(fundraiser).code(201);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/fundraisers',
    handler: function (request, reply) {
      const query = request.query;
      const options = {};

      options.find = query.find || '';
      options.select = query.select || '';
      options.populate = '';
      // options.populate = {
      //   path: 'user',
      //   select: 'id name'
      // };
      options.sort = query.sort || '';
      options.limit = query.limit || '';
      options.skip = query.skip || '';

      Fundraiser.readAll(options, function (err, fundraisers) {
        if (err) {
          return reply(err);
        }

        return reply(fundraisers);
      });
    },
    config: {
      cors: {
        origin: [process.env.CORS]
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/fundraisers/{id}',
    config: {
      cors: {
        origin: [process.env.CORS]
      }
    },
    handler: function (request, reply) {
      let query = request.query;
      let options = {};

      options.query = {_id: request.params.id};
      options.select = (query.select || '').replace(',', ' ');
      options.populate = {
        path: 'user',
        select: 'id name'
      };

      Fundraiser.readOne(options, function (err, fundraiser) {
        process.nextTick(function () {
          if (err) {
            return reply(err);
          }

          if (!fundraiser) {
            return reply(boom.notFound());
          }

          return reply(fundraiser);
        });
      });
    }
  });

  server.route({
    method: 'PATCH',
    path: '/v1/fundraisers/{id}',
    config: {
      auth: 'user',
      pre: [routeValidators.isFundraiserOwner],
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          title: joi.string(),
          charity: joi.string(),
          description: joi.string(),
          currency: joi.string(),
          target: joi.number(),
          raised: joi.number(),
          target_date: joi.date().format('YYYY/MM/DD')
          // attributes: {
          //   donation_provider: joi.string(),
          //   donation_provider_url: joi.string(),
          //   donation_provider_account_id: joi.string()
          // }
        }
      }
    },
    handler: function (request, reply) {
      let data;
      let query = request.params.id;
      let options = {
        new: true,
        upsert: false
      };

      data = pick(request.payload, [
        'title',
        'charity',
        'description',
        'currency',
        'target',
        'target_date',
        'raised',
        'attributes'
      ]);

      Fundraiser.findOneAndUpdate(query, data, options, function (err, model) {
        if (err) {
          return reply(err);
        }

        return reply(model);
      });
    }
  });
}

module.exports = routes;
