'use strict';

var Hapi = require('hapi');
var access = require('./util/access');
var server = new Hapi.Server(process.env.HOST, process.env.PORT);
var mongoose = require('mongoose');
var mongoConnectionURI = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DBNAME;

mongoose.connect(mongoConnectionURI);

access(server);
require('./routes/users')(server);

server.start(function () {
	console.log('Server started at', server.info.uri);
});