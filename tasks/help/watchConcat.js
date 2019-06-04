const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const filter = require('gulp-filter');
const sort = require('gulp-sort');
const concat = require('gulp-concat');
const gap = require('gulp-append-prepend');
const testEmpty = require('./testEmpty.js');

/**
* Функция помощник для создания задач
* watch('theme:watch:css', paths.css, dest.css, stream => {
return stream
.pipe(concat());
})
*/
module.exports = (nameTask, source, dest, concatName, textInclude, plugins) => {
  let pipeline = (typeof plugins === 'function') ? plugins : (stream) => { return stream; };
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
          .pipe(filter(testEmpty))
          .pipe(sort()))
          .pipe(concat(concatName))
          .pipe(gap.prependText(textInclude))
          .pipe(gulp.dest(dest));
      });
      resolve();
    });
  });
};
