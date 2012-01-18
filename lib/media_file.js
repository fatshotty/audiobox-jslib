var Utils = require("./utils");
var Logger = require("logging");
var Module = require("./module");
var Collection = require("./collection");


// {"type":"AudioFile","token":"7be76b0e-edcd-4f28-bfed-41587ec9cd49","artist":"Aban","album":"La Bella Italia","genre":"HipHop","release_year":2008,"title":"Intro","length_str":"2:13","length_int":133,"position":1,"play_count":2,"media_file_name":"7be76b0e-edcd-4f28-bfed-41587ec9cd49.mp3","mime":"audio/mpeg","md5":"b07b4b631588bdd223ff40f1e09b4488","loved":true,"disc_number":1}

module.exports = MediaFile;


function MediaFile(connector){

  this.connector = connector;

  Module.call( this, MediaFile.DECLARED_FIELDS );
  return this;
}

MediaFile.prototype.__proto__ = Module.prototype;


MediaFile.prototype.__defineGetter__('streamUrl', function(){
  return '/stream/' + this.filename;
});

MediaFile.prototype.__defineGetter__('fullStreamUrl', function(){
  var req = this.connector.Request;

  // forcing Request to simulate the download. In this way we are sure that server is correctly set
  req.downloadFile = this.filename;

  return req.getUrl( this.streamUrl );
});


/**
 * This method performs the download of the file
 * @param path String the full path name of the file which download into
 * @return Request the Request instance
 */
MediaFile.prototype.download = function(path){
  var req = this.connector.Request;
  req.downloadFile = path;
  return req.get( this.streamUrl );
}



MediaFile.TYPES = {
  audio: "AudioFile",
  video: "VideoFile"
};

MediaFile.DECLARED_FIELDS = Object.freeze({
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
  filename: '',
  mime: '',
  md5: '',
  loved: false,
  disc: 0
});







