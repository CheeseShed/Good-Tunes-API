'use strict';

const async = require('async');
const omit = require('lodash/omit');
const joi = require('joi');
const User = require('../models/user');
const Provider = require('../models/provider');

function authenticateRoutes(server) {
  server.route({
    method: 'POST',
    path: '/v1/auth/facebook',
    config: {
      validate: {
        payload: {
          email: joi.string().email(),
          first_name: joi.string(),
          last_name: joi.string(),
          name: joi.string(),
          id: joi.string(),
          link: joi.string(),
          picture: joi.string(),
          verified: joi.boolean()
        }
      }
    },
    handler: function (request, reply) {
      let payload = request.payload;

      let createUser = function (next) {
        let newUser = new User({
          name: payload.name,
          email: payload.email
        });

        newUser.save(function (err, userModel) {
          if (err) {
            return next(err);
          }

          return next(null, userModel);
        });
      };

      let createFacebookProvider = function (userModel, next) {
        let newProvider = new Provider({
          user: userModel._id.toString(),
          provider: 'facebook',
          profile: omit(payload, 'email')
        });

        newProvider.save(function (err, providerModel) {
          if (err) {
            console.error(err);
            return next(err);
          }

          next(null, providerModel, userModel);
        });
      };

      let createAccessToken = function (provider, user, next) {
        User.createToken(user._id.toString(), next);
      };

      let facebookAuthenticationFlow = function () {
        async.waterfall([
          createUser,
          createFacebookProvider,
          createAccessToken
        ], function (err, user) {
          if (err) {
            console.error(err);
            return reply(err);
          }

          return reply(user);
        });
      };

      let checkForExistingAccount = function (email) {
        User.findByEmail(email, function (err, existingUser) {
          if (err) {
            console.error(err);
            return reply(err);
          }

          if (existingUser) {
            console.log('Existing User');
            return reply(existingUser);
          } else {
            return facebookAuthenticationFlow();
          }
        });
      };

      checkForExistingAccount(payload.email);
    }
  });
}

module.exports = authenticateRoutes;
