(function(){
  /**
    type: 'AudioFile',
    token: 'c_00c55d...86d0c6',
    artist: 'Aban',
    album: 'La Bella Italia',
    genre: 'Hip Hop',
    release_year: 2008,
    title: 'Intro',
    len_str: '2:13',
    len_int: 133,
    position: 1,
    filename: 'c_00c55dd40....86d0c6.mp3',
    loved: false,
    disc_number: 1,
    mime: 'audio/mpeg',
    remote_path: null,
    source: 'cloud',
    share_token: '710db390a8.....5a78c5a94e220f13',
    size: 2175615,
    hash: 'b07b4b631588.....0f1e09b4488',
    video_bitrate: null,
    video_codec: null,
    video_resolution: null,
    video_fps: null,
    video_aspect: null,
    video_container: null,
    audio_bitrate: '128',
    audio_codec: null,
    audio_sample_rate: '44100',
    artwork: '//s3.amazonaws.com/m.audiobox.fm/a/000/000/954/17c02bb5fb52.jpg',
    plays: 3
   */


  window.MediaFile = MediaFile;


  function MediaFile(config, connectors){

    Module.call( this, MediaFile.DECLARED_FIELDS, config, connectors );

    return this;
  }


  MediaFile.prototype.__proto__ = Module.prototype;


  MediaFile.prototype.__defineGetter__('streamUrl', function(){
    var request = this.NodeConnector.Request;
    return request.parseUrl( '/stream/' + this.filename, true );
  });

  MediaFile.prototype.__defineGetter__('downloadUrl', function(){
    var request = this.NodeConnector.Request;
    return request.parseUrl( '/download/' + this.filename, true );
  });



  MediaFile.DECLARED_FIELDS = Object.freeze({
    type:  '',
    token:  '',
    artist:  '',
    album:  '',
    genre:  '',
    release_year:  0,
    title:  '',
    len_str:  '',
    len_int:  0,
    position:  0,
    filename:  '',
    loved:  false,
    disc_number:  0,
    mime:  '',
    remote_path:  null,
    source:  '',
    share_token:  '',
    size:  0,
    hash:  '',
    video_bitrate:  null,
    video_codec:  null,
    video_resolution:  null,
    video_fps:  null,
    video_aspect:  null,
    video_container:  null,
    audio_bitrate:  '',
    audio_codec:  null,
    audio_sample_rate:  '',
    artwork:  '',
    plays: 0
  });

  MediaFile.prototype.__defineGetter__("Sources", function(){
    return MediaFiles.Sources;
  });


  MediaFile.prototype._extractData = function(data) {
    return data[ "media_file" ];
  };


  MediaFile.prototype.lyrics = function(callback){
    var
      self = this,
      request = this.RailsConnector.Request;

    // Set the 'extension' for the URL
    request.requestFormat = this.Configuration.RequestFormats.JSON;

    request.success = function(res, data){

      var mediadata = self._extractData( data );

      callback( mediadata.lyrics || "" );

    };

    return request.get(  [ MediaFiles.END_POINT, this.token, "lyrics"] );
  };


  MediaFile.prototype.scrobble = function(){
    var
      self = this,
      request = this.RailsConnector.Request;

    // Set the 'extension' for the URL
    request.requestFormat = this.Configuration.RequestFormats.JSON;

    request.success = function(res, data){

      self.plays = self.plays + 1;

      self.emit("changed", ['plays']);

    };
    return request.post(  [ MediaFiles.END_POINT, this.token, "scrobble" ] );
  };




  MediaFile.prototype.upload = function(path) {
    var
      self = this,
      request = this.NodeConnector.Request;

    var file = request.fileUpload(path);

    request.success = function(res, data){
      data = self._extractData( data );
      self._parseResponse( data );
    };

    return request.post( "upload", {"files[]": file });
  };


  MediaFile.prototype.uploadAsLocal = function(){
    throw new Error("not implements yet");
  };

  MediaFile.prototype.update = function(){
    if ( ! this.token )
      throw "media file has no token"

    var
      self = this,
      request = this.RailsConnector.Request;

    request.requestFormat = this.Configuration.RequestFormats.JSON;

    return request.put([ MediaFiles.END_POINT, this.token ], this.queryParameters);
  };

  MediaFile.prototype.delete = function(){
    if ( ! this.token )
      throw "media file has no token"

    var
      self = this,
      request = this.RailsConnector.Request;

    request.requestFormat = this.Configuration.RequestFormats.JSON;

    return request.del([ MediaFiles.END_POINT, "multidestroy" ], {"tokens[]": this.token});
  };


  MediaFile.prototype.__defineGetter__("queryParameters", function(){
    var result = {};

    var field_keys = Object.keys( MediaFile.DECLARED_FIELDS );
    field_keys.forEach(function(key){
      var value = MediaFile.DECLARED_FIELDS[ key ];
      if ( typeof value == 'object' ) return;
      result[ key ] = this[ key ];
    }, this);

    return result;

  });
})();