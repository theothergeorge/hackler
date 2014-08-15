var db     = require('../data/db');
var Q      = require('q');
var logger = require('../common/logger')(module);
var _      = require('lodash');
var teamsRepository = require('./teamsRepository');

var DEFAULT_SORT = [["email", -1]];

var votesCollection = db.collection('votes');
// votesCollection.ensureIndex({ screen_name: 1 }, { w: 0 });
// votesCollection.ensureIndex({ date: 1 }, { w: 0 });

module.exports = {
	listVotes: listVotes,
	removeVotesByEmail: removeVotesByEmail,
	save: save
};

/**
 * @param opts
 *  - sort: order of results, by default [['date', -1]]
 *  - limit: return at most this many results, by default 144
 *  any other options will be used as search criteria
 */
function listVotes(opts){
	var sort = opts.sort || DEFAULT_SORT;
	var limit = opts.limit || 999;

	var criteria = {};
	return Q.ninvoke(votesCollection, "find", criteria, { limit: limit, sort: sort })
		.then(function(cursor){
			return Q.ninvoke(cursor, "toArray");
		}).then(function(votes){
			var allVotes = votes;
			return teamsRepository.listTeams({}).then(function(teams){
				// TODO: get team names
				// add all votes for a particular team
				var retVotes = {};
				_.each(allVotes, function(vote) {
					var voteObj = retVotes[vote.teamId];
					if (voteObj) {
						voteObj.votes = voteObj.votes + 1;
					} else {
						retVotes[vote.teamId] = {};
						retVotes[vote.teamId]['id'] = vote.teamId;
						retVotes[vote.teamId]['votes'] = 1;
						retVotes[vote.teamId]['name'] = _.find(teams, function(team){
							return parseInt(team.teamId) == parseInt(vote.teamId)
						}).name;
					}
				});
				return retVotes;
			});

		});
}

function removeVotesByEmail(email){
	return Q.ninvoke(votesCollection, "remove", { email: email });
}

/**
 * @param tweets Object or Array
 */
function save(votes){
	return Q.ninvoke(votesCollection, "insert", votes);
}