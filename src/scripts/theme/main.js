import Vue from 'vue';
import Carousel from '../base-theme/components/carousel.vue';
import Modal from '../base-theme/components/modal.vue';
import Drawer from '../base-theme/components/drawer.vue'
import store from '../base-theme/store'
import {mapState, mapActions} from 'vuex'
import {debounce} from '../base-theme/utils/common'


document.querySelectorAll(".vue-app").forEach(el => {
  new Vue({
    el: el,
    store,
    computed: {
      ...mapState('global', ['navDrawerIsOpen', 'cartDrawerIsOpen', 'sizeChartModalVisible'])
    },
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    components: {
      'carousel': Carousel,
      'modal': Modal,
      'drawer': Drawer
    },
    methods: {
      ...mapActions('global', {
        'closeNavDrawer': dispatch => {
          $(".hamburger").removeClass("is-active")
          dispatch('closeNavDrawer')
        }, 
        'openNavDrawer': dispatch => {
          $(".hamburger").addClass("is-active")
          dispatch('openNavDrawer')
        }, 
        'closeSizeChart': dispatch => dispatch('closeSizeChart'), 
        'openSizeChart': dispatch => dispatch('openSizeChart')
      }),
      // toggleMobileNav: e => {
      //   $(e.currentTarget).toggleClass('is-active');
      //   $('body').toggleClass('header__nav-mobile--is-active');               
        
      //   if($("body").hasClass("header__nav-mobile--is-active")) {
      //     $(".section__header").css("bottom", 0);
      //   }      
      //   setTimeout(_ => {
      //     if(!$("body").hasClass("header__nav-mobile--is-active")) {
      //       $(".section__header").css("bottom", "");
      //     } 
      //   }, 300) 
      // },
      toggleSubmenu: e => {
        if(e) e.preventDefault()
        if (!$(e.currentTarget).hasClass("is-active")) {
          //de-activate any currently active menus if activating a new one
          $(".header__menu .is-active").removeClass("is-active");
          $(".section__header").addClass("nav-active");
        }
        else {
          $(".section__header").removeClass("nav-active");
        }
        $(e.currentTarget).toggleClass("is-active");
      }
    }
  })
})

store.dispatch('cart/getCart')

let headerOffset = $(".section__header").data("offset") || 100;
const stickyNav = debounce(e => {
  if(window.pageYOffset >= headerOffset)
    $('body').addClass("page-scrolled");
  else
    $('body').removeClass('page-scrolled')
}, 100);
$(window).on('scroll', stickyNav);
