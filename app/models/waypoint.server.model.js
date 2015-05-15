'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Waypoint Schema
 */
var WaypointSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Waypoint name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	placesId: {
		type: String,
		default: ''
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	participants: [{
		type: Schema.ObjectId,
		ref: 'User'
		}]
});

mongoose.model('Waypoint', WaypointSchema);