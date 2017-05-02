// A dust compilation service to be run from the front-end client.
//
// window.dust should be already defined.
//
// tmpl should be the key of a precompiled blog template. E.G. 'partials/blog'
// for more details see the taskDustBuild in the gulpfile.
module.exports = function(tmpl, data, onRes, onErr) {
  var dust = window.dust;

  if (!dust) {
    throw 'Error: window.dust not found. If trying to use this from the backend, you should use adaro instead.'
  }

  if (!tmpl) {
    throw 'Error: tmpl parameter is required';
  }

  data = data || {};

  return dust.render(tmpl, data, function(err, out) {
    if (err) {
      onErr = onErr || function(err){ throw err };

      onErr(err);
    }

    onRes(out);
  });
};
