"use strict";

let Promise  = require('bluebird');

let promise1 = new Promise( function (resolve, reject) {
//     resolve(2);
//     reject(3);
         setTimeout( function () { console.log('resolving1'); reject(1); }, 1010);
});

promise1
.then(
    function ( v ) {
        console.log("A1> "+v);
        return v;
    }
)
.then(
    function ( v ) {
        console.log("A3> "+v);
        return v;
    },
    function ( r ) {
        console.log("A4> "+r);
        return Promise.break();
    }
)
.catch(
    function ( r ) {
        console.log("A5> "+r);
    }
)
.finally(
    function () {
        console.log("A9> finally");
    }
);

// promise1
// .then(
//     function ( v ) {
//         console.log("b1> "+v);
//     }
// );
