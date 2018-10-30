module.exports = {
  props: {
    value: Boolean,
    label: String,
    disabled: Boolean,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  data: () => ({
    focused: false,
  }),

  methods: {
    onFocus(event) {
      this.focused = true
      this.$emit('focus', event)
    },
    onBlur(event) {
      this.focused = false
      this.$emit('blur', event)
    },
  },
}

if (!module.exports.mixins) module.exports.mixins = [];
module.exports.mixins.push({
  mounted() {
    this.$el.setAttribute('id-9isdl7', '');
  }
});

module.exports.render = function() {
  with(this){return _c('label',{staticClass:"ob-checkbox",class:{ focused, disabled, checked: value }},[_c('span',{staticClass:"box"},[_c('span',{staticClass:"inner"}),_v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(value),expression:"value"}],attrs:{"type":"checkbox","disabled":disabled},domProps:{"value":label,"checked":Array.isArray(value)?_i(value,label)>-1:(value)},on:{"change":[function($event){var $$a=value,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=label,$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(value=$$a.concat([$$v]))}else{$$i>-1&&(value=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{value=$$c}},function($event){$emit('change', $event.target.checked)}],"focus":onFocus,"blur":onBlur}})]),_v(" "),($slots.default || label)?_c('span',{staticClass:"label"},[_t("default"),_v(" "),(!$slots.default)?[_v(_s(label))]:_e()],2):_e()])}
};
