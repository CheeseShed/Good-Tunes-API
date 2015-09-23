'use strict';

var mongoose = require('mongoose');
var lastModifiedPlugin = require('./plugins/last-modified');
var Schema = mongoose.Schema;
var Track;

Track = new Schema({
  playlist: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  donatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  'spotify_id': String,
  'duration_ms': Number,
  uri: String
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
