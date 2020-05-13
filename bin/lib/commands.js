
const themekit = require('@shopify/themekit').command
const paths = require('./paths')
const promptIfMainTheme = require('./prompt-if-main-theme')
const webpackConfig = require('../../webpack.config')
const webpack = require('webpack')
const chokidar = require('chokidar')
const utils = require('./utils')
const bs = require('browser-sync').create()

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_PASSWORD,
  SHOPIFY_STORE,
  THEME_ID,
  PORT = 8080
} = process.env;

const themeKitFlags = {
  password: SHOPIFY_API_PASSWORD,
  store: SHOPIFY_STORE,
  themeid: THEME_ID
}

const themekitOpt = {
  cwd: paths.dist
}

const watch = async argv => {
  const {
    dev,
    ...tkFlags
  } = argv;
  if(dev)
    webpackConfig.mode = "development"
  
  const eventCache = utils.createEventCache();
  const compiler = webpack(webpackConfig);

  compiler.watch();
  chokidar.watch(paths.src, {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true,
  }).on('all', (event, path) => {
    //messages.logFileEvent(event, path);
    eventCache.addEvent(event, path);
    utils.processCache(eventCache, processAssets, removeAssets);
  })
  themekit('watch', {...themeKitFlags, notify: paths.tmp('theme.update'), ...tkFlags }, themekitOpt);

  // Provide a callback to capture ALL events to CSS
  // files - then filter for 'change' and reload all
  // css files on the page.
  bs.watch("**/*.css", function (event, file) {
    if (event === "change") {
        bs.reload("*.css");
    }
  });
  bs.watch("**/*.js", function (event, file) {
    if (event === "change") {
        bs.reload("*.js");
    }
  });
  bs.init({
    server: paths.dist,
    proxy: `https://${SHOPIFY_STORE}?preview_theme_id=${THEME_ID}`
  })
}

const build = async argv => {
  // run webpack
  console.log('Building ...')
}

const deploy = async argv => {
  if(!argv.skipBuild)
    await build(argv);
  //themekit('deploy')
  console.log('Deploying to ...', argv)
}

// const settings = {
//   env: 'development',
//   deployRoot: config.paths.dist,
//   defaultArgs: [
//     '--no-update-notifier',
//     '--config', config.paths.userShopifyConfig
//   ]
// }


//   return new Promise((resolve, reject) => {
//     themekit({
//       args: [
//         cmd,
//         '--env',
//         settings.env,
//         ...settings.defaultArgs,
//         ...files
//       ],
//       cwd: settings.deployRoot
//     }, (err) => {
//       deploying = false

//       if (err) {
//         reject(err)
//       } else {
//         resolve()
//       }
//     })
//   }).then(() => {
//     deploying = false
//     return maybeDeploy()
//   }).catch((err) => {
//     deploying = false
//     console.error(err)
//     return maybeDeploy()
//   })


module.exports = {
  watch,
  deploy,
  build
}
