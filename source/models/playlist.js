'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var PlaylistSchema

PlaylistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        'default': Date.now
    },
    tracks: [{
        type: Schema.ObjectId,
        ref: 'Track'
    }]
})

module.exports = mongoose.model('Playlist', PlaylistSchema)