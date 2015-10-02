'use strict';

const mongoose = require('mongoose');
const lastModifiedPlugin = require('./plugins/last-modified');
const crudPlugin = require('./plugins/crud');
const Schema = mongoose.Schema;

let Donation;

Donation = new Schema({
  type: {
    type: String,
    required: true,
    default: 'donation'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  fundraiser: {
    type: Schema.Types.ObjectId,
    ref: 'Fundraiser',
    required: true
  },
  amount: {
    type: String,
    required: true
  }
});

Donation.plugin(lastModifiedPlugin);
Donation.plugin(crudPlugin);

Donation.set('toJSON', {
    getters: true,
    virtuals: true
});

Donation.options.toJSON.transform = function (doc, model) {
    delete model.__v;
    delete model._id;
    return model;
};

module.exports = mongoose.model('Donation', Donation);
