const gulp = require('gulp');
const writeFile = require('write');
const glob = require('globby');
const flatten = require('gulp-flatten');
const updatePaths = require('../help/updatePaths.js');
const getStylesFile = require('../help/getStylesFile.js');
const getScriptFile = require('../help/getScriptFile.js');
const paths = updatePaths(require('../config/paths.json'));
const sort = require('gulp-sort');
const plumber = require('gulp-plumber');
gulp.plumbed = (...args) => gulp.src(...args).pipe(plumber());

gulp.task('deploy:plugins:styles', () => {
  return new Promise((resolve, reject) => {
    return gulp.plumbed(paths.plugins.styles, {allowEmpty: true})
      .pipe(sort())
      .pipe(flatten())
      .pipe(gulp.dest(paths.theme.media))
      .on('end', () => {
        resolve();
      });
  });
});

gulp.task('deploy:plugins:scss', (cb) => {
  glob(paths.plugins.styles)
    .then((styles) => {
      if (styles.length) {
        let contentStyle = getStylesFile(styles);
        writeFile(paths.theme.media + '/plugins.scss', contentStyle, function (err) {
          if (err) {
            console.log('Ошибка при генерации стилей');
          }
        });
      }
      cb();
    });
});

gulp.task('deploy:plugins:media', function () {
  return new Promise((resolve, reject) => {
    return gulp.plumbed(paths.plugins.media, {allowEmpty: true})
      .pipe(flatten())
      .pipe(gulp.dest(paths.theme.media))
      .on('end', () => resolve());
  });
});

gulp.task('deploy:plugins:scripts', function () {
  return new Promise((resolve, reject) => {
    return gulp.plumbed(paths.plugins.scripts, {allowEmpty: true})
      .pipe(sort())
      .pipe(flatten())
      .pipe(gulp.dest(paths.theme.media))
      .on('end', function () {
        resolve();
      });
  });
});

gulp.task('deploy:plugins:js', (cb) => {
  glob(paths.plugins.scripts)
    .then((scripts) => {
      if (scripts.length) {
        let contentScripts = getScriptFile(scripts);
        writeFile(paths.theme.media + '/plugins.js', contentScripts, function (err) {
          if (err) {
            console.log('Ошибка при генерации стилей');
          }
        });
      }
      cb();
    });
});
