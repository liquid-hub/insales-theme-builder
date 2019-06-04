const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const flatten = require('gulp-flatten');
const fixPath = require('./fixPath.js');
const delFile = require('./delFile.js');
const watchOptions = require('../config/watchOptions.js');

/**
* Функция помощник для создания задач
* watch('theme:watch:css', paths.css, dest.css, stream => {
return stream
.pipe(concat());
})
*/
module.exports = (nameTask, source, dest, plugins) => {
  let pipeline = (typeof plugins === 'function') ? plugins : (stream) => { return stream; };
  return gulp.task(nameTask, () => {
    return new Promise(function (resolve, reject) {
      pipeline(watch(fixPath(source), watchOptions, delFile)
        .pipe(plumber({
          errorHandler: function (err) {
            if (err.message) {
              notifier.notify({
                message: err.message
              });
            }else{
              console.log(err);
            }
          }
        })))
        .pipe(flatten())
        .pipe(gulp.dest(dest));
      resolve();
    });
  });
};
