'use strict';

//generic utilities
let log          = require('npmlog');

//express related stuff
let express        = require('express');
let logger         = require('morgan');
let bodyParser     = require('body-parser');
let methodOverride = require('method-override');

//app specific stuff
let R            = require('../common/loadR.js');
let config       = require('../common/config.js');

log.info("Starting cook-http server");
log.level        = config.logLevel;

//generic setup
let app    = express()
.use( logger(( config.MODE === 'dev' ) ? 'dev' : null ))
.use( bodyParser.json() )
.use( bodyParser.urlencoded({ extended: false }) )
.use( methodOverride() )
.use( csrf() )
.use( function(req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});

cookrecipe here....

let authorized = require('./user')(app, config);

require('./static')(app, {
	authorized : authorized,
	ROOT_DIR   : config.ROOT_DIR
});

require('./listeners')(app, {
	httpPort  : config.server.httpPort,
	httpsPort : config.server.httpsPort,
	ssl       : config.ssl
});
