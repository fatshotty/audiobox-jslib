var Utils = require("./utils");
var EventEmitter = require("events").EventEmitter;
var Rest = require("restler");
var Logger = require("logging").from(__filename);
var FS = require('fs');




module.exports = Request;


/**
 *  Request declaration
 */

function Request(connection){
  this.connector = connection;

  this._options = {headers:{}, data:{}};

  // default value for "Accept" header
  this.acceptType = "application/json";
  this.userAgent = this.connector.UserAgent;


  // Empty Event interceptor to avoid EventEmitter errors
  this.on("complete", function(){});
  this.on("success", function(){});
  this.on("error", function(){});
  this.on("beforeSend", function(){});


  return this;
}

Request.prototype.__proto__ = EventEmitter.prototype;


/* Used for login */
Request.prototype.setCredentials = function(username, password){
  this._options.username = username;
  this._options.password = password;
  return this;
};


/* Adds query parameters */
Request.prototype.addParam = function(key, value){
  this._options.data[ key ] = value
  // Logger("in AddParam", key, value, this._options);
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

Request.prototype.__defineSetter__('downloadFile', function(value){
  this._downloadFile = value;
});
Request.prototype.__defineGetter__('downloadFile', function(){
  return this._downloadFile
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

Request.prototype.getUrl = function(url){

  var url = this.parseUrl( url );

  url += "?auth_token=" + this._options.data.auth_token;

  return url;
};

Request.prototype.parseUrl = function(url){

  var host = "http://";

  if ( this.upload || !!this.downloadFile ){
    host += this.connector.NodeServer + ":" + this.connector.NodePort + "/";
  } else {
    host += this.connector.RailsServer + ":" + this.connector.RailsPort + this.connector.apiPath;
  }


  var url = url || this.url;

  if ( !url ) return "";

  if ( url.indexOf("/") == 0 ){
    url = url.substring(1);
  }

  url = host + url + (  ( this.upload || !!this.downloadFile ) ? "" : ".json");

  return url;
};




Request.prototype._execute = function(method, url, options){

  var
    self = this,
    _options = {};

  _options.method = method;
  _options.followRedirects = false;
  _options.data = options.data;
  _options.headers = options.headers;
  _options.username = options.username;
  _options.password = options.password;

  Logger("executing request ", method.toUpperCase(), url);//, options);

  var file = null;
  if ( !!this.downloadFile ){
    file = FS.openSync( this._downloadFile, 'w');
    _options.query = _options.data;
    delete _options.data;
  }

  this.request = Rest.request(url, _options);

  this.request
    .on("complete", function(data, response){

      if (!response){
        response = {
          statusCode: 500,
          headers: {}
        };
      }

      // Logger(response);

      if ( !self.downloadFile ){
        console.info("no dowload", data)
      }

      if ( !!this._downloadFile && file ){
        FS.closeSync( file );
      }

      if ( response.statusCode >= 200 && response.statusCode < 300  ){
        self.emit("success", response, data );
      } else {
        self.emit("error", response, data );
      }

      self.emit("complete", response, data );
    })
    .on("error", function(data, response){

      if ( !!this._downloadFile && file ){
        FS.closeSync( file );
      }

      self.emit("error", response, data );
      self.emit("complete", response, data );

    }).request.on('response', function(response){
      var
        contentLength = response.headers['content-length'],
        progressLength = 0;
      contentLength = parseInt( contentLength , 10 );
      response.on('data', function(chunk){
        if ( !!this._downloadFile && file ){
          FS.writeSync(file, chunk, 0, chunk.length, null);
        }
        progressLength += chunk.length;
        var percent = (100 * progressLength) / contentLength;
        self.emit('progress', percent, contentLength, chunk);
      });
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
    this._options.data[ k ] = params[ k ];
  });

  this._execute( 'get', this.parseUrl( this.url ), this._options );

  return this;
};

Request.prototype.post = function(){

};

Request.prototype.put = function(){

};

Request.prototype.del = function(){

};
