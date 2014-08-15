var db     = require('../data/db');
var Q      = require('q');
var logger = require('../common/logger')(module);
var _      = require('lodash');

var teamsCollection = db.collection('teams');

module.exports = {
	createTeam: createTeam,
	deleteTeam: deleteTeam,
	findTeam: findTeam,
	setTeamName: setTeamName,
};

function createTeam(team){
}

function deleteTeam(){
}

function findTeam(){
}

function setTeamName(){
}

