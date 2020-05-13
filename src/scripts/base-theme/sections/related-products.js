import Vue from 'vue';
import Collection from '../components/collection.vue';
import Carousel from '../components/carousel.vue';
import store from '../store';
import { mapState } from 'vuex';

document.querySelectorAll(".vue-related-products").forEach(el => {
  new Vue({
    el: el,
    store,
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    computed: {
      ...mapState('products', ['related_product_groups'])
    },
    components: {
      'collection': Collection,
      'carousel': Carousel
    }
  })
})

