const concat = require('gulp-concat');
const gulp = require('gulp');
const dust = require('gulp-dust');
const tap = require('gulp-tap');
const path = require('path');
const streamSeries = require('stream-series');
const utils = require('./utils');
const fileExtRegex = /\.[^/.]+$/;

// todo: is there a nicer way to get this?
const pathDust = 'node_modules/dustjs-linkedin/dist/dust-core.min.js';

module.exports = function(options) {
  const pathViews = options.pathViews;
  const pathDist = options.pathDist;
  const dustBuildFileName = options.dustBuildFileName || 'dust-build';
  const isDebug = options.isDebug;

  const getDustGlob = function(pathRoot) {
    return path.join(pathRoot, '/**/*.html');
  };

  const paths = {
    dust: pathDust,
    dustExtensions: options.dustExtensions || null,
    dustSetup: path.join(__dirname, 'dust-setup.js'),
    partials: path.join(pathViews, options.pathRelPartials),
    pageModules: options.pathPageModules,
    views: pathViews,
    dist: pathDist,
    sugarconeDist: utils.getPathSugarconeDist(pathDist),
  };

  const globs = {
    views: getDustGlob(paths.views),
    partials: getDustGlob(paths.partials),
    pageModules: paths.pageModules + '/*.js',
  };

  const getDustExpressHeader = function() {
    // this is a messy way to do this. Consider a better way
    const isDebugStr =  '"isDebug": ' + isDebug + ', ';
    const dustExtensionsStr = paths.dustExtensions ? '"dustExtensionsPath": "' + paths.dustExtensions + '", ' : '';
    const dustSetupStr =  '"dustSetupPath": "' + paths.dustSetup + '", ';

    return 'const _config = {' + isDebugStr + dustSetupStr + dustExtensionsStr + ' }';
  };

  // Read the pages directory and create a dictionary of pageModules.
  const taskPageModules = function () {
    return gulp.src(globs.pageModules)
      .pipe(tap(function(file) {
        const fileName = path.basename(file.path, '.js');
        const pageModuleExportString = 'export {default as ' + utils.escapeFilename(fileName) + '} from "' + paths.pageModules + '/' + fileName + '";';

        file.contents = Buffer.concat([
          new Buffer(pageModuleExportString),
        ]);
      }))
      .pipe(concat('page-module-index.js'))
      .pipe(gulp.dest(paths.sugarconeDist));
  };

  const getDustPartials = function () {
    return gulp.src(globs.partials)
      .pipe(dust({
        name: function(file) {
          // get the path relative to the views folder root
          var relPath = path.relative(paths.views, file.path);
          // strip ext
          var dustTemplateKey = relPath.replace(fileExtRegex, '');

          // this is now the key that dust will use to cache the template
          return dustTemplateKey;
        },
      }));
  };


  const getDustExtensionsStream = function (path) {
    if (!path) {
      return null;
    }

    return gulp.src(path).pipe(tap(function(file, t) {
      const requiredFunc = require(file.path);

      file.contents = Buffer.concat([
        new Buffer(getWrappedDustFuncString(requiredFunc))
      ]);
    }));
  };

  const getWrappedDustFuncString = function (func) {
    return '(' + func.toString() + ')(dust);\n';
  };

  const prefixDustSetup = function (fileContentsArr, isDebug, pathDustExtensions) {
    if (pathDustExtensions) {
      // If there are dustExtensions, add them in
      fileContentsArr.unshift(new Buffer(
        getWrappedDustFuncString(require(pathDustExtensions)))
      );
    }

    if (isDebug) {
      fileContentsArr.unshift(
        // set the debug property at the top (unshifting last)
        new Buffer(getWrappedDustFuncString(function(dust) {
          dust.debugLevel = 'DEBUG';
        }))
      );
    }

    return fileContentsArr;
  };

  const taskDustBuild = function () {
    const dustSrc = gulp.src(paths.dust);
    const dustPartials = getDustPartials();
    const dustSetup = gulp.src(paths.dustSetup).pipe(tap(function(file, t) {
      var fileContentsArr = [file.contents];

      prefixDustSetup(fileContentsArr, isDebug, paths.dustExtensions);

      file.contents = Buffer.concat(fileContentsArr);
    }));

    return streamSeries(dustSrc, dustPartials, dustSetup)
      .pipe(concat(dustBuildFileName + '.js'))
      .pipe(gulp.dest(paths.sugarconeDist));
  };

  const taskDustExpress = function () {
    const header = getDustExpressHeader(paths.dist);

    return gulp.src(path.join(__dirname, 'dust-express.js'))
      .pipe(tap(function(file, t) {
        file.contents = Buffer.concat([
          new Buffer(header),
          file.contents
        ]);
      }))
      .pipe(concat('dust-express.js'))
      .pipe(gulp.dest(paths.sugarconeDist));
  };

  const taskHtml = function () {
    const process = gulp.src(globs.views)
      .pipe(dust({
        config: {
            // the dust whitespace parser is broken https://github.com/linkedin/dustjs/issues/238
          whitespace: true,
        },
      }))
      // todo: make this explicit #dustDistViews
      .pipe(gulp.dest(path.join(paths.dist, 'views')));

      return process;
  };

  const runTasks = function() {
    taskPageModules();
    taskDustBuild();
    taskDustExpress();
    taskHtml();
  };

  return {
    task: runTasks,
    globs: globs,
  };
};
