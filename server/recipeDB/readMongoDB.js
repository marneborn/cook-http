"use strict"

var mongodb = require('mongodb');

//Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://admin:whatever@ds041150.mongolab.com:41150/cook-http';

mongodb.MongoClient.connect(uri, function(err, db) {

	if(err) throw err;

	var recipes = db.collection('recipes');

	recipes.find(null, { message:1, _id:0 }).sort().toArray(function (err, docs) {

		if(err) throw err;

		docs.forEach(function (doc) {
			console.log("d> "+JSON.stringify(doc));
			/*
	          console.log(
					'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
					' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
			);
			*/
		});

		db.close(function (err) {
			if(err) throw err;
		});
	});
});
