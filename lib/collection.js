var Utils = require("./utils");
var Logger = require("logging");
var EventEmitter = require("events").EventEmitter;


module.exports = Collection;


function Collection(connector, module_name){

  this._isLoaded = false;

  this.module_name = module_name
  this.module = require("./" + module_name.singularize() );
  this.connector = connector;

  return this;
}
Collection.prototype = EventEmitter.prototype;
Collection.prototype.__proto__ = Array.prototype;


Collection.prototype.__defineSetter__('parent', function(parent){
  this._parent = parent;
});


Collection.prototype.__defineGetter__('isLoaded', function(){
  return this._isLoaded;
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
    request = this.connector.Request;

  request.success = function(res, data){

    var
      collection = self._extractData( data );

    collection.forEach(function(item){
      var module = new this.module( self.connector );
      module._parseResponse( item );
      this.push( module );
    }, self);

    self._isLoaded = true;

  };

  var url = "";
  if ( this._parent ){
    url = this._parent.END_POINT + "/" + this._parent.token;
  } else {
    url = this.module.DECLARED_FIELDS.END_POINT;
  }
  return request.get( url );
};



Collection.prototype._extractData = function(data){
  return data[ this.module_name ];
};


Collection.prototype.find = function(value){
  for( var i = 0, l = this.length; i < l; i++ ){
    var item = this[ i ];
    if ( item.token == value ){
      return item;
    }
  }
  return null;
};


Collection.prototype.findBy = function(field, value){

  Logger("find by", field, value);
  for( var i = 0, l = this.length; i < l; i++ ){
    var item = this[ i ];
    if ( item[ field ] == value ){
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
      result.push( item );
    }
  }
  return result;
};

Collection.prototype.__defineGetter__("CLASS_TYPE", function(){return Collection.CLASS_TYPE;});

Collection.__defineGetter__("CLASS_TYPE", function(){return "AudioBox.ModelCollection";});