var _              = require('lodash');
var config         = require('../common/config');
var GoogleStrategy = require('passport-google').Strategy;
var logger         = require('../common/logger')(module);
var passport       = require('passport');
var server         = require('../api/server');

module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.requireAdminUser = requireAdminUser;

passport.serializeUser(function(user, done){
	// logger.trace({ user: user }, "serializing user -> obj");
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	// logger.trace({ obj: obj }, "deserializing obj -> user");
	done(null, obj);
});

var GoogleOauthStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleOauthStrategy({
    clientID: "249199484190-igee9eei58eh1sghd6cmth05eomgqkfv.apps.googleusercontent.com",
    clientSecret: "4blsU1Lin7eE0wSgx4wTsqla",
    callbackURL: config.httpServer.baseUrl + "/auth/google/return"
  },
  function(token, tokenSecret, profile, done) {
    var email = profile.emails[0].value;
    //logger.trace( email );
    //logger.trace( profile );
    var user = {
        			fullname: profile.displayName,
                    email: email,
                    roles: {
                           		isAdmin : _.contains(config.auth.admins, email),
                           		isFromAllowedDomain : email && _.contains(config.auth.domains,email.split('@')[1])
                    }
   				};

    done(null, user);
  }
));

/*passport.use(new GoogleOauthStrategy({
    consumerKey: "bluejeansnet.com",
    consumerSecret: "y4FNh2ufRjQWBBgg8HvE8Jft",
    callbackURL: config.httpServer.baseUrl + "/auth/google/return"
  },
  function(token, tokenSecret, profile, done) {
		var email = profile.emails[0].value;
		var user = {
			fullname: profile.displayName,
			email: email,
			roles: {
				isAdmin: _.contains(config.auth.admins, email)
			}
		};

		done(null, user);
  }
));*/

/*passport.use(new GoogleStrategy({
		returnURL: config.httpServer.baseUrl + '/auth/google/return',
		realm: config.httpServer.baseUrl
	}, function(identifier, profile, done){
		// logger.trace({ identifier: identifier, profile: profile }, "verifying user");

		var email = profile.emails[0].value;
		var user = {
			fullname: profile.displayName,
			email: email,
			roles: {
				isAdmin: _.contains(config.auth.admins, email)
			},
			googleId: identifier
		};

		done(null, user);
	}));*/

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.roles.isFromAllowedDomain) { return next(); }
  res.redirect('/shouldLogin')
}

function requireAdminUser(req, res, next){
	var isAuthenticated = req.isAuthenticated() && req.user && req.user.roles.isFromAllowedDomain;
	var isAuthorized = isAuthenticated && req.user && req.user.roles.isAdmin;

	// logger.trace({ isAuthenticated: isAuthenticated, user: req.user }, "checking if %s is an admin with access to %s", req.user, req.path);

	if(!isAuthenticated){
		res.redirect('/shouldLogin');
	} else if(!isAuthorized){
		res.redirect('/home');
	} else {
		next();
	}
}
