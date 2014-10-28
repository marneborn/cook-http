var passport       = require('passport');

var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var RedisStore     = require('connect-redis')(session);
var log            = require('npmlog');

var redisClient = require('redis').createClient()
.on('ready', function()    { log.info ('REDIS', 'ready'); })
.on('error', function(err) { log.error('REDIS', err.message); });

module.exports = function (app, config) {

	app
	.use(cookieParser())
	.use(session({
		secret: config.session.secret,
		resave: true,
		saveUninitialized : true,
		store: new RedisStore({ client: redisClient })
	}))
	.use(passport.initialize())
	.use(passport.session());
	
	app.use( function (req, res, next) {
		console.log("--session--\n"+JSON.stringify(req.session));
		next();
	})
	
	passport.serializeUser(function(user, done) {
		console.log("-- user --\n"+JSON.stringify(user, null, 4));
		done(null, user.identifier);
	});

	passport.deserializeUser(function(id, done) {
		done(null, { identifier: id });
	});
	
	require('./google')(passport, config);
	require('./local' )(passport, config);
		
	app.get('/foo', function (req, res) { res.status(200).send('foo'); });

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// return an 'authorized' middleware
	return function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else if (redisClient.ready) {
			res.json(403, {
				error : "forbidden",
				reason: "not_authenticated"
			});
		} else {
			res.json(503, {
				error : "service_unavailable",
				reason: "authentication_unavailable"
			});
		}
	};
};
