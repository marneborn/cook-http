var express = require('express')
, path = require('path')
, passport = require('passport')
, util = require('util')
, logger       = require('morgan')
, cookieParser = require('cookie-parser')
, session      = require('express-session')
, bodyParser   = require('body-parser')
, methodOverride = require('method-override')
, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//API Access link for creating client ID and secret:
//https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = "786732306424-vd674755dnughpmlo0slkve4o48ejb71.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "gr7G7-BY-DF3aFFVGuBWwYJB";


//Passport session setup.
//To support persistent login sessions, Passport needs to be able to
//serialize users into and deserialize users out of the session.  Typically,
//this will be as simple as storing the user ID when serializing, and finding
//the user by ID when deserializing.  However, since this example does not
//have a database of user records, the complete Google profile is
//serialized and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


//Use the GoogleStrategy within Passport.
//Strategies in Passport require a `verify` function, which accept
//credentials (in this case, an accessToken, refreshToken, and Google
//profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:5080/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
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

var app = express();

//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: false }) );
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave:true, saveUninitialized : true }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


//app.get('/', function(req, res){
//	res.render('index', { user: req.user });
//});

//app.get('/account', ensureAuthenticated, function(req, res){
//	res.render('account', { user: req.user });
//});

//app.get('/login', function(req, res){
//	res.render('login', { user: req.user });
//});

//GET /auth/google
//Use passport.authenticate() as route middleware to authenticate the
//request.  The first step in Google authentication will involve
//redirecting the user to google.com.  After authorization, Google
//will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
		                                          'https://www.googleapis.com/auth/userinfo.email'] }),
		                                          function(req, res){
	// The request will be redirected to Google for authentication, so this
	// function will not be called.
});

//GET /auth/google/callback
//Use passport.authenticate() as route middleware to authenticate the
//request.  If authentication fails, the user will be redirected back to the
//login page.  Otherwise, the primary route function function will be called,
//which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
		passport.authenticate('google', { failureRedirect: '/login' }),
		function(req, res) {
	res.redirect('/');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.use(express.static(path.resolve(__dirname, '..', 'webApp')));

app.listen(5080);


//Simple route middleware to ensure user is authenticated.
//Use this route middleware on any resource that needs to be protected.  If
//the request is authenticated (typically via a persistent login session),
//the request will proceed.  Otherwise, the user will be redirected to the
//login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}