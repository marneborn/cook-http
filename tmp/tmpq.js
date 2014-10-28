"use strict";

let Q  = require('q');
let mongodb  = require('mongodb');
let utils    = require('utils');

let R        = require('../common/loadR');
let config   = require('../common/config.js');

let uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
+'@'+config.mongoLab.host+':'+config.mongoLab.port
+'/'+config.mongoLab.name+"s";

let connectDB = Q.nbind(mongodb.MongoClient.connect, mongodb.MongoClient);
connectDB(uri)
.then(
    function (db)  {
        console.log("s> "+db);
        return { db : db };
    },
    function (err)  {
        if ( utils.isError(err) && err.qhandled ) throw err;

        err = new Error("Couldn't connect to db - "+err)
        err.qhandled = true;
        throw err;
    }
)
.then(
    function (db)  { console.log("s> "+db); return db; },
    function (err) {
        if ( util.isError(err) ) {
            if ( !err.ishandled ) {
                console.error(err);
                err.ishandled = true;
            }
            throw err;
        }
        err = "Got an error: "+err;
        err = new Error("Got an error: "+err
        if ( util.isError(err) && err.handled ) throw err;
        if ( console.log("e> "+r); let err = new Error("Couldn't connect"); err.handled = true; }
)
.done();

//use npost...
//.then(
//    function (db) { db.close(); }
//)
//.done();
///*
//    .
//	console.log("g1> "+JSON.stringify(toFind));
//	let defer = Q.defer();
//	console.log("g2> "+uri);
//	mongodb.MongoClient.connect(uri, function(err, db) {
//		console.log("g3> "+err+","+db);
//		if (err) {
//			defer.reject(err)
//		}
//		else {
//			let dbColl = db.collection( collection );
//			let cursor = dbColl.find(toFind);
//			cursor ? defer.resolve(cursor) : defer.reject(R.NORECIPE);
//		}
//	});
//
//	return defer.promise;
//}
//*/
//
