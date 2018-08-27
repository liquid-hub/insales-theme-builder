const gulp = require('gulp');
const gulp_watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const testEmpty = require('../help/testEmpty.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const merge = require('gulp-merge-json');
const filter = require('gulp-filter');
const notifier = require('node-notifier');

gulp.task('theme:watch:setup', () => {
  return new Promise(function(resolve, reject) {

    gulp_watch(paths.setup.setup, function () {
      gulp.src(paths.setup.setup, {allowEmpty:true})
      .pipe(filter(testEmpty))
      .pipe(plumber({
        errorHandler: function(err) {
          if (err.message) {
            notifier.notify({
              message:  err.message
            });
          }
        }
      }))
      .pipe(merge({
        fileName: "setup.json"
      }))
      .pipe(gulp.dest(paths.theme.config))
    })

    resolve()
  });
});
