const upath = require('upath');
const gulp = require('gulp');
const watch = require('gulp-watch');
const scssStream = require('../pipelines/scss.js');
const filter = require('gulp-filter');
const sort = require('gulp-sort');
const concat = require('gulp-concat');
const gap = require('gulp-append-prepend');
const getVariables = require('../help/getVariables.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('theme:watch:bundles:css', function (cb) {
  let css = [upath.normalize( paths.bundles.css + '/*/*.*css' ), upath.normalize( paths.bundles.css + '/*/*/*.*css' )];

  var bundlesPath = upath.sep + 'bundles' + upath.sep + 'css' + upath.sep;
  watch(css, function (vinyl) {
    var dirname = paths.bundles.css + '/' +vinyl.dirname.split(bundlesPath).reverse()[0].split(upath.sep)[0];

    let variablesInclude = getVariables();
    var bundlePath = [upath.normalize(dirname + '/*/*.*css'), upath.normalize(dirname + '/*.*css')];
    var bundleName = dirname.split(upath.sep).reverse()[0] + '.scss';
    scssStream(gulp.src(bundlePath))
      .pipe(sort())
      .pipe(concat(bundleName))
      .pipe(gap.prependText(variablesInclude))
      .pipe(gulp.dest(paths.theme.media));
  });

  cb();
});

gulp.task('theme:watch:bundles:js', function (cb) {
  var js = [upath.normalize( paths.bundles.js + '/*/*.*js' ), upath.normalize(paths.bundles.js + '/*/*/*.*js' )];

  var bundlesPath = upath.sep + 'bundles' + upath.sep + 'js' + upath.sep;

  watch(js, function (vinyl) {
    var dirname = paths.bundles.js + '/' +vinyl.dirname.split(bundlesPath).reverse()[0].split(upath.sep)[0];

    var bundlePath = [upath.normalize( dirname + '/*.*js' ), upath.normalize( dirname + '/*/*.*js' )];
    var bundleName = dirname.split(upath.sep).reverse()[0] + '.js';

    gulp.src(bundlePath)
      .pipe(sort())
      .pipe(concat(bundleName))
      .pipe(gulp.dest(paths.theme.media));
  });
  cb();
});
