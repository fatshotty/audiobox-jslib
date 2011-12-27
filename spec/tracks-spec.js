var AudioBox = new (require("../lib/audiobox"));
var Fixtures = require("../test/fixtures");
var EventEmitter = require("events").EventEmitter;
var Logger = require("logging");



describe("Tracks", function(){

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
        expect(playlists.length).toBe(8);
        pl = playlists.findBy("name", "Music");
      })
      .on("error", function(){
        expect(false).toBe(true);
      });

  });



  it('should be correctly instantiated',function(){

    var tracks = pl.tracks;

    expect( Array.prototype.isPrototypeOf(tracks) ).toBe(true);
    expect( EventEmitter.prototype.isPrototypeOf(tracks) ).toBe(true);


    asyncSpecWait();

    tracks.load()
      .on("complete", asyncSpecDone)
      .on("success", function(){
        expect(tracks.length).toBe(276);
      })
      .on("error", function(){
        expect(false).toBe(true);
      });


  });


});