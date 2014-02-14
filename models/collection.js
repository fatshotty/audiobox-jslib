var EventEmitter = require("events").EventEmitter;


window.Collection = Collection;


function Collection(config, connectors, module_name){

  this._configuration = config;
  this._connectors = connectors;

  this._isLoaded = false;

  this.module_name = module_name
  this.module = require("./" + module_name.singularize() );

  // this.end_point = end_point;

  EventEmitter.call(this);
  Array.call(this);

  return this;
}


Collection.prototype.__proto__ = Array.prototype;
Utils.merge(Collection.prototype, EventEmitter.prototype);


Collection.prototype.__defineSetter__('parent', function(parent){
  this._parent = parent;
});

Collection.prototype.__defineGetter__('parent', function(){
  return this._parent;
});


Collection.prototype.__defineGetter__('isLoaded', function(){
  return this._isLoaded;
});


Collection.prototype.__defineGetter__("Connectors", function(){
  return this._connectors;
});

Collection.prototype.__defineGetter__("Configuration", function(){
  return this._configuration;
});


Collection.prototype.__defineGetter__("RailsConnector", function(){
  return this.Connectors[ this.Configuration.SERVERS.RAILS ];
});

Collection.prototype.__defineGetter__("NodeConnector", function(){
  return this.Connectors[ this.Configuration.SERVERS.NODE ];
});

Collection.prototype.__defineGetter__("DaemonConnector", function(){
  return this.Connectors[ this.Configuration.SERVERS.DAEMON ];
});



Collection.prototype._push = Array.prototype.push;

Collection.prototype.push = function(item){
  this._push(item);
  this.emit("add", item);
};


Collection.prototype.load = function(){

  this.length = 0;

  var
    self = this,
    request = this.RailsConnector.Request;

  // Set the 'extension' for the URL
  request.requestFormat = this.Configuration.RequestFormats.JSON;

  request.success = function(res, data){

    // data = JSON.parse( data );

    var collection = self._extractData( data );

    collection.forEach(function(item){
      var module = new this.module( this.Configuration, this.Connectors );
      module._parseResponse( item );
      this.push( module );
    }, self);

    self._isLoaded = true;

  };

  var url = "";
  if ( this._parent ){
    url = "/" + this._parent.END_POINT + "/" + this._parent.token;
  }

  url += "/" + this.module_name;

  return request.get( url );
};



Collection.prototype._populate = function(collection){
  this.emit("populateStart", this);

  collection.forEach(function(item){
    var module = new this.module( this.Configuration, this.Connectors );
    module._parseResponse( item );
    this.push( module );
  }, this);
  this._isLoaded = true;

  this.emit("populateEnd", this);
};



Collection.prototype._extractData = function(data){
  return data[ this.module_name ];
};


Collection.prototype.find = function(value){
  for( var i = 0, l = this.length; i < l; i++ ){
    var item = this[ i ];
    if ( item.token == value ){
      item.__index__ = i;
      return item;
    }
  }
  return null;
};


Collection.prototype.findBy = function(field, value){

  for( var i = 0, l = this.length; i < l; i++ ){
    var item = this[ i ];
    if ( item[ field ] == value ){
      item.__index__ = i;
      return item;
    }
  }
  return null;

};


Collection.prototype.findAllBy = function(field, value){
  var result = [];
  for( var i = 0, l = this.length; i < l; i++ ){
    var item = this[ i ];
    if ( item.token == value ){
      item.__index__ = i;
      result.push( item );
    }
  }
  return result;
};

Collection.prototype.__defineGetter__("CLASS_TYPE", function(){return Collection.CLASS_TYPE;});

Collection.__defineGetter__("CLASS_TYPE", function(){return "AudioBox.ModelCollection";});