var AudioBox = require("../core/audiobox");
var Fixtures = require("../test/fixtures");
var Configuration = require("../configuration/configuration");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");
var Playlists = require("../models/playlists");




describe("Playlists", function(){

  AudioBox = new AudioBox( new Configuration() );

  beforeEach(function(){
    asyncSpecWait();
    AudioBox.User.load(Fixtures.User.emailOK, Fixtures.User.pwdOK).on("complete", asyncSpecDone);
  });





  it("should be correctly instantiated", function(){

    var user = AudioBox.User;

    var playlists = user.playlists;

    expect( Array.prototype.isPrototypeOf(playlists) ).toBe(true);
    expect( EventEmitter.prototype.isPrototypeOf(playlists) ).toBe(true);


    asyncSpecWait();

    playlists.load()
      .on("complete", asyncSpecDone)
      .on("success", function(){
        expect(playlists.length).toEqual(9);
        expect(playlists.isLoaded).toBe(true);
      })
      .on("error", function(){
        expect(false).toBe(true);
      });

  });


  it("should be already instantiated", function(){

    var playlists = AudioBox.User.playlists;

    expect(playlists.length).toEqual(9);

  });



  it("should have drives and playlists", function(){

    var playlists = AudioBox.User.playlists;

    expect(playlists.drives).toBeDefined();
    expect(playlists.drives.length).toBeGreaterThan(1);
    expect(playlists.playlists).toBeDefined();
    expect(playlists.playlists.length).toEqual(1);

  });


  it("should return drives by type", function(){

    var playlists = AudioBox.User.playlists;

    for( var prop in Playlists.PlaylistTypes ){

      if ( Playlists.PlaylistTypes.hasOwnProperty(prop) ){
        var type = Playlists.PlaylistTypes[ prop ];
        var pl = playlists.findBy("type", type);
        expect( pl ).toBeDefined();
        if ( pl != null )
          expect( pl.type ).toEqual( type );
      }
    }

  });


});