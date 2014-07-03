'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var TrackSchema

TrackSchema = new Schema({
    'spotify_id': {
        type: String,
        required: true
    },
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
    },
    'spotify_uri': {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Track', TrackSchema)