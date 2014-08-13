module.exports = function (server) {

    'use strict';

    var User = require('../models/user');

    server.route({
        method: 'GET',
        path: '/v1/users',
        config: {
            auth: 'simple'
        },
        handler: function (request, reply) {
            User.find(function(err, users) {
                if (err) {
                    return reply(err);
                }
                reply(users);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/v1/users',
        handler: function (request, reply) {
            User.create(request.body, function(err, user) {
                if (err) {
                    return reply(err);
                }
                reply(user);
            });
        }
    });


//    server.route('/users/:userId')
//
//        .get(function(req, res) {
//            User.findById(req.params.userId, function(err, user) {
//                if (err) {
//                    return res.json(err);
//                }
//                res.json(user);
//            });
//        })
//
//        .put(function(req, res) {
//            User.findOneAndUpdate({
//                _id: req.params.userId
//            }, req.body, function(err, user) {
//                if (err) {
//                    return res.json(err);
//                }
//                res.json(user);
//            });
//        });
};