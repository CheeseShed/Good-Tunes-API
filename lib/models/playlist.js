'use strict';

const mongoose = require('mongoose');
const lastModifiedPlugin = require('./plugins/last-modified');
const crudPlugin = require('./plugins/crud');
const Schema = mongoose.Schema;

let Playlist;

Playlist = new Schema({
  description: {
    type: String
  },
  fundraiser: {
    type: Schema.Types.ObjectId,
    ref: 'Fundraiser',
    required: true
  },
  spotify_id: String,
  title: {
      type: String,
      required: true
  },
  type: {
    type: String,
    required: true,
    default: 'playlist'
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
  }
});

Playlist.plugin(lastModifiedPlugin);
Playlist.plugin(crudPlugin);

Playlist.set('toJSON', {
    getters: true,
    virtuals: true
});

Playlist.options.toJSON.transform = function (doc, model) {
    delete model.__v;
    delete model._id;
    return model;
};

module.exports = mongoose.model('Playlist', Playlist);
