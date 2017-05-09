const path = require('path');

const escapeFilename = function (str) {
  // todo: #escapeFilename make this more robust.
  // prefix with an underscore, and replace dashes and spaces to underscores
  return '_' + str.replace(/[- ]/g, '_');
};

const getPathDustExpress = function (pathDist) {
  return path.join(getPathSugarconeDist(pathDist), 'dust-express');
};

const getPathSugarconeDist = function (pathDist) {
  return path.join(pathDist, 'sugarcone');
};

module.exports = {
  escapeFilename: escapeFilename,
  getPathDustExpress: getPathDustExpress,
  getPathSugarconeDist: getPathSugarconeDist,
};
