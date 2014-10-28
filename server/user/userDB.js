"use strict";

var mongodb  = require('mongodb');
var config   = require('../../common/config.js');
var Q        = require('q');

var uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
+'@'+config.mongoLab.host+':'+config.mongoLab.port
+'/'+config.mongoLab.name;

module.exports = {
		findUser : function ( query ) {
			
		}
};

