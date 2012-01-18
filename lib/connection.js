var EventEmitter = require("events").EventEmitter;
var Request = require("./request");
var Utils = require("./utils");
var Logger = require("logging").from(__filename);


module.exports = Connection;


function Connection(env){


  this.environment = {};
  this._properties = {};

  if ( env ){
    this.ENV = env;
  }

  return this;
}



Connection.prototype.__proto__ = EventEmitter.prototype;



Connection.prototype.set = function(key, value){
  this._properties[key] = value;
};

Connection.prototype.get = function(key){
  var value = this.environment[ key ] || this._properties[ key ];
  Logger("get ", key, value);
  return value;
};



Connection.prototype.__defineSetter__("ENV", function( env ){

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


Connection.prototype.__defineGetter__('HTTPServer', function(){
  return this.get( 'HTTPServer' );
});

Connection.prototype.__defineGetter__('HTTPPort', function(){
  return this.get( 'HTTPPort' );
});

Connection.prototype.__defineGetter__('UPServer', function(){
  return this.get( 'UPServer' );
});

Connection.prototype.__defineGetter__('UPPort', function(){
  return this.get( 'UPPort' );
});

Connection.prototype.__defineGetter__('UserAgent', function(){
  return this.get( 'UserAgent' );
});


Connection.prototype.__defineGetter__("apiPath", function(){
  return "/api/v2/";
});


Connection.prototype.__defineGetter__('Request', function(){
  var request =  new Request(this);
  this.emit('new_request', request);
  return request;
});