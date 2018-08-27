const traverse = require('traverse');
const upath = require('upath');
let PWD = process.env.PWD || process.cwd();

module.exports = (paths) => {
  return traverse(paths).map(function (path) {
    if (typeof path === 'string') this.update(path.replace('./', upath.normalize(PWD) + '/'));
  });
};
