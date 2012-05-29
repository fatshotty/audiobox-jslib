var AudioBox = require("../lib/audiobox");
var Configuration = require("../lib/configuration");
var Fixtures = require("../test/fixtures");


describe("User", function(){

  AudioBox = new AudioBox( new Configuration() );

  it('should be correctly populated', function(){

    asyncSpecWait()

    var user = AudioBox.User;

    user.load(Fixtures.User.emailOK, Fixtures.User.pwdOK)
      .on("complete", asyncSpecDone)
      .on("success", function(){
        expect(user.email).toEqual( Fixtures.User.emailOK);
        expect(user.username).toEqual( Fixtures.User.username );
      });

  });


  it("should be already logged", function(){
    var user = AudioBox.User;

    expect(user.email).toEqual( Fixtures.User.emailOK );
    expect(user.username).toEqual( Fixtures.User.username );
    expect(user.auth_token.length).toEqual( 20 );

  });


});