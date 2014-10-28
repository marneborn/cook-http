var cookieParser = require('cookie-parser');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var log          = require('npmlog');

log.info("Setting up session stuff");

var redisClient = require('redis').createClient()
.on('ready', function()    { log.info ('REDIS', 'ready'); })
.on('error', function(err) { log.error('REDIS', err.message); });

module.exports = function (app, config) {
	app
	.use(cookieParser())
	.use(session({
		secret: config.sessionSecret,
		resave: true,
		saveUninitialized : true,
		store: new RedisStore({ client: redisClient })
	}));
};