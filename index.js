const path = require('path');
const dustRender = require('./dust-render');
const bootstrap = require('./bootstrap');
const utils = require('./utils');
const app = require('./app');
const isNode = process && process.release && process.release.name === 'node';

if (isNode) {
  module.exports = {
    //Note: this causes an error if loaded in a non-node environment (like a browser).
    gulpUtils: require('./gulp-utils'),
    getExpressBuild: function (pathDist) {
      return require(utils.getPathDustExpress(pathDist));
    },
  };
} else {
  module.exports = {
    app: app,
    bootstrap: bootstrap,
    dustRender: dustRender,
  };
}
