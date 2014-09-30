"use strict";

let EventEmitter = require('events').EventEmitter;

let nextID = 0;

module.exports.EventEmitter = function myEventEmitter () {
    //this.prototype = new EventEmitter(Array.prototype.slice.call(arguments, 0));
    this.on(null, onnull);
    this.emit = function ( ) {
        let ev = arguments[0];
        if ( ev == null )
            throw new Error("Trying to emit an unregistered
        this.prototype.emit.apply(this, Array.prototype.slice.call(arguments, 0));
    };
};

myEventEmitter.proto = EventEmitter;
myEventEmiit
function onnull () {
    console.log(">> ");
    //throw new Error("Trying to listen for an event that doesn't exist");
};

module.exports.register = function register ( name ) {
    
};
{
  "OK"       :  0,
  "NOK"      :  1,
  "BAD_PATH" :  2
}
