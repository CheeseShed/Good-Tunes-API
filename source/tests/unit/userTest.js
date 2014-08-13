'use strict'

describe('models/user', function() {

	var expect = require('chai').expect
	var mongoose = require('mongoose')
	var mockgoose = require('mockgoose')
	var User

	mockgoose(mongoose)

	afterEach(function(done) {
		mockgoose.reset()
		done()
	})

	describe('Given a user', function() {

		var email = 'ian@ian.com'
		var user

		beforeEach(function(done) {
			User.create({
				email: email,
				password: 'abcde',
			}, function(err, _user_) {
				user = _user_
				done()
			})
		})

		describe('When a user account is created', function() {

		})
	})

})