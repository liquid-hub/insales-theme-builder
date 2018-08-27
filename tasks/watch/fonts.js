const gulp = require('gulp');
const concat = require('gulp-concat');
const sort = require('gulp-sort');
const watch = require('../help/watch.js');
const watchSrc = require('../help/watchSrc.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

watchSrc('theme:watch:fonts:style', paths.fonts.style, paths.theme.media, (stream) => {
  return stream
    .pipe(sort())
    .pipe(concat('fonts.scss'));
});

watch('theme:watch:fonts:media', paths.fonts.path, paths.theme.media);

gulp.task('theme:watch:fonts', gulp.series('theme:watch:fonts:style', 'theme:watch:fonts:media'));
