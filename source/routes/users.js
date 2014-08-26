module.exports = function (server) {

    'use strict';

    var Joi = require('joi');
    var userCtrl = require('../controllers/user');
    var prefix = '/v1';

    server.route({
        method: 'GET',
        path: prefix + '/users',
        handler: userCtrl.read.all
    });

    server.route({
        method: 'GET',
        path: prefix + '/users/{userId}',
        handler: userCtrl.read.one
    });

    server.route({
        method: 'POST',
        path: prefix + '/users',
        config: {
            // auth: 'simple',
            validate: {
                payload: {
                    name: Joi.string().min(2).max(64).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).max(32).required()
                }
            }
        },
        handler: userCtrl.create
    });

    server.route({
        method: 'PUT',
        path: prefix + '/users/{userId}',
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(2).max(64),
                    email: Joi.string().email(),
                    password: Joi.string().min(8).max(32)
                }
            }
        },
        handler: userCtrl.update
    });

    server.route({
        method: 'DELETE',
        path: prefix + '/users/{userId}',
        handler: userCtrl.destroy
    });

};