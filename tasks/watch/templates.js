const watch = require('../help/watch.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));

watch('theme:watch:templates', paths.templates.liquid, paths.theme.templates);
