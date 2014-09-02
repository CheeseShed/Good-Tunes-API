'use strict';

var Hapi = require('hapi'),
    access = require('./util/access'),
    server = new Hapi.Server(process.env.HOST, process.env.PORT),
    mongoose = require('mongoose'),
    mongoConnectionURI = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DBNAME;

mongoose.connect(mongoConnectionURI);

access(server);
require('./routes/users')(server);
require('./routes/playlists')(server);

server.start(function () {
	console.log('Server started at', server.info.uri);
});