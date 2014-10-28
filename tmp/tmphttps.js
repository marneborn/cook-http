var https = require('https');
var http  = require('http');
var fs = require('fs');

var hskey = fs.readFileSync('ssl/cook-http-key.pem');
var hscert = fs.readFileSync('ssl/cook-http-cert.pem');

console.log("k> "+hskey);
console.log("c> "+hscert);
var options = {
    key: hskey,
    cert: hscert
};

var server;
if ( true ) {
	server = https.createServer(options, function (req, res) {
		console.log("heard something");
	    res.writeHead(200);
	    res.end("Hi from HTTPS");
	});}
else {
	server = http.createServer(function (req, res) {
		console.log("heard something");
	    res.writeHead(200);
	    res.end("Hi from HTTP");
	});
}

server.listen(3000, function () {
	console.log("Listening on: "+JSON.stringify(server.address()));
});	
