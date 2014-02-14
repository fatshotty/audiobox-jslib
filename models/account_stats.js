var Logger = require("logging").from(__filename);

/**
  data_served_this_month: 1493165284,
  data_served_overall: 1493165284,
  cloud_data_stored_overall: 1488200097,
  cloud_data_stored_this_month: 1488200097,
  local_data_stored_overall: 0,
  local_data_stored_this_month: 3770908450,
  dropbox_data_stored_overall: 0,
  dropbox_data_stored_this_month: 0,
  gdrive_data_stored_this_month: 38403869,
  gdrive_data_stored_overall: 38403869,
  skydrive_data_stored_this_month: 38403869,
  skydrive_data_stored_overall: 38403869,
  box_data_stored_this_month: 19324002,
  box_data_stored_overall: 19324002,
  soundcloud_data_stored_this_month: 0,
  soundcloud_data_stored_overall: 0
 */


window.AccountStats = AccountStats;


function AccountStats(config, connectors) {
  var self = this;
  Module.call( this, AccountStats.DECLARED_FIELDS, config, connectors );
}


AccountStats.prototype.__proto__ = Module.prototype;

AccountStats.DECLARED_FIELDS = Object.freeze({
  data_served_this_month: 0,
  data_served_overall: 0,
  cloud_data_stored_overall: 0,
  cloud_data_stored_this_month: 0,
  local_data_stored_overall: 0,
  local_data_stored_this_month: 0,
  dropbox_data_stored_overall: 0,
  dropbox_data_stored_this_month: 0,
  gdrive_data_stored_this_month: 0,
  gdrive_data_stored_overall: 0,
  skydrive_data_stored_this_month: 0,
  skydrive_data_stored_overall: 0,
  box_data_stored_this_month: 0,
  box_data_stored_overall: 0,
  soundcloud_data_stored_this_month: 0,
  soundcloud_data_stored_overall: 0
});

AccountStats.prototype._extractData = function(data){
  return data.stats;
};