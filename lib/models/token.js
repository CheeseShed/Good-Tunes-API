'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Token;

Token = new Schema({
  access_token: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Token', Token);
