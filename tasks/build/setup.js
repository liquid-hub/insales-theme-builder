const gulp = require('gulp');
const merge = require('gulp-merge-json');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const testEmpty = require('../help/testEmpty.js');
const filter = require('gulp-filter');

gulp.task('deploy:setup', function () {
  return new Promise((resolve, reject) => {
    gulp.src(paths.setup.setup, { allowEmpty: true })
      .pipe(filter(testEmpty))
      .pipe(plumber({
        errorHandler: function (err) {
          if (err.message) {
            notifier.notify({
              message: err.message
            });
          }
        }
      }))
      .pipe(merge({
        fileName: 'setup.json'
      }))
      .pipe(gulp.dest(paths.theme.config))
      .on('end', () => resolve());
  });
});
