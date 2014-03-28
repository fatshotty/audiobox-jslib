(function(){
  window.Node = Node;


  function Node(config, connectors){

    Module.call( this, Node.DECLARED_FIELDS, config, connectors );

    return this;
  }

  Node.prototype.__proto__ = Module.prototype;


  Node.prototype.__defineGetter__("END_POINT", function(){
    if ( this._parent instanceof Nodes ) {
      return [this._parent.END_POINT, this.id].join( Connection.URISeparator );
    } else {
      return [Configuration.APIPath, "node"].join( Connection.URISeparator );
    }
  });

  Node.DECLARED_FIELDS = Object.freeze({
    id: 0,
    title: "",
    email: "",
    authentication_token: "",
    play_count: 0,
    country: "",
    address: "",
    latitude: 0.0,
    longitude: 0.0,
    unit: "",
    phone: "",
    street: "",
    locality: "",
    region: "",
    postal_code: "",
    last_object: {},
    last_client: "",
    is_public_place: false,
    created_at: "",
    updated_at: "",
    customer_id: 0,
    online: false
  });


  Node.prototype.setAuthentication = function(token) {
    var self = this;
    var addAuthToken = function(request) {
      if ( self._authentication_token ){
        Logger("setting auth_token", self._authentication_token);
        request.setAuthentication( "auth_token", "x-auth-token", self._authentication_token, true );
      }
    };

    // Reset authentication

    delete this._authentication_token;
    this.RailsConnector.removeAllListeners("new_request");
    this.NodeConnector.removeAllListeners("new_request");
    this.DaemonConnector.removeAllListeners("new_request");

    if ( token ) {
      this._authentication_token = token;
      // We have to set the first listener on the Connection class
      // In this way we are sure Auth parameter is correctly set!
      this.RailsConnector.on( "new_request", addAuthToken );
      this.NodeConnector.on( "new_request",  addAuthToken );
      this.DaemonConnector.on( "new_request",  addAuthToken );
    }

  }


  Node.prototype.__defineSetter__("updated_at", function(value){
    if ( value ) {
      this.fields[ "updated_at" ] = new Date( value );
    } else {
      this.fields[ "updated_at" ] = null;
    }
  });

  Node.prototype.__defineSetter__("created_at", function(value){
    if ( value ) {
      this.fields[ "created_at" ] = new Date( value );
    } else {
      this.fields[ "created_at" ] = null;
    }
  });


  Node.prototype.__defineGetter__("Events", function(){
    if ( !this._events ){
      this._events = new Events(this.Configuration, this.Connectors);
      this._events.parent = this;
    }
    return this._events;
  });


  Node.prototype._extractData = function(data){
    return data.node || data.company_node;
  };


  Node.prototype.load = function(authToken){
    // Reset all fields
    var authToken = authToken || this._authentication_token;
    this._clear();

    if ( authToken ) {
      this.setAuthentication(authToken);
    }

    var self = this;  // shortcut to 'this' instance

    var request = this.RailsConnector.Request; // new request


    // Set the 'extension' for the URL
    request.requestFormat = this.Configuration.RequestFormats.JSON;


    // Request successfully completed
    request.success = function(res, data){

      // data = JSON.parse(data);
      var nodedata = self._extractData( data );
      self._parseResponse( nodedata );
      self.emit('login', true);
      self._abx_.emit('login', true);

    };

    request.error = function(){
      self._loaded = false;
      self.emit('login', false);
      self._abx_.emit('login', false);
    }

    return request.get( this.END_POINT );
  };


  Node.prototype._clear = function() {
    Module.prototype._clear.call(this);
    delete this._authentication_token
    this._events && this._events._clear();
    this._events = null;
  };
})();