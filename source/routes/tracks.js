module.exports = function(router) {
    var Track = require('../models/track')

    router.route('/tracks')

        .get(function(req, res) {
            Track.find(function(err, tracks) {
                if (err) {
                    return res.json(err)
                }
                res.json(tracks)
            })
        })

        .post(function(req, res) {
            var spotifyId = '4GGw2WhvFOniMdAl8ZLpVW'
            var spotifyUri = 'spotify:track:4GGw2WhvFOniMdAl8ZLpVW'

            Track.create({
                addedBy: req.body.user,
                title: req.body.title,
                artist: req.body.artist,
                'spotify_id': spotifyId,
                'spotify_uri': spotifyUri
            }, function(err, track) {
                if (err) {
                    return res.json(err)
                }
                res.json(track)
            })
        })

    router.route('/tracks/:track_id')

        .get(function(req, res) {
            var trackId = req.params['track_id']

            Track.findById(trackId, function(err, track) {
                if (err) {
                    return res.json(err)
                }
                res.json(track)
            })
        })
}