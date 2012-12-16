﻿var assert = require('assert');
var express = require("express");
var supertest = require('supertest');
var moment = require('moment');
var async = require('async');
var atpl = require('../lib/atpl');
var app = express();

app.engine('html', atpl.__express);
app.set('devel', false);
app.set('view engine', 'html');
app.set('view cache', true);
app.set('views', __dirname + '/../test/templates');

var AtplExtension;
AtplExtension = {
	functions: (function () {
		function functions() { }
		functions.hashByDate = function hashByDate(count) {
			var index = Math.round(new Date(2012, 0, 1).getTime() / (1000 * 3600 * 24));
			index += 3;
			return ((index) % (count)) + 1;
		}
		return functions;
	})()
};

atpl.registerExtension(AtplExtension);

app.get('/simple', function(req, res) {
	res.render('simple', { name : 'Test' });
});

app.get('/extension', function (req, res) {
	res.render('extension', {});
});

var test = supertest(app);

describe('app', function() {
	it('simple should work', function(done) {
		test
			.get('/simple')
			.end(function(err, res) {
				assert.equal(res.text, 'Hello Test!');
				done();
			})
		;
	});

	it('extension should work', function (done) {
		test
			.get('/extension')
			.end(function (err, res) {
				assert.equal(res.text, '4');
				done();
			})
		;
	});
});