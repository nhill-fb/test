import Vue from 'vue';

Vue.directive('accordion', {
  bind: function(el, binding) {
    $('.accordion__toggle', el).on('click', function(e) {
      e.preventDefault()
      const parent = $(this).parents('.accordion');
      if(parent.hasClass('is-active')) {
        parent.removeClass('is-active')
        $(this).attr('aria-expanded', 'false');
      } else {
        $('.accordion', el).removeClass('is-active')
        $('.accordion__title > a').attr('aria-expanded', 'false');
        parent.addClass('is-active');
        $(this).attr('aria-expanded', 'true');
      }
    });
  }
})
