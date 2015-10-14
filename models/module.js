(function(){
  window.Module = Module;





  function Module(declared_fields, config, connectors){

    this._fields = {};

    this._configuration = config;
    this._connectors = connectors;

    this._properties = {};
    this._loaded = false;

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
            this[ fName ]._parseResponse( value );
          }

        } else {

          // Simple property, invoke Set method
          this[ fName ] = value;
        }

      }, this)

      // Populate class with server response

      this._loaded = true;

      return this;
    };


    this.__defineGetter__("CLASS_TYPE", function(){
      return Module.CLASS_TYPE;
    });

    EventEmitter.call(this);

    return this;

  }



  Utils.merge(Module.prototype, EventEmitter.prototype);


  Module.prototype._clear = function(){
    this._fields = {};
    this.emit("clear");
  };


  Module.prototype.getProperty = function(key){
    return this._properties[ key ];
  };

  Module.prototype.setProperty = function(key, value){
    this._properties[ key ] = value;
    return this;
  };

  Module.prototype.__defineGetter__("isLoaded", function(){
    return this._loaded;
  });

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
})();
