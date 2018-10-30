const checkbox = require('@obui/checkbox/src')
const menu = require('@obui/menu/src')

module.exports = {
  checkbox,
  menu,
}

module.exports.install = function(Vue) {
  Vue.use(checkbox)
  Vue.use(menu)
}
