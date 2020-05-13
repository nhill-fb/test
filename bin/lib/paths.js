const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())

/**
 * Resolve a relative path to the app directory
 *
 * @return String
 */
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

/**
 * Resolve a relative path to the tool directory
 *
 * @return String
 */
function resolveSelf(relativePath) {
  return path.resolve(__dirname, '../', relativePath)
}

/**
 * Find and return the userland .eslintrc if one exists, otherwise, returns
 * shopify-pipeline .eslintrc.
 *
 * @return  String  Path to an .eslintrc file
 */
function getEslintrc() {
  const appEslintrc = resolveApp('./.eslintrc')

  if (fs.existsSync(appEslintrc)) {
    return appEslintrc
  }

  return resolveSelf('./.eslintrc')
}

module.exports = {
  root: appDirectory,
  dist: resolveApp('dist'),
  src: resolveApp('src'),
  tmp(file) { return path.resolve(resolveApp('bin/tmp'), file) },
  entrypoints: {
    scripts: resolveApp('src/assets/js/index.js')
  },
  assetsOutput: resolveApp('dist/assets'),
  configYml: resolveApp('config.yml'),
  eslintrc: getEslintrc()
}
