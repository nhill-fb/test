import Vue from 'vue';
import Collection from '../components/collection.vue';
import Carousel from '../components/carousel.vue';
import Cookies from 'js-cookie';
import store from '../store';
import { mapState } from 'vuex';

document.querySelectorAll(".vue-collection").forEach(el => {
  new Vue({
    el: el,
    store,
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    created() {
      if(location.pathname.indexOf('/collections/') >= 0) {
        Cookies.set('last-visited-collection', location.pathname);
      }
    },
    computed: {
      ...mapState('products', ['product_groups'])
    },
    components: {
      'collection': Collection,
      'carousel': Carousel
    }
  })
})

document.querySelectorAll(".vue-filter").forEach(el => {
  new Vue({
    el,
    store,
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    data: {
      open: false
    },
    methods: {
      filter(e) {
        bcsffilter.buildSubmitEvent(null, !0, e);
        this.open = false;
      },
      reset(e) {
        clearAllFilterOptions(e);
        this.open = false;
      }
    }
  })
})
