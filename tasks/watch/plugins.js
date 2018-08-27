const watch = require('../help/watch.js');
const gulp = require('gulp');
const gulp_watch = require('gulp-watch');
const glob = require('globby');
const path = require('path');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const delFile = require('../help/delFile.js');
const getStylesFile = require('../help/getStylesFile.js');
const getScriptFile = require('../help/getScriptFile.js');
const watchOptions = require('../config/watchOptions.js');
const imagePipeline = require('../pipelines/image.js');
const writeFile = require('write');

watch('theme:watch:plugins:media', paths.plugins.media, paths.theme.media, imagePipeline);

watch('theme:watch:plugins:styles', paths.plugins.styles, paths.theme.media)

watch('theme:watch:plugins:scripts', paths.plugins.scripts, paths.theme.media)

gulp.task('theme:watch:plugins:styles:require', (cb) => {
  gulp_watch(paths.plugins.styles, watchOptions, (e) => {
    delFile(e);

    let files =  glob.sync(paths.plugins.styles, {});
    let styles = [];
    files.forEach((file) => {
      let fileParse = path.parse(file);
      styles.push( fileParse.base );
    })

    let contentStyle = getStylesFile(styles);

    writeFile(paths.theme.media + '/plugins.scss', contentStyle, function (err) {
      if (err) {
        console.log('Ошибка при генерации плагинов');
      }
    });
  });

  cb();

})
gulp.task('theme:watch:plugins:scripts:require', (cb) => {
  gulp_watch(paths.plugins.scripts, watchOptions, (e) => {
    delFile(e);

    let files =  glob.sync(paths.plugins.scripts, []);
    let scripts = [];
    files.forEach((file) => {
      let fileParse = path.parse(file);
      scripts.push( fileParse.base );
    })

    let contentScripts = getScriptFile(scripts);

    writeFile(paths.theme.media + '/plugins.js', contentScripts, function (err) {
      if (err) {
        console.log('Ошибка при генерации плагинов');
      }
    });
  });
  cb();
});
