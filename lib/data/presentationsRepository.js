var db     = require('../data/db');
var Q      = require('q');
var logger = require('../common/logger')(module);
var _      = require('lodash');

var DEFAULT_SORT = [["order", 1]];

var presentationsCollection = db.collection('presentations');
// votesCollection.ensureIndex({ screen_name: 1 }, { w: 0 });
// votesCollection.ensureIndex({ date: 1 }, { w: 0 });

module.exports = {
	listPresentations: listPresentations,
	save: save
};

/**
 * @param opts
 *  - sort: order of results, by default [['date', -1]]
 *  - limit: return at most this many results, by default 144
 *  any other options will be used as search criteria
 */
function listPresentations(opts){
	var sort = opts.sort || DEFAULT_SORT;
	var limit = opts.limit || 999;

	var criteria = {};
	return Q.ninvoke(presentationsCollection, "find", criteria, { limit: 5000, sort: sort })
		.then(function(cursor){
			return Q.ninvoke(cursor, "toArray");
		}).then(function(presentations){
			return _.sortBy(presentations, "order");
		});
}

/**
 * @param tweets Object or Array
 */
function save(presentations){
	console.log(presentations);
	return Q.ninvoke(presentationsCollection, "remove", {})
		.then(function(){
			console.log("inserting");
			return Q.ninvoke(presentationsCollection, "insert", presentations);
		});	
}