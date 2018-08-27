const gulpif = require('gulp-if');

module.exports = function (stream) {
  return stream
    .pipe(gulpif(stream.isPaused(), stream.resume()));
};
