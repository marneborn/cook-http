"use strict";

var EventEmitter = require('events').EventEmitter;

let net      = require('net');

//app specific stuff
var R        = require('../common/loadR.js');
var config   = require('../common/config.js');

var server = net.createServer()
.listen(config.sendOnlyClient.port, function () {
	console.log("Listening to: "+this.address().port);
})
.on('connection', function ( socket ) { 
	console.log("Getting a message from "+socket.remoteAddress+":"+socket.remotePort);
	let message = '';
	socket.on('data', function(chunk) {
		message += chunk;
	})
	.on('close', function () {
		server.emit('message', message)
	});
})
.on('error', function ( err ) {
	console.log("Error: "+err);
})
.on('message', function ( msg ) {
	console.log('Got message: '+msg);
});
