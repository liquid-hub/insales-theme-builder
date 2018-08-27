const gulp = require('gulp');
const flatten = require('gulp-flatten');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const imagePipeline = require('../pipelines/image.js');

gulp.task('deploy:media', (cb) => {
  return imagePipeline(gulp.src(paths.media.paths)
    .pipe(flatten()))
    .pipe(gulp.dest(paths.theme.media))
    .on('end', cb);
});
