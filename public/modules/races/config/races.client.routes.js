'use strict';

//Setting up route
angular.module('races').config(['$stateProvider',
	function($stateProvider) {
		// Races state routing
		$stateProvider.
		state('listRaces', {
			url: '/races',
			templateUrl: 'modules/races/views/list-races.client.view.html'
		}).
		state('createRace', {
			url: '/races/create',
			templateUrl: 'modules/races/views/create-race.client.view.html'
		}).
		state('viewRace', {
			url: '/races/:raceId',
			templateUrl: 'modules/races/views/view-race.client.view.html'
		}).
		state('editRace', {
			url: '/races/:raceId/edit',
			templateUrl: 'modules/races/views/edit-race.client.view.html'
		});
	}
]);