var AudioBox = require("../core/audiobox");
var Configuration = require("../configuration/configuration");
var Fixtures = require("../test/fixtures");

var ENV = process.env.NODE_ENV || "development";

var Settings = require("../config/" + ENV );

describe("User", function(){
  var user_loaded = false;

  AudioBox = new AudioBox( new Configuration(ENV) );

  it('should be correctly populated', function(){

    asyncSpecWait()

    var user = AudioBox.User;

    user.load(Fixtures.User.emailOK, Fixtures.User.pwdOK)
      .on("complete", function(){
        expect( user_loaded ).toBe(true);
        asyncSpecDone()
      })
      .on("success", function(){
        expect(user.email).toEqual( Fixtures.User.emailOK);
        user_loaded = true;
      })
      .on("error", function(){
        user_loaded = false;
      });

  });


  it("should be already logged", function(){
    var user = AudioBox.User;

    expect( user_loaded ).toBe(true);

    if ( user_loaded ){
      expect(user.email).toEqual( Fixtures.User.emailOK );
      expect(user.auth_token.length).toEqual( 20 );
    }

  });

  it("permission should be populated", function(){
    var user = AudioBox.User;

    expect(user.permissions).toBeDefined();
    expect(user.permissions.local).toBe(true);
  });


  it("hashes of Cloud", function(){

    asyncSpecWait();
    var req = AudioBox.User.mediaFilesMap("cloud", function(mediaFiles){
      expect(mediaFiles.length > 0).toBe(true);
      expect( mediaFiles[0].hash ).toBeDefined();
    });

    req.on("error", function(){
      expect(true).toBe(false);
    });

    req.on("complete", asyncSpecDone);

  });


});