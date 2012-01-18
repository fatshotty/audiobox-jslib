var AudioBox = new (require("../lib/audiobox"));
var Fixtures = require("../test/fixtures");


describe("AudioBox", function(){


  it("should contain the connector", function(){
    expect( AudioBox.connection ).toBeDefined();
  })


});