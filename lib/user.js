var Module = require("./module");
var Logger = require("logging").from(__filename);

/**
  { user:
    { username: 'fatshotty',
      real_name: null,
      email: 'fat@fatshotty.net',
      auth_token: 'S1bmdtFzNpqxv1wxUC5j',
      media_files_count: 139,
      playlists_count: 11,
      total_play_count: 93,
      country: null,
      time_zone: 'UTC',
      data_served_this_month: 435514012,
      data_served_overall: 435514012,
      cloud_data_stored_overall: 116232530,
      cloud_data_stored_this_month: 116232530,
      local_data_stored_overall: 79995131,
      local_data_stored_this_month: 151896311,
      dropbox_data_stored_overall: 69145176,
      dropbox_data_stored_this_month: 69145176,
      accepted_extensions: 'aac,mp3,mp2,m4a,m4b,m4r,3gp,ogg,oga,flac,spx,wma,rm,ram,wav,mpc,mp+,mpp,aiff,aif,aifc,tta,mp4,mpg,mpeg,m4v,mov,avi,flv,webm,ogv',
      accepted_formats: 'audio/aac,audio/mpeg,audio/mp4,audio/ogg,audio/flac,audio/speex,audio/x-ms-wma,audio/x-pn-realaudio,audio/vnd.wave,audio/x-musepack,audio/x-aiff,audio/x-tta,video/mp4,video/mpeg,video/x-m4v,video/quicktime,video/x-msvideo,video/x-flv,video/webm,video/ogg',
      permissions: {
        local: true,
        cloud: true,
        dropbox: true,
        gdrive: true,
        skydrive: true,
        soundcloud: false,
        youtube: true,
        box: true,
        lastfm: false
      }
    }
  }
 */



var END_POINT = "user";

module.exports = User;


function User(config, connectors){

  var self = this;

  Module.call( this, User.DECLARED_FIELDS, config, connectors );



  var addAuthToken = function(request) {
    if ( self.auth_token ){
      Logger("setting auth_token", self.auth_token);
      req.auth_token = self.auth_token;
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
  END_POINT: END_POINT,

  username: "",
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
  accepted_formats: ""
  //, permissions: Permission
});


/**
 *  This methods performs a request to server and populates this instance
 *  @param username String the username associated with this user
 *  @param password String the password associated with this user
 *
 *  @return Request
 */
User.prototype.load = function(username, password){

  // Reset all fields
  this._fields = {};

  var self = this;  // shortcut to 'this' instance


  var request = this.RailsConnector.Request; // new request

  request.beforeSend = function(req){
    Logger("set credentials");
    this.setCredentials(username, password);
  };


  // Request successfully completed
  request.success = function(res, data){
    var
      userdata = data.user,
      keys = Object.keys(userdata);

    self._parseResponse( userdata );

  };

  return request.get( END_POINT );
};