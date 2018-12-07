const gulp = require('gulp');
const upath = require('upath');
const log = require('fancy-log');
const download = require('download-git-repo');
const theme = require('../config/theme.json');
const async = require('async');
const deepMerge = require('../help/deepMerge');
const getConfig = require('../help/getConfig');

let PWD = process.env.PWD || process.cwd();
let tmp = upath.normalize(PWD + '/project/tmp/');

gulp.task('git:download', () => {
  let config = getConfig();
  let components = deepMerge(theme, config.mixedComponents);
  if (typeof config.customTheme == 'object' && Object.keys(config.customTheme).length) {
    components = config.customTheme;
  }
  return getComponents(components);
});

function getComponents (components) {
  let componentsPkg = {};
  return new Promise(function (resolve, reject) {
    if (!components) resolve(componentsPkg);

    async.mapSeries(components, (url, cb) => {
      let link = url.replace(/^\//, '').replace(/^https:\/\/github.com\//, '');
      let key = url.split('/').reverse()[0];
      let savePath = tmp + key;
      download(link, savePath, function (err) {
        let component = upath.resolve(savePath + '/component.json');
        let currentModule = require(component);
        componentsPkg[key] = currentModule;
        log('Компонент - ' + link);
        if (err) {
          console.log(err);
        }
        cb();
      });
    }, () => {
      resolve(componentsPkg);
    });
  });
}

module.exports = getComponents;
