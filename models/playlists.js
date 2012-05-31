var Collection = require("./collection");


module.exports = Playlists;
var END_POINT = "playlists";


function Playlists(config, connectors) {

  Collection.call(this, config, connectors, END_POINT);

  return this;
}


Playlists.prototype.__proto__ = Collection.prototype;



Playlists.__defineGetter__("PlaylistTypes", function(){
  return {
    LOCAL: "LocalPlaylist",
    CLOUD: "CloudPlaylist",
    DROPBOX: "DropboxPlaylist",
    SKYDRIVE: "SkydrivePlaylist",
    GDRIVE: "GdrivePlaylist",
    YOUTUBE: "YoutubePlaylist",
    SOUNDCLOUD: "SoundcloudPlaylist",
    BOX: "BoxPlaylist",
    CUSTOM: "CustomPlaylist",
    SMART: "SmartPlaylist"
  };
});

Playlists.prototype.__defineGetter__("PlaylistTypes", function(){
  return Playlists.PlaylistTypes;
});


Playlists.__defineGetter__("END_POINT", function(){
  return END_POINT;
});

Playlists.prototype.__defineGetter__("END_POINT", function(){
  return Playlists.END_POINT;
});




Playlists.prototype.__defineGetter__("drives", function(){
  var drives = [];
  for( var i = 0, l = this.length; i < l; i++ ){
    var pl = this[ i ];
    if (  !  ( ( pl.type === Playlists.PlaylistTypes.CUSTOM ) || ( pl.type === Playlists.PlaylistTypes.SMART )  )   )  {
      drives.push( pl );
    }
  }

  return drives;

});

Playlists.prototype.__defineGetter__("playlists", function(){
  var playlists = [];
  for( var i = 0, l = this.length; i < l; i++ ){
    var pl = this[ i ];
    if (  ( pl.type === Playlists.PlaylistTypes.CUSTOM ) || ( pl.type === Playlists.PlaylistTypes.SMART )   )  {
      playlists.push( pl );
    }
  }

  return playlists;
});