'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Race = mongoose.model('Race'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, race;

/**
 * Race routes tests
 */
describe('Race CRUD tests', function() {
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

		// Save a user to the test db and create new Race
		user.save(function() {
			race = {
				name: 'Race Name'
			};

			done();
		});
	});

	it('should be able to save Race instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Race
				agent.post('/races')
					.send(race)
					.expect(200)
					.end(function(raceSaveErr, raceSaveRes) {
						// Handle Race save error
						if (raceSaveErr) done(raceSaveErr);

						// Get a list of Races
						agent.get('/races')
							.end(function(racesGetErr, racesGetRes) {
								// Handle Race save error
								if (racesGetErr) done(racesGetErr);

								// Get Races list
								var races = racesGetRes.body;

								// Set assertions
								(races[0].user._id).should.equal(userId);
								(races[0].name).should.match('Race Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Race instance if not logged in', function(done) {
		agent.post('/races')
			.send(race)
			.expect(401)
			.end(function(raceSaveErr, raceSaveRes) {
				// Call the assertion callback
				done(raceSaveErr);
			});
	});

	it('should not be able to save Race instance if no name is provided', function(done) {
		// Invalidate name field
		race.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Race
				agent.post('/races')
					.send(race)
					.expect(400)
					.end(function(raceSaveErr, raceSaveRes) {
						// Set message assertion
						(raceSaveRes.body.message).should.match('Please fill Race name');
						
						// Handle Race save error
						done(raceSaveErr);
					});
			});
	});

	it('should be able to update Race instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Race
				agent.post('/races')
					.send(race)
					.expect(200)
					.end(function(raceSaveErr, raceSaveRes) {
						// Handle Race save error
						if (raceSaveErr) done(raceSaveErr);

						// Update Race name
						race.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Race
						agent.put('/races/' + raceSaveRes.body._id)
							.send(race)
							.expect(200)
							.end(function(raceUpdateErr, raceUpdateRes) {
								// Handle Race update error
								if (raceUpdateErr) done(raceUpdateErr);

								// Set assertions
								(raceUpdateRes.body._id).should.equal(raceSaveRes.body._id);
								(raceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Races if not signed in', function(done) {
		// Create new Race model instance
		var raceObj = new Race(race);

		// Save the Race
		raceObj.save(function() {
			// Request Races
			request(app).get('/races')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Race if not signed in', function(done) {
		// Create new Race model instance
		var raceObj = new Race(race);

		// Save the Race
		raceObj.save(function() {
			request(app).get('/races/' + raceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', race.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Race instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Race
				agent.post('/races')
					.send(race)
					.expect(200)
					.end(function(raceSaveErr, raceSaveRes) {
						// Handle Race save error
						if (raceSaveErr) done(raceSaveErr);

						// Delete existing Race
						agent.delete('/races/' + raceSaveRes.body._id)
							.send(race)
							.expect(200)
							.end(function(raceDeleteErr, raceDeleteRes) {
								// Handle Race error error
								if (raceDeleteErr) done(raceDeleteErr);

								// Set assertions
								(raceDeleteRes.body._id).should.equal(raceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Race instance if not signed in', function(done) {
		// Set Race user 
		race.user = user;

		// Create new Race model instance
		var raceObj = new Race(race);

		// Save the Race
		raceObj.save(function() {
			// Try deleting Race
			request(app).delete('/races/' + raceObj._id)
			.expect(401)
			.end(function(raceDeleteErr, raceDeleteRes) {
				// Set message assertion
				(raceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Race error error
				done(raceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Race.remove().exec();
		done();
	});
});