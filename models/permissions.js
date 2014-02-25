/**
  player: true,
  local: true,
  cloud: false,
  dropbox: false,
  gdrive: false,
  skydrive: false,
  ubuntu: false,
  box: false,
  soundcloud: true,
  youtube: true,
  lastfm: true,
  twitchtv: true,
  facebook: true,
  twitter: true,
  lyrics: true,
  musixmatch: true,
  songkick: true
 */

(function(){
  window.Permissions = Permissions;


  function Permissions(config, connectors) {
    var self = this;
    Module.call( this, Permissions.DECLARED_FIELDS, config, connectors );
  }


  Permissions.prototype.__proto__ = Module.prototype;

  Permissions.DECLARED_FIELDS = Object.freeze({
    player: false,
    local: false,
    cloud: false,
    dropbox: false,
    gdrive: false,
    skydrive: false,
    ubuntu: false,
    box: false,
    soundcloud: false,
    youtube: false,
    lastfm: false,
    twitchtv: false,
    facebook: false,
    twitter: false,
    lyrics: false,
    musixmatch: false,
    songkick: false
  });

  Permissions.prototype._extractData = function(data){
    return data.permissions;
  };
})();