var Module = require("./module");
var Logger = require("logging").from(__filename);

/**
  permissions = {
    local: true,
    cloud: true,
    dropbox: true,
    gdrive: true,
    skydrive: true,
    soundcloud: false
    youtube: true,
    box: true,
    lastfm: false
  }
 */


module.exports = Permissions;


function Permissions(config, connectors) {
  var self = this;
  Module.call( this, Permissions.DECLARED_FIELDS, config, connectors );
}


Permissions.prototype.__proto__ = Module.prototype;

Permissions.DECLARED_FIELDS = Object.freeze({

  local: false,
  cloud: false,
  dropbox: false,
  gdrive: false,
  skydrive: false,
  soundcloud: false,
  youtube: false,
  box: false,
  lastfm: false
});