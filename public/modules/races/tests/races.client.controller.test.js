'use strict';

(function() {
	// Races Controller Spec
	describe('Races Controller Tests', function() {
		// Initialize global variables
		var RacesController,
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

			// Initialize the Races controller.
			RacesController = $controller('RacesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Race object fetched from XHR', inject(function(Races) {
			// Create sample Race using the Races service
			var sampleRace = new Races({
				name: 'New Race'
			});

			// Create a sample Races array that includes the new Race
			var sampleRaces = [sampleRace];

			// Set GET response
			$httpBackend.expectGET('races').respond(sampleRaces);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.races).toEqualData(sampleRaces);
		}));

		it('$scope.findOne() should create an array with one Race object fetched from XHR using a raceId URL parameter', inject(function(Races) {
			// Define a sample Race object
			var sampleRace = new Races({
				name: 'New Race'
			});

			// Set the URL parameter
			$stateParams.raceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/races\/([0-9a-fA-F]{24})$/).respond(sampleRace);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.race).toEqualData(sampleRace);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Races) {
			// Create a sample Race object
			var sampleRacePostData = new Races({
				name: 'New Race'
			});

			// Create a sample Race response
			var sampleRaceResponse = new Races({
				_id: '525cf20451979dea2c000001',
				name: 'New Race'
			});

			// Fixture mock form input values
			scope.name = 'New Race';

			// Set POST response
			$httpBackend.expectPOST('races', sampleRacePostData).respond(sampleRaceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Race was created
			expect($location.path()).toBe('/races/' + sampleRaceResponse._id);
		}));

		it('$scope.update() should update a valid Race', inject(function(Races) {
			// Define a sample Race put data
			var sampleRacePutData = new Races({
				_id: '525cf20451979dea2c000001',
				name: 'New Race'
			});

			// Mock Race in scope
			scope.race = sampleRacePutData;

			// Set PUT response
			$httpBackend.expectPUT(/races\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/races/' + sampleRacePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid raceId and remove the Race from the scope', inject(function(Races) {
			// Create new Race object
			var sampleRace = new Races({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Races array and include the Race
			scope.races = [sampleRace];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/races\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRace);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.races.length).toBe(0);
		}));
	});
}());