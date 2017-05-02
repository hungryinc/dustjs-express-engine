const path = require('path');
const dustRender = require('./dust-render');
const bootstrap = require('./bootstrap');
const app = require('./app');

module.exports = {
  app: app,
  bootstrap: bootstrap,
  dustRender: dustRender,
  getGulpDust: function () {
    // this needs to be protected in this function wrap to prevent errors
    return require('./gulp-task-dust');
  },
};
