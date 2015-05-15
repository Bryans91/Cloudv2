'use strict';

//Setting up route
angular.module('waypoints').config(['$stateProvider',
	function($stateProvider) {
		// Waypoints state routing
		$stateProvider.
		state('listWaypoints', {
			url: '/waypoints',
			templateUrl: 'modules/waypoints/views/list-waypoints.client.view.html'
		}).
		state('createWaypoint', {
			url: '/waypoints/create',
			templateUrl: 'modules/waypoints/views/create-waypoint.client.view.html'
		}).
		state('viewWaypoint', {
			url: '/waypoints/:waypointId',
			templateUrl: 'modules/waypoints/views/view-waypoint.client.view.html'
		}).
		state('editWaypoint', {
			url: '/waypoints/:waypointId/edit',
			templateUrl: 'modules/waypoints/views/edit-waypoint.client.view.html'
		});
	}
]);