'use strict'

var Boom = require('Boom')
var crypto = require('crypto')
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var iterations = 25000
var keyLength = 512
var saltLength = 128
var encoding = 'hex'
var User

User = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  hash: String,
  salt: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

User.index({
  email: 1
}, {
  unique: true
})

User.methods.setPasswordAndSave = function (password, done) {
  var salt
  var model = this

  crypto.randomBytes(saltLength, function (err, buf) {
    if (err) return done(err)

    salt = buf.toString('hex')

    crypto.pbkdf2(password, salt, iterations, keyLength, function (err, derivedKey) {
      if (err) return done(err)

      model.set('hash', new Buffer(derivedKey, 'binary').toString(encoding))
      model.set('salt', salt)

      model.save(done)
    })
  })
}

User.methods.authenticate = function (password, cb) {
  var model = this

  // check to see if a salt exists for the user
  if (!model.get('salt')) return cb(Boom.badRequest())

  crypto.pbkdf2(password, model.get('salt'), iterations, keyLength, function (err, derivedKey) {
    if (err) return cb(err)

    var hash = new Buffer(derivedKey, 'binary').toString(encoding)

    if (hash === model.get('hash')) {
      cb(model)
    } else {
      cb(Boom.unauthorized('Your details are incorrect'))
    }
  })
}

User.static('findByEmail', function (email, cb) {
  this.findOne({email: email}, cb)
})

User.static('register', function (user, password, cb) {
  this.findByEmail(user.email, function (err, existingUser) {
    if (err) return cb(err)

    if (existingUser) {
      return cb(Boom.badRequest('Username already exists'))
    }

    user.setPasswordAndSave(password, cb)
  })
})

User.static('authenticate', function (payload, cb) {
  var username = payload.email.toLowerCase()

  this.findByEmail(username, function (err, user) {
    if (err) return cb(err)

    if (user) {
      user.authenticate(payload.password, cb)
    } else {
      cb(Boom.badRequest('Your details are incorrect'))
    }
  })
})

User.set('toJSON', {
  getters: true,
  virtuals: true
})

User.options.toJSON.transform = function (doc, model) {
  return {
    id: model._id,
    name: model.name,
    email: model.email,
    createdAt: model.createdAt
  }
}

module.exports = mongoose.model('User', User)
