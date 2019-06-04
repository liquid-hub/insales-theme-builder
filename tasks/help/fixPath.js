const upath = require('upath');

module.exports = (paths) => {
  let result = [];
  if (typeof paths === "string") {
    result = upath.normalize(paths);
  }else{
    paths.forEach(function(element) {
      result.push(upath.normalize(element));
    });
  }
  return result;
};
