'use strict';

var mongoose = require('mongoose');
var lastModifiedPlugin = require('./plugins/last-modified');
var Schema = mongoose.Schema;
var Provider;

Provider = new Schema({});

Provider.plugin(lastModifiedPlugin);

Provider.set('toJSON', {
    getters: true,
    virtuals: true
});

Provider.options.toJSON.transform = function (doc, model) {
    delete model.__v;
    delete model._id;
    return model;
};

module.exports = mongoose.model('Provider', Provider);
