const program = require('commander')
const webpack = require('webpack')
const sfc2js = require('sfc2js')
const util = require('./util')
const chalk = require('chalk')
const fs = require('fs')

program
  .option('-a, --all')
  .option('-d, --dev')
  .option('-p, --prod')
  .option('-w, --webpack')
  .parse(process.argv)

const env = program.dev ? 'development' : 'production'
const pkgs = fs.readdirSync(util.fullPath())

sfc2js
  .install(require('@sfc2js/node-sass'))
  .install(require('@sfc2js/clean-css'))

let sequence = Promise.resolve()

if (program.all) program.args = pkgs

program.args.forEach((name) => {
  if (!fs.existsSync(util.fullPath(name))) return
  const isEntry = name === 'obui'

  sequence = sequence.then(() => {
    if (isEntry) return
    return sfc2js.transpile({
      baseDir: util.fullPath(name),
      cachePath: false,
      srcDir: 'comp',
      outDir: 'src',
      outCSSFile: '../dist/index.css',
    })
  }).then(() => new Promise((resolve, reject) => {
    if (!program.webpack) return
    
    const compiler = webpack({
      target: 'web',
      mode: env,
      entry: util.fullPath(name, 'src/index.js'),
      output: {
        path: util.fullPath(name, 'dist'),
        filename: 'index.js',
        library: isEntry ? 'obui' : ['obui', util.toCamel(name)],
        libraryTarget: 'umd',
        globalObject: 'typeof self !== "undefined" ? self : this',
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

sequence.then(() => {
  if (env !== 'production' || !program.args.includes('obui')) return
  let css = ''
  pkgs.forEach((name) => {
    if (name === 'obui') return
    css += fs.readFileSync(util.fullPath(name, 'dist/index.css'))
  })
  fs.writeFileSync(util.fullPath('obui/dist/index.css'), css)
}).catch(() => {})
