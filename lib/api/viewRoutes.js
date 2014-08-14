var _               = require('lodash');
var config          = require('../common/config');
var logger          = require('../common/logger')(module);
var server          = require('./server');
var Q                = require('q');

var defaultContext = {
};

var closableServer = null;

server.get('/', function(req, res){
	res.redirect(server.mountPath + 'hello');
});

server.get('/hello', function(req, res){
	res.render('hello', defaultContext);
});