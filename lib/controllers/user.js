var Hapi = require('hapi');
var User = require('../models/user');

exports.create = function (request, reply) {
	var query = {
		name: request.payload.name,
		email: request.payload.email
	};

	User.register(new User(query), request.payload.password, function (err, user) {
		if (err) {
			return reply(err);
		}

		reply(user);
	});
	// User.create(query, function (err, user) {
	// 	if (err) {
	// 		return reply(err);
	// 	}

	// 	reply(user);
	// });
};

exports.read = {
	all: function (request, reply) {
		var query = request.payload;

		User.find(function (err, users) {
			if (err) {
                console.log(err);
				return reply(err);
			}

			reply(users);
		})
	},
	one: function (request, reply) {
		var options = {};

        options._id = request.params.userId;

		User.findOne(options).exec(function (err, user) {
			if (err) {
                console.log(err);
				return reply(err);
			}

            if (!user) {
                return reply({
                    message: 'User was not found'
                });
            }

			reply(user);
		});
	}
};

exports.update = function (request, reply) {
	var userId = request.params.userId;
	var update = request.payload;

	User.findByIdAndUpdate(userId, update, function (err, user) {
		if (err) {
			return reply(err);
		}

		reply(user);
	});
};

exports.destroy = function (request, reply) {
	var userId = request.params.userId;

	User.findByIdAndRemove(userId, function (err, user) {
		if (err) {
			return reply(err);
		}

		reply({ message: 'User ' + userId + ' was deleted' });
	});
};