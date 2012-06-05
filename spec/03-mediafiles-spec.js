var AudioBox = require("../core/audiobox");
var Configuration = require("../configuration/Configuration");
var Fixtures = require("../test/fixtures");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");
var Playlists = require("../models/playlists");



describe("MediaFiles", function(){

  AudioBox = new AudioBox( new Configuration() );

  var pl, loaded = false;

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



});