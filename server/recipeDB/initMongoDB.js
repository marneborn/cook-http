"use strict";

let mongodb  = require('mongodb');
let fs       = require('fs');
let Q        = require('q');
let config   = require('../../config.json');
let deepcopy = require('deepcopy');

JSON.minify = JSON.minify || require("node-json-minify");

let R = module.exports = JSON.parse(JSON.minify(fs.readFileSync(__dirname+'/R.json', 'utf8')));
//let R = module.exports = require("./R.json");

var uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
	+'@'+config.mongoLab.host+':'+config.mongoLab.port
	+'/'+config.mongoLab.name;

// need to eval since there are R. constants in the mock.json
let recipes;
eval('recipes = '+JSON.minify(fs.readFileSync(__dirname+'/mock.json', 'utf8')));
//let recipes = JSON.parse(JSON.minify(fs.readFileSync(__dirname+'/mock.json', 'utf8')));

mongodb.MongoClient.connect(uri, function(err, db) {

	if(err) throw err;

	var recipeColl = db.collection(config.mongoLab.recipes);

	recipeColl.insert(recipes, function(err, result) {

		if(err) throw err;
		
		db.close(function (err) {
			if(err) throw err;
		});

	});
});