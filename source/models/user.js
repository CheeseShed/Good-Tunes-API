'use strict';

var Hapi = require('hapi'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    iterations = 25000,
    keyLength = 512,
    saltLength = 64,
    encoding = 'hex',
    UserSchema;

UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: 1
    },
    hash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    playlists: [{
		type: Schema.ObjectId,
		ref: 'Playlist'
    }],
    salt: {
        type: String,
        required: true
    }
});

UserSchema.methods.setPasswordAndSave = function (password, done) {
    var salt;
    var model = this;

    crypto.randomBytes(saltLength, function (err, buf) {
        if (err) {
            return done(err);
        }

        salt = buf.toString('hex');

        crypto.pbkdf2(password, salt, iterations, keyLength, function (err, derivedKey) {
            if (err) {
                return done(err);
            }

            model.set('hash', new Buffer(derivedKey, 'binary').toString(encoding));
            model.set('salt', salt);

            model.save(done);
        });
    });
};

UserSchema.static('findByEmail', function (email, done) {
    this.findOne({ email: email }, done);
});

UserSchema.static('register', function (user, password, done) {
    this.findByEmail(user.email, function (err, existingUser) {
        if (err) {
            return done(err);
        }

        if (existingUser) {
            return done(Hapi.error.badRequest('User already exists'));
        }

        user.setPasswordAndSave(password, done);
    });
});

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

UserSchema.options.toJSON.transform = function (doc, model) {
    delete model._id;
    delete model.__v;
    delete model.salt;
    delete model.hash;
    return model;
};

module.exports = mongoose.model('User', UserSchema);