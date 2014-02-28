(function(){
  const END_POINT = Configuration.EnterpriseAPIPath + Connection.URISeparator + "company";


  /*{ company:
     { id: 1,
       email: 'enterprisedemo@audiobox.fm',
       auth_token: 'scpYnN-sQs9snXy2xM7v',
       created_at: '2014-01-12T20:21:05.366Z',
       updated_at: '2014-01-25T02:50:01.327Z',
       media_files_count: 0,
       playlists_count: 2,
       nodes_count: 0,
       customers_count: 0,
       total_play_count: 0,
       accepted_extensions: 'aac,mp3,m4a,flac,mp4,flv,webm',
       accepted_formats: 'audio/aac,audio/mpeg,audio/mp4,audio/flac,video/mp4,video/x-flv,video/webm',
       permissions:
        { cloud: false,
          dropbox: false,
          gdrive: false,
          skydrive: false,
          box: false,
          soundcloud: false,
          stripe_connect: true },
       external_tokens:
        { dropbox: false,
          gdrive: false,
          skydrive: false,
          soundcloud: false,
          box: false,
          stripe_connect: false },
       comet_channels:
        { private: 'private-ea3260dd1e9a9a9622814d6a62aa85e6efdf659b',
          nodes: 'presence-nodes_1' },
       subscription_state: 'no',
       plan: null,
       company_name: 'Demo',
       address_1: 'via',
       address_2: 'address 2',
       zip_code: '20131',
       city: 'Milan',
       country: 'Italy',
       vat_number: '123',
       real_name: 'Fabio Tunno',
       time_zone: 'UTC',
       stats: {},
       preferences: { accept_emails: true } } }*/


  window.Company = Company;


  function Company(config, connectors){

    var self = this;

    Module.call( this, Company.DECLARED_FIELDS, config, connectors );


    var addAuthToken = function(request) {
      if ( self._disableAuth ){
        return Logger("disableAuth for authToken");
      }
      if ( self.auth_token ){
        Logger("setting auth_token", self.auth_token);
        request.setAuthentication( "auth_token", "x-auth-token", self.auth_token, true );
      }
    };


    // User is loaded! we have to set the first listener on the Connection class
    // In this way we are sure Auth parameter is correctly set!
    this.RailsConnector.on( "new_request", addAuthToken );
    this.NodeConnector.on( "new_request",  addAuthToken );
    this.DaemonConnector.on( "new_request",  addAuthToken );

    Logger("new Company instantiated");

    return this;
  }

  Company.prototype.__proto__ = Module.prototype;

  Company.prototype.__defineSetter__("disableAuth", function(value){
    this._disableAuth = value;
  });


  Company.DECLARED_FIELDS = Object.freeze({
    id: 0,
    email: '',
    auth_token: '',
    created_at: '',
    updated_at: '',
    media_files_count: 0,
    playlists_count: 0,
    nodes_count: 0,
    customers_count: 0,
    total_play_count: 0,
    accepted_extensions: '',
    accepted_formats: '',
    subscription_state: '',
    comet_channels: {},
    plan: '',
    company_name: '',
    address_1: '',
    address_2: '',
    zip_code: '',
    city: '',
    country: '',
    vat_number: '',
    real_name: '',
    time_zone: ''
  });


  Company.prototype._extractData = function(data){
    return data.company;
  };


  Company.prototype.__defineGetter__("END_POINT", function(){
    return END_POINT;
  });


  Company.prototype.__defineGetter__("permissions", function(){
    if( !this._permissions ){
      this._permissions = new Permissions(this.Configuration, this.Connectors);
    }
    return this._permissions;
  });

  Company.prototype.__defineGetter__("external_tokens", function(){
    if( !this._external_tokens ){
      this._external_tokens = new ExternalTokens(this.Configuration, this.Connectors);
    }
    return this._external_tokens;
  });

  Company.prototype.__defineGetter__("account_stats", function(){
    if( !this._account_stats ){
      this._account_stats = new AccountStats(this.Configuration, this.Connectors);
    }
    return this._account_stats;
  });

  Company.prototype.__defineGetter__("preferences", function(){
    if( !this._preferences ){
      this._preferences = new Preferences(this.Configuration, this.Connectors);
    }
    return this._preferences;
  });


  Company.prototype.__defineGetter__("plans", function(){
    if( !this._plans ){
      this._plans = new Preferences(this.Configuration, this.Connectors);
    }
    return this._plans;
  });


  Company.prototype.__defineGetter__("isLoggedIn", function(){
    return this.isLoaded && this.email != null && this.auth_token != null;
  });

  Company.prototype.__defineGetter__("Nodes", function(){
    if ( !this._nodes ){
      this._nodes = new Nodes(this.Configuration, this.Connectors);
      // this._nodes.parent = this;
    }
    return this._nodes;
  });



  /**
   *  This methods performs a request to server and populates this instance
   *  @param username String the username associated with this user
   *  @param password String the password associated with this user
   *
   *  @return Request
   */
  Company.prototype.load = function(username, password){

    // Reset all fields
    this._clear();

    var self = this;  // shortcut to 'this' instance

    var request = this.RailsConnector.Request; // new request


    // Set the 'extension' for the URL
    request.requestFormat = this.Configuration.RequestFormats.JSON;


    request.beforeSend = function(req){
      if ( self._disableAuth ){
        return Logger("disableAuth for email e password");
      }
      Logger("set credentials");
      this.setCredentials(username, password);
    };


    // Request successfully completed
    request.success = function(res, data){

      // data = JSON.parse(data);
      var companydata = self._extractData( data );

      self._parseResponse( companydata );
      self.emit('login', true);
      self._abx_.emit('login', true);

    };

    request.error = function(){
      self._loaded = false;
      self.emit('login', false);
      self._abx_.emit('login', false);
    }

    return request.get( END_POINT );
  };



  Company.prototype._clear = function() {
    Module.prototype._clear.call(this);
    this._permissions && this._permissions._clear();
    this._external_tokens && this._external_tokens._clear();
    this._account_stats && this._account_stats._clear();
    this._preferences && this._preferences._clear();
    this._nodes && this._nodes._clear();
    this._permissions = null;
    this._external_tokens = null;
    this._account_stats = null;
    this._preferences = null;
    this._plans = null;
    this._nodes = null;
    this._comet_channels = {};
  };
})();