const menuItem = require('./menu-item.vue')

module.exports = {
  name: 'menu-view',

  components: { menuItem },

  props: {
    menu: Array,
    context: Object,
  },

  data: () => ({
    chosen: null,
    active: false,
    children: [],
  }),

  computed: {
    current: {
      get() {
        const index = this.children.findIndex(submenu => submenu && submenu.active)
        return index < 0 ? null : index
      },
      set(value) {
        this.children.forEach((submenu, index) => {
          if (!submenu) return
          submenu.active = index === value
        })
      },
    },
    focused() {
      return this.active && this.current === null
    },
  },

  mounted() {
    addEventListener('keydown', this.handleKeyDown)
    addEventListener('keypress', this.handleKeyPress)

    this.children = this.menu.map((item, index) => {
      if (!item.children) return
      return this.$refs[index][0]
    })
  },

  beforeDestroy() {
    removeEventListener('keydown', this.handleKeyDown)
    removeEventListener('keypress', this.handleKeyPress)
  },

  methods: {
    handleKeyDown(event) {
      if (!this.focused) return
      console.log(event.key, event.keyCode)
      if (event.keyCode === 8) {
        event.preventDefault()
        event.stopPropagation()
        this.$nextTick(() => this.$parent.current = null)
      }
    },
    handleKeyPress(event) {
      if (!this.focused) return
      const key = event.key.toUpperCase()
      const index = this.menu.findIndex(item => item.mnemonic === key)
      if (index >= 0) {
        event.preventDefault()
        event.stopPropagation()
        this.toggleMenuItem(index)
        this.$menuManager.underlineMnemonic = true
      }
    },
    toggleMenuItem(index) {
      const item = this.menu[index]
      if (item.children) {
        this.enterMenuItem(index)
      } else if (!item.disabled) {
        if (item.command) {
          this.$menuManager.hideAllMenus()
          this.$menuManager.executeCommand(item.command)
        }
      }
    },
    enterMenuItem(index) {
      const style = this.$refs.standalone.style
      const button = this.$refs.body.children[index]
      this.$menuManager.locateAtLeftRight(style, button, -2)
      this.$refs[index][0].active = true
    },
    leaveMenuItem(index, event) {
      const x = event.clientX
      const y = event.clientY
      const rect = this.$refs.body.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.left && y <= rect.right) {
        this.$refs[index][0].active = false
      }
    },
    traverse(callback) {
      callback(this)
      this.menu.forEach((item, index) => {
        if (item.children) {
          const submenu = this.$refs[index][0]
          callback(submenu)
          submenu.traverse(callback)
        }
      })
    },
  },
}

if (!module.exports.mixins) module.exports.mixins = [];
module.exports.mixins.push({
  mounted() {
    this.$el.setAttribute('id-6i361o', '');
  }
});

module.exports.render = function() {
  with(this){return _c('span',{staticClass:"ob-menu",class:{ active }},[_c('div',{ref:"standalone",class:{ standalone: current !== null }},_l((menu),function(item,index){return (item.children)?_c('menu-view',{key:index,ref:index,refInFor:true,attrs:{"menu":item.children,"context":context}}):_e()})),_v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(active),expression:"active"}],ref:"body",class:['menu-body', { focused }]},[_l((menu),function(item,index){return [(item.children)?_c('menu-item',{key:index,attrs:{"binding":">","context":context,"caption":item.caption,"mnemonic":item.mnemonic},nativeOn:{"click":function($event){$event.stopPropagation();},"mouseenter":function($event){enterMenuItem(index, $event)},"mouseleave":function($event){leaveMenuItem(index, $event)}}}):(item.command)?_c('menu-item',{key:index,attrs:{"context":context,"mnemonic":item.mnemonic,"command":$menuManager.commands[item.command]}}):(item.switch)?_c('transition-group',{key:index,attrs:{"name":"ob-menu-list"}},_l(($menuManager.parseArgument(item.data, context)),function(sub,index){return _c('menu-item',{key:index,class:{ active: sub.key === $menuManager.parseArgument(item.current, context) },attrs:{"context":context,"caption":sub.name},nativeOn:{"click":function($event){$menuManager.executeMethod(context, item.switch, sub.key)}}})})):_c('div',{key:index,staticClass:"menu-item disabled",on:{"click":function($event){$event.stopPropagation();}}},[(item.caption === '-')?_c('div',{staticClass:"separator"}):_c('div',{staticClass:"caption"},[_v(_s(item.caption))])])]})],2)])}
};
