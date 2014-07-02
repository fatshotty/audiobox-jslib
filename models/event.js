(function(){
  window.Event = Event;


  function Event(config, connectors){

    Module.call( this, Event.DECLARED_FIELDS, config, connectors );

    return this;
  }

  Event.prototype.__proto__ = Module.prototype;


  Event.__defineGetter__("END_POINT", function(value){
    return Events.END_POINT;
  });

  Event.prototype.__defineGetter__("END_POINT", function(value){
    if ( this._parent ) {
      return [ this._parent.END_POINT, this.id ].join( Connection.URISeparator );
    }
    return Event.END_POINT;
  });


  Event.prototype._extractData = function(data){
    return data.event;
  };

  Event.prototype.__defineGetter__("Playlist", function(value){
    if ( ! this._playlist ) {
      this._playlist = new Playlist(this.Configuration, this.Connectors);
      this._playlist._parent = this;
    }
    return this._playlist;
  });


  Event.DECLARED_FIELDS = Object.freeze({
    id: 0,
    playlist_token: "",
    schedule: "",
    comment: "",
    promo: false
  });

  Event.prototype._clear = function() {
    this._playlist && this._playlist._clear();
    delete this._playlist;
    Module.prototype._clear.call(this);
  };


})();