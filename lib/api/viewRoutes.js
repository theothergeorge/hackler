var _               = require('lodash');
var config          = require('../common/config');
var logger          = require('../common/logger')(module);
var server          = require('./server');
var Q                = require('q');
var auth			= require('../auth/auth');
var votesRepository = require('../data/votesRepository');
var presentationsRepository = require('../data/presentationsRepository');
var teamsRepository = require('../data/teamsRepository');

var defaultContext = {

};

var closableServer = null;

server.get('/', function(req, res){
	var dest = req.user ? '/home' : '/shouldLogin';
	res.redirect(dest);
});

server.get('/shouldLogin', function(req, res){
	res.render('shouldLogin', _.merge(defaultContext, { user: req.user }));
});

server.get('/home', auth.ensureAuthenticated, function(req, res){
	res.render('home', _.merge(defaultContext, { user: req.user }));
	}
);

server.get('/vote', auth.ensureAuthenticated, function(req, res){
	teamsRepository.listTeams({}).then(function(teams){
		console.log(teams);
		var voteContext = {teams: teams};
		var extraContext = _.merge(voteContext, {user: req.user});
		res.render('vote', _.merge(defaultContext, extraContext));
	});
});

server.get('/results', auth.requireAdminUser, function(req, res) {
	votesRepository.listVotes({}).then(function(votes){
		var votesContext = {votes: votes};
		var extraContext = _.merge(votesContext, {user: req.user});
		res.render('results', _.merge(defaultContext, extraContext));
	});
});

server.get('/presentations', auth.requireAdminUser, function(req, res) {
	presentationsRepository.listPresentations({})
		.then(function(presentations){
			var allPresentations = presentations;
			return teamsRepository.listTeams({})
				.then(function(teams){
					var presentationsContext = {presentations: allPresentations};
					var teamsContext = {teams : teams};
					var extraContext = _.merge({}, presentationsContext, teamsContext);
					res.render('presentations', _.merge(defaultContext, extraContext));
				});
		})
});

server.get('/demos', auth.requireAdminUser, function(req, res) {
	presentationsRepository.listPresentations({})
		.then(function(presentations){
			var presentationsContext = {presentations: presentations};
			var extraContext = _.merge(presentationsContext, {user: req.user});
			res.render('demos', _.merge(defaultContext, extraContext));
		})
});

server.get('/schedule', function(req, res) {
	presentationsRepository.listPresentations({})
		.then(function(presentations){
			var presentationsContext = {presentations: presentations};
			var extraContext = _.merge(presentationsContext, {user: req.user});
			res.render('schedule', _.merge(defaultContext, extraContext));
		})
});