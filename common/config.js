'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

var path    = require('path');
var extend  = require('extend');

//two separate config files, one (secret.config.json) is excluded from git.
var config  = {
		ROOT_DIR : path.resolve(__dirname, ".."),
		MODE     : process.env.NODE_ENV
};

config      = extend(true, config, require(path.resolve(config.ROOT_DIR, 'common', 'config.json')));
config      = extend(true, config, require(path.resolve(config.ROOT_DIR, 'common', 'config.secret.json')));

if ( process.env.NODE_ENV === "dev" ) {
	config  = extend(true, config, require(path.resolve(config.ROOT_DIR, 'common', 'config.dev.json')));
}

module.exports = config;
