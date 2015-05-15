'use strict';

// Waypoints controller
angular.module('waypoints').controller('WaypointsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Waypoints',
	function($scope, $stateParams, $location, Authentication, Waypoints) {
		$scope.authentication = Authentication;

		// Create new Waypoint
		$scope.create = function() {
			// Create new Waypoint object
			var waypoint = new Waypoints ({
				name: this.name
			});

			// Redirect after save
			waypoint.$save(function(response) {
				$location.path('waypoints/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Waypoint
		$scope.remove = function(waypoint) {
			if ( waypoint ) { 
				waypoint.$remove();

				for (var i in $scope.waypoints) {
					if ($scope.waypoints [i] === waypoint) {
						$scope.waypoints.splice(i, 1);
					}
				}
			} else {
				$scope.waypoint.$remove(function() {
					$location.path('waypoints');
				});
			}
		};

		// Update existing Waypoint
		$scope.update = function() {
			var waypoint = $scope.waypoint;

			waypoint.$update(function() {
				$location.path('waypoints/' + waypoint._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Waypoints
		$scope.find = function() {
			$scope.waypoints = Waypoints.query();
		};

		// Find existing Waypoint
		$scope.findOne = function() {
			$scope.waypoint = Waypoints.get({ 
				waypointId: $stateParams.waypointId
			});
		};
	}
]);