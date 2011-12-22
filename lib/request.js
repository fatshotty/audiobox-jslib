var Utils = require("./utils");
var EventEmitter = require("events").EventEmitter;
var Rest = require("restler");
var Logger = require("logging").from(__filename);




module.exports = Request;


/**
 *  Request declaration
 */

function Request(connection){
  this.connector = connection;

  // default value for "Accept" header
  this.acceptType = "application/json";
  this.userAgent = this.connector.UserAgent;

  return this;
}

Request.prototype.__proto__ = EventEmitter.prototype;


/* Used while sending request */
Request.prototype._options = {headers:{}, data:{}};


/* Used for login */
Request.prototype.setCredentials = function(username, password){
  this._options.username = username;
  this._options.password = password;
  return this;
};


/* Adds query parameters */
Request.prototype.addParam = function(key, value){
  this._options.data[ key ] = value
  return this;
};



/* ================================
            GET/SET methods
   ================================= */


/* Used for each other requests */
Request.prototype.__defineSetter__("auth_token", function(auth){
  if ( auth ){
    // auth token is set
    this.addParam( "auth_token", auth );
  } else {
    // auth token is not in a valid format. Remove it from query string
    Logger("removed auth token");
    delete this._options.data.auth_token;
  }
  return this;
});


// TODO: fix the name of the property
Request.prototype.__defineSetter__('upload', function(value){
  this._options.multipart = !!value;
});
Request.prototype.__defineGetter__('upload', function(){
  return !!this._options.multipart;
});

// Accept type header
Request.prototype.__defineSetter__('acceptType', function(value){
  this._options.headers['Accept'] = value;
});
Request.prototype.__defineGetter__('acceptType', function(){
  return this._options.headers['Accept'];
});


// UserAgent header
Request.prototype.__defineSetter__('userAgent', function(value){
  this._options.headers['User-Agent'] = value;
});
Request.prototype.__defineGetter__('userAgent', function(){
  return this._options.headers['User-Agent'];
});



/* ================================
                EVENTS
   ================================= */
Request.prototype.__defineSetter__("beforeSend", function(fn){
  this.on('beforeSend', fn);
});
Request.prototype.__defineSetter__("success", function(fn){
  this.on('success', fn);
});
Request.prototype.__defineSetter__("complete", function(fn){
  this.on('complete', fn);
});
Request.prototype.__defineSetter__("error", function(fn){
  this.on('error', fn);
});





/* ===========================
        COMMON METHODS
  ============================ */
Request.prototype.parseUrl = function(){
  var host = "http://";

  if ( this.upload ){
    host += this.connector.UPServer + ":" + this.connector.UPPort
  } else {
    host += this.connector.HTTPServer + ":" + this.connector.HTTPPort
  }


  var url = this.url;

  if ( url.indexOf("/") == 0 ){
    url = url.substring(1);
  }

  url = host + this.connector.apiPath + url + ".json";

  return url;
};




Request.prototype._execute = function(method, url, options){

  var self = this;

  options.method = method;

  Logger("executing request ", method.toUpperCase(), url); //, options);

  this.request = Rest.request(url, options);

  this.request
    .on("complete", function(data, response){

      eval("data = " + data);

      if ( response.statusCode >= 200 && response.statusCode < 300  ){
        self.emit("success", response, data );
      } else {
        self.emit("error", response, data );
      }

      self.emit("complete", response, data );
    })
    .on("error", function(data, response){
      self.emit("error", response, data );
    });
};


Request.prototype.abort = function(){
  if ( this.request ){
    this.request.abort(); // TODO: check the method name
  }
  return this;
};


/** REST method */
Request.prototype.get = function(url, params){

  this.url = url;
  this.params = params

  this.emit('beforeSend', this);

  Object.keys(params||{}).forEach(function(k){
    this.options.data[ k ] = params[ k ];
  });

  this._options.data = {};

  this._execute( 'get', this.parseUrl(), this._options );

  return this;
};

Request.prototype.post = function(){

};

Request.prototype.put = function(){

};

Request.prototype.del = function(){

};
