
window.Nodes = Nodes;
const END_POINT = Configuration.EnterpriseAPIPath + Connection.URISeparator + "nodes";


function Nodes(config, connectors) {

  Collection.call(this, config, connectors, "nodes");

  return this;
}


Nodes.prototype.__proto__ = Collection.prototype;

Nodes.__defineGetter__("END_POINT", function(){
  return END_POINT;
});

Nodes.prototype.__defineGetter__("END_POINT", function(){
  return Playlists.END_POINT;
});


Nodes.prototype._extractData = function(data){
  return data.nodes;
};