'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Race = mongoose.model('Race'),
	_ = require('lodash');

/**
 * Create a Race
 */
exports.create = function(req, res) {
	var race = new Race(req.body);
	race.user = req.user;

	race.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(race);
		}
	});
};

/**
 * Show the current Race
 */
exports.read = function(req, res) {
	res.jsonp(req.race);
};

/**
 * Update a Race
 */
exports.update = function(req, res) {
	var race = req.race ;

	race = _.extend(race , req.body);

	race.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(race);
		}
	});
};

/**
 * Delete an Race
 */
exports.delete = function(req, res) {
	var race = req.race ;

	race.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(race);
		}
	});
};

/**
 * List of Races
 */
exports.list = function(req, res) {
	Race.find().sort('-created').populate('user', 'displayName').exec(function(err, races) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(races);
		}
	});
};

/**
 * Race middleware
 */
exports.raceByID = function(req, res, next, id) {
	Race.findById(id).populate('user', 'displayName').exec(function(err, race) {
		if (err) return next(err);
		if (! race) return next(new Error('Failed to load Race ' + id));
		req.race = race ;
		next();
	});
};

/**
 * Race authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.race.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
