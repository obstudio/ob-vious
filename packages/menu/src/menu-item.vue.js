module.exports = {
  props: {
    command: {
      type: Object,
      default: {},
    },
    mnemonic: {
      type: String,
      default: '',
    },
    binding: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    context: {
      type: Object
    },
  },

  computed: {
    disabled() {
      if (!this.command.enabled) return
      return !this.$menuManager.parseArgument(this.command.enabled, this.context)
    },
    keybinding() {
      let binding = this.binding || this.command.bind
      if (!binding) return ''
      if (binding.charAt(0) === '!') binding = binding.slice(1)
      return binding.replace(/[a-z]+/g, word => {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }).replace(/ /g, ', ')
    },
  },

  methods: {
    handleClick(event) {
      if (this.disabled) {
        event.stopPropagation()
      } else {
        this.$menuManager.executeCommand(this.command)
      }
    }
  },
}

if (!module.exports.mixins) module.exports.mixins = [];
module.exports.mixins.push({
  mounted() {
    this.$el.setAttribute('id-gittep', '');
  }
});

module.exports.render = function() {
  with(this){return _c('div',{class:['menu-item', { disabled }],on:{"click":handleClick}},[_c('span',{staticClass:"label"},[(command.checked !== undefined)?_c('ob-checkbox',{attrs:{"value":$menuManager.parseArgument(command.checked, context)},on:{"change":handleClick}}):_e(),_v("\r\n      "+_s(caption || command.name)+"\r\n      "),(mnemonic)?[_v(" ("),_c('span',{staticClass:"mnemonic"},[_v(_s(mnemonic))]),_v(")")]:_e(),_v(" "),(command.ellipsis)?[_v(" ...")]:_e()],2),_v(" "),_c('span',{staticClass:"binding"},[_v(_s(keybinding))])])}
};
