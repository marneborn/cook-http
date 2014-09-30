'use strict';

let Q        = require('q');
let config   = require('../config.json');
let deepcopy = require('deepcopy');

let R = module.exports = {
		NOK     : 0,
		OK      : 1,
		NORECIPE: 2,
		NOLOOKUP: 3,
		ATTACH  : 4,
		HTML    : 5,
};

let localDB  = {
		"dummyid0" : { protocol : "tcp", method: 'send-and-forget', host : config.simpleClient.host, port : config.simpleClient.port, message : "muteoff", response : R.ATTACH },
		"dummyid1" : { protocol : "tcp", method: 'send-response',   host : config.homeClient.host  , port : config.homeClient.port  , message : "muteoff", response : R.HTML },
		"dummyid2" : { protocol : "tcp", method: 'send-response',   host : config.homeClient.host  , port : config.homeClient.port  , message : "muteon" , response : R.ATTACH }
};

//---------------------------------------------------------------------------
function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
	return uuid;
};

//---------------------------------------------------------------------------
module.exports.get = function ( lookup ) {

	if ( lookup == null )
		return Q.reject(R.NOLOOKUP);

	if ( localDB[lookup] === undefined )
		return Q.reject(R.NORECIPE);

	return Q.resolve(deepcopy(localDB[lookup]));
}

