var AudioBox = require("../core/audiobox");
var Configuration = require("../configuration/Configuration");
var Fixtures = require("../test/fixtures");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");
var Playlists = require("../models/playlists");



describe("MediaFiles", function(){

  AudioBox = new AudioBox( new Configuration() );

  var pl;

  beforeEach(function(){
    asyncSpecWait();
    AudioBox.User.load(Fixtures.User.emailOK, Fixtures.User.pwdOK).on("complete", asyncSpecDone);
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


  it('should contain Cloud media files',function(){

    var mediaFiles = pl.mediaFiles;

    expect( Array.prototype.isPrototypeOf(mediaFiles) ).toBe(true);
    expect( EventEmitter.prototype.isPrototypeOf(mediaFiles) ).toBe(true);


    asyncSpecWait();

    mediaFiles.load()
      .on("complete", asyncSpecDone)
      .on("success", function(){
        expect(mediaFiles.length).toBeGreaterThan(3);

        expect( mediaFiles[0].streamUrl.indexOf('?auth_token') ).toBeGreaterThan(0);

      })
      .on("error", function(){
        expect(false).toBe(true);
      });


  });


  it('should contain lyrics',function(){
    var mediaFiles = pl.mediaFiles;

    var mediaFile = mediaFiles.find("c_20d9e104f58352ba0d8470");

    mediaFile.lyrics( function( lyrics ){

      expect( lyrics ).toBeDefined();
      expect( lyrics.length ).toBeGreaterThan( 2 );
    });

  });



});