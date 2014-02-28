(function(){
  window.Node = Node;


  function Node(config, connectors){

    Module.call( this, Node.DECLARED_FIELDS, config, connectors );

    return this;
  }

  Node.prototype.__proto__ = Module.prototype;



  Node.__defineGetter__("END_POINT", function(value){
    return Nodes.END_POINT;
  });

  Node.prototype.__defineGetter__("END_POINT", function(value){
    return Node.END_POINT;
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

  Node.prototype._clear = function() {
    Module.prototype._clear.call(this);
    this._events && this._events._clear();
    this._events = null;
  };
})();