"use strict";

let mongodb  = require('mongodb');
let path     = require('path');
let extend   = require('extend');
let fs       = require('fs');
let Q        = require('q');
let deepcopy = require('deepcopy');
let R        = require('../../common/loadR');
let config   = require('../../common/config.js');

var uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
+'@'+config.mongoLab.host+':'+config.mongoLab.port
+'/'+config.mongoLab.name;

//---------------------------------------------------------------------------
module.exports.get = function ( id ) {
	console.log("g0> "+id);
	if ( id == null )
		return Q.reject(R.NOID);

	return getCursor ( config.mongoLab.recipes, { _id : mongodb.ObjectID(id) } )
	.then( checkCounts   )
	.then( getNextObject )
	.catch( reportError );
};

//---------------------------------------------------------------------------
function getCursor ( collection, toFind ) {
	console.log("g1> "+JSON.stringify(toFind));
	let defer = Q.defer();
	console.log("g2> "+uri);
	mongodb.MongoClient.connect(uri, function(err, db) {
		console.log("g3> "+err+","+db);
		if (err) {
			defer.reject(err)
		}
		else {
			let dbColl = db.collection( collection );
			let cursor = dbColl.find(toFind);
			cursor ? defer.resolve(cursor) : defer.reject(R.NORECIPE);
		}
	});
	
	return defer.promise;
}

//---------------------------------------------------------------------------
function checkCounts ( cursor ) {
	
	let defer = Q.defer();

	cursor.count(function (err, count) {
		console.log("g10> "+err+","+count);
		if ( err              )  { defer.reject (err);          }
		else if ( count === 0 )  { defer.reject (R.COOK.NORECIPE);   }
		else if ( count > 1   )  { defer.reject (R.COOK.NOT_UNIQUE); }
		else                     { defer.resolve(cursor);       }
	});
	
	return defer.promise;
}

//---------------------------------------------------------------------------
function getNextObject ( cursor ) {
	
	let defer = Q.defer();

	cursor.nextObject(function (err, item) {
		console.log("g20>");
		console.log("g21> "+JSON.stringify(item));

		if ( err ) {
			defer.reject(err);
			return;
		}
		item.url = item._id;
		defer.resolve(item);	
	});

	return defer.promise;
}

//---------------------------------------------------------------------------
function reportError ( reason ) {
	console.log("Error: "+reason);
	return Q.reject(reason);
}