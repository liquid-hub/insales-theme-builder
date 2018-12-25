const outputFileSync = require('output-file-sync');
const gulp = require('gulp');
const download = require('download');
const flatten = require('gulp-flatten');
const upath = require('upath');
const del = require('del');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const async = require('async');
const getComponents = require('./download.js');
const omit = require('object.omit');

let PWD = process.env.PWD || process.cwd();
let thempath = upath.normalize(PWD + '/project/');
let tmp = upath.normalize(PWD + '/project/tmp/');

gulp.task('git:build', () => {
  getComponentsPkg()
    .then(getDependencies)
    .then(destComponents)
    .then(clearTmp)
    .catch((err) => console.log(err));
});

// получить component.json
function getComponentsPkg () {
  return new Promise((resolve, reject) => {
    let components = {};
    try {
      let directories = getDirectories(tmp);
      async.mapSeries(directories, (path, cb) => {
        let currentModule = require(upath.resolve(path + '/component.json'));
        let key = currentModule.homepage.split('/').reverse()[0];
        components[key] = {...currentModule, path, key};
        cb();
      }, () => {
        resolve(components);
      });
    } catch (e) {
      reject(new Error('Нет директории компонентов'));
    }
  });
}

// Получить массив зависимостей, рекурсивно скачать все зависимости, сверяя в буфере массив компонентов
function getDependencies (componentsInner = {}) {
  return new Promise((resolve, reject) => {
    recursiveGetDependencies(componentsInner);

    function recursiveGetDependencies (components = {}, recursiveData = {}) {
      components = {...components, ...recursiveData};
      let dependencies = {};

      async.mapSeries(components, (component, cb) => {
        let keysComponents = Object.keys(components);
        let downloadList = omit(component.dependencies, keysComponents);
        getComponents(downloadList)
          .then((dependence) => {
            dependencies = {...dependencies, ...dependence};
            cb();
          })
          .catch(() => {
            reject(new Error('Ошибка при скачивании'));
          });
      }, () => {
        let keysComponents = Object.keys(components);
        let downloadList = omit(dependencies, keysComponents);
        if (Object.keys(downloadList).length > 0) {
          return recursiveGetDependencies(downloadList, components);
        } else {
          return resolve({...dependencies, ...components});
        }
      });
    }
  });
}
// Переместить компоненты в нужные директории (в зависимости от типа)
function destComponents () {
  return new Promise((resolve, reject) => {
    getComponentsPkg()
      .then((components) => {
        async.mapSeries(components, (component, cb) => {
          let componentDest = thempath + '/components/' + component.key;
          switch (component.type) {
            case 'media':
              componentDest = thempath + '/media/' + component.key;
              break;
            case 'scss_function':
              componentDest = thempath + '/scss_import/function/';
              break;
            case 'scss_mixins':
              componentDest = thempath + '/scss_import/mixins/';
              break;
            case 'scss_variables':
              componentDest = thempath + '/scss_import/variables/';
              break;
            case 'scss_variables_default':
              componentDest = thempath + '/scss_import/variables_default/';
              break;
            case 'templates':
              componentDest = thempath + '/templates/';
              break;
            case 'fonts':
              componentDest = thempath + '/fonts/' + component.key;
              break;
            case 'config':
              componentDest = thempath + '/config/';
              break;
            case 'bundle-css':
              let keyCss = (typeof component.bundleName !== 'undefined') ? component.bundleName : component.key;
              componentDest = thempath + '/bundles/css/' + keyCss;
              break;
            case 'bundle-js':
              let keyJs = (typeof component.bundleName !== 'undefined') ? component.bundleName : component.key;
              componentDest = thempath + '/bundles/js/' + keyJs;
              break;
            default:
              componentDest = thempath + '/components/' + component.key;
          }
          componentDest = upath.normalize(componentDest);
          getPlugins(component.plugins, componentDest, component.type)
            .then(() => {
              switch (component.type) {
                case 'snippets':
                  gulp.src([component.path + '/*', component.path + '/*/*'])
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'media':
                  gulp.src(component.path + '/media/*')
                    .pipe(flatten())
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'templates':
                  gulp.src(component.path + '/*.liquid')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'bundle-css':
                  gulp.src(component.path + '/*.*css')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'scss_function':
                  gulp.src(component.path + '/*.*css')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'scss_mixins':
                  gulp.src(component.path + '/*.*css')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'scss_variables':
                  gulp.src(component.path + '/*.*css')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'scss_variables_default':
                  gulp.src(component.path + '/*.*css')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'bundle-js':
                  gulp.src(component.path + '/*.js')
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'fonts':
                  let fonts = [component.path + '/*.*css', component.path + '/*.woff', component.path + '/*.woff2', component.path + '/*.eot', component.path + '/*.ttf', component.path + '/*.svg', component.path + '/*.otf']
                  gulp.src(fonts)
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                case 'config':
                  let configs = [component.path + '/setup.json', component.path + '/messages.json', component.path + '/settings.html', component.path + '/settings_data.json'];
                  gulp.src(configs, {allowEmpty: true})
                    .pipe(gulp.dest(componentDest))
                    .on('end', cb);
                  break;
                default:
                  cb();
              }
            })
            .catch((e) => {
              reject(e);
            });
        }, () => {
          resolve(components);
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function getPlugins (plugins, componentPath, componentType) {
  return new Promise((resolve, reject) => {
    if (!plugins) return resolve();

    async.mapSeries(plugins, (plugin, callback) => {
      let dest = componentPath + '/plugins/' + plugin.name;
      if (componentType === 'bundle-css') {
        dest = componentPath + '/vendor/';
      }
      if (componentType === 'bundle-js') {
        dest = componentPath + '/vendor/';
      }
      async.mapSeries(plugin.files, (file, cb) => {
        let fileInfo = getPluginFileInfo(file);
        if (!fileInfo) {
          cb();
        }

        let url = fileInfo.url;
        getPlugin(url, upath.normalize(dest))
          .then(() => cb())
          .catch((e) => {
            return reject(e);
          });
      }, () => callback());
    }, () => resolve());
  });
}

// Получить урл и имя для файла плагина
function getPluginFileInfo (file) {
  let type = typeof file;
  let result = {};

  switch (type) {
    case 'string':
      result.url = file;
      result.fileName = file.split('/').reverse()[0];
      break;
    case 'object':
      result.url = file.url;
      result.fileName = file.file;
      break;
    default:
      result = null;
  }

  return result;
}

function getPlugin (url, dest) {
  return new Promise(function (resolve, reject) {
    download(encodeURI(url), {
      timeout: 30000
    }).then(data => {
      let savePath = dest + '/' + url.split('/').reverse()[0];
      try {
        outputFileSync(savePath, data);
        resolve();
      } catch (err) {
        reject(err);
      };
    })
      .catch((e) => {
        reject(e);
      });
  });
}

// Очистить временные файлы
function clearTmp (dependencies) {
  return new Promise((resolve, reject) => {
    try {
      del.sync(tmp);
      resolve(dependencies);
    } catch (e) {
      reject(e);
    }
  });
}
