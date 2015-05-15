'use strict';

(function() {
	// Waypoints Controller Spec
	describe('Waypoints Controller Tests', function() {
		// Initialize global variables
		var WaypointsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Waypoints controller.
			WaypointsController = $controller('WaypointsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Waypoint object fetched from XHR', inject(function(Waypoints) {
			// Create sample Waypoint using the Waypoints service
			var sampleWaypoint = new Waypoints({
				name: 'New Waypoint'
			});

			// Create a sample Waypoints array that includes the new Waypoint
			var sampleWaypoints = [sampleWaypoint];

			// Set GET response
			$httpBackend.expectGET('waypoints').respond(sampleWaypoints);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.waypoints).toEqualData(sampleWaypoints);
		}));

		it('$scope.findOne() should create an array with one Waypoint object fetched from XHR using a waypointId URL parameter', inject(function(Waypoints) {
			// Define a sample Waypoint object
			var sampleWaypoint = new Waypoints({
				name: 'New Waypoint'
			});

			// Set the URL parameter
			$stateParams.waypointId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/waypoints\/([0-9a-fA-F]{24})$/).respond(sampleWaypoint);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.waypoint).toEqualData(sampleWaypoint);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Waypoints) {
			// Create a sample Waypoint object
			var sampleWaypointPostData = new Waypoints({
				name: 'New Waypoint'
			});

			// Create a sample Waypoint response
			var sampleWaypointResponse = new Waypoints({
				_id: '525cf20451979dea2c000001',
				name: 'New Waypoint'
			});

			// Fixture mock form input values
			scope.name = 'New Waypoint';

			// Set POST response
			$httpBackend.expectPOST('waypoints', sampleWaypointPostData).respond(sampleWaypointResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Waypoint was created
			expect($location.path()).toBe('/waypoints/' + sampleWaypointResponse._id);
		}));

		it('$scope.update() should update a valid Waypoint', inject(function(Waypoints) {
			// Define a sample Waypoint put data
			var sampleWaypointPutData = new Waypoints({
				_id: '525cf20451979dea2c000001',
				name: 'New Waypoint'
			});

			// Mock Waypoint in scope
			scope.waypoint = sampleWaypointPutData;

			// Set PUT response
			$httpBackend.expectPUT(/waypoints\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/waypoints/' + sampleWaypointPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid waypointId and remove the Waypoint from the scope', inject(function(Waypoints) {
			// Create new Waypoint object
			var sampleWaypoint = new Waypoints({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Waypoints array and include the Waypoint
			scope.waypoints = [sampleWaypoint];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/waypoints\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWaypoint);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.waypoints.length).toBe(0);
		}));
	});
}());