module.exports = function (App) {
  const app = new App(window.appData);

  window.onload = app.init.bind(app);

  // temp - expose the app instance to the window object
  window.app = app;
};