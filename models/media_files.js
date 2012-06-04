var Collection = require("./collection");


module.exports = MediaFiles;

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
    LOCAL: "local",
    CLOUD: "cloud",
    DROPBOX: "dropbox",
    SKYDRIVE: "skydrive",
    GDRIVE: "gdrive",
    YOUTUBE: "youtube",
    SOUNDCLOUD: "soundcloud",
    BOX: "box"
  };
});

MediaFiles.prototype.__defineGetter__("MediaTypes", function(){
  return MediaFiles.MediaTypes;
});

MediaFiles.prototype.__defineGetter__("Sources", function(){
  return MediaFiles.Sources;
});

MediaFiles.__defineGetter__("END_POINT", function(){
  return "media_files";
});