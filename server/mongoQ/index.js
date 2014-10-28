"use strict";

var Q        = require('q');
var mongodb  = require('mongodb');

module.exports = {};

//---------------------------------------------------------------------------
function connect ( uri ) {
    var defer = Q.defer();
}

//---------------------------------------------------------------------------
function getCursor ( collectionName, query ) {
	var defer = Q.defer();
	mongodb.MongoClient.connect(uri, function(err, db) {
		console.log("g3> "+err+","+db);
		if (err) {
			defer.reject(err)
		}
		else {
			let dbColl = db.collection( collectionName );
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
