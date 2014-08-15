var db     = require('../data/db');
var Q      = require('q');
var logger = require('../common/logger')(module);
var _      = require('lodash');

var teamsCollection = db.collection('teams');

var DEFAULT_SORT = [["name", 1]];

module.exports = {
	saveTeams: saveTeams,
	saveTeamByID: saveTeamByID,
	removeTeamByID: removeTeamByID,
	getTeamByID: getTeamByID,
	listTeams: listTeams,
};

/*
 * @param teams
 */
function saveTeams(teams){
        console.log(teams);
        return Q.ninvoke(teamsCollection, "remove", {})
                .then(function(){
                        console.log("inserting");
                        return Q.ninvoke(teamsCollection, "insert", teams);
                });
}

/*
 * @param id, team
 */
function saveTeamByID(id, team){
        return Q.ninvoke(teamsCollection, "update", { _id: id }, team);
}

/*
 * @param id
 */
function removeTeamByID(id){
        return Q.ninvoke(teamsCollection, "remove", { _id: id });
}

/*
 * @param id
 */
function getTeamByID(id){
        return Q.ninvoke(teamsCollection, "findOne", { _id: id })
                .then(function(cursor){
                        return Q.ninvoke(cursor, "toArray");
                });
}

/*
 * @param opts
 */
function listTeams(opts){
        var sort = opts.sort || DEFAULT_SORT;
        var limit = opts.limit || 999;

        var criteria = {};
        return Q.ninvoke(teamsCollection, "find", criteria, { limit: limit, sort: sort })
                .then(function(cursor){
                        return Q.ninvoke(cursor, "toArray");
                }).then(function(teams){
                        return _.sortBy(teams, "name");
                });
}

