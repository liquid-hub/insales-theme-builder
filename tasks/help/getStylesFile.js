const path = require('path');

module.exports = function (stylesPaths) {
  let directiveImport = '@import "';
  let directiveRequire = '//= require ';
  let content = '';
  if (typeof stylesPaths === 'undefined') {
    return content;
  }

  for (var index in stylesPaths) {
    var style = stylesPaths[index];
    let parsePath = path.parse(style);
    let addStyle = style;
    if (parsePath.name) {
      addStyle = parsePath.name;
    }
    if (parsePath.base.indexOf('.css') === -1 || parsePath.base.indexOf('.scss') === -1) {
      addStyle = parsePath.base;
    }

    addStyle = addStyle.replace(/^_/, '');

    let badPath = addStyle.indexOf(path.sep) > -1;
    let isScss = parsePath.ext.indexOf('.scss') > -1;
    if (!badPath) {
      if (isScss) {
        content += directiveImport + addStyle + '";\n';
      } else {
        content += directiveRequire + addStyle + '\n';
      }
    }
  }

  return content;
};
