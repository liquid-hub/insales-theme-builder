const upath = require('upath');

module.exports = function (scriptsPaths) {
  let directiveRequire = '#= require ';
  let content = '';
  scriptsPaths.forEach(function (script) {
    if (typeof script === 'string') {
      content += directiveRequire + upath.basename(script, '.js') + '\n';
    }
  });
  return content;
};
