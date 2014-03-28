
(function(){

  window.Events = Events;

  function Events(config, connectors) {

    Collection.call(this, config, connectors, "events");

    return this;
  }


  Events.prototype.__proto__ = Collection.prototype;


  Events.__defineGetter__("END_POINT", function(){
    return [Configuration.APIPath, "node", "events"].join( Connection.URISeparator );
  });

  Events.prototype.__defineGetter__("END_POINT", function(){
    if ( this._parent instanceof Node ) {
      var url = [];
      if ( this._parent._parent instanceof Nodes ) {
        url = this._parent.END_POINT.split( Connection.URISeparator );
        url.pop(); // remove the ID of the node
      } else {
        // standalone NODE instantiated
        url = [this._parent.END_POINT];
      }
      return url.concat(["events"]).join( Connection.URISeparator );
    }
    return Events.END_POINT;
  });


  Events.prototype._extractData = function(data){
    return data.events;
  };
})();