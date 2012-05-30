var Utils = require("../configuration/utils");
var Logger = require("logging");
var Module = require("./module");
var Collection = require("./collection");
var MediaFiles = require("./media_files");


/**
  playlist: {
    token: '803a9f413c8427c0',
    name: 'Homebrew',
    system_name: 'local',
    type: 'LocalPlaylist',
    media_files_count: 50,
    position: 1,
    offline: false,
    embeddable: false,
    visible: true,
    last_accessed: false,
    updated_at: '2012-05-09T21:21:35Z',
    sync_supported: false
  }
 */

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

  token: "",
  name: "",
  system_name: "",
  type: "",
  media_files_count: 0,
  position: 0,
  offline: false,
  embeddable: false,
  visible: false,
  last_accessed: false,
  updated_at: "",
  sync_supported: false

});


Playlist.prototype.__defineSetter__("updated_at", function(value){
  if ( value ) {
    this.fields[ "updated_at" ] = new Date( value );
  } else {
    this.fields[ "updated_at" ] = null;
  }
});


Playlist.prototype.__defineGetter__("mediaFiles", function(){
  if ( !this._mediaFiles ){
    this._mediaFiles = new Object();
  }
  return this._mediaFiles;
});