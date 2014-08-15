var bodyParser     = require('body-parser');
var config         = require('../common/config');
var express        = require('express');
var hbs            = require('hbs');
var hbs_json       = require('hbs-json');
var lessMiddleware = require('less-middleware');
var passport       = require('passport');
var path           = require('path');
var Q              = require('q');
var rootLogger     = require('../common/logger');
var GoogleStrategy = require('passport-google').Strategy;
var url            = require('url');

var server = module.exports = express();
var logger         = rootLogger(module);
var mountPath      = server.mountPath = url.parse(config.httpServer.baseUrl).pathname.replace(/([^\/])\/+$/, '$1');
var publicDir      = path.join(__dirname, '../../public');

var rootLogger       = require('../common/logger');
var serverLogger   = rootLogger().child({ module: 'express' });
serverLogger.level("warn");

server.set   ('port', config.httpServer.port);
server.set   ('json spaces', 0);
server.set   ('views', path.join(__dirname, '../../views'));
server.set   ('view engine', 'html');
server.engine('html', hbs.__express);
server.use(express.cookieParser());
server.use   (express.session({ secret: 'alagubeerandbeeralagu'}));
server.use   (mountPath, passport.initialize());
server.use   (mountPath, passport.session());
server.use   (mountPath, lessMiddleware({ src: publicDir }));
server.use   (mountPath, express.static(publicDir));
server.use   (bodyParser.json());
server.use   (bodyParser.urlencoded());
server.use   (mountPath, server.router);

require('./routes');

server.start = function(){
	var deferred = Q.defer();
	var port = server.get('port');

	closableServer = server.listen(port, deferred.makeNodeResolver());

	closableServer.once('error', deferred.reject);

	return deferred.promise
		.then(function(){
				var address = closableServer.address();
				logger.info("Listening on http://%s:%d%s", address.address, address.port, mountPath);
			},
			function(err){ 
				if(err.code == 'EACCES'){
					logger.error("No access to port "+port);
				} else if(err.code == 'EADDRINUSE'){
					logger.error("Port "+port+" already in use.");
				} else {
					logger.error("Error starting server: "+err.message); 
				}
				throw err;
			});
};

server.shutdown = function(){
	var deferred = Q.defer();
	if(closableServer){
		try {
			closableServer.close(function(err){
				if(err != null){
					logger.error("Unable to close: %s", err);
					deferred.reject(err);
				} else {
					logger.info("Shut down.");
					deferred.resolve();
				}
				closableServer = null;
			});
		} catch (e){
			logger.error(e);
			deferred.reject(e);
		}
	} else {
		logger.info("Shut down.");
		deferred.resolve();
	}
	return deferred.promise;
};