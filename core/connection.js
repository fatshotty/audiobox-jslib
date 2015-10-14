var EventEmitter = require("events").EventEmitter;
var Request = require("./request");
var Utils = require("../configuration/utils");
var Logger = require("logging").from(__filename);


module.exports = Connection;


function Connection(config, server){

  this._configuration = config;
  this._server = server;

  this._properties = {};

  var self = this;
  this.on( "connectionError", function(){
    if ( config.DefaultErrorHandler ) {
      config.DefaultErrorHandler.apply( self, arguments );
    }
  });

  EventEmitter.call(this);

  return this;
}


Utils.merge(Connection.prototype, EventEmitter.prototype);


Connection.prototype.set = function(key, value){
  if ( value === null || value === undefined ){
    delete this._properties[key]
  } else {
    this._properties[key] = value;
  }
  return this;
};
Connection.prototype.get = function(key){
  return this._properties[key] || null;
};


Connection.__defineGetter__("URISeparator", function(){
  return "/";
});

Connection.prototype.__defineGetter__("URISeparator", function(){
  return Connection.URISeparator;
});

Connection.prototype.__defineGetter__('Configuration', function(){
  return this._configuration;
});

Connection.prototype.__defineGetter__('Server', function(){
  return this._server;
});

Connection.prototype.__defineGetter__('Protocol', function(){
  return this.Configuration.Property( "Protocol", this.Server );
});

Connection.prototype.__defineGetter__('Host', function(){
  return this.Configuration.Property( "Host", this.Server );
});

Connection.prototype.__defineGetter__('Port', function(){
  return this.Configuration.Property( "Port", this.Server );
});

Connection.prototype.__defineGetter__('ApiPath', function(){
  return this.Configuration.Property( "ApiPath", this.Server );
});

Connection.prototype.__defineGetter__('UserAgent', function(){
  return this.Configuration.Property( "UserAgent" );
});


Connection.prototype.__defineGetter__('Request', function(){
  var request =  new Request(this);
  this.emit('new_request', request);
  return request;
});
