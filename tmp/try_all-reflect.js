"use strict";

let Promise  = require('bluebird');

let promise1 = new Promise( function (resolve, reject) {
    setTimeout( function () { console.log('resolving1'); resolve(1); }, 1010);
});

let promise2 = new Promise( function (resolve, reject) {
    setTimeout( function () { console.log('rejecting2'); reject(2); }, 2010);
});

let promise3 = new Promise( function (resolve, reject) {
    setTimeout( function () { console.log('resolving3'); resolve(3); }, 3010);
});

let promise4 = new Promise( function (resolve, reject) {
    setTimeout( function () { console.log('resolving4'); resolve(4); }, 4010);
});

var promises = [promise1.reflect(), promise2.reflect(), promise3.reflect(), promise4.reflect()];
var keys = [0, 1, 2, 3];

var interval = setInterval(
    function () {
        for (var i=0; i<promises.length; i++) {
            var promise = promises[i];
            if ( promise.isFulfilled() )     {
                var reflect = promise.value();
                if ( reflect.isFulfilled() )     { console.log("rs> "+i+' : '+reflect.value()); }
                else if ( reflect.isRejected() ) { console.log("rr> "+i+' : '+reflect.reason()); }
                else if ( reflect.isPending() )  { console.log("rp> "+i+' : ?'); }
                else { console.log("p?>"); }
            }
            else if ( promise.isRejected() ) { console.log("pr> "+i+' : '+promise.reason()); }
            else if ( promise.isPending() )  { console.log("pp> "+i+' : ?'); }
            else { console.log("p?>"); }
        }
    }, 500
);

Promise
.all(promises)
.then(
    function ( promises ) {
        console.log("all the files were created");
        for (var i=0; i<keys.length; i++) {
            if ( promises[i].isFulfilled() ) { console.log("ls> "+i+','+promises[i].value()); }
            if ( promises[i].isRejected()  ) { console.log("lr> "+i+','+promises[i].reason()); }
        }
        return promises;
    }
)
.catch(
    function (v) { console.log('rejecting all'); }
)
.finally(
    function () {
        setTimeout( function () {
            clearInterval(interval);
        },500);
    }
);
