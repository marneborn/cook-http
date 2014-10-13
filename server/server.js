'use strict';

//generic utilities
var url          = require('url');
var util         = require('util');
var querystring  = require('querystring');
var Q            = require('q');
var extend       = require('extend');
var path         = require('path');
var log          = require('npmlog');

// express related stuff
var express      = require('express');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

// app specific stuff
var R            = require('../common/loadR.js');
var config       = require( '../common/config.js' );

log.info("Starting cook-http server");
log.level        = config.logLevel;

// generic setup
var app    = express()
.use( function ( req, res, next ) { next(); })
.set('http-port', Number(config.server.port || process.env.PORT) )
.use( favicon(path.resolve(config.ROOT_DIR, 'web-app', 'favicon.ico') ) )
.use( logRequests )
.use( logger('dev') )
.use( bodyParser.json() )
.use( bodyParser.urlencoded({ extended: false }) );

// session stuff
log.info("Setting up session stuff");
var redisClient = require('redis').createClient()
.on('ready', function()    { log.info('REDIS', 'ready'); })
.on('error', function(err) { log.error('REDIS', err.message); });
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
app
.use(cookieParser())
.use(session({
	secret: config.sessionSecret,
	resave: true,
	saveUninitialized : true,
	store: new RedisStore({ client: redisClient })
}));

// authentication via google
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
app
.use(passport.initialize())
.use(passport.session());
passport.serializeUser(function(user, done) {
	done(null, user.identifier);
})
passport.deserializeUser(function(id, done) {
	done(null, { identifier: id });
})
passport.use(new GoogleStrategy(
		{
			returnURL: 'http://localhost:5000/auth/google/return',
			realm: 'http://localhost:5000/'
		},
		function(identifier, profile, done) {
			profile.identifier = identifier;
			return done(null, profile);
		}
));
var authed = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else if (redisClient.ready) {
		res.json(403, {
			error: "forbidden",
			reason: "not_authenticated"
		});
	} else {
		res.json(503, {
			error: "service_unavailable",
			reason: "authentication_unavailable"
		});
	}
};

//test routing
app
.get('/api/user', authed, function(req, res){
	res.json(req.user);
})
.get('/api/:name', function(req, res) {
	res.status(200).json({ "hello": req.params.name });
})
.get('/auth/google/:return?',
		passport.authenticate('google', { successRedirect: '/' })
)
.get('/auth/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app
.get('/api/user/bundles', authed, function(req, res) {
	console.log(">>> "+req.user.identifier);
	return;
	var userURL = config.b4db + encodeURIComponent(req.user.identifier);
	request(userURL, function(err, couchRes, body) {
		if (err) {
			res.json(502, { error: "bad_gateway", reason: err.code });
		} else if (couchRes.statusCode === 200) {
			res.json(JSON.parse(body).bundles || {});
		} else {
			res.send(couchRes.statusCode, body);
		}
	});
});

// routing
log.info("Setting up routes");
app
.use( express.static( path.resolve(config.ROOT_DIR, 'web-app') ) )
//.use( express.static( path.resolve(config.ROOT_DIR, 'app/bower_components') ) )
//.use( require('./cookRequest') )
.use( send404 )
.use( function ( err, req, res, next ) {
	console.error("Error: "+err);
});

var server = app.listen(app.get('http-port'), function () {
	console.log('Listening on port %d', server.address().port);
});


//---------------------------------------------------------------------------
function logRequests (req, res, next) {
	console.log("URL: ", req.url, "Time: ", new Date().toJSON());
	next();
}

//---------------------------------------------------------------------------
function send404 (req, res, next) {

	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.sendFile( path.resolve(config.ROOT_DIR, 'app', '404.html') );
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
}

