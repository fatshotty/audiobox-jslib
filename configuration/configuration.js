var Utils = require("./utils");
var Logger = require("logging").from(__filename);


module.exports = Configuration;


function Configuration(env) {

  if ( !env ){
    env = "development";
    Logger("no environment set, use development instead");
  }

  this.ENV = env;

  return this;
}


Configuration.__defineGetter__("SERVERS", function(){
  return {
    RAILS: "Rails",
    NODE: "Node",
    DAEMON: "Daemon"
  };
});
Configuration.__defineGetter__("RequestFormats", function(){
  return {
    JSON: "json",
    XML: "xml",
    BINARY: ""
  };
});


Configuration.prototype.__defineGetter__("SERVERS", function(){
  return Configuration.SERVERS;
});

Configuration.prototype.__defineGetter__("RequestFormats", function(){
  return Configuration.RequestFormats;
});



Configuration.prototype.__defineSetter__("DefaultErrorHandler", function(callback){
  this._defaultErrorHandler = callback;
});

Configuration.prototype.__defineGetter__("DefaultErrorHandler", function(){
  return this._defaultErrorHandler;
});




Configuration.prototype.__defineSetter__("ENV", function(env) {

  this.environment = {};

  var
    settings = require("../config/" + env ),
    keys = Object.keys(settings);

  Logger("loaded environment", settings);

  keys.forEach(function(k){
    this.environment[ k ] = settings[ k ];
  }, this);

  Utils.freeze( this.environment );
});




Configuration.prototype.Property = function(key, Server) {
  if ( Server ){
    return this.Property( Server + key );
  }
  return this.environment[ key ];
};


Configuration.prototype.Protocol = function(Server) {
  return this.Property( "Protocol", Server );
};

Configuration.prototype.Host = function(Server) {
  return this.Property( "Host", Server );
};

Configuration.prototype.Port = function(Server) {
  return this.Property( "Port", Server );
};

Configuration.prototype.ApiPath = function(Server) {
  return this.Property( "ApiPath", Server );
};
