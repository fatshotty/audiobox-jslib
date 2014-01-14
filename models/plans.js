var Collection = require("./collection");


module.exports = Plans;
var END_POINT = "plans";


function Plans(config, connectors) {

  Collection.call(this, config, connectors, END_POINT);

  return this;
}


Plans.prototype.__proto__ = Collection.prototype;


Plans.__defineGetter__("Types", function(){
  return {
    gb5:   "audiobox_5",
    gb50:  "audiobox_50",
    gb100: "audiobox_100",
    gb200: "audiobox_200"
  };
});


Plans.prototype.__defineGetter__("Types", function(){
  return Plans.Types;
});

Plans.__defineGetter__("END_POINT", function(){
  return END_POINT;
});

Plans.prototype.__defineGetter__("END_POINT", function(){
  return Plans.END_POINT;
});