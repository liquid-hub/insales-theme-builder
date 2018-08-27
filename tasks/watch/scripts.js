const watch = require('../help/watchSrc.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const jsStream = require('../pipelines/scripts.js');
const sort = require('gulp-sort');
const concat = require('gulp-concat');

const process = (inputStream) => {
  return jsStream(inputStream
    .pipe(sort()))
    .pipe(concat('theme.js'));
};

watch('theme:watch:scripts', paths.components.scripts, paths.theme.media, process);
