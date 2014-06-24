(function(){
  window.Request = Request;

  /**
   *  Request declaration
   */

  function Request(connection){
    this.connector = connection;
    this._configuration = connection.Configuration

    this._options = {headers:{}, data:{}};

    this.setAuthentication();

    // this.userAgent = this.connector.UserAgent;
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


  Request.prototype.setRequestHeader = function(key, value){
    this._options.headers[ key ] = value;
    return this;
  };

  Request.prototype.setRequestHeaders = function(obj){
    for ( key in obj ) {
      if ( obj.hasOwnProperty(key) ) {
        this.setRequestHeader(key, obj[ key ]);
      }
    }
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
  Request.prototype.setAuthentication = function(qname, hname, value, isheader, prefix){
    if ( (qname || hname ) && value ) {
      // auth token is set
      this._authentication = {
        qname: qname,
        hname: hname,
        value: value,
        isHeader: !!isheader,
        prefix: prefix || ""
      };
    } else {
      // Authentication is null, so reset it
      this._authentication = {
        qname: "",
        hname: "",
        value: "",
        isHeader: false,
        prefix: ""
      };
    }
    return this;
  };

  Request.prototype.__defineGetter__('Configuration', function(){
    return this.connector.Configuration;
  });


  // UserAgent header
  // Request.prototype.__defineSetter__('userAgent', function(value){
  //   this._options.headers['User-Agent'] = value;
  // });
  // Request.prototype.__defineGetter__('userAgent', function(){
  //   return this._options.headers['User-Agent'];
  // });

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

  Request.prototype.parseUrl = function(url, authentication){
    var host = this.connector.Protocol + "://" + this.connector.Host + ":" + this.connector.Port; // + this.connector.ApiPath;

    var url = url || this.url;

    if ( !url ) return "";

    if ( url.indexOf( this.connector.URISeparator ) != 0 ){
      url = this.connector.URISeparator + url;
    }

    url = host + url + ( this.requestFormat ? "." + this.requestFormat : "" );

    if ( authentication && this._authentication.qname && this._authentication.value ){
      url += "?" + this._authentication.qname + "=" + this._authentication.value;
    }

    return url;
  };




  Request.prototype._execute = function(method, url, options){

    var
      self = this,
      _options = {};

    _options.type = method;
    _options.data = options.data;
    _options.headers = options.headers;
    _options.username = options.username;
    _options.password = options.password;

    if ( _options.username && _options.password ) {
      _options.headers['Authorization'] = "Basic " + btoa( _options.username + ":" + _options.password );
    }

    var callbackCache = (function(eCode) {

      if ( this._authentication.hname && this._authentication.value && this._authentication.isHeader ) {
        _options.headers[ this._authentication.hname ] = this._authentication.prefix + this._authentication.value
      }

      if ( eCode ) {
        _options.headers[ 'If-None-Match' ] = "\"" + eCode + "\"";
      }

      Logger("executing request ", method.toUpperCase(), url);

      _options.url = url;

      _options.complete = function(response, data){
        var data = response.responseText;
        if (!response){
          response = {
            statusCode: 500,
            headers: {}
          };
        }

        var contentType = response.getResponseHeader("content-type");

        if ( (contentType || "").indexOf('json') > -1 ) {
          data = JSON.parse(data);
        }

        function callback_success(data){
          self.emit("success", response, data );
          self.emit("complete", response, data );
        }

        if ( response.status >= 200 && response.status < 300  ){

          if ( method.toUpperCase() == "GET" ){
            self.Configuration.CacheManager.setBody(self, data, response, eCode, function(){
              callback_success(data);
            });
          } else {
            callback_success();
          }

        } else if ( response.status == 304 ) {
          // Cache management
          self.Configuration.CacheManager.getBody(self, eCode, function(data){
            if ( typeof data == "string" ) {
              data = JSON.parse(data);
            }
            callback_success(data);
          });

        } else {

          self.emit("error", response, data );

          if ( self.connector.listeners( "error-" + response.status ).length > 0 ) {
            self.connector.emit("error-" + response.status, self, response, data);
          }
          if ( self.connector.listeners( "error" ).length > 0 ) {
            self.connector.emit("error", self, response, data);
          }

          self.emit("complete", response, data );

        }


      };

      this.request = $.ajax( _options );

    }).bind(this);

    if ( method.toUpperCase() == "GET" ){
      self.Configuration.CacheManager.setRequest(this, url, _options, callbackCache);
    } else {
      callbackCache();
    }

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
    }, this);

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
})();