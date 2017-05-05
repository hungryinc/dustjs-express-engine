const escapeFilename = require('./utils').escapeFilename;

module.exports = {
  getPage: function (Pages, _route) {
    const route = escapeFilename(_route || 'home');

    // get the correct page constructor
    const Page = Pages[route];

    return Page;
  },
}