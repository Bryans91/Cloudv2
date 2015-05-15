'use strict';

//Races service used to communicate Races REST endpoints
angular.module('races').factory('Races', ['$resource',
	function($resource) {
		return $resource('races/:raceId', { raceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);