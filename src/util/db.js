'use strict'

var mongoose = require('mongoose')

var user = process.env.MONGO_USER
var password = process.env.MONGO_PASSWORD
var port = process.env.MONGO_PORT
var host = process.env.MONGO_HOST
var name = process.env.MONGO_NAME

var externals = {}

externals.connect = function () {
  var path = 'mongodb://' + user + ':' + password + '@' + host + ':' + port + '/' + name
  return mongoose.connect(path)
}

module.exports = externals
