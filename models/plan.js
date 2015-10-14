var Utils = require("../configuration/utils");
var Logger = require("logging");
var Module = require("./module");
var Playlists = require("./plans");


/*
  description: 'Cloud 5GB',
  price: 99,
  currency: 'USD',
  currency_symbol: '$',
  formatted_price: '$0.99',
  formatted_monthly_price: '$0.99/mo.',
  soft_limit: 5242880000,
  special: false,
  code: 'audiobox_5',
  current: false
*/

module.exports = Plan;


function Plan(config, connectors){

  Module.call( this, Plan.DECLARED_FIELDS, config, connectors );

  return this;
}

Plan.prototype.__proto__ = Module.prototype;

Plan.__defineGetter__("END_POINT", function(value){
  return Plans.END_POINT;
});

Plan.prototype.__defineGetter__("END_POINT", function(value){
  return Plan.END_POINT;
});


Plan.DECLARED_FIELDS = Object.freeze({

  description: '',
  price: 0,
  currency: '',
  currency_symbol: '',
  formatted_price: '',
  formatted_monthly_price: '',
  soft_limit: 0,
  special: false,
  code: '',
  current: false

});

Plan.prototype._extractData = function(data){
  return data.plan;
};
