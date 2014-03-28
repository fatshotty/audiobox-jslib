(function(){
  window.Nodes = Nodes;

  function Nodes(config, connectors) {

    Collection.call(this, config, connectors, "nodes");

    return this;
  }


  Nodes.prototype.__proto__ = Collection.prototype;

  Nodes.__defineGetter__("END_POINT", function(){
    return [Configuration.EnterpriseAPIPath, "nodes"].join( Connection.URISeparator );
  });

  Nodes.prototype.__defineGetter__("END_POINT", function(){
    return Nodes.END_POINT;
  });


  Nodes.prototype._extractData = function(data){
    return data.nodes;
  };


  Nodes.prototype.getNodeById = function(id){
    var n = null;
    this.forEach(function(node){
      if ( node.id == id ) {
        n = node;
        return false; // stop the loop
      }
    });
    return n;
  };

})();