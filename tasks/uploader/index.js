const getConfig = require('../help/getConfig.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const bs = require('browser-sync').create('insales_server');
const gulpif = require('gulp-if');
const gulp = require('gulp');
const notifier = require('node-notifier');

// Insales Uploader
let uploader = getConfig(()=>{}, true);

if (!uploader.plugins) {
  uploader.plugins = {
    // файлы которые не обрабатываются плагинами
    exclude: ['*.min.js', '*.min.css', '*.liquid'],
    // gulp плагины для стилей
    style: function (stream) {
      return stream
        .pipe(gulpif(stream.isPaused(), stream.resume()));
    },
    // gulp плагины для скриптов
    script: function (stream) {
      return stream
        .pipe(gulpif(stream.isPaused(), stream.resume()));
    }
  };
}

let optionDefaultUploader = {
  theme: {
    root: paths.uploader,
    backup: false,
    assetsSync: false
  }
};

uploader = {...optionDefaultUploader, ...uploader};

if (uploader.theme && uploader.theme.id) {
  uploader.theme.root = paths.uploader;
  if (!uploader.theme.id) {
    gulp.task('uploader:watch', (cb) => cb());
    throw new Error('Нет id темы!');
  }

  const InsalesUploader = require('insales-uploader');
  const InsalesUp = new InsalesUploader(uploader);

  gulp.task('uploader:watch', function (cb) {
    if (!uploader.account) {
      notifier.notify({
        message: 'Нет настроек для insales-uploader'
      });
      return false;
    }
    let withTools = typeof uploader.tools !== 'undefined';
    let withBrowserSync = (withTools) ? typeof uploader.tools.browserSync !== 'undefined' : false;

    InsalesUp.stream(function () {
      if (withTools && withBrowserSync && uploader.tools.browserSync.start) {
        bs.reload();
      }
    });

    if (withTools && withBrowserSync && uploader.tools.browserSync.start) {
      let optionDefault = {
        proxy: InsalesUp.options.themeUrl.replace('https', 'http'),
        serveStatic: [InsalesUp.options.theme.root],
        reloadDebounce: 5000,
        reloadDelay: 2000,
        https: false
      };
      bs.init(optionDefault);
    }

    if (typeof cb === 'function') cb();
  });

  gulp.task('uploader:upload', function (cb) {
    if (!uploader.account) {
      notifier.notify({
        message: 'Нет настроек для insales-uploader'
      });
      return false;
    }

    InsalesUp.upload();

    if (typeof cb === 'function') cb();
  });

  gulp.task('uploader:stop', function (cb) {
    if (!uploader.account) {
      notifier.notify({
        message: 'Нет настроек для insales-uploader'
      });
      return false;
    }

    InsalesUp.stopStream();
    if (typeof cb === 'function') cb();
  });

  gulp.task('uploader:download', function (cb) {
    if (!uploader.account) {
      notifier.notify({
        message: 'Нет настроек для insales-uploader'
      });
      return false;
    }

    InsalesUp.download();
    if (typeof cb === 'function') cb();
  });
}else{
  notifier.notify({
    message: 'Нет настроек для insales-uploader'
  });
};
