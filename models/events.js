var Collection = require("./collection");


module.exports = Events;
const END_POINT = Configuration.APIPath + Connection.URISeparator + "events";


function Events(config, connectors) {

  Collection.call(this, config, connectors, "events");

  return this;
}


Events.prototype.__proto__ = Collection.prototype;


Events.__defineGetter__("END_POINT", function(){
  return END_POINT;
});

Events.prototype.__defineGetter__("END_POINT", function(){
  return Events.END_POINT;
});


Events.prototype._extractData = function(data){
  return data.events;
};