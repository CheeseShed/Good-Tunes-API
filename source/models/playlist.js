'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    PlaylistSchema;

PlaylistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tracks: [{
        type: Schema.ObjectId,
        ref: 'Track'
    }]
});

PlaylistSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

PlaylistSchema.options.toJSON.transform = function (doc, model) {
    delete model.__v;
    return model;
};

module.exports = mongoose.model('Playlist', PlaylistSchema);