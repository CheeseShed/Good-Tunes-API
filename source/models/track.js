'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TrackSchema;

TrackSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Track', TrackSchema);