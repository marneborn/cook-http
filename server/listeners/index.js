var http         = require('http');
var https        = require('https');

module.exports = function (app, config) {
	var httpServer  = http
	.createServer(app)
	.listen(config.httpPort, function () {
		console.log('listening http on: ' +httpServer.address().port);
	});

	var httpsServer = https
	.createServer(config.ssl, app)
	.listen(config.httpsPort, function () {
		console.log('listening https on: '+httpsServer.address().port);
	});
};
