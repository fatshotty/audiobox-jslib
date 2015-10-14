
/**
  dropbox: true,
  gdrive: true,
  skydrive: true,
  soundcloud: true,
  youtube: true,
  box: true,
  lastfm: true,
  twitchtv: true,
  facebook: true,
  twitter: true
 */
(function(){

  window.ExternalTokens = ExternalTokens;




  function ExternalTokens(config, connectors) {
    var self = this;
    Module.call( this, ExternalTokens.DECLARED_FIELDS, config, connectors );
  }


  ExternalTokens.prototype.__proto__ = Module.prototype;

  ExternalTokens.DECLARED_FIELDS = Object.freeze({
    dropbox: false,
    gdrive: false,
    skydrive: false,
    ubuntu: false,
    soundcloud: false,
    youtube: false,
    box: false,
    lastfm: false,
    twitchtv: false,
    facebook: false,
    twitter: false
  });

  ExternalTokens.prototype._extractData = function(data){
    return data.external_tokens;
  };
})();
