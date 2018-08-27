const watch = require('../help/watch.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const imagePipeline = require('../pipelines/image.js');

watch('theme:watch:media', paths.media.paths, paths.theme.media, imagePipeline);
