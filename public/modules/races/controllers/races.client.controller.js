'use strict';

// Races controller
angular.module('races').controller('RacesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Races',
	function($scope, $stateParams, $location, Authentication, Races) {
		$scope.authentication = Authentication;

		// Create new Race
		$scope.create = function() {
			// Create new Race object
			var race = new Races ({
				name: this.name
			});

			// Redirect after save
			race.$save(function(response) {
				$location.path('races/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Race
		$scope.remove = function(race) {
			if ( race ) { 
				race.$remove();

				for (var i in $scope.races) {
					if ($scope.races [i] === race) {
						$scope.races.splice(i, 1);
					}
				}
			} else {
				$scope.race.$remove(function() {
					$location.path('races');
				});
			}
		};

		// Update existing Race
		$scope.update = function() {
			var race = $scope.race;

			race.$update(function() {
				$location.path('races/' + race._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Races
		$scope.find = function() {
			$scope.races = Races.query();
		};

		// Find existing Race
		$scope.findOne = function() {
			$scope.race = Races.get({ 
				raceId: $stateParams.raceId
			});
		};
	}
]);