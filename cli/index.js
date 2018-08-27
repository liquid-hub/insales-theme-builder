const Liftoff = require('liftoff');
const log = require('fancy-log');
const gulp = require('gulp');
const upath = require('upath');
const program = require('commander');
const getRootPath = require('./getRootPath');
const argv = require('minimist')(process.argv.slice(2));
const requireDir = require('require-dir');
const getConfig = require(upath.join(__dirname + '../..' +'/tasks/help/getConfig.js'));

/**
 * Создать консольный клиент
 */
let ITB = new Liftoff({
  name: 'itb',
  moduleName: 'itb',
  configName: 'itb-config',
  extensions: {
    '.js': null,
    '.json': null
  }
}).on('require', function (name, module) {
  console.log('Loading:', name);
}).on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
}).on('respawn', function (flags, child) {
  console.log('Detected node flags:', flags);
  console.log('Respawned to PID:', child.pid);
});

let invoke = (env) => {
  let isInit = (argv['_'].indexOf('init') > -1) || (argv['_'].indexOf('setup') > -1);
  if (!env.configPath) {
    if (!isInit) log('Нет настроек - ' + env.cwd);
    return false;
  }
  try {
    gulp.insalesConfig = require(env.configPath);
  } catch (e) {
    console.log(e);
  }
  gulp.insalesConfig.root = env.cwd;
  gulp.insalesConfig.env = env;

  initProgram();
};

module.exports = ITB.launch({
  cwd: argv.cwd,
  configPath: argv.myappfile,
  require: argv.require,
  completion: argv.completion
}, invoke);

requireDir('../tasks/', {
  recurse: true
});

const initProgram = (config) => {
  program
    .version(getRootPath().version, '-v, --version');

  program
    .command('build')
    .alias('b')
    .description('Собрать тему')
    .action(() => {
      let clean = ['theme:clean'];
      let config = ['deploy:config'];
      let media = ['deploy:media'];
      let setup = ['deploy:setup'];
      let sizereport = ['theme:sizereport'];
      let templates = ['deploy:templates:liquid'];
      let plugins = ['deploy:plugins:media', 'deploy:plugins:styles', 'deploy:plugins:scripts', 'deploy:plugins:js', 'deploy:plugins:scss'];
      let fonts = ['deploy:fonts:items', 'deploy:fonts:styles'];
      let bundle = ['variables:scss', 'bundle:css', 'bundle:js'];
      let components = ['deploy:components:liquid', 'deploy:components:styles', 'deploy:components:scripts', 'deploy:components:guide', 'deploy:components:ui'];
      gulp.task('build', gulp.series([...clean, ...bundle, ...components, ...fonts, ...config, ...media, ...plugins, ...setup, ...templates, ...sizereport]));

      gulp.task('build')();
      log('build');
    });

  program
    .command('watch')
    .alias('w')
    .description('Отслеживание изменений')
    .action((cmd) => {
      let config = ['theme:watch:config'];
      let fonts = ['theme:watch:fonts'];
      let templates = ['theme:watch:templates'];
      let media = ['theme:watch:media'];
      let styles = ['theme:watch:styles', 'theme:watch:scss', 'theme:watch:ui'];
      let scripts = ['theme:watch:scripts'];
      let setup = ['theme:watch:setup'];
      let uploader = (gulp._registry && typeof gulp._registry._tasks['uploader:watch'] != 'undefined') ? ['uploader:watch'] : [];
      let snippets = ['theme:watch:snippets', 'theme:watch:guide'];
      let plugins = ['theme:watch:plugins:media', 'theme:watch:plugins:styles', 'theme:watch:plugins:scripts', 'theme:watch:plugins:styles:require', 'theme:watch:plugins:scripts:require'];
      let bundles = ['theme:watch:bundles:css', 'theme:watch:bundles:js'];
      gulp.task('watch', gulp.series([...bundles, ...config, ...fonts, ...templates, ...plugins, ...styles, ...scripts, ...setup, ...snippets, ...media, ...uploader]));
      gulp.task('watch')();
      log('start-watch');
    });

  program
    .command('setup')
    .alias('s')
    // .option('-a, --a', 'Адаптивная версия', () => {
    //   return gulp.insalesConfig.adaptive = true;
    // })
    .description('Установить базовый проект')
    .action(function (env, options) {
      gulp.task('components', gulp.series(['git:download', 'git:build']));
      gulp.task('components')();
      log('install');
    });

  program
    .command('create [components...]')
    .description('Создать компоненты')
    .action(function (components) {
      gulp.task('create')();
    });

  program
    .command('push')
    .alias('p')
    .description('Отправить тему на сервер')
    .action(function (components) {
      if (gulp._registry && typeof gulp._registry._tasks['uploader:watch'] != 'undefined') {
        gulp.task('uploader:upload')();
      }
    });

  program
    .command('init')
    .alias('i')
    .description('Инициализировать проект')
    .action(function (components) {
      getConfig();
    });

  program.parse(process.argv);
};
