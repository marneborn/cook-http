'use strict';

let fs       = require('fs');
let Q        = require('q');
let config   = require('../../config.json');
let deepcopy = require('deepcopy');
let R        = require('../../common/loadR');

JSON.minify = JSON.minify || require("node-json-minify");

// use eval so that R's are visible...
let recipes;
eval('recipes = '+JSON.minify(fs.readFileSync(__dirname+'/mock.json', 'utf8')));

let localDB = {};
let nextID  = 1;
for ( var i=0; i<recipes.length; i++ ) {
	recipes[i]._id = 'mock'+(nextID++);
	localDB[recipes[i]._id] = recipes[i];
}

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

