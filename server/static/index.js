var express   = require('express');
var path      = require('path');
var favicon   = require('serve-favicon');
var log       = require('npmlog');

log.info("Setting up routes");

module.exports = function (app, config ) {
	app
	.use( express.static( path.resolve(config.ROOT_DIR, 'webApp') ) )
	.use( favicon(path.resolve(config.ROOT_DIR, 'webApp', 'favicon.ico') ) )
	.use( send404 )
	.use( function ( err, req, res, next ) {
		console.error("Error: "+err);
	});
};

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

