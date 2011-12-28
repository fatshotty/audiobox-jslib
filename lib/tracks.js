var Collection = require("./collection");


module.exports = Tracks;

function Tracks(){
  Collection.apply(this, arguments);
  return this;
}

Tracks.prototype.__proto__ = Collection.prototype;


Tracks.prototype._extractData = function(data){
  return data[ 'audio_files' ] || data[ 'video_files' ] || data[ 'media_files' ];
};