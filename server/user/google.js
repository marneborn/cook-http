var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var log            = require('npmlog');

module.exports = function (passport, config) {
	console.log(">> "+"http://"+config.server.host+":"+config.server.httpPort+"/auth/google/callback")
	passport.use(new GoogleStrategy(
			{
				clientID     : config.google.client_id,
				clientSecret : config.google.client_secret,
				callbackURL  : "http://"+config.server.host+":"+config.server.httpPort+"/auth/google/callback"
			},
			function(accessToken, refreshToken, profile, done) {
				console.log("--profile--\n"+JSON.stringify(profile, null, 4));
				// asynchronous verification, for effect...
				process.nextTick(function () {

					// To keep the example simple, the user's Google profile is returned to
					// represent the logged-in user.  In a typical application, you would want
					// to associate the Google account with a user record in your database,
					// and return that user instead.
					return done(null, profile);
				});
			}
	));

//	GET /auth/google
//	Use passport.authenticate() as route middleware to authenticate the
//	request.  The first step in Google authentication will involve
//	redirecting the user to google.com.  After authorization, Google
//	will redirect the user back to this application at /auth/google/callback
	app.get('/auth/google',
			passport.authenticate('google', {
				scope: [
				        'https://www.googleapis.com/auth/userinfo.profile',
				        'https://www.googleapis.com/auth/userinfo.email'
				        ]
			}),
			function (req, res) {
		// The request will be redirected to Google for authentication, so this
		// function will not be called.
	});

//	GET /auth/google/callback
//	Use passport.authenticate() as route middleware to authenticate the
//	request.  If authentication fails, the user will be redirected back to the
//	login page.  Otherwise, the primary route function function will be called,
//	which, in this example, will redirect the user to the home page.
	app.get(
			'/auth/google/callback', 
			passport.authenticate('google', { failureRedirect: '/login' }),
			function(req, res) {
				console.log('in google/callback')
				res.redirect('/');
			}
	);
