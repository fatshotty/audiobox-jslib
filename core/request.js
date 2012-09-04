var Utils = require("../configuration/utils");
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

  this.userAgent = this.connector.UserAgent;
  this.requestFormat = null;
  this._multipart = false;
  this.followRedirects = false;

  // Empty Event interceptor to avoid EventEmitter errors
  this.on("complete", function(){});
  this.on("success", function(){});
  this.on("error", function(){});
  this.on("beforeSend", function(){});
  this.on("progress", function(){});

  EventEmitter.call(this);

  return this;
}

Utils.merge(Request.prototype, EventEmitter.prototype);


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
    this._options.headers["x-auth-token"] = auth
  } else {
    // auth token is not in a valid format. Remove it from query string
    Logger("removed auth token");
    delete this._options.headers["x-auth-token"];
  }
  return this;
});


// UserAgent header
Request.prototype.__defineSetter__('userAgent', function(value){
  this._options.headers['User-Agent'] = value;
});
Request.prototype.__defineGetter__('userAgent', function(){
  return this._options.headers['User-Agent'];
});

// RequestFormat for the 'extension' of the URL
Request.prototype.__defineSetter__('requestFormat', function(value){
  this._requestFormat = value;
});
Request.prototype.__defineGetter__('requestFormat', function(){
  return this._requestFormat;
});


// Should this request follow redirects?
Request.prototype.__defineSetter__('followRedirects', function(value){
  this._options.followRedirects = value;
});
Request.prototype.__defineGetter__('followRedirects', function(){
  return this._options.followRedirects;
});



/* ================================
                EVENTS
   ================================ */
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

Request.prototype.parseUrl = function(url, authToken){

  var host = this.connector.Protocol + "://" + this.connector.Host + ":" + this.connector.Port + this.connector.ApiPath;

  var url = url || this.url;

  if ( !url ) return "";

  if ( url.indexOf("/") != 0 ){
    url = "/" + url
  }

  url = host + url + ( this.requestFormat ? "." + this.requestFormat : "" );

  if ( authToken && this._options.data.auth_token ){
    url += "?auth_token=" + this._options.data.auth_token;
  }

  return url;
};




Request.prototype._execute = function(method, url, options){

  var
    self = this,
    _options = {};

  _options.method = method;
  _options.followRedirects = this.followRedirects;
  _options.data = options.data;
  _options.headers = options.headers;
  _options.username = options.username;
  _options.password = options.password;
  _options.multipart = this._multipart;

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

      var contentType = response.headers["content-type"];

      if ( (contentType || "").indexOf('json') > -1 ) {
        data = JSON.parse(data);
      }

      if ( response.statusCode >= 200 && response.statusCode < 300  ){
        self.emit("success", response, data );
      } else {

        self.emit("error", response, data );

        if ( self.connector.listeners( "error-" + response.statusCode ).length > 0 ) {
          self.connector.emit("error-" + response.statusCode, self, response, data);
        }
        if ( self.connector.listeners( "error" ).length > 0 ) {
          self.connector.emit("error", self, response, data);
        }

      }

      self.emit("complete", response, data );
    })
    .on("error", function(data, response){

      self.emit("error", response, data );

      self.connector.emit("connectionError", self, response, data);

      self.emit("complete", response, data );

    }).request.on('response', function(response){
      var
        contentLength = response.headers['content-length'],
        progressLength = 0;
      contentLength = parseInt( contentLength , 10 );
      response.on('data', function(chunk){

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

  if ( url instanceof Array ){
    url = url.join( "/" );
  }

  this.url = url;
  this.params = params

  this.emit('beforeSend', this);

  Object.keys(params||{}).forEach(function(k){
    this._options.data[ k ] = params[ k ];
  });

  this._execute( 'get', this.parseUrl( this.url ), this._options );

  return this;
};



Request.prototype.post = function(url, params){

  if ( url instanceof Array ){
    url = url.join( "/" );
  }

  this.url = url;
  this.params = params

  this.emit('beforeSend', this);

  Object.keys(params||{}).forEach(function(k){
    this._options.data[ k ] = params[ k ];
  }, this);

  this._execute( 'post', this.parseUrl( this.url ), this._options );

  return this;

};


Request.prototype.fileUpload = function(path, mime){
  this._multipart = true;

  var size = FS.lstatSync(path).size

  return Rest.file(path, null, size, null, mime);
};


Request.prototype.put = function(url, params){
  if ( url instanceof Array ){
    url = url.join( "/" );
  }

  this.url = url;
  this.params = params

  this.emit('beforeSend', this);

  Object.keys(params||{}).forEach(function(k){
    this._options.data[ k ] = params[ k ];
  }, this);

  this._execute( 'put', this.parseUrl( this.url ), this._options );

  return this;
};

Request.prototype.del = function(url, params){
  if ( url instanceof Array ){
    url = url.join( "/" );
  }

  this.url = url;
  this.params = params

  this.emit('beforeSend', this);

  Object.keys(params||{}).forEach(function(k){
    this._options.data[ k ] = params[ k ];
  }, this);

  this._execute( 'delete', this.parseUrl( this.url ), this._options );

  return this;

};
