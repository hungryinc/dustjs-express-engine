const logger = (console && console.log) || function() {
  // noop. No console available.
};

// todo: replace these dummy examples with settings passed in
var dustFilters = {
  addOneAndZeroFill: function(val) {
    return ('00' + (val + 1)).slice(-2);
  },
};

var dustHelpers = {
  testToUpper: function (chunk, context, bodies, params) {
    return chunk.tap(function(data) {
      return data.toUpperCase();
    }).render(bodies.block, context).untap();
  },
};

var setupHelpers = function(dust) {
  Object.assign(dust.helpers, dustHelpers);
};

var setupFilters = function(dust) {
  Object.assign(dust.filters, dustFilters);
};

var setup = function(dust, isDebug) {
  var dustLog = dust.log;

  if (isDebug) {
    // ensure that dust actually logs errors.
    dust.debugLevel = 'DEBUG';

    // wrap the existing log function to provide more detail and also log on the front end.
    dust.log = function(msg, level) {
      logger('[DUST:' + level + ']: ' + msg);
      dustLog.apply(this, arguments);
    };
  }

  setupHelpers(dust);
  setupFilters(dust);
};

// Make Client and Server Compatible
if (typeof exports !== 'undefined') {
  module.exports = setup;
} else if (!!window) {
  // todo: use a different flag.
  setup(window.dust, window.appData.isDev);
}