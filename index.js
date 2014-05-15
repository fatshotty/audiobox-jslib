var LEVEL, LEVELS, l;

window.Logger = function() {
  Logger.info.apply(Logger, arguments);
};

window.Logger.write = function(level, args) {
  var arg, toString, _i, _len;
  if (window.console && window.console[level]) {
    if (window.console[level].apply) {
      return window.console[level].apply(window.console, args);
    } else {
      toString = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        toString.push("" + arg);
      }
      return window.console[level](toString.join(", "));
    }
  }
};

LEVELS = {
  no: 0,
  error: 1,
  warn: 2,
  info: 3,
  log: 4
};

LEVEL = LEVELS.no;

Logger.level = function(l) {
  if (l === void 0 || l === null) {
    return LEVEL;
  }
  if (typeof l === "number") {
    return LEVEL = l;
  } else {
    return LEVEL = LEVELS[l] || l;
  }
};
Logger.error = function() {
  if (LEVEL < LEVELS.error) {
    return;
  }
  return Logger.write("error", arguments);
};
Logger.warn = function() {
  if (LEVEL < LEVELS.warn) {
    return;
  }
  return Logger.write("warn", arguments);
};
Logger.info = function() {
  if (LEVEL < LEVELS.info) {
    return;
  }
  return Logger.write("info", arguments);
};
Logger.log = function() {
  if (LEVEL < LEVELS.log) {
    return;
  }
  return Logger.write("log", arguments);
};

Logger.level( LEVELS.error );

function ABX_IMPORTER(env, folder, cb){
  window.ABX = {};

  var IMPORTS = [
    "config/" + (env || "development") + ".js",

    "event_emitter.js",

    "configuration/inflector.js",
    "configuration/utils.js",
    "configuration/cachemanager.js",
    "configuration/configuration.js",

    "core/request.js",
    "core/connection.js",

    "models/collection.js",
    "models/module.js",


    "models/account_stats.js",
    "models/collection.js",
    "models/event.js",
    "models/events.js",
    "models/external_tokens.js",
    "models/media_file.js",
    "models/media_files.js",
    "models/module.js",
    "models/node.js",
    "models/nodes.js",
    "models/permissions.js",
    "models/plan.js",
    "models/plans.js",
    "models/playlist.js",
    "models/playlists.js",
    "models/preferences.js",
    "models/user.js",
    "models/company.js",

    "core/audiobox.js"
  ];

  (function(){
    var curr = 0;
    function next(){

      if ( curr == IMPORTS.length ) {
        ABX.AudioBox = new AudioBox( new Configuration(ABX.Settings) );
        cb();
        return true;
      }

      var script = document.createElement("script");
      script.src = folder + IMPORTS[curr++];
      script.onload = next;
      document.body.appendChild( script );
    }
    next();
  })();


};
