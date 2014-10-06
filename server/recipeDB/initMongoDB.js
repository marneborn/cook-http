"use strict";

let mongodb  = require('mongodb');
let fs       = require('fs');
let Q        = require('q');
let deepcopy = require('deepcopy');
let config   = require('../../config.json');
let R        = require('../../common/loadR');

var uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
+'@'+config.mongoLab.host+':'+config.mongoLab.port
+'/'+config.mongoLab.name;

//use eval so that R's are visible...
JSON.minify = JSON.minify || require("node-json-minify");
let recipes;
eval('recipes = '+JSON.minify(fs.readFileSync(__dirname+'/mock.json', 'utf8')));

var MongoClient = require('mongodb').MongoClient;

mongodb.MongoClient.connect(uri, function (err, db) {
	if ( err ) throw new Error(err);

	db.dropCollection(config.mongoLab.recipes, function (err,res) {
		// keep going whether or not the drop collection passed.
		//if ( err ) throw new Error(err);

		db.createCollection(config.mongoLab.recipes, function (err, collection) {
			if ( err ) throw new Error(err);

			collection.insert(recipes, function (err, result) {
				if ( err ) throw new Error(err);
				db.close();
			});
		});
	});
});

/*
Q.nfcall(mongodb.MongoClient.connect, uri)
.then( dropCollection )
.then( createAndInsert )
.then( closeDB )
.catch(
		function ( reason ) {
			console.log("Connect error: "+reason);
			throw new Error(reason)
		}
);

function dropCollection ( db ) {
	// drop the recipe collection then pass on the db regardless of pass/fail
	var defer = Q.defer();
	db.dropCollection(config.mongoLab.recipes, function (err,res) {
		defer.resolve(db);
	});
	return defer.promise;
}

function createAndInsert ( db ) {
	var defer = Q.defer();
	db.createCollection(config.mongoLab.recipes, function (err, collection) {
		if ( err )
			throw new Error(err);
		collection.insert(recipes, function (err, result) {
			if ( err ) { defer.reject(err); }
			else       { defer.resolve(db); }
		});
	});
	return defer.promise;
}

function closeDB ( db ) {
	db.close();
	return Q(true);
}

*/