(function(){

  var CacheManager = function(config){
    this._configuration = config;
  }

  CacheManager.prototype.__defineGetter__("Configuration", function(){
    return this._configuration;
  });


  CacheManager.prototype.setRequest = function(request, url, options, cb){
    cb("");
  };

  CacheManager.prototype.setBody = function(request, data, response, ecode, cb){
    cb();
  };

  CacheManager.prototype.getBody = function(request, url, options, cb){
    cb("");
  };

  window.CacheManager = CacheManager;

})();