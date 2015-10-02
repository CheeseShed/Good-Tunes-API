'use strict';

const mongoose = require('mongoose');
const lastModifiedPlugin = require('./plugins/last-modified');
const crudPlugin = require('./plugins/crud');
const Schema = mongoose.Schema;

let Track;

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
  link: String,
  artists: [{
    name: String,
    link: String,
    spotify_id: String
  }]
});

Track.plugin(lastModifiedPlugin);
Track.plugin(crudPlugin);

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
