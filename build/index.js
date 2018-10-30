const CleanCSS = require('clean-css')
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

sfc2js.install(require('@sfc2js/node-sass'))

const cleanCSS = new CleanCSS({ level: 2 })

let sequence = Promise.resolve()
program.args.forEach((name) => {
  if (!fs.existsSync(util.fullPath(name))) return
  sequence = sequence.then(() => {
    return sfc2js.transpile({
      baseDir: util.fullPath(name),
      cachePath: false,
      srcDir: 'src',
      outDir: 'temp',
    }).then(() => new Promise((resolve, reject) => {
      if (!program.webpack) return

      const output = cleanCSS.minify(fs.readFileSync(util.fullPath(name, 'temp/app.css')))

      if (output.warnings.length) {
        console.log(chalk.redBright(output.warnings.join('\n')))
        reject()
      } else if (output.errors.length) {
        console.log(chalk.redBright(output.errors.join('\n')))
        reject()
      }
      
      fs.writeFileSync(util.fullPath(name, 'dist/index.css'), output.styles)
      
      const compiler = webpack({
        target: 'web',
        mode: env,
        entry: util.fullPath(name, 'temp/index.js'),
        output: {
          path: util.fullPath(name, 'dist'),
          filename: 'index.js',
          library: 'obui.' + name,
          libraryTarget: 'umd',
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
