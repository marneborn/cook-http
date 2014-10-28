var LocalStrategy = require('passport-local').Strategy;
var log           = require('npmlog');

module.exports = function (passport, userDB, config) {
	passport.use(new LocalStrategy(
			function(username, password, done) {
				User.findOne({ username: username }, function (err, user) {
					if (err) { return done(err); }
					if (!user) { return done(null, false); }
					if (!user.verifyPassword(password)) { return done(null, false); }
					return done(null, user);
				});
			}
	));
))

