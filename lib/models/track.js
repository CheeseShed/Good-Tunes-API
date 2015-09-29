'use strict';

var mongoose = require('mongoose');
var lastModifiedPlugin = require('./plugins/last-modified');
var Schema = mongoose.Schema;
var Track;

Track = new Schema({
  type: {
    type: String,
    required: true,
    default: 'track'
  },
  playlist: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  spotify_id: {
    type: String,
    required: true
  },
  duration_ms: Number,
  uri: String,
  artists: [{
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  }]
});

Track.plugin(lastModifiedPlugin);

Track.set('toJSON', {
    getters: true,
    virtuals: true
});

Track.options.toJSON.transform = function (doc, model) {
    delete model._id;
    delete model.__v;
    return model;
};

module.exports = mongoose.model('Track', Track);
