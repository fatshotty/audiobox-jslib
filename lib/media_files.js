var Collection = require("./collection");


module.exports = MediaFiles;

function MediaFiles(connector, module_name){
  Collection.call(this, connector, "media_files");
  return this;
}

MediaFiles.prototype.__proto__ = Collection.prototype;


MediaFiles.prototype._extractData = function(data){
  return data[ 'audio_files' ] || data[ 'video_files' ] || data[ 'media_files' ];
};