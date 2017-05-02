module.exports = {
  getPage: function (Pages, _route) {
    const route = _route || 'home';

    // get the correct page constructor
    const Page = Pages[route];

    return Page;
  },
}