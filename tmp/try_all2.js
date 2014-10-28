"use strict";

var Promise  = require('bluebird');

var loop  = true;
var count = 0;
var done  = true;

var interval = setInterval(function () {
    if ( ! done ) return;
    done = false;
    count++;
    var promise1 = new Promise( function (resolve, reject) { resolve(1); });
    var promise2 = new Promise( function (resolve, reject) { resolve(2); });
    var promise3 = new Promise( function (resolve, reject) { resolve(3); });
    var promise4 = new Promise( function (resolve, reject) { resolve(4); });

    var promises = [ promise1, promise2, promise3, promise4];
    Promise.all(promises)
    .then(
        function ( values ) {}
    )
    .catch(
        function (v) { console.log('rejecting all - '+v); }
    )
    .finally(
        function () { done = true; }
    );
}, 0);

setTimeout(function () {
    clearInterval(interval);
    loop = false;
    console.log(">> count = "+count);
}, 5000);
