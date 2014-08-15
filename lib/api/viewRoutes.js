var _               = require('lodash');
var config          = require('../common/config');
var logger          = require('../common/logger')(module);
var server          = require('./server');
var Q                = require('q');
var auth			= require('../auth/auth');
var votesRepository = require('../data/votesRepository');

var defaultContext = {

};

var closableServer = null;

server.get('/', function(req, res){
	var dest = req.user ? '/home' : '/login';
	res.redirect(dest);
});

server.get('/home', auth.ensureAuthenticated, function(req, res){
	res.render('home', _.merge(defaultContext, { user: req.user }));
	}
);

server.get('/vote', auth.ensureAuthenticated, function(req, res){
	res.render('vote', _.merge(defaultContext, { user: req.user }));
	}
);

server.get('/results', function(req, res) {
	votesRepository.listVotes({}).then(function(votes){
		console.log("VOTES VOTES");
		console.log(votes);
		var votesContext = {votes: votes};
		var extraContext = _.merge(votesContext, {user: req.user});
		res.render('results', _.merge(defaultContext, extraContext));
	});
});