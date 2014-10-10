'use strict';

let path     = require('path');
let extend   = require('extend');
let fs       = require('fs');
let Q        = require('q');
let deepcopy = require('deepcopy');
var mongodb  = require('mongodb');
let R        = require('../../common/loadR');
var config   = require('../../common/config.js');

// use eval so that R's are visible...
JSON.minify = JSON.minify || require("node-json-minify");
let recipes;
eval('recipes = '+JSON.minify(fs.readFileSync(__dirname+'/mock.json', 'utf8')));

let localDB = {};
for ( var i=0; i<recipes.length; i++ ) {
	var tmpID = 'mock'+i.toString();
	recipes[i]['_id'] = mongodb.ObjectID(Array(1+12-tmpID.length).join("_")+tmpID);
	localDB[recipes[i]._id.toHexString()] = recipes[i];
}
console.log(">>> "+JSON.stringify(localDB, null, 4));

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
		return Q.reject(R.NOID);

	if ( localDB[lookup] === undefined )
		return Q.reject(R.NORECIPE);

	return Q.resolve(deepcopy(localDB[lookup]));
}

