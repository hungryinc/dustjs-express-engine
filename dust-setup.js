const dustSetup = function(dust) {
  const logger = (console && console.log) || function() {
    // noop. No console available.
  };

  var dustLog = dust.log;
  var isDebug = dust.debugLevel === 'DEBUG';

  if (isDebug) {
    // wrap the existing log function to provide more detail and also log on the front end.
    dust.log = function(msg, level) {
      logger('[DUST:' + level + ']: ' + msg);
      dustLog.apply(this, arguments);
    };
  }
};

// Make Client and Server Compatible
if (typeof exports !== 'undefined') {
  module.exports = dustSetup;
} else if (!!window) {
  dustSetup(window.dust);
}