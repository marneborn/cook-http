/**
 * @fileOverview
 * @name try-bluebird.js
 * @author
 * @license
 */
"use strict";

let Promise  = require('bluebird');
Promise.longStackTraces();

let mongodb  = require('mongodb');
let util     = require('util');
let fs       = Promise.promisifyAll(require("fs"));

let R        = require('../common/loadR');
let config   = require('../common/config.js');

let uri = 'mongodb://'+config.mongoLab.user+':'+config.mongoLab.password
    +'@'+config.mongoLab.host+':'+config.mongoLab.port
    +'/'+config.mongoLab.name;

mongodb.MongoClient.connect(uri, function(err, db) {
    if ( err ) {
        console.error("Could not connect: %s", err);
        return;
    }
    console.log("connected");

    db.collection( 'recipes', function (err, collection) {
        if ( err ) {
            console.error("Could not get collection: %s", err);
            return;
        }
        console.log("collection found");
        collection.find({}, function (err, cursor) {
            if ( err ) {
                console.log("Could not get cursor: %s", err);
                return;
            }
            console.log("cursor found");
            cursor.count(function (err, count) {
                if ( err ) {
                    console.log("Could not get the cursor's count: %s", err);
                    return;
                }
                if ( count === 0 ) {
                    console.error("No recipes found");
                    return;
                }
                cursor.nextObject(function (err, obj) {
                    if (err) {
                        console.log("Could not get next object: %s", err);
                        return;
                    }
                    console.log("Found> "+JSON.stringify(obj));
                    db.close();
                });
            });
        });
    });
});
