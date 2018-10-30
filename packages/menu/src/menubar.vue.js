module.exports = {
  props: {
    from: {
      type: String,
      default: 'menubar',
    }
  },

  data: () => ({
    focused: false,
  }),

  computed: {
    children() {
      return this.$menuManager.menu.find(item => item.ref === this.from).children
    },
    origin() {
      return this.$menuManager.refs[this.from]
    },
  },

  mounted() {
    addEventListener('keydown', this.handleKeyDown)
    addEventListener('keypress', this.handleKeyPress)
  },

  beforeDestroy() {
    removeEventListener('keydown', this.handleKeyDown)
    removeEventListener('keypress', this.handleKeyPress)
  },

  methods: {
    handleKeyDown(event) {
      if (event.keyCode === 18) {
        this.focused = !this.focused
      } else if (event.keyCode === 27 && this.focused) {
        this.focused = false
        this.$menuManager.underlineMnemonic = false
      } else return
      event.preventDefault()
      event.stopPropagation()
    },
    handleKeyPress(event) {
      if (!this.focused) return
      const key = event.key.toUpperCase()
      const index = this.children.findIndex(menu => menu.mnemonic === key)
      if (index >= 0) {
        this.toggleMenu(index)
        this.$menuManager.underlineMnemonic = true
        event.preventDefault()
        event.stopPropagation()
      }
    },
    hoverMenu(index) {
      const current = this.origin.current
      if (current !== null && current !== index) {
        this.toggleMenu(index)
      }
    },
    toggleMenu(index) {
      if (this.origin.current === index) {
        this.origin.current = null
        return
      }
      this.focused = false
      const style = this.origin.$refs.standalone.style
      this.$menuManager.hideAllMenus()
      this.$menuManager.locateAtTopBottom(style, this.$el.children[index])
      this.origin.current = index
    },
  }
}

if (!module.exports.mixins) module.exports.mixins = [];
module.exports.mixins.push({
  mounted() {
    this.$el.setAttribute('id-sarnxo', '');
  }
});

module.exports.render = function() {
  with(this){return _c('div',{class:['ob-menubar', { focused }]},[($menuManager.loaded)?_l((children),function(menu,index){return _c('div',{key:index,staticClass:"item",class:{ active: origin.current === index },on:{"click":function($event){$event.stopPropagation();toggleMenu(index)},"mouseover":function($event){$event.stopPropagation();hoverMenu(index)},"contextmenu":function($event){$event.stopPropagation();}}},[_v("\r\n        "+_s(menu.caption)+" ("),_c('span',{staticClass:"mnemonic"},[_v(_s(menu.mnemonic))]),_v(") \r\n      ")])}):_e()],2)}
};
