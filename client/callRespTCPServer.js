"use strict";

var EventEmitter = require('events').EventEmitter;

let net        = require('net');
let Packetizer = require('packetize-string');

//app specific stuff
var R          = require('../common/loadR.js');
var config     = require('../common/config.js');

var server = net.createServer()
.listen(config.responseClient.port, function () {
	console.log("Listening to: "+this.address().port);
})
.on('connection', function ( socket ) { 
	Packetizer.receive(socket)
	.then (
			function ( msg ) {
				console.log("Got: "+msg);
				socket.end(Packetizer.send("Done with: "+msg));
				return Q(msg);
			},
			function ( reason ) {
				console.log("Error: "+reason);
				socket.end("Error: "+reason);
				return Q.reject(reason);
			}
	);
})
.on('error', function ( err ) {
	console.log("Error: "+err);
})
.on('message', function ( msg ) {
	console.log('Got message: '+msg);
});


