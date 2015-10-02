'use strict';

var mongoose = require('mongoose');
var lastModifiedPlugin = require('./plugins/last-modified');
var Schema = mongoose.Schema;
var Artist;

Artist = new Schema({
  type: {
    type: String,
    required: true,
    default: 'artist'
  },
  spotify_id: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

Artist.plugin(lastModifiedPlugin);

Artist.set('toJSON', {
    getters: true,
    virtuals: true
});

Artist.options.toJSON.transform = function (doc, model) {
    delete model.__v;
    delete model._id;
    return model;
};

module.exports = mongoose.model('Artist', Artist);
