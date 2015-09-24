'use strict';

var server = require('./lib')();

server.start(function () {
  console.log('Server running at', server.info.uri);
});
