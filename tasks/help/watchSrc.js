const gulp = require('gulp');
const flatten = require('gulp-flatten');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const fixPath = require('./fixPath.js');

/**
* Функция помощник для создания задач
* watch('theme:watch:css', paths.css, dest.css, stream => {
return stream
.pipe(concat());
})
*/
module.exports = (nameTask, sourcePath, dest, plugins) => {
  let pipeline = (typeof plugins === 'function') ? plugins : (stream) => { return stream; };
  let source = fixPath(sourcePath);
  return gulp.task(nameTask, () => {
    return new Promise(function (resolve, reject) {
      watch(source, () => {
        return pipeline(gulp.src(source)
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
          }))
        )
          .pipe(flatten())
          .pipe(gulp.dest(dest));
      });
      resolve();
    });
  });
};
