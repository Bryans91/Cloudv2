'use strict';

//Waypoints service used to communicate Waypoints REST endpoints
angular.module('waypoints').factory('Waypoints', ['$resource',
	function($resource) {
		return $resource('waypoints/:waypointId', { waypointId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);