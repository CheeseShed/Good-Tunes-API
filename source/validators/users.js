'use strict'

var Joi = require('joi')

module.exports = {
  payload: {
    email: Joi.string().email().required(),
    name: Joi.string().min(2).required(),
    password: Joi.string().min(8).max(16).required()
  }
}
