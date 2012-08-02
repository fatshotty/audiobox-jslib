var Utils = require("../configuration/utils");
var Logger = require("logging");
var Collection = require("./collection");
var EventEmitter = require("events").EventEmitter;

module.exports = Module;

function Module(declared_fields, config, connectors){


  this._fields = {};

  this._configuration = config;
  this._connectors = connectors;

  /*
   * Adds all property as GET method
   */
  Object.keys( declared_fields ).forEach(function(fName){

    if ( !this.__lookupGetter__(fName) ){

      this.__defineGetter__( fName, function() {
        return this._fields[ fName ] || null;

      });

    }

    if ( ! this.__lookupSetter__(fName) ){

      this.__defineSetter__( fName, function(value) {
        this._fields[ fName ] = value;
      });

    }


  }, this);




  /*
   * Parse the response returned by the server
   */
  this._parseResponse = function(data){

    if ( !data ) return this;

    Object.keys( data ).forEach(function(fName){

      var value = data[ fName ];
      if ( value === null || value === undefined ){
        return true;
      }

      if ( this[ fName ] && this[ fName ]._parseResponse ){

        // This is an Object attribute
        if ( typeof value === "object" ){

          // We can populate it with the data response
          this[ fName ]._parseResponse( value );
        }

      } else {

        // Simple property, invoke Set method
        this[ fName ] = value;
      }

    }, this)

    // Populate class with server response


    return this;
  };


  this.__defineGetter__("CLASS_TYPE", function(){
    return Module.CLASS_TYPE;
  });

  return this;

}



require("util").inherits(Module, EventEmitter);


Module.prototype._clear = function(){
  this._fields = {};
};


Module.prototype._extractData = function(data){
  return data[ this.END_POINT ];
};


Module.prototype.__defineGetter__("Connectors", function(){
  return this._connectors;
});

Module.prototype.__defineGetter__("Configuration", function(){
  return this._configuration;
});

Module.prototype.__defineGetter__("RailsConnector", function(){
  return this.Connectors[ this.Configuration.SERVERS.RAILS ];
});

Module.prototype.__defineGetter__("NodeConnector", function(){
  return this.Connectors[ this.Configuration.SERVERS.NODE ];
});

Module.prototype.__defineGetter__("DaemonConnector", function(){
  return this.Connectors[ this.Configuration.SERVERS.DAEMON ];
});


Module.__defineGetter__("CLASS_TYPE", function(){return "AudioBox.Model"});