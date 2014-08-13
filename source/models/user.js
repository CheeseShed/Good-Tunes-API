'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema;

UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    playlists: [{
		type: Schema.ObjectId,
		ref: 'Playlist'
    }]
});

module.exports = mongoose.model('User', UserSchema);