const escapeFilename = function (str) {
  // todo: #escapeFilename make this more robust.
  // prefix with an underscore, and replace dashes and spaces to underscores
  return `_${str.replace(/[- ]/g, '_')}`;
};

module.exports = {
  escapeFilename: escapeFilename,
};
