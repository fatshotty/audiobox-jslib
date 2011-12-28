var Utils = require("./utils");
var Logger = require("logging");
var Module = require("./module");
var Collection = require("./collection");
var Tracks = require("./tracks");


// {"token":"uxhlQg7yIgj9","name":"test","position":null,"media_files_count":5,"type":"CustomPlaylist","updated_at":"2011-12-07T11:55:04+01:00"

var END_POINT = "playlists";

module.exports = Playlist;


function Playlist(connector){

  this.connector = connector;

  Module.call( this, Playlist.DECLARED_FIELDS );
  return this;
}

Playlist.prototype.__proto__ = Module.prototype;


Playlist.DECLARED_FIELDS = Object.freeze({
  "END_POINT": END_POINT,
  "token": "",
  "name": "",
  "position": 0,
  "media_files_count": 0,
  "type": "",
  "updated_at": "",
  "tracks": Tracks
});