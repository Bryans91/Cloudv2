'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Waypoint = mongoose.model('Waypoint'),
	_ = require('lodash');

/**
 * Create a Waypoint
 */
exports.create = function(req, res) {
	var waypoint = new Waypoint(req.body);
	waypoint.user = req.user;

	waypoint.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(waypoint);
		}
	});
};

/**
 * Show the current Waypoint
 */
exports.read = function(req, res) {
	res.jsonp(req.waypoint);
};

/**
 * Update a Waypoint
 */
exports.update = function(req, res) {
	var waypoint = req.waypoint ;

	waypoint = _.extend(waypoint , req.body);

	waypoint.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(waypoint);
		}
	});
};

/**
 * Delete an Waypoint
 */
exports.delete = function(req, res) {
	var waypoint = req.waypoint ;

	waypoint.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(waypoint);
		}
	});
};

/**
 * List of Waypoints
 */
exports.list = function(req, res) { 
	Waypoint.find().sort('-created').populate('user', 'displayName').exec(function(err, waypoints) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(waypoints);
		}
	});
};

/**
 * Waypoint middleware
 */
exports.waypointByID = function(req, res, next, id) { 
	Waypoint.findById(id).populate('user', 'displayName').exec(function(err, waypoint) {
		if (err) return next(err);
		if (! waypoint) return next(new Error('Failed to load Waypoint ' + id));
		req.waypoint = waypoint ;
		next();
	});
};

/**
 * Waypoint authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.waypoint.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
