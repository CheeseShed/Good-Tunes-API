module.exports = function(router) {
    var Playlist = require('../models/playlist')

    router.route('/playlists')

        .post(function(req, res) {
            Playlist.create(req.body, function(err, playlist) {
                if (err) {
                    return res.json(err)
                }
                res.json(playlist)
            })
        })

        .get(function(req, res) {
            Playlist.find(function(err, playlists) {
                if (err) {
                    return res.json(err)
                }
                res.json(playlists)
            })
        })
}