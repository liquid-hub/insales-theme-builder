const gulp = require('gulp');
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('deploy:fonts:items', (cb) => {
  gulp.src(paths.fonts.path)
    .pipe(flatten())
    .pipe(gulp.dest(paths.theme.media))
    .on('end', () => cb());
});

gulp.task('deploy:fonts:styles', (cb) => {
  gulp.src(paths.fonts.style)
    .pipe(concat('fonts.scss'))
    .pipe(gulp.dest(paths.theme.media))
    .on('end', () => cb());
});
