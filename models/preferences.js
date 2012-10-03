var Module = require("./module");
var Logger = require("logging").from(__filename);

/**
  accept_emails: '1',
  autoplay: false,
  volume_level: 85,
  color: 'shadows-grey',
  top_bar_bg: 'space'
 */


module.exports = Preferences;


function Preferences(config, connectors) {
  var self = this;
  Module.call( this, Preferences.DECLARED_FIELDS, config, connectors );
}


Preferences.prototype.__proto__ = Module.prototype;

Preferences.DECLARED_FIELDS = Object.freeze({
  accept_emails: false,
  autoplay: false,
  volume_level: 50,
  color: "",
  top_bar_bg: "space"
});