var Utils = require("../configuration/utils");
var Connection = require("./connection");
var Configuration = require("../configuration/configuration");
var Collection = require("../models/collection");
var Logger = require("logging").from(__filename);
var EventEmitter = require("events").EventEmitter;
require("../configuration/inflector");
var User = require("../models/user");
var User = require("../models/company");


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

  // remove all listener for login
  this.RailsConnector.removeAllListeners( "new_request" );
  this.NodeConnector.removeAllListeners( "new_request" );
  this.DaemonConnector.removeAllListeners( "new_request" );

  if ( this._user ) {
    this._user.clear();
  }
  if ( this._company ) {
    this._company.clear();
  }

  if( this.listeners("logout").length > 0 ) {
    this.emit("logout");
  }
  this._user = null;
  this._company = null;
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
    if ( this._company ){
      // Company is already loggedin, so we must perform a completely logout
      Logger("Company is already logged in, perform a logout");
      this.logout();
    }
    this._user = new User( this.Configuration, this.Connectors );
  }
  return this._user;
});

AudioBox.prototype.__defineGetter__("Company", function(){
  if ( !this._company ){
    Logger("Company requested");
    if ( this._user ){
      // Company is already loggedin, so we must perform a completely logout
      Logger("User is already logged in, perform a logout");
      this.logout();
    }
    this._company = new Company( this.Configuration, this.Connectors );
  }
  return this._company;
});

AudioBox.prototype.__defineSetter__("disableAuth", function(value){
  this.User.disableAuth = value;
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