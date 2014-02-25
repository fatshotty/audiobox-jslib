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
    return Event.END_POINT;
  });


  Event.prototype._extractData = function(data){
    return data.event;
  };


  Event.DECLARED_FIELDS = Object.freeze({
    id: 0,
    playlist_token: "",
    schedule: "",
    comment: ""
  });


})();