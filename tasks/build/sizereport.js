const gulp = require('gulp');
const size = require('gulp-warn-size');
const notifier = require('node-notifier');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('theme:sizereport', (cb) => {
  return gulp.src(paths.theme.media + '/*')
    .pipe(size(1048576))
    .on('error', (e) => {
      notifier.notify({
        sound: true,
        title: 'insales-template-builder',
        message: 'Файл больше 1mb'
      });
    })
    .on('end', () => cb());
});
