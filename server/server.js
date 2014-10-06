'use strict';

let express     = require('express');
let path        = require('path');
let url         = require('url');
let util        = require('util');
let querystring = require('querystring');
let Q           = require('q');

let config     = require('../config.json');
let R          = require('../common/loadR.js');
let protocols  = require('./protocols.js');
//let recipeDB   = require('./recipeDB/recipeDBMock.js');
let recipeDB   = require('./recipeDB/recipeDBMongo.js');

console.log("Starting...");

let port   = Number(process.env.PORT || config.localHerokuPort);
var app    = express();
var server = app.listen(port, function () {
	console.log('Listening on port %d', server.address().port);
});

app
.use( logRequests )
.use( express.static( path.resolve(R.ROOT_DIR, 'app') ) )
.use( cookRequest )
.use( send404 )
.use( function ( err, req, res, next ) {
	console.error("Error: "+err);
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
		res.sendFile( path.resolve(R.ROOT_DIR, 'app', '404.html') );
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

//---------------------------------------------------------------------------
function cookRequest ( req, res, next ) {
	var path = req.path.substr(1); // strip leading '/'

	res.cook = {
			doRespond : false,
			request   : req,
			recipe    : null,
			url       : req.url,
			response  : null,
			log       : [
			             ["Requester", req.connection.remoteAddress+":"+req.connection.remotePort],
			             ["URL"      , req.url],
			             ["Path"     , path]
			             ]
	};

	recipeDB.get( path )
	.then(
			function ( recipe ) {
				return followRecipe(res, recipe)
				.then(
						function () {
							return respondToRequest(res)
							.catch(
									function ( reason ) { return respondWith404(res, reason); }
							);
						},
						function ( reason ) { return respondWith404(res, reason); }
				);
			},
			function (reason) {
				// go to the next middleware if the reason for not finding a recipe is OK.
				// Otherwise respond with a 404
				return noRecipe(res, reason)
				.then(
						// need to wrap in a function so that passing in the 'true'
						// doesn't cause the err middleware to fire
						function (        ) { next(); },
						function ( reason ) { return respondWith404(res, reason); }
				);
			}
	)
	.catch(
			function ( reason ) {
				console.log("Caught: "+reason);
			}
	)
	.done();
}

//---------------------------------------------------------------------------
function followRecipe ( res, recipe ) {

	res.recipe = recipe;
	res.cook.log.push(["Recipe", JSON.stringify(recipe)]);

	let cookFn = protocols.getCookFunction(recipe);

	if ( !cookFn ) {
		res.cook.log.push(["Unsupported protocol", recipe.protocol]);
		return Q.reject(protocols.UNSUPPORTED);
	}
	
	return cookFn( recipe )
	.then(
			function (msg) {
				if ( !msg ) return Q(R.OK);
				res.cook.response = msg;
				return Q(R.OK);
			}
	);
}

//---------------------------------------------------------------------------
function respondToRequest ( res ) {

	if ( res.recipe.response === R.RESPONSE.ATTACH )
		return respondWithAttach ( res );

	if ( res.recipe.response === R.RESPONSE.HTML )
		return respondWithHtml( res );

	res.cook.log.push(["Unsupported response", res.recipe.response]);
	return Q.reject(R.UNSUPPORTED);
}

//---------------------------------------------------------------------------
function respondWithAttach ( res ) {

	var filename = res.recipe.filename || "cook-http."+(new Date().getTime())+".log"

	res.writeHead(200, {
		'Content-Type'        : 'text/plain',
		'Content-Disposition' : 'attachment; filename="'+filename+'"'
	});

	res.write(
			res.cook.log
			.map(function (arr) { return arr.join(' : '); })
			.join("\n")
	);
	res.write("\n");

	if ( typeof(res.cook.response) === 'array' ) {
		res.write(
				res.cook.response
				.map(function (msg) { return ["Response", msg].join(' : '); })
				.join("\n")
		);
		res.write("\n");
	}
	else if (res.cook.response) {
		res.write("Response : "+res.cook.response.toString()+"\n");
	}

	res.end();
	return Q.resolve(R.OK);
}

//---------------------------------------------------------------------------
function respondWithHtml ( res ) {

	res.writeHead(200, {
		'Content-Type'        : 'text/html',
	});
	res.write("<html>");
	res.write("<head></head>");
	res.write("<body>");
	res.write("<h1>Response to a cook request</h1>");
	res.write("<table>");
	for ( var i=0; i<res.cook.log.length; i++ ) {
		res.write("<tr><td>"+res.cook.log[i][0]+"</td>"+"<td>"+res.cook.log[i][1]+"</td></tr>")
	}
	if ( typeof(res.cook.response) === 'array' ) {
		for ( var i=0; i<res.cook.response.length; i++ ) {
			res.write("<tr><td>Response</td>"+"<td>"+res.cook.response[i].toString()+"</td></tr>")
		}
	}
	else {
		res.write("<tr><td>Response</td>"+"<td>"+res.cook.response.toString()+"</td></tr>")
	}

	res.write("</table>");
	res.write("</body></html>");
	res.end();

	return Q(R.OK);
}

//---------------------------------------------------------------------------
function respondWith404 ( res, code ) {

	res.writeHead(404, {
		'Content-Type' : 'text/html',
	});

	res.write('<html>');
	res.write('<head>');
	res.write('<title>404 Not Found</title>');
	res.write('</head>');
	res.write('<body>');
	res.write('<h1>Not Found</h1>');
	res.write('<p>The requested URL '+res.url+' was not found on this server.</p>');
	res.write('<p>The failure code was: '+code+'.</p>');
	res.write('<p>Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request.</p>');
	res.write('</body></html>');
	res.end();

	return Q.reject(R.NOK);
}

//---------------------------------------------------------------------------
function noRecipe ( res, reason ) {

	if ( reason === recipeDB.NORECIPE )
		return Q(true);

	respondWith404(res, reason);
	return Q.reject(reason);
}

//---------------------------------------------------------------------------
function recipeFailed ( res, reason ) { 
	return respondWith404(res, reason);
}
