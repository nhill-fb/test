import Vue from 'vue';

Vue.directive('zoom', {
  bind: function(el, binding) {
    $(el).on('lazyloaded', _ => {
      if($(window).width() >= 768) {
        const parent = $(el).parent();
        parent.zoom({
          // set defaults here
          ...binding.value
        });
      }
    })
    
  }
})
