var Utils = require("./utils");
var Connection = require("./Connection");
var Collection = require("./collection");
var Logger = require("logging").from(__filename);
require("./inflector");



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
  if ( !this._user ){
    Logger("User requested");
    this._user = new User(this.connection);
    // TODO: Extends with all 'GET collection' methods
    _extendsUser( this._user );
  }
  return this._user;
});


function _extendsUser( user ){

  var _playlists, _genres, _artits, _albums;

  user.__defineGetter__( "playlists" , function(){
    return _playlists || (_playlists = new Collection(this.connector, "playlists"));
  });

  user.__defineGetter__( "genres" , function(){
    return _genres || (_genres = new Collection(this.connector, "genres"));
  });

  user.__defineGetter__( "artists" , function(){
    return _artists || (_artists = new Collection(this.connector, "artists"));
  });

  user.__defineGetter__( "albums" , function(){
    return _albums || (_albums = new Collection(this.connector,"albums"));
  });

}