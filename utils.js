const path = require('path');

const escapeFilename = function (str) {
  // todo: #escapeFilename make this more robust.
  // prefix with an underscore, and replace dashes and spaces to underscores
  return '_' + str.replace(/[- ]/g, '_');
};

const getPathDustExpress = function (pathDist) {
  return path.join(getPathDistSubdirectory(pathDist), 'dust-express');
};

const getPathDistSubdirectory = function (pathDist) {
  return path.join(pathDist, 'dustjs-express-engine');
};

module.exports = {
  escapeFilename: escapeFilename,
  getPathDustExpress: getPathDustExpress,
  getPathDistSubdirectory: getPathDistSubdirectory,
};
