"use strict"

let mongodb  = require('mongodb');
let fs       = require('fs');
let Q        = require('q');
let deepcopy = require('deepcopy');
let config   = require('../../config.json');
let R        = require('../../common/loadR');

var uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
+'@'+config.mongoLab.host+':'+config.mongoLab.port
+'/'+config.mongoLab.name;

//---------------------------------------------------------------------------
module.exports.get = function ( id ) {

	if ( id == null )
		return Q.reject(R.NOID);

	let defer   = Q.defer();
	return getCursor ( config.mongoLab.recipes, { _id : id } )
	.then( checkCounts   )
	.then( getNextObject )
	.catch( reportError );
};

//---------------------------------------------------------------------------
function getCursor ( collection, toFind ) {

	let defer = Q.defer();
	
	mongodb.MongoClient.connect(uri, function(err, db) {

		if (err) {
			defer.reject(err)
		}
		else {
			let dbColl = db.collection( collection );
			let recipes = dbColl.find(toFind);
			defer.resolve(recipes);
		}
	});
	
	return defer.promise;
}

//---------------------------------------------------------------------------
function checkCounts ( cursor ) {
	
	let defer = Q.defer();

	cursor.count(function (err, count) {
		if ( err              )  { defer.reject (err);          }
		else if ( count === 0 )  { defer.reject (R.NORECIPE);   }
		else if ( count > 1   )  { defer.reject (R.NOT_UNIQUE); }
		else                     { defer.resolve(cursor);       }
	});
	
	return defer.promise;
}

//---------------------------------------------------------------------------
function getNextObject ( cursor ) {
	
	let defer = Q.defer();

	cursor.nextObject(function (err, item) {
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
}