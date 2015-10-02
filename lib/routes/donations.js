'use strict';

const joi = require('joi');
const Donation = require('../models/donation');

function routes(server, dbConnection) {

  server.route({
    method: 'POST',
    path: '/v1/donations',
    config: {
      auth: 'user',
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          track: joi.string().regex(/^[a-f\d]{24}$/i).required(),
          fundraiser: joi.string().regex(/^[a-f\d]{24}$/i).required(),
          amount: joi.number().required()
        }
      }
    },
    handler: function (request, reply) {
      const user = request.auth.credentials.id.toString();

      let payload = request.payload;
      payload.user = user;

      Donation.create(payload, function (err, model) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        return reply(model);
      });
    }
  });
}

module.exports = routes;
