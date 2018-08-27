const upath = require('upath');
const getStylesFile = require('./getStylesFile.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const fs = require('fs');

module.exports = function () {
  let variablesInclude = '/*itb*/\n';

  for (let index in paths.scss.all) {
    let path = paths.scss.all[index];
    let files = [];
    let exists = fs.existsSync(upath.normalize(path));
    if (exists) {
      files = fs.readdirSync(upath.normalize(path));
      variablesInclude += getStylesFile(files);
    }
  }

  return variablesInclude;
};
