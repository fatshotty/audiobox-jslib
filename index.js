function Logger() {
  if (window.console) {
    console.info.apply(console, arguments);
  }
}

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
