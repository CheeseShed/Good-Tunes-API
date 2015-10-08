'use strict';

const joi = require('joi');
const async = require('async');
const Donation = require('../models/donation');
const Fundraiser = require('../models/fundraiser');

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

      const addDonation = function (next) {
        Donation.create(payload, next);
      };

      const updateFundraiserRaisedAmount = function (donation, next) {
        const query = {_id: donation.fundraiser.toString()};

        Fundraiser.findOne(query, function (err, fundraiser) {

          const existingRaisedAmount = fundraiser.get('raised') * 100;
          const donationToAdd = donation.amount * 100;
          const newRaisedAmount = existingRaisedAmount + donationToAdd;

          fundraiser.set('raised', (newRaisedAmount / 100));

          fundraiser.save(function (err, updatedFundraiser) {
            if (err) {
              return next(err);
            }

            return next(null, updatedFundraiser, donation);
          });
        });
      };

      async.waterfall([
        addDonation,
        updateFundraiserRaisedAmount
      ], function (err, donation) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        return reply(donation);
      });
    }
  });
}

module.exports = routes;
