const gulp = require('gulp');
const log = require('fancy-log');
const writeFile = require('write');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const fs = require('fs');
const notifier = require('node-notifier');
const commandLine = require('command-line-commands');
const validCommands = ['create'];

// настройки нотификации
let defaultNotifier = {
  sound: true,
  title: 'insales-template-builder',
  message: ''
};

/**
 * gulp create --products --gallery
 */
gulp.task('create', function () {
  let cmdLines = commandLine(validCommands);
  let createList = [];
  cmdLines.argv.reduce((result, item) => {
    if (item && typeof item === 'string') {
      result.push(item.replace('--', ''));
    };
    return result;
  }, createList);

  createList.forEach((componentName) => {
    let componentsFolder = paths.components.root + componentName + '/';

    let isExist = fs.existsSync(componentsFolder);
    if (isExist) {
      let message = 'Компонент "' + componentName + '" уже существует!';
      defaultNotifier.message = message;
      log(message);
      notifier.notify(defaultNotifier);
      return;
    }

    let componentsStyle = componentsFolder + componentName + '.scss';
    let componentsSetup = componentsFolder + 'setup.json';
    let componentsPlugins = componentsFolder + 'plugins/';
    let componentsLiquid = componentsFolder + componentName + '.liquid';
    let componentsJs = componentsFolder + componentName + '.js';
    let componentReadme = componentsFolder + 'readme.md';

    createComponent(componentsLiquid);
    createComponent(componentsStyle);
    createComponent(componentsJs);
    createComponent(componentsSetup);
    createComponent(componentReadme);
    createComponent(componentsPlugins);
  });
});

function createComponent (filePath, fileContent = '') {
  writeFile(filePath, fileContent, function (err) {
    if (err) {
      console.log('Ошибка при генерации файла: ' + filePath);
    } else {
      log('Создан файл: ' + filePath);
    }
  });
}
