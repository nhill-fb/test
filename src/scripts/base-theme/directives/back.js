
import Cookies from 'js-cookie';
import Vue from 'vue';

Vue.directive('back', {
  bind: function(el, binding) {
    const $el = $(el);
    if($el.attr("href") == '#') {
      if(Cookies.get('last-visited-collection')) 
        $el.attr("href", Cookies.get('last-visited-collection'))
      else
        $el.attr("href", "/")
    } 
  }
})
