var _               = require('lodash');
var config          = require('../common/config');
var logger          = require('../common/logger')(module);
var server          = require('../api/server');
var Q                = require('q');
var passport         = require('passport');

var defaultContext = {
};

var closableServer = null;

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this serverlication at /auth/google/return
server.get('/login', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
server.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

server.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});