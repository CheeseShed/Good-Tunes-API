module.exports = function(router) {
    var Playlist = require('../models/playlist')
    var mongoose = require('mongoose')
    var ObjectId = mongoose.Types.ObjectId

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

    router.route('/playlists/:playlistId')

        .get(function(req, res) {
            Playlist.findById(req.params.playlistId, function(err, playlist) {
                if (err) {
                    return res.json(err)
                }
                res.json(playlist)
            })
        })

        .put(function(req, res) {
            var query = {
                _id: req.params.playlistId
            }
            var update = {
                $push: req.body
            }
            var options = {
                new: true
            }

            if (req.body.tracks && req.body.tracks.length) {
                var test = req.body.tracks.map(function(trackId) {
                    
                    return new ObjectId(trackId)
                })
                console.log(test)
            }
            console.log(update.$push)
            Playlist.findOneAndUpdate(query, update, options, function(err, playlist) {
                if (err) {
                    return res.json(err)
                }
                res.json(playlist)
            })
        })

        .delete(function(req, res) {
            Playlist.remove({
                _id: req.params.playlistId
            }, function(err, playlist) {
                if (err) {
                    return res.json(err)
                }
                res.json(playlist)
            })
        })
}