const PWD = process.env.PWD || process.cwd();
const upath = require('upath');
const cpFile = require('cp-file');

module.exports = (callback = () => {}, onlyRequire = false) => {
  let config = {};
  let dest = upath.normalize(PWD + '/itb-config.js');
  try {
    config = require(dest);
    callback(config);
  } catch (e) {
    let path = __dirname + '../..' + '/config/itb-config.js';
    cpFile(upath.normalize(path), dest).then(() => {
      console.log('Создан файл конфигурации itb-config.js');
    })
      .catch(() => {
        console.log('Не удалось создать файл настроек!');
      });
  }
  return config;
};
