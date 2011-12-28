var Utils = require("./utils");
var Logger = require("logging");
var Module = require("./module");
var Collection = require("./collection");


// {"type":"AudioFile","token":"7be76b0e-edcd-4f28-bfed-41587ec9cd49","artist":"Aban","album":"La Bella Italia","genre":"HipHop","release_year":2008,"title":"Intro","length_str":"2:13","length_int":133,"position":1,"play_count":2,"media_file_name":"7be76b0e-edcd-4f28-bfed-41587ec9cd49.mp3","mime":"audio/mpeg","md5":"b07b4b631588bdd223ff40f1e09b4488","loved":true,"disc_number":1}

module.exports = Track;


function Track(connector){

  this.connector = connector;

  Module.call( this, Track.DECLARED_FIELDS );
  return this;
}

Track.prototype.__proto__ = Module.prototype;


Track.TYPES = {
  audio: "AudioFile",
  video: "VideoFile"
};

Track.DECLARED_FIELDS = Object.freeze({
  type: '',
  token: '',
  artist: '',
  album: '',
  genre: '',
  year: 0,
  title: '',
  length_str: '0:00',
  length_int: 0,
  position: 0,
  plays: 0,
  media_file_name: '',
  mime: '',
  md5: '',
  loved: false,
  disc: 0
});