const path = require('path')

function fullPath(...names) {
  return path.join(__dirname, '../packages', ...names)
}

module.exports = {
  fullPath,
}
