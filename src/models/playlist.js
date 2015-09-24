'use strict';

var mongoose = require('mongoose');
var lastModifiedPlugin = require('./plugins/last-modified');
var Schema = mongoose.Schema;
var Playlist;

Playlist = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
      type: String,
      required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

Playlist.plugin(lastModifiedPlugin);

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
