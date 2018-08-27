const watch = require('../help/watch.js');
const watchSrc = require('../help/watchSrc.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const sort = require('gulp-sort');
const concat = require('gulp-concat');

watch('theme:watch:snippets', paths.components.liquid, paths.theme.snippets);

const processGuide = (inputStream) => {
  return inputStream
    .pipe(sort())
    .pipe(concat('style_guide.liquid'));
};

watchSrc('theme:watch:guide', paths.components.guide, paths.theme.snippets, processGuide);
