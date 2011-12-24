var Utils = require("./utils");
var Logger = require("logging");


module.exports = Collection;


function Collection(module_name, connector){

  this.module_name = module_name
  this.module = require("./" + module_name.singularize() );
  this.connector = connector;

  return this;
}

Collection.prototype.__proto__ = Array.prototype;



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