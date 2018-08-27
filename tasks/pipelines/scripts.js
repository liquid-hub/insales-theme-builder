const gulpif = require('gulp-if');
const path = require('path');
const insert = require('gulp-insert');

module.exports = function (stream) {
  return stream
    .pipe(insert.transform(function (contents, file) {
      if (contents && contents.length > 0) {
        let name = path.basename(file.path, '.js');
        let comment = getComments(name);
        contents = comment + contents;
      }

      return contents;
    }))
    .pipe(gulpif(stream.isPaused(), stream.resume()));
};

function getComments (name) {
  return '/**\n * ' + name.toUpperCase() + '\n */\n';
}
