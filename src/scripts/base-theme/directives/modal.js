import Vue from 'vue';
import {animationEnd} from '../utils/common';

const defaultOpt = {
  animateIn: 'fadeInUp',
  animateOut: 'fadeOutDown',
  isActive: 'is-active'
}

const animateOut = el => {
  const opt = el.data('options'),
    $container = $('.modal-container', el);
  $container.one(animationEnd, () => {
    $container.removeClass(opt.animateOut)
      .removeClass(opt.animateIn)
    el.removeClass(opt.isActive)
  })
  $container.addClass(opt.animateOut)
}

const animateIn = el => {
  if(el.length) {
    const opt = el.data('options');
    el.addClass(opt.isActive);
    $('.modal-container', el).addClass(opt.animateIn) 
  }   
}

Vue.directive('modal', {
  bind: function(el, binding) {
    if(binding.value && typeof binding.value === 'string') {
      $(el).on('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const target = $(el).data('target') || $(el).attr('href');
        animateIn($(target))
      })
    } else {
      $(el).on('click', e => {
        // close modal if clicked outside of container
        animateOut($(el));
      });
      // stop propagation so user can interact with modal without closing it
      $('.modal-container', el).click(e => e.stopPropagation());
      $('.modal-close', el).click(e => {
        e.preventDefault();
        animateOut($(el));
      });
      $(el).data('options', $.extend({}, defaultOpt, binding.value));
    }
  }
})
