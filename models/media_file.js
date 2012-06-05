var Utils = require("../configuration/utils");
var Logger = require("logging");
var Module = require("./module");
var MediaFiles = require("./media_files");


/**
  media_file: {
    type: 'AudioFile',
    token: 'c_4330c1a260e85caf5f0831',
    artist: 'Anto',
    album: 'Anto selection',
    genre: 'Raggae',
    year: 0,
    title: 'Traccia 3',
    len_str: '0:43',
    len_int: 43,
    position: 3,
    filename: 'c_4330c1a260e85caf5f0831.mp3',
    loved: false,
    disc: 1,
    mime: 'audio/mpeg',
    remote_path: null,
    source: 'cloud',
    size: 689890,
    hash: '8ee533e31949bcfd74f89403ea59b127',
    video_bitrate: null,
    video_codec: null,
    video_resolution: null,
    video_fps: null,
    video_aspect: null,
    video_container: null,
    audio_bitrate: '128',
    audio_codec: null,
    audio_sample_rate: '44100',
    artworks: {
      l: 'http://assets.development.audiobox.fm/a/0f921778fd88/l.jpg',
      s: 'http://assets.development.audiobox.fm/a/0f921778fd88/s.jpg'
    },
    plays: 0
  }
 */


module.exports = MediaFile;


function MediaFile(config, connectors){

  Module.call( this, MediaFile.DECLARED_FIELDS, config, connectors );

  return this;
}


MediaFile.prototype.__proto__ = Module.prototype;


MediaFile.prototype.__defineGetter__('streamUrl', function(){
  var request = this.NodeConnector.Request;
  return request.parseUrl( '/stream/' + this.filename, true );
});



MediaFile.DECLARED_FIELDS = Object.freeze({

  type: "",
  token: "",
  artist: "",
  album: "",
  genre: "",
  year: 0,
  title: "",
  len_str: "",
  len_int: 0,
  position: 0,
  filename: "",
  loved: false,
  disc: 0,
  mime: "",
  remote_path: "",
  source: "",
  size: 0,
  hash: "",
  video_bitrate: 0,
  video_codec: "",
  video_resolution: "",
  video_fps: 0,
  video_aspect: 0,
  video_container: "",
  audio_bitrate: "",
  audio_codec: "",
  audio_sample_rate: "",
  artworks: {
    l: "",
    s: ""
  },
  plays: 0

});


MediaFile.prototype._extractData = function(data) {
  return data[ "media_file" ];
};


MediaFile.prototype.lyrics = function(callback){
  var
    self = this,
    request = this.RailsConnector.Request;

  // Set the 'extension' for the URL
  request.requestFormat = this.Configuration.RequestFormats.JSON;

  request.success = function(res, data){

    data = JSON.parse(data);

    var mediadata = self._extractData( data );

    callback( mediadata.lyrics );

  };

  return request.get(  [ MediaFiles.END_POINT, this.token, "lyrics"] );
}

