var Utils = require("./utils");
var Connection = require("./Connection");
var Logger = require("logging").from(__filename);



var User = require("./user");
// var Collection = require("./collection");



module.exports = AudioBox;


function AudioBox( env ) {

  if ( !env ){
    env = "development";
    Logger("no environment set, use development instead");
  }

  this.connection = new Connection( env );

  return this;
}



AudioBox.prototype.__defineGetter__("User", function(){
  Logger("User requested");
  if ( !this._user ){
    this._user = new User(this.connection);
    // TODO: Extends with all 'GET collection' methods
  }
  return this._user;
});


/** =================================
  User.prototype.__defineGetter__( "playlists" , function(){
    return _playlists || (_playlists = new Collection());
  });

  User.prototype.__defineGetter__( "genres" , function(){
    return _genres || (_genres = new Collection());
  });

  User.prototype.__defineGetter__( "artists" , function(){
    return _artists || (_artists = new Collection());
  });

  User.prototype.__defineGetter__( "albums" , function(){
    return _albums || (_albums = new Collection());
  });
====================================== */