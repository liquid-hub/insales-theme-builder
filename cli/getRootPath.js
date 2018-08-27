const upath = require('upath');

/**
 * Получить директорию с insales-uploader
 */
module.exports = function () {
  return require(upath.join(__dirname + '../..'+'/package.json'));
};
