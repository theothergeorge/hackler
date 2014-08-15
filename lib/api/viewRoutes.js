var _               = require('lodash');
var config          = require('../common/config');
var logger          = require('../common/logger')(module);
var server          = require('./server');
var Q                = require('q');
var auth			= require('../auth/auth');

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