const checkbox = require('@obui/checkbox')
const menu = require('@obui/menu')

module.exports = {
  checkbox,
  menu,
}

module.exports.install = function(Vue) {
  Vue.install(checkbox)
  Vue.install(menu)
}
