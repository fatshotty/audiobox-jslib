var AudioBox = require("../core/audiobox");
var Configuration = require("../configuration/configuration");

var ENV = process.env.NODE_ENV || "development";

var Settings = require("../config/" + ENV );


describe("AudioBox", function(){

  it("should be correctly declared and exported", function(){
    expect( AudioBox ).toBeDefined();
  });


  it("should be correctly instanciated", function(){
    AudioBox = new AudioBox( new Configuration(ENV) );
    expect( AudioBox ).toBeDefined();
    expect( AudioBox.Configuration ).toBeDefined();
    expect( AudioBox.Connectors ).toBeDefined();
    expect( AudioBox.Configuration.SERVERS ).toBeDefined();
    expect( AudioBox.Configuration.SERVERS.RAILS ).toEqual( "Rails" );
    expect( AudioBox.Configuration.SERVERS.NODE ).toEqual( "Node" );
    expect( AudioBox.Configuration.SERVERS.DAEMON ).toEqual( "Daemon" );
  });


});



describe("Connectors", function(){


  it("Rails connector", function(){

    expect( AudioBox.RailsConnector.Protocol ).toEqual( Settings.RailsProtocol );
    expect( AudioBox.RailsConnector.Host ).toEqual( Settings.RailsHost );
    expect( AudioBox.RailsConnector.Port ).toEqual( Settings.RailsPort );
    expect( AudioBox.RailsConnector.ApiPath ).toEqual( Settings.RailsApiPath );

  });

  it("Node connector", function(){

    expect( AudioBox.NodeConnector.Protocol ).toEqual( Settings.NodeProtocol );
    expect( AudioBox.NodeConnector.Host ).toEqual( Settings.NodeHost );
    expect( AudioBox.NodeConnector.Port ).toEqual( Settings.NodePort );
    expect( AudioBox.NodeConnector.ApiPath ).toEqual( Settings.NodeApiPath );

  });

  it("Daemon connector", function(){

    expect( AudioBox.DaemonConnector.Protocol ).toEqual( Settings.DaemonProtocol );
    expect( AudioBox.DaemonConnector.Host ).toEqual( Settings.DaemonHost );
    expect( AudioBox.DaemonConnector.Port ).toEqual( Settings.DaemonPort );
    expect( AudioBox.DaemonConnector.ApiPath ).toEqual( Settings.DaemonApiPath );

  });


});