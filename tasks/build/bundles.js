const gulp = require('gulp');
const scssStream = require('../pipelines/scss.js');
const sort = require('gulp-sort');
const concat = require('gulp-concat');
const gap = require('gulp-append-prepend');
const fs = require('fs');
const upath = require('upath');
const updatePaths = require('../help/updatePaths.js');
const getVariables = require('../help/getVariables.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('variables:scss', (cb) => {
  let variablesScss = [];

  paths.scss.all.forEach((path) => {
    variablesScss.push(upath.normalize(path + '*.*'));
  });
  gulp.src(variablesScss)
    .pipe(gulp.dest(paths.theme.media));

  cb();
});

gulp.task('bundle:css', (cb) => {
  let variablesInclude = getVariables();
  fs.readdir(paths.bundles.css, (err, list) => {
    if (err || !list) return cb();

    list.forEach((item) => {
      let path = upath.normalize(paths.bundles.css + '/' + item + '/**.*css');
      let pathInner = upath.normalize(paths.bundles.css + '/' + item + '/*/**.*css');
      let name = item + '.scss';

      scssStream(gulp.src([pathInner, path]))
        .pipe(concat(name))
        .pipe(gap.prependText(variablesInclude))
        .pipe(gulp.dest(paths.theme.media));
    });
    cb();
  });
});

gulp.task('bundle:js', (cb) => {
  fs.readdir(paths.bundles.js, (err, list) => {
    if (err || !list) return cb();

    list.forEach((item) => {
      let path = upath.normalize(paths.bundles.js + '/' + item + '/**.js');
      let pathInner = upath.normalize(paths.bundles.js + '/' + item + '/*/**.js');
      let name = item + '.js';

      gulp.src([pathInner, path])
        .pipe(concat(name))
        .pipe(gulp.dest(paths.theme.media));
    });

    cb();
  });
});
