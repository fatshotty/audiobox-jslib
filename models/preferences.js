
/**
  color: 'audiobox-fm-blue',
  repeat: false,
  shuffle: false,
  autoplay: false,
  prebuffer: true,
  js_demuxer: false,
  top_bar_bg: 'default',
  volume_level: '0',
  accept_emails: true,
  hide_tooltips: false
 */

(function(){
  window.Preferences = Preferences;




  function Preferences(config, connectors) {
    var self = this;
    Module.call( this, Preferences.DECLARED_FIELDS, config, connectors );
  }


  Preferences.prototype.__proto__ = Module.prototype;

  Preferences.DECLARED_FIELDS = Object.freeze({
    color: 'audiobox-fm-blue',
    repeat: false,
    shuffle: false,
    autoplay: false,
    prebuffer: false,
    js_demuxer: false,
    top_bar_bg: 'default',
    volume_level: '0',
    accept_emails: false,
    hide_tooltips: false
  });

  Preferences.prototype._extractData = function(data){
    return data.preferences;
  };
})();
