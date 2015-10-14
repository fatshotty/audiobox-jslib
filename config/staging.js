module.exports = {

  env: "staging",

  RailsProtocol: "http",
  RailsHost: "staging.audiobox.fm",
  RailsPort: 80,

  NodeProtocol: "http",
  NodeHost: "staging.audiobox.fm",
  NodePort: 80,

  SocketProtocol: "https",
  SocketHost: "staging.audiobox.fm",
  SocketPort: 443,

  DaemonProtocol: "http",
  DaemonHost: "staging.audiobox.fm",
  DaemonPort: 8082,

  UserAgent: "AudioBox.fm 2 API framework",

  Cover: {
    protocol: "http",
    host: "m.staging.audiobox.fm",
    basePath: ""
  }

};
