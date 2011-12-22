var Module = require("./module");
var Logger = require("logging").from(__filename);

// {"user":{"email":"fat@fatshotty.net","username":"fatshotty","auth_token":"nQ6Xv1axdfHxPzBYszSM","data_served_this_month_in_bytes":0,"data_served_overall_in_bytes":48040948873,"data_stored_overall_in_bytes":1334106643,"total_play_count":5360,"country":null,"time_zone":"Rome"}}


module.exports = User;


User.DECLARED_FIELDS = Object.freeze({
  "email": "",
  "username": "",
  "auth_token": "",
  "data_served_this_month_in_bytes": 0,
  "data_served_overall_in_bytes": 0,
  "data_stored_overall_in_bytes": 0,
  "total_play_count": 0,
  "country": "",
  "time_zone": "",
  // "plan": Plan
});


function User(connector){

  this.connector = connector;

  Module.call( this, User.DECLARED_FIELDS );

  Logger("new User instantiated");

  return this;
}

User.prototype.__proto__ = Module.prototype;



User.prototype._parseResponse = function(data){

  var keys = Object.keys(data);

  Logger("populating user");

  // Populate class with server response
  keys.forEach(function(field){

    var type = User.DECLARED_FIELDS[ field ];

    if (  Module.prototype.isPrototypeOf( type ) ){
      var value = new type(this.connector);
      value._parseResponse( data[field] );
    }

    this._fields[ field ] = data[ field ];

  }, this);

  return this;
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
  this._fields = {};

  var self = this;  // shortcut to 'this' instance


  var request = this.connector.Request; // new request

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

    // Freeze fields: they cannot be modify anymore!!
    _freeze( self._fields );

    // User is loaded! we have to set the first listener on the Connection class
    // In this way we are sure Auth parameter is correctly set!
    self.connector.on("new_request", function(req){
      Logger("setting auth_token", self.auth_token);
      req.auth_token = self.auth_token;
    });

  };

  return request.get("user");
};



User.prototype._fields = {};

/**
 *  This method freezes the given object and all its 'Obejct' typed property
 *  recursively
 */
function _freeze(fields){
  Object.freeze( fields );
  var keys = Object.keys( fields );

  keys.forEach(function(k){

    if ( fields.hasOwnProperty(k) ){
      var type = User.DECLARED_FIELDS[ k ];
      if ( type === Object || type === Array ){
        Object.freeze( fields[k] );
      }
    }

  });
}