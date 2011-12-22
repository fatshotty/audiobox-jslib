var Utils = require("./utils");
var Logger = require("logging");

module.exports = Module;

function Module(declared_fields){

  // Adds all property as GET method
  Object.keys( declared_fields ).forEach(function(fName){

    this.__defineGetter__(fName, function(){

      var value = this._fields[ fName ];

      if ( ! Utils.isDefined(value) ){
        // No value exists, try to instantiate a new one
        var value = declared_fields[ fName ];

        if (  Module.prototype.isPrototypeOf( value )  ){
          // It seems to be a sub module, try to create that
          value = new type( this.connector );
        }

        this._fields[ fName ] = value;
      }

      return value;
    });

  }, this);

  return this;
}

Module.prototype.__defineGetter__("CLASS_TYPE", function(){
  return "AudioBox.Model";
});
