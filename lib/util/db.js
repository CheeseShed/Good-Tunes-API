'use strict'

var mongoose = require('mongoose');
var externals = {};

externals.connect = function () {
  return mongoose.connect(process.env.MONGO_PATH);
}

module.exports = externals;
