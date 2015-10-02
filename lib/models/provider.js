'use strict';

var mongoose = require('mongoose');
var lastModifiedPlugin = require('./plugins/last-modified');
var Schema = mongoose.Schema;
var Provider;

Provider = new Schema({
  type: {
    type: String,
    required: true,
    default: 'provider'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  profile: {
    id: String,
    name: String,
    first_name: String,
    last_name: String,
    picture: String,
    link: String,
    verified: Boolean
  }
});

Provider.plugin(lastModifiedPlugin);

Provider.set('toJSON', {
    getters: true,
    virtuals: true
});

Provider.options.toJSON.transform = function (doc, model) {
    delete model.__v;
    delete model._id;
    return model;
};

module.exports = mongoose.model('Provider', Provider);
