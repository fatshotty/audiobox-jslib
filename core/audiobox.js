var Utils = require("../configuration/utils");
var Connection = require("./connection");
var Configuration = require("../configuration/configuration");
var Collection = require("../models/collection");
var Logger = require("logging").from(__filename);
require("../configuration/inflector");
var User = require("../models/user");


module.exports = AudioBox;


function AudioBox( config ) {

  this._configuration = config;

  this._connectors = {}
  this._connectors[ Configuration.SERVERS.RAILS ] = new Connection( this.Configuration , Configuration.SERVERS.RAILS );
  this._connectors[ Configuration.SERVERS.NODE ] = new Connection( this.Configuration , Configuration.SERVERS.NODE );
  this._connectors[ Configuration.SERVERS.DAEMON ] = new Connection( this.Configuration , Configuration.SERVERS.DAEMON );

  return this;
}

AudioBox.prototype.__proto__ = EventEmitter.prototype;

AudioBox.prototype.logout = function(){
  if( this.listeners("logout").length > 0 ) {
    this.emit("logout");
  }
  this._user = null;
};


AudioBox.prototype.__defineGetter__("Configuration", function(){
  return this._configuration;
});

AudioBox.prototype.__defineGetter__("Connectors", function(){
  return this._connectors;
});

AudioBox.prototype.__defineGetter__("User", function(){
  if ( !this._user ){
    Logger("User requested");
    this._user = new User( this.Configuration, this.Connectors );
  }
  return this._user;
});


AudioBox.prototype.__defineGetter__("RailsConnector", function() {
  return this._connectors[ Configuration.SERVERS.RAILS ];
});
AudioBox.prototype.__defineGetter__("NodeConnector", function() {
  return this._connectors[ Configuration.SERVERS.NODE ];
});
AudioBox.prototype.__defineGetter__("DaemonConnector", function() {
  return this._connectors[ Configuration.SERVERS.DAEMON ];
});