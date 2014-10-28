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

function flagAndThrow ( string, err ) {
    if ( arguments.length === 0 ) {
        string = "%s";
        err = new Error("Error: unknown");
    }
    else if ( arguments === 1 ) {
        err = string;
        string = "%s";
    }
    if (!util.isError(err))
        err = new Error(err);
    if ( err.handled ) throw err;
    console.error(string, err.toString());
    err.handled = true;
    throw err;
}

Promise.promisifyAll(mongodb);

mongodb.MongoClient
.connectAsync(uri)
.catch(
    function ( err ) { flagAndThrow("Could not connect: %s", err); }
)
.then(
    function (db) {
        console.log("connected");

        db
        .collectionAsync( 'recipes', {strict:true} )
        .catch(
            function ( err ) { flagAndThrow("Could not get collection: %s", err); }
        )
        .then(
            function ( collection ) {
                console.log("collection found");
                return collection.findAsync({});
            }
        )
        .catch(
            function ( err ) { flagAndThrow("Could not get cursor: %s", err); }
        )
        .then(
            function ( cursor ) {
                console.log("cursor found");
                return cursor
                .countAsync()
                .catch(
                    function ( err ) { flagAndThrow("Could not get the cursor's count: %s", err); }
                )
                .then(
                    function (count) {
                        console.log(">> "+count);
                        if ( count === 0 )
                            flagAndThrow("No recipes found");
                        //if ( count > 1 )
                        //  flagAndThrow("More than one recipe found");
                    }
                )
                .then(
                    function () { return cursor.nextObjectAsync(); }
                )
                .catch(
                    function ( err ) { flagAndThrow("Could not get next object: %s", err); }
                );
            }
        )
        .then(
            function (obj) {
                console.log("Found> "+JSON.stringify(obj));
            }
        )
        .finally(
            function () { db.close(); }
        )
        .catch(
            function (err) { flagAndThrow("Couldn't close: %s", err); }
        );
    }
);
