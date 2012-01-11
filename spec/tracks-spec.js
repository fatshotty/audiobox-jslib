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
        expect(tracks.length).toBe(282);
      })
      .on("error", function(){
        expect(false).toBe(true);
      });


  });

  it('should be downloaded', function(){
    var tracks = pl.tracks;
    var track = tracks.find("wF80grQptQX2pij61tNufo");

    expect(track).toNotBe(null);

    asyncSpecWait();
    var req = track.download('/Users/fatshotty/Sites/audiobox/node/test/fixtures/audio.mp3');

    var old_perc = -1;

    req.on('complete',function(){
      console.info('download complete');
      asyncSpecDone();
    })
    .on('progress', function(perc){
      if ( perc != old_perc )
        console.info( "progress", perc );
    })
    .on('error', function( e ){
      console.info( "error downloading" );
    });
  });


});