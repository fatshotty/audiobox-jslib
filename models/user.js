/**
  {
    real_name: '',
    email: 'fat@fatshotty.net',
    auth_token: 'Jgs...',
    media_files_count: 325,
    playlists_count: 9,
    total_play_count: 266,
    country: null,
    time_zone: 'UTC',
    accepted_extensions: 'mp3,m4a,m4b,m4r,mp4,flv,webm',
    accepted_formats: 'audio/mpeg,audio/mp4,video/mp4,video/x-flv,video/webm',
    comet_channel: 'private-de103b403',
    subscription_state: 'active'
    permissions:
      player: true,
      local: true,
      cloud: true,
      dropbox: true,
      gdrive: true,
      skydrive: true,
      soundcloud: true,
      youtube: true,
      box: true,
      lastfm: true,
      twitchtv: true,
      facebook: true,
      twitter: true
    external_tokens:
      dropbox: true,
      gdrive: true,
      skydrive: true,
      soundcloud: true,
      youtube: true,
      box: true,
      lastfm: true,
      twitchtv: true,
      facebook: true,
      twitter: true
    stats:
      data_served_this_month: 1493165284,
      data_served_overall: 1493165284,
      cloud_data_stored_overall: 1488200097,
      cloud_data_stored_this_month: 1488200097,
      local_data_stored_overall: 0,
      local_data_stored_this_month: 3770908450,
      dropbox_data_stored_overall: 0,
      dropbox_data_stored_this_month: 0,
      gdrive_data_stored_this_month: 38403869,
      gdrive_data_stored_overall: 38403869,
      skydrive_data_stored_this_month: 38403869,
      skydrive_data_stored_overall: 38403869,
      box_data_stored_this_month: 19324002,
      box_data_stored_overall: 19324002,
      soundcloud_data_stored_this_month: 0,
      soundcloud_data_stored_overall: 0
    preferences:
      accept_emails: '1',
      autoplay: false,
      volume_level: 85,
      color: 'shadows-grey',
      top_bar_bg: 'space'
  }
 */



const END_POINT = Configuration.APIPath + Connection.URISeparator + "user";

window.User = User;


function User(config, connectors){

  var self = this;

  Module.call( this, User.DECLARED_FIELDS, config, connectors );


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


  Logger("new User instantiated");

  return this;
}


User.prototype.__proto__ = Module.prototype;


User.DECLARED_FIELDS = Object.freeze({

  id: 0,
  username: "",
  plan: "",
  real_name: "",
  email: "",
  auth_token: "",
  media_files_count: 0,
  playlists_count: 0,
  total_play_count: 0,
  country: "",
  time_zone: "",
  data_served_this_month: 0,
  data_served_overall: 0,
  cloud_data_stored_overall: 0,
  cloud_data_stored_this_month: 0,
  local_data_stored_overall: 0,
  local_data_stored_this_month: 0,
  dropbox_data_stored_overall: 0,
  dropbox_data_stored_this_month: 0,
  accepted_extensions: "",
  accepted_formats: "",
  offline_playlist: "",
  created_at: "",
  updated_at: ""

});


User.prototype.__defineGetter__("MediaFile", function(){
  return new MediaFile(this.Configuration, this.Connectors);
});


User.prototype.__defineSetter__("disableAuth", function(value){
  this._disableAuth = value;
});


User.prototype._extractData = function(data){
  return data.user;
};

/**
 *  This methods performs a request to server and populates this instance
 *  @param username String the username associated with this user
 *  @param password String the password associated with this user
 *
 *  @return Request
 */
User.prototype.load = function(username, password){

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
    var userdata = self._extractData( data );

    self._parseResponse( userdata );

  };

  return request.get( END_POINT );
};



User.prototype.mediaFilesMap = function(source, cb){
  var mediaFiles = new MediaFiles(this.Configuration, this.Connectors);
  return mediaFiles.loadMap(source, cb);
};


User.prototype.__defineGetter__("END_POINT", function(){
  return END_POINT;
});


User.prototype.__defineGetter__("isLoggedIn", function(){
  return this.isLoaded && this.email != null && this.auth_token != null;
});


User.prototype.__defineGetter__("permissions", function(){
  if( !this._permissions ){
    this._permissions = new Permissions(this.Configuration, this.Connectors);
  }
  return this._permissions;
});

User.prototype.__defineGetter__("external_tokens", function(){
  if( !this._external_tokens ){
    this._external_tokens = new ExternalTokens(this.Configuration, this.Connectors);
  }
  return this._external_tokens;
});

User.prototype.__defineGetter__("account_stats", function(){
  if( !this._account_stats ){
    this._account_stats = new AccountStats(this.Configuration, this.Connectors);
  }
  return this._account_stats;
});

User.prototype.__defineGetter__("preferences", function(){
  if( !this._preferences ){
    this._preferences = new Preferences(this.Configuration, this.Connectors);
  }
  return this._preferences;
});


User.prototype.__defineGetter__("plans", function(){
  if( !this._plans ){
    this._plans = new Preferences(this.Configuration, this.Connectors);
  }
  return this._plans;
});


User.prototype.__defineGetter__("playlists", function(){
  if( !this._playlists ){
    this._playlists = new Playlists(this.Configuration, this.Connectors);
  }
  return this._playlists;
});


User.prototype._clear = function() {
  Module.prototype._clear.call(this);
  this._permissions && this._permissions._clear();
  this._external_tokens && this._external_tokens._clear();
  this._account_stats && this._account_stats._clear();
  this._preferences && this._preferences._clear();
  this._permissions = null;
  this._external_tokens = null;
  this._account_stats = null;
  this._preferences = null;
  this._plans = null;
};

