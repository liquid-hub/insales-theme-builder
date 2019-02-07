const upath = require('upath');

/**
 * Получить директорию с insales-uploader
 */
module.exports = function () {
  return require(upath.normalize(__dirname + '../..'+'/package.json'));
};
