"use strict";

var Promise  = require('bluebird');

var promise1 = new Promise( function (resolve, reject) { resolve(1); });
var promise2 = new Promise( function (resolve, reject) { resolve(2); });
var promise3 = new Promise( function (resolve, reject) { resolve(3); });
var promise4 = new Promise( function (resolve, reject) { resolve(4); });

var promises = [ promise1, promise2, promise3, promise4];

Promise.settle(promises)
.then(
    function ( results ) {
        console.log("all the files were created");
        for (var i=0; i<results.length; i++) {
            if ( results[i].isFulfilled() )     { console.log("s> "+i+' : '+results[i].value()); }
            else if ( results[i].isRejected() ) { console.log("r> "+i+' : '+results[i].reason()); }
            else if ( results[i].isPending() )  { console.log("p> "+i+' : ?'); }
            else { console.log("?>"); }

        }
        return results;
    }
)
.catch(
    function (v) { console.log('rejecting all - '+v); }
);
