var AudioBox = require("../core/audiobox");
var Fixtures = require("../test/fixtures");
var Configuration = require("../configuration/configuration");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");




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
        expect(playlists.length).toBe(9);
        expect(playlists.isLoaded).toBe(true);
      })
      .on("error", function(){
        expect(false).toBe(true);
      });

  });


});