var _               = require('lodash');
var auth            = require('../auth/auth');
var logger          = require('../common/logger')(module);
var server          = require('./server');
var votesRepository		= require('../data/votesRepository');

var api = server.apiRouter;

api.get('/votes', function(req, res, next) {
	votesRepository.listVotes({})
		.then(function(votes) {
			res.send(votes);
		})
		.fail(next);
});

/* {
	"email": "luke@lukema.net",
	"votes": [{
		"email" : "luke@lukema.net",
		"teamId" : 5
	}]
}*/
api.post('/votes', function(req, res, next){
	var email = req.body.email;
	var votes = req.body.votes;
	votesRepository.removeVotesByEmail(email)
		.then(function(){
			return votesRepository.save(votes);
		})
		.then(function(){
			res.send(204);
		})
		.fail(next);
});