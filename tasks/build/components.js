const gulp = require('gulp');
const filter = require('gulp-filter');
const testEmpty = require('../help/testEmpty.js');
const concat = require('gulp-concat');
const sort = require('gulp-sort');
const gap = require('gulp-append-prepend');
const scssStream = require('../pipelines/scss.js');
const jsStream = require('../pipelines/scripts.js');
const getVariables = require('../help/getVariables.js');
const updatePaths = require('../help/updatePaths.js');
const paths = updatePaths(require('../config/paths.json'));
const flatten = require('gulp-flatten');

gulp.task('deploy:components:styles', (cb) => {
  let variablesInclude = getVariables();
  scssStream(gulp.src(paths.components.styles)
    .pipe(filter(testEmpty))
    .pipe(sort()))
    .pipe(concat('theme.scss'))
    .pipe(gap.prependText(variablesInclude))
    .pipe(gulp.dest(paths.theme.media))
    .on('end', () => cb());
});

gulp.task('deploy:components:ui', (cb) => {
  let variablesInclude = getVariables();
  scssStream(gulp.src(paths.components.ui)
    .pipe(filter(testEmpty))
    .pipe(sort()))
    .pipe(concat('ui.scss'))
    .pipe(gap.prependText(variablesInclude))
    .pipe(gulp.dest(paths.theme.media))
    .on('end', () => cb());
});

gulp.task('deploy:components:scripts', (cb) => {
  jsStream(gulp.src(paths.components.scripts)
    .pipe(filter(testEmpty))
    .pipe(sort()))
    .pipe(concat('theme.js'))
    .pipe(gulp.dest(paths.theme.media))
    .on('end', () => cb());
});

gulp.task('deploy:components:liquid', (cb) => {
  gulp.src(paths.components.liquid)
    .pipe(flatten())
    .pipe(gulp.dest(paths.theme.snippets))
    .on('end', () => cb());
});

gulp.task('deploy:components:guide', (cb) => {
  gulp.src(paths.components.guide)
    .pipe(filter(testEmpty))
    .pipe(flatten())
    .pipe(sort())
    .pipe(concat('style_guide.liquid'))
    .pipe(gulp.dest(paths.theme.snippets))
    .on('end', () => cb());
});
