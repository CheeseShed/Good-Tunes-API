'use strict';

const mongoose = require('mongoose');
const lastModifiedPlugin = require('./plugins/last-modified');
const crudPlugin = require('./plugins/crud');
const Schema = mongoose.Schema;

let Fundraiser;

Fundraiser = new Schema({
  type: {
    type: String,
    required: true,
    default: 'fundraiser'
  },
  title: {
    type: String,
    required: true
  },
  charity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  raised: {
    type: Number,
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  target_date: {
    type: Date,
    required: true
  },
  playlist: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  attributes: {
    donation_provider: String,
    donation_provider_url: String,
    donation_provider_account_id: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spotify_user_id: String,
  spotify_playlist_id: String,
  summary: {
    type: String,
    required: true
  }
});

Fundraiser.plugin(lastModifiedPlugin);
Fundraiser.plugin(crudPlugin);

Fundraiser.set('toJSON', {
    getters: true,
    virtuals: true
});

Fundraiser.options.toJSON.transform = function (doc, model) {
  delete model.__v;
  delete model._id;
  return model;
};

module.exports = mongoose.model('Fundraiser', Fundraiser);
