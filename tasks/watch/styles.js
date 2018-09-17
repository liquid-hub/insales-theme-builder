const watchSrc = require('../help/watchSrc.js');
const watch = require('../help/watch.js');
const getVariables = require('../help/getVariables.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const scssStream = require('../pipelines/scss.js');
const upath = require('upath');
const sort = require('gulp-sort');
const concat = require('gulp-concat');
const gap = require('gulp-append-prepend');

let variablesScss = [];

paths.scss.all.forEach((path) => {
  variablesScss.push(upath.normalize(path + '*.*'));
});

const processTheme = (inputStream) => {
  let variablesInclude = getVariables();

  return scssStream(inputStream
    .pipe(sort()))
    .pipe(concat('theme.scss'))
    .pipe(gap.prependText(variablesInclude));
};

const processUI = (inputStream) => {
  let variablesInclude = getVariables();

  return scssStream(inputStream
    .pipe(sort()))
    .pipe(concat('ui.scss'))
    .pipe(gap.prependText(variablesInclude));
};

watchSrc('theme:watch:styles', paths.components.styles, paths.theme.media, processTheme);
watchSrc('theme:watch:ui', paths.components.ui, paths.theme.media, processUI);
watch('theme:watch:scss', variablesScss, paths.theme.media);
