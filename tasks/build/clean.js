const gulp = require('gulp');
const del = require('del');
const mkdirp = require('mkdirp');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

gulp.task('theme:clean', (cb) => {
  del.sync(paths.clear.path);
  Object.values(paths.theme).forEach((el, index) => {
    mkdirp.sync(el);
  });
  cb();
});
