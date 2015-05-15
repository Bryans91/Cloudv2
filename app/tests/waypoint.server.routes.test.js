'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Waypoint = mongoose.model('Waypoint'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, waypoint;

/**
 * Waypoint routes tests
 */
describe('Waypoint CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Waypoint
		user.save(function() {
			waypoint = {
				name: 'Waypoint Name'
			};

			done();
		});
	});

	it('should be able to save Waypoint instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Waypoint
				agent.post('/waypoints')
					.send(waypoint)
					.expect(200)
					.end(function(waypointSaveErr, waypointSaveRes) {
						// Handle Waypoint save error
						if (waypointSaveErr) done(waypointSaveErr);

						// Get a list of Waypoints
						agent.get('/waypoints')
							.end(function(waypointsGetErr, waypointsGetRes) {
								// Handle Waypoint save error
								if (waypointsGetErr) done(waypointsGetErr);

								// Get Waypoints list
								var waypoints = waypointsGetRes.body;

								// Set assertions
								(waypoints[0].user._id).should.equal(userId);
								(waypoints[0].name).should.match('Waypoint Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Waypoint instance if not logged in', function(done) {
		agent.post('/waypoints')
			.send(waypoint)
			.expect(401)
			.end(function(waypointSaveErr, waypointSaveRes) {
				// Call the assertion callback
				done(waypointSaveErr);
			});
	});

	it('should not be able to save Waypoint instance if no name is provided', function(done) {
		// Invalidate name field
		waypoint.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Waypoint
				agent.post('/waypoints')
					.send(waypoint)
					.expect(400)
					.end(function(waypointSaveErr, waypointSaveRes) {
						// Set message assertion
						(waypointSaveRes.body.message).should.match('Please fill Waypoint name');
						
						// Handle Waypoint save error
						done(waypointSaveErr);
					});
			});
	});

	it('should be able to update Waypoint instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Waypoint
				agent.post('/waypoints')
					.send(waypoint)
					.expect(200)
					.end(function(waypointSaveErr, waypointSaveRes) {
						// Handle Waypoint save error
						if (waypointSaveErr) done(waypointSaveErr);

						// Update Waypoint name
						waypoint.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Waypoint
						agent.put('/waypoints/' + waypointSaveRes.body._id)
							.send(waypoint)
							.expect(200)
							.end(function(waypointUpdateErr, waypointUpdateRes) {
								// Handle Waypoint update error
								if (waypointUpdateErr) done(waypointUpdateErr);

								// Set assertions
								(waypointUpdateRes.body._id).should.equal(waypointSaveRes.body._id);
								(waypointUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Waypoints if not signed in', function(done) {
		// Create new Waypoint model instance
		var waypointObj = new Waypoint(waypoint);

		// Save the Waypoint
		waypointObj.save(function() {
			// Request Waypoints
			request(app).get('/waypoints')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Waypoint if not signed in', function(done) {
		// Create new Waypoint model instance
		var waypointObj = new Waypoint(waypoint);

		// Save the Waypoint
		waypointObj.save(function() {
			request(app).get('/waypoints/' + waypointObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', waypoint.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Waypoint instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Waypoint
				agent.post('/waypoints')
					.send(waypoint)
					.expect(200)
					.end(function(waypointSaveErr, waypointSaveRes) {
						// Handle Waypoint save error
						if (waypointSaveErr) done(waypointSaveErr);

						// Delete existing Waypoint
						agent.delete('/waypoints/' + waypointSaveRes.body._id)
							.send(waypoint)
							.expect(200)
							.end(function(waypointDeleteErr, waypointDeleteRes) {
								// Handle Waypoint error error
								if (waypointDeleteErr) done(waypointDeleteErr);

								// Set assertions
								(waypointDeleteRes.body._id).should.equal(waypointSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Waypoint instance if not signed in', function(done) {
		// Set Waypoint user 
		waypoint.user = user;

		// Create new Waypoint model instance
		var waypointObj = new Waypoint(waypoint);

		// Save the Waypoint
		waypointObj.save(function() {
			// Try deleting Waypoint
			request(app).delete('/waypoints/' + waypointObj._id)
			.expect(401)
			.end(function(waypointDeleteErr, waypointDeleteRes) {
				// Set message assertion
				(waypointDeleteRes.body.message).should.match('User is not logged in');

				// Handle Waypoint error error
				done(waypointDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Waypoint.remove().exec();
		done();
	});
});