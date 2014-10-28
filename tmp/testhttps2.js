'use strict';
var fs      = require('fs');
var http    = require('http');
var https   = require('https');
var express = require('express');

// generic setup
var app = express()
.disable('etag')
.use( function ( req, res, next ) {
    console.log('express');
    req.myStart = new Date();
    next();
})
.put('/testajax', function ( req, res ) {
    res.status(200).send(Array(100000).join('y'));
    res.end();
    console.log(">> "+(new Date() - req.myStart)/1000);
})
.use( express.static( './web-app' ))

var httpServer  = http
.createServer(app)
.listen(5080, function () {
    console.log('listening http on: ' +httpServer.address().port);
})
.on('request', function (req) {
    console.log('listener');
    req.onStart = new Date();
});

var httpsServer = https
.createServer(
    {
	key  : fs.readFileSync('ssl/server.key', 'utf8'),
	cert : fs.readFileSync('ssl/server.crt', 'utf8')
    },
    app
)
.listen(5880, function () {
    console.log('listening https on: '+httpsServer.address().port);
})
.on('request', function (req) {
    console.log('listener');
    req.onStart = new Date();
});



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

