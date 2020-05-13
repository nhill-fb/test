import Vue from 'vue';

/**
 * Example use:
 * <div v-toggle="{class: '.active'}">
 * options: {
 *  class: 'is-active',
 *  parent: [jquery selector | boolean to select parent node],
 *  parentClass: [optional - will use class]
 * }
 */
Vue.directive('toggle', {
  bind: function(el, binding) {
    const $el = $(el),
      options = binding.value || {},
      className = options.class || "is-active";

    $el.on('click', function(e) {
      if(e) e.preventDefault();

      $(options.target || this).toggleClass(className);
      if(typeof options.parent == 'string') {
        $(options.parent).toggleClass(options.parentClass || className)
      } else if(options.parent){
        $el.parent().toggleClass(options.parentClass || className)
      }
      if(options.focus) {
        $(options.focus).focus()
      }
    })
    
  }
})
