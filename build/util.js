const path = require('path')
const chalk = require('chalk')
const cp = require('child_process')

function toCamel(source, firstCharUpper = false) {
  if (firstCharUpper) source = source[0].toUpperCase() + source.slice(1)
  return source.replace(/-\w/g, str => str.slice(1).toUpperCase())
}

function exec(command) {
  return new Promise((resolve) => {
    console.log(`${chalk.blue('$')} ${command}\n`)
    const child = cp.exec(command)
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on('close', (code) => {
      console.log()
      resolve(code)
    })
  })
}

function fullPath(...names) {
  return path.join(__dirname, '../packages', ...names)
}

module.exports = {
  fullPath,
  toCamel,
  exec,
}
