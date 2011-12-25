var Utils = require("./utils");
var Logger = require("logging");
var Module = require("./module");
var Collection = require("./collection");


module.exports = Track;


function Track(connector){

  Module.call( this, Track.DECLARED_FIELDS );
  return this;
}

Track.prototype.__proto__ = Module.prototype;


Track.DECLARED_FIELDS = Object.freeze({
  "token": "",
  "title": ""
});