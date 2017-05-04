// this header will get written to _config by gulp
const config = _config || {
  isDebug: true,
  dustSetupPath: '',
};

const path = require('path');
const adaroDust = require('adaro');
const dustSetup = require(config.dustSetupPath);

const dustOptions = {
  helpers: [
    function (dust) {
      dustSetup(dust, config.isDebug);
    },
  ],
  // todo: not sure if this setting is actually getting passed through...
  whitespace: true,
  // don't cache on dev so we can see changes
  cache: !config.isDebug,
};

module.exports = {
  // These functions call dust.loadSource behind the scenes. See adaro/index.js --> adaro/lib/engine.js
  dust: adaroDust.dust(dustOptions),
  dustPrecompiled: adaroDust.js(dustOptions),
};