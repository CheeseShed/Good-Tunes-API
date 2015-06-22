'use strict'

var mongoose = require('mongoose')

// var user = process.env.MONGO_USER
// var password = process.env.MONGO_PASSWORD
// var port = process.env.MONGO_PORT
// var host = process.env.MONGO_HOST
// var name = process.env.MONGO_NAME
var db = {
		uri: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/goodtunes-dev',
		options: {
			user: '',
			pass: ''
		}
	};

var externals = {}

externals.connect = function () {
 var datb = mongoose.connect(db.uri, db.options, function(err) {
	if (err) {
		console.error('error: Could not connect to MongoDB!');
		console.log(err);
	}
	});
 return datb;
}

module.exports = externals