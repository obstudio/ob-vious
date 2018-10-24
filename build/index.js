const sfc2js = require('sfc2js')
const util = require('./util')

sfc2js.install(require('@sfc2js/node-sass'))

sfc2js.transpile({
  baseDir: util.fullPath('checkbox'),
  cachePath: false,
  srcDir: 'src',
  outDir: 'dist',
})
