var Playlist = require('../models/playlist');

module.exports.create = function (request, reply) {
    var query = {
        title: request.payload.title,
        creator: request.payload.user
    };

    Playlist.create(query, function (err, playlist) {
        if (err) {
            console.error(err);
            reply(err);
        }

        reply(playlist);
    });
};

module.exports.read = {
    all: function (request, reply) {
        Playlist
            .find()
            .populate('createdBy')
            .exec(function (err, playlists) {
                if (err) {
                    console.error(err);
                    reply(err);
                }

                reply(playlists);
            });
    }
};
