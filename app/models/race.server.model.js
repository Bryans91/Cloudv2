'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Race Schema
 */
var RaceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Race name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	participants: [{
		type: Schema.ObjectId,
		ref: 'User'
		}],
	waypoints: [{
		type: Schema.ObjectId,
		ref: 'Waypoint'
	}]	
});

mongoose.model('Race', RaceSchema);