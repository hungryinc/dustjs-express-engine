module.exports = function (App, _appData) {
  // todo: keep window.appData as a fallback until the next breaking change update
  const appData = _appData || window.appData || {};
  const app = new App(appData);

  window.onload = app.init.bind(app);
};