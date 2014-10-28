"use strict";

var Promise  = require('bluebird');

var promise1 = new Promise( function (resolve, reject) { resolve(1); });
var promise2 = new Promise( function (resolve, reject) { resolve(2); });
var promise3 = new Promise( function (resolve, reject) { resolve(3); });
var promise4 = new Promise( function (resolve, reject) { resolve(4); });

var promises = [ promise1, promise2, promise3, promise4];

Promise.props(promises)
.then(
    function ( values ) {
        console.log(">> "+JSON.stringify(values));
    }
)
.catch(
    function (v) { console.log('rejecting all - '+v); }
);
