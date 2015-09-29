'use strict';

const boom = require('boom');
const joi = require('joi');
const Fundraiser = require('../models/fundraiser');
const routeValidators = require('../util/validators');
const pick = require('lodash/object/pick');

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
          currency: joi.string().required(),
          target: joi.number().required(),
          target_date: joi.date().format('YYYY/MM/DD').required()
        }
      }
    },
    handler: function (request, reply) {
      const user = request.auth.credentials.id.toString();

      let payload = request.payload;

      payload.user = user;

      Fundraiser.create(payload, function(err, fundraiser) {
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
      let query = request.query;
      let options = {};

      options.find = query.find || '';
      options.select = query.select || '';
      options.populate = {
        path: 'user',
        select: 'id name'
      };
      options.sort = query.sort || '';
      options.limit = query.limit || '';
      options.skip = query.skip || '';

      Fundraiser.readAll(options, function (err, fundraisers) {
        if (err) {
          return reply(err);
        }

        return reply(fundraisers);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/fundraisers/{id}',
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
        if (err) {
          return reply(err);
        }

        if (!fundraiser) {
          return reply(boom.notFound());
        }

        return reply(fundraiser);
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
          description: joi.string(),
          currency: joi.string(),
          target: joi.number(),
          target_date: joi.date().format('YYYY/MM/DD')
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

      data = pick(request.payload, ['title', 'description', 'currency', 'target', 'target_date']);

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
