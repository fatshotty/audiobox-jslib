var Utils = require("./utils");
var Logger = require("logging");
var EventEmitter = require("events").EventEmitter;


module.exports = Collection;


function Collection(module_name, connector){

  this.module_name = module_name
  this.module = require("./" + module_name.singularize() );
  this.connector = connector;

  // EventEmitter.call(this);

  return this;
}
Collection.prototype = EventEmitter.prototype;
Collection.prototype.__proto__ = Array.prototype;



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
      collection = data[ self.module_name ];

    collection.forEach(function(item){
      var module = new this.module( self.connector );
      module._parseResponse( item );
      this.push( module );
    }, self);

  };

  return request.get( this.module_name );
};


Collection.prototype.find = function(value){
  for( var i = 0, l = this.length; i < l; i++ ){
    var item = this[ i ];
    if ( item.token == value ){
      return item;
    }
  }
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

