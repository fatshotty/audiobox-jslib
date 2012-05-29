var Utils = require("./utils");
var Logger = require("logging");
var Collection = require("./collection");

module.exports = Module;

function Module(declared_fields, config, connectors){


  this._fields = {};

  this._configuration = config;
  this._connectors = connectors;

  /*
   * Adds all property as GET method
   */
  Object.keys( declared_fields ).forEach(function(fName){

    this.__defineGetter__(fName, function(){

      var value = this._fields[ fName ];

      if ( ! Utils.isDefined(value) ){

        // No value exists, try to instantiate a new one
        var value = declared_fields[ fName ];

        if ( typeof value == "function" ){

          value = new value( this.connector, fName );

          if( value.CLASS_TYPE == Collection.CLASS_TYPE ) {
            Logger("found a collection child", fName);
            value.parent = this;

          }
        }

        this._fields[ fName ] = value;
      }

      return value;
    });

  }, this);





  /*
   * Parse the response returned by the server
   */
  this._parseResponse = function(data){

    var keys = Object.keys(data);

    // Populate class with server response
    keys.forEach(function(field){

      var type = declared_fields[ field ];

      if (  Module.prototype.isPrototypeOf( type ) ){
        var value = new type(this.connector);
        value._parseResponse( data[field] );
        this._fields[ field ] = value
      } else {
        this._fields[ field ] = data[ field ];
      }

    }, this);

    return this;
  };


  this.__defineGetter__("CLASS_TYPE", function(){
    return Module.CLASS_TYPE;
  });

  return this;

}




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