var AudioBox = require("../core/audiobox");
var Configuration = require("../configuration/configuration");
var Fixtures = require("../test/fixtures");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");
var Playlists = require("../models/playlists");


var ENV = process.env.NODE_ENV || "development";

var Settings = require("../config/" + ENV );


describe("MediaFiles", function(){

  AudioBox = new AudioBox( new Configuration(ENV) );

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
        expect( pl ).toBeDefined();
      })
      .on("error", function(){
        expect(false).toBe(true);
      });

  });


  it('Cloud should contain mediafiles',function(){

    var mediaFiles = pl.mediaFiles;

    expect( !!mediaFiles.splice ).toBe(true);
    expect( !!mediaFiles.removeAllListeners ).toBe(true);


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