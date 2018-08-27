const postcss = require('gulp-postcss');
const upath = require('upath');
const configPost = upath.join(__dirname + '../../../' +'/postcss.config.js');
const config = require(configPost);
const log = require('fancy-log');
const notifier = require('node-notifier');
const gulpif = require('gulp-if');
const path = require('path');
const insert = require('gulp-insert');

// настройки нотификации
let defaultNotifier = {
  sound: true,
  title: 'insales-template-builder',
  message: ''
}
;
module.exports = function (stream) {
  return stream
    .pipe(insert.transform(function (contents, file) {
      if (contents && contents.length > 0) {
        let name = path.basename(file.path, '.scss');
        if (name == 'ui') {
          let dirName = upath.dirname(file.path);
          name = dirName.split(upath.sep).reverse()[0];
        }
        let comment = getComments(name);
        contents = comment + contents;
      }

      return contents;
    }))
    .pipe(postcss(config.plugins, config.options).on('error', function (err) {
      defaultNotifier.message = err.name;
      notifier.notify(defaultNotifier);
      log(err.message);
      console.log(err);
    }))
    .pipe(gulpif(stream.isPaused(), stream.resume()));
};

function getComments (name) {
  return '/*=========================================\n  ' + name.toUpperCase() + '\n=========================================*/\n';
};
