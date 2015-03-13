'use strict'

var Boom = require('Boom')
var crypto = require('crypto')
var mongoose = require('mongoose')
var uuid = require('node-uuid')
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
  },
  token: {
    type: String
  }
})

User.index({
  email: 1
}, {
  unique: true
})

User.methods.setPasswordAndSave = function (password, cb) {
  var salt
  var model = this

  crypto.randomBytes(saltLength, function (err, buf) {
    if (err) {
      console.error(err)
      return cb(err)
    }

    salt = buf.toString('hex')

    crypto.pbkdf2(password, salt, iterations, keyLength, function (err, derivedKey) {
      if (err) {
        console.error(err)
        return cb(err)
      }

      model.set('hash', new Buffer(derivedKey, 'binary').toString(encoding))
      model.set('salt', salt)
      model.set('token', createToken())

      model.save(function (err, user) {
        if (err) {
          console.error(err)
          return cb(err)
        }

        cb(user)
      })
    })
  })
}

User.methods.authenticate = function (password, cb) {
  var model = this

  // check to see if a salt exists for the user
  if (!model.get('salt')) return cb(Boom.badRequest())

  crypto.pbkdf2(password, model.get('salt'), iterations, keyLength, function (err, derivedKey) {
    if (err) {
      console.error(err)
      return cb(err)
    }

    var hash = new Buffer(derivedKey, 'binary').toString(encoding)

    if (hash === model.get('hash')) {
      model.set('token', createToken())
      model.save(cb)
    } else {
      cb(Boom.unauthorized('Your details are incorrect'))
    }
  })
}

User.static('findByEmail', function (email, cb) {
  this.findOne({email: email}, cb)
})

User.static('findOneByToken', function (token, cb) {
  this.findOne({token: token}, function (err, user) {
    if (err) {
      console.error(err)
      return cb(err)
    }

    if (user) {
      cb(null, true, {_id: user.id, name: user.name, email: user.email})
    } else {
      cb(null, false)
    }
  })
})

User.static('register', function (user, password, cb) {
  this.findByEmail(user.email, function (err, existingUser) {
    if (err) {
      console.error(err)
      return cb(err)
    }

    if (existingUser) {
      return cb(Boom.badRequest('Username already exists'))
    }

    user.setPasswordAndSave(password, cb)
  })
})

User.static('authenticate', function (payload, cb) {
  var email = payload.email.toLowerCase()

  this.findByEmail(email, function (err, user) {
    if (err) {
      console.error(err)
      return cb(err)
    }

    if (user) {
      user.authenticate(payload.password, cb)
    } else {
      cb(Boom.badRequest('Your details are incorrect'))
    }
  })
})

User.static('logout', function (payload, cb) {
  this.findById(payload.id, function (err, user) {
    if (err) {
      console.error(err)
      return cb(err)
    }

    if (!user) return cb(Boom.badRequest('Your details are incorrect'))

    user.set('token', null)
    user.save(cb)
  })
})

function createToken() {
  return uuid.v4()
}

User.set('toJSON', {
  getters: true,
  virtuals: true
})

User.options.toJSON.transform = function (doc, model) {
  return {
    createdAt: model.createdAt,
    email: model.email,
    id: model._id,
    name: model.name,
    token: model.token
  }
}

module.exports = mongoose.model('User', User)
