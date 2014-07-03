module.exports = function(router) {
    var User = require('../models/user')

    router.route('/users')

        .post(function(req, res) {
            User.create(req.body, function(err, user) {
                if (err) {
                    return res.send(err)
                }
                res.json(user)
            })
        })

        .get(function(req, res) {
            User.find(function(err, users) {
                if (err) {
                    return res.send(err)
                }
                res.json(users)
            })
        })


    router.route('/users/:userId')

        .get(function(req, res) {
            User.findById(req.params.userId, function(err, user) {
                if (err) {
                    return res.json(err)
                }
                res.json(user)
            })
        })

        .put(function(req, res) {
            User.findOneAndUpdate({
                _id: req.params.userId
            }, req.body, function(err, user) {
                if (err) {
                    return res.json(err)
                }
                res.json(user)
            })
        })

};