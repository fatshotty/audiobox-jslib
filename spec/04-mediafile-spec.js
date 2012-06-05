var AudioBox = require("../core/audiobox");
var Configuration = require("../configuration/Configuration");
var Fixtures = require("../test/fixtures");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");
var Playlists = require("../models/playlists");



describe("MediaFiles", function(){

  AudioBox = new AudioBox( new Configuration() );

  var pls, pl, loaded = false;

  beforeEach(function(){
    if ( !loaded ) {
      asyncSpecWait();
      AudioBox.User.load(Fixtures.User.emailOK, Fixtures.User.pwdOK).on("complete", function(){ loaded = true; asyncSpecDone() });
    }
  });


  it("should be retrived by playlists", function(){

    var user = AudioBox.User;

    var playlists = user.playlists;

    asyncSpecWait();

    playlists.load()
      .on("complete", asyncSpecDone)
      .on("success", function(){
        pl = playlists.findBy("type", Playlists.PlaylistTypes.CLOUD );
      })
      .on("error", function(){
        expect(false).toBe(true);
      });

  });


  it("reload mediaFiles", function(){
    var mediaFiles = pl.mediaFiles;

    asyncSpecWait();
    mediaFiles.load().on("complete", asyncSpecDone);
  })



  it('should contain lyrics',function(){

    var mediaFiles = pl.mediaFiles;

    var mediaFile = mediaFiles.find("c_20d9e104f58352ba0d8470");

    asyncSpecWait();

    mediaFile.lyrics( function( lyrics ){

      expect( lyrics ).toBeDefined();
      expect( lyrics.length ).toBeGreaterThan( 2 );

      asyncSpecDone();
    });

  });



  it('should scrobble and playcount should increment',function(){
    var mediaFiles = pl.mediaFiles;

    var mediaFile = mediaFiles.find("c_20d9e104f58352ba0d8470");

    var old_playcount = mediaFile.plays;

    asyncSpecWait();
    mediaFile.scrobble().on("success", function(){
      expect( mediaFile.plays ).toEqual( old_playcount + 1 );
    })
    .on("error", function(){
      // Fails
      expect(true).toBe(false);
    })
    .on("complete", asyncSpecDone);

  });



  it("waiting for new scrobble", function(){
    asyncSpecWait();
    setTimeout(asyncSpecDone, 3000);
  })



  it('should scrobble and "changed" event should be emitted',function(){


    var mediaFiles = pl.mediaFiles;

    var mediaFile = mediaFiles.find("c_20d9e104f58352ba0d8470");

    var old_playcount = mediaFile.plays, fired = false;

    mediaFile.on("changed", function(props){
      expect( props.indexOf( "plays" ) ).toBeGreaterThan( -1 );
      expect( mediaFile.plays ).toEqual( old_playcount + 1 );
      fired = true;
    });

    asyncSpecWait();

    mediaFile.scrobble()
      .on("complete", function(){
        expect( fired ).toBe(true);
        asyncSpecDone();
      }).on("error", function(){
      })


  });


})