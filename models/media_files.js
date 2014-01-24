var Configuration = require("../configuration/configuration");
var Connection = require("../core/connection");
var Collection = require("./collection");


module.exports = MediaFiles;

const END_POINT = Configuration.APIPath + Connection.URISeparator + "media_files";


function MediaFiles(config, connectors){
  Collection.call(this, config, connectors, "media_files");
  return this;
}

MediaFiles.prototype.__proto__ = Collection.prototype;


MediaFiles.prototype._extractData = function(data){
  return data[ 'audio_files' ] || data[ 'video_files' ] || data[ 'media_files' ];
};


MediaFiles.__defineGetter__("MediaTypes", function(){
  return {
    AUDIO: "AudioFile"
  };
});

MediaFiles.__defineGetter__("Sources", function(){
  return {
    Local: "local",
    Cloud: "cloud",
    Dropbox: "dropbox",
    Skydrive: "skydrive",
    Gdrive: "gdrive",
    Youtube: "youtube",
    Soundcloud: "soundcloud",
    Box: "box"
  };
});


MediaFiles.prototype.loadMap = function(source, cb){

  if ( typeof source == 'function' ){
    cb = source;
    source = undefined;
  }

  var
    self = this,
    request = this.RailsConnector.Request;

  // Set the 'extension' for the URL
  request.requestFormat = this.Configuration.RequestFormats.JSON;

  request.success = function(res, data){

    var collection = self._extractData( data );

    collection.forEach(function(item){
      var module = new this.module( this.Configuration, this.Connectors );
      module._parseResponse( item );
      this.push( module );
    }, self);


    if ( cb && cb.apply ){
      cb( self );
    }

  };

  return request.get(  [ MediaFiles.END_POINT, "hashes" ], {source: source} );


};

MediaFiles.prototype.__defineGetter__("MediaTypes", function(){
  return MediaFiles.MediaTypes;
});

MediaFiles.prototype.__defineGetter__("Sources", function(){
  return MediaFiles.Sources;
});

MediaFiles.__defineGetter__("END_POINT", function(){
  return END_POINT;
});