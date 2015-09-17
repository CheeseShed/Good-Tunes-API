'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Track;

Track = new Schema({
  'spotify_id': String,
  'spotify_uri': String,
  playlist: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

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
