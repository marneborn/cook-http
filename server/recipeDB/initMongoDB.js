"use strict";

let mongodb  = require('mongodb');
let fs       = require('fs');
let Q        = require('q');
let config   = require('../../config.json');
let deepcopy = require('deepcopy');

let R = module.exports = require("./R.json");

var uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
	+'@'+config.mongoLab.host+':'+config.mongoLab.port
	+'/'+config.mongoLab.name;

let seedData;
eval('seedData = '+fs.readFileSync(__dirname+'/mock.json')+';');

mongodb.MongoClient.connect(uri, function(err, db) {

	if(err) throw err;

	var recipes = db.collection(config.mongoLab.recipes);

	recipes.insert(seedData, function(err, result) {

		if(err) throw err;
		
		db.close(function (err) {
			if(err) throw err;
		});

	});
});