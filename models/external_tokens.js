var Module = require("./module");
var Logger = require("logging").from(__filename);

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


module.exports = ExternalTokens;


function ExternalTokens(config, connectors) {
  var self = this;
  Module.call( this, ExternalTokens.DECLARED_FIELDS, config, connectors );
}


ExternalTokens.prototype.__proto__ = Module.prototype;

ExternalTokens.DECLARED_FIELDS = Object.freeze({
  dropbox: false,
  gdrive: false,
  skydrive: false,
  soundcloud: false,
  youtube: false,
  box: false,
  lastfm: false,
  twitchtv: false,
  facebook: false,
  twitter: false
});