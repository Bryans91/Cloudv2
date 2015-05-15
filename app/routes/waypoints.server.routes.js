'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var waypoints = require('../../app/controllers/waypoints.server.controller');

	// Waypoints Routes
	app.route('/waypoints')
		.get(waypoints.list)
		.post(users.requiresLogin, waypoints.create);

	app.route('/waypoints/:waypointId')
		.get(waypoints.read)
		.put(users.requiresLogin, waypoints.hasAuthorization, waypoints.update)
		.delete(users.requiresLogin, waypoints.hasAuthorization, waypoints.delete);

	// Finish by binding the Waypoint middleware
	app.param('waypointId', waypoints.waypointByID);
};
