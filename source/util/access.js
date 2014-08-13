module.exports = function (server) {

    'use strict';

    server.pack.register({
        plugin: require('hapi-auth-bearer-token')
    }, function (err) {
        if (err) {
            return console.error('Failed loading Hapi Auth Bearer Token plugin');
        }

        server.auth.strategy('simple', 'bearer-access-token', {
            validateFunc: function (token, cb) {
                var isValid = false;

                if (token === 'abcde') {
                    isValid = true;
                }

                // cb signature function(err, isValid, credentials)
                cb(null, isValid, {
                    token: token
                });
            }
        })
    });
};