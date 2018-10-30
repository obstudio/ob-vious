const program = require('commander')
const webpack = require('webpack')
const sfc2js = require('sfc2js')
const util = require('./util')
const chalk = require('chalk')
const fs = require('fs')

program
  .option('-d, --dev')
  .option('-p, --prod')
  .option('-w, --webpack')
  .parse(process.argv)

const env = program.dev ? 'development' : 'production'

sfc2js
  .install(require('@sfc2js/node-sass'))
  .install(require('@sfc2js/clean-css'))

let sequence = Promise.resolve()
program.args.forEach((name) => {
  if (!fs.existsSync(util.fullPath(name))) return
  sequence = sequence.then(() => {
    return sfc2js.transpile({
      baseDir: util.fullPath(name),
      cachePath: false,
      srcDir: 'src',
      outDir: 'temp',
      outCSSFile: '../dist/index.css',
    }).then(() => new Promise((resolve, reject) => {
      if (!program.webpack) return
      
      const compiler = webpack({
        target: 'web',
        mode: env,
        entry: util.fullPath(name, 'temp/index.js'),
        output: {
          path: util.fullPath(name, 'dist'),
          filename: 'index.js',
          library: 'obui' + util.toCamel(name, true),
          libraryTarget: 'umd',
          globalObject: 'typeof self !== \'undefined\' ? self : this',
        },
      })

      new webpack.ProgressPlugin().apply(compiler)

      compiler.run((error, stat) => {
        if (error) {
          console.log(chalk.redBright(error))
          reject()
        } else if (stat.compilation.errors.length) {
          console.log(chalk.redBright(stat.compilation.errors.join('\n')))
          reject()
        } else {
          resolve()
        }
      })
    }))
  })
})
