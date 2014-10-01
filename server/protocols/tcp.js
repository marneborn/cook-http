"use strict";

let Q = require('q');
let Packetizer = require('packetize-string');
let net        = require('net');
let R          = require('../../common/loadR');

//---------------------------------------------------------------------------
module.exports.getFn = function ( recipe ) {

	if ( recipe.protocol !== R.PROTOCOL.TCP )
		return null;

	for (let i=0; i<methods.length; i++) {

		if ( methods[i].name === recipe.method )
			return methods[i].fn;

	}
	return null;
};

//---------------------------------------------------------------------------
let methods   = [];
module.exports.registerMethod = registerMethod;

function registerMethod ( name, fn ) {
	methods.push( { name : name, fn : fn } );
};

//---------------------------------------------------------------------------
registerMethod(R.TCP.SEND_AND_FORGET, function ( recipe ) {
	console.log("Sending a message to: "+recipe.host+":"+recipe.port);
	net.Socket()
	.connect( recipe.port, recipe.host, function () {
		this.end(recipe.message);
	})
	.on('error', function ( e ) {
		console.log("Error: "+e);
	})
	.on('close', function () {
		console.log("Connection closed");
	});
	return Q.resolve(null);
});

//---------------------------------------------------------------------------
registerMethod(R.TCP.PACKETIZE_STRING, function ( recipe, logArray ) {
	console.log("Sending a message to: "+recipe.host+":"+recipe.port);
	let defer  = Q.defer();

	let client = net.Socket();
	client
	.connect( recipe.port, recipe.host, function () {
		this.write(Packetizer.send(recipe.message));
	})
	.on('error', function ( e ) {
		console.log("Error: "+e);
		defer.reject("Error: "+e);
	})
	.on('close', function () {
		console.log("Connection closed");
	});

	let timeout = 3000;
	let timedOut = false;
	let timeoutObj = setTimeout(
			function () {
				console.log("Timed out!!!");
				timedOut = true;
			},
			timeout
	);

	let timeOutMsg = "Timed out after "+timeout+" milliseconds";

	Packetizer.receive(client)

	// clear the timeout regardless...
	// this pushes the resolve/reject of the previous on.
	.fin  ( function () { clearTimeout(timeoutObj); } )
	.then (
			function ( msg ) {
				// only resolve if it's not already resolved/rejected.
				if (!defer.promise.isPending)
					return
					
				if ( timedOut ) 
					return defer.reject(timeOutMsg);
				console.log("got back: "+msg);
				defer.resolve(msg);
			}
			// reject from .receive will fall through
	)
	.fin  ( function () { client.end() })
	.done ();

	return defer.promise;
});

