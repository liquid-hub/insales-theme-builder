const gulp = require('gulp');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('deploy:config', function (cb) {
  gulp.src(paths.config.configs)
    .pipe(gulp.dest(paths.theme.config))
    .on('end', () => cb());
});
