const gulp = require('gulp');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('deploy:templates:liquid', () => {
  return new Promise((resolve, reject) => {
    gulp.src(paths.templates.liquid)
      .pipe(gulp.dest(paths.theme.templates))
      .on('end', () => resolve());
  });
});
