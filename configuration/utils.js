

var Utils = module.exports = {

  isDefined: function(value){
    return value !== null && value !== undefined;
  },

  /**
   *  This method freezes the given object and all its 'Obejct' typed property
   *  recursively
   */
  freeze: function (fields){
    Object.freeze( fields );
    var keys = Object.keys( fields );

    keys.forEach(function(k){

      if ( fields.hasOwnProperty(k) ){
        if ( typeof fields[k] === "object" ){
          Utils.freeze( fields[k] );
        }
      }

    });
  },


  merge: function(){

    var
      dest = arguments[0]
      args = Array.prototype.slice.call( arguments, 1 );

    args.forEach(function(obj){

      var keys = Object.keys(obj);

      keys.forEach(function(key){
        if (   Utils.isDefined( obj[ key ] )   )
          dest[ key ] = obj[ key ];
      });

    });

    return dest;
  }

};

