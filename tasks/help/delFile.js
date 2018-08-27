const del = require('del');
/**
 * Удаляет файлы в стриме
 * @param  {[type]} v винил из watch
 */
module.exports = v => {
  var isDelete = (v.event === 'unlink');

  if (isDelete) {
    del.sync([v.path]);
  }
};
