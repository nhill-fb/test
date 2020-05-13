import Instafeed from 'instafeed.js';
import Vue from 'vue';
import Carousel from '../components/carousel.vue';

document.querySelectorAll(".vue-instafeed").forEach(el => {
  new Vue({
    el: el,
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    components: {
      'carousel': Carousel
    },
    mounted() {
      const ctx = this,
        feedOpt = ctx.$el.dataset.options;
      if(feedOpt) {
        const feed = new Instafeed($.extend({
          get: "user",
          success: json => {
            ctx.feeds = json.data;
          }
        }, JSON.parse(feedOpt)));
        feed.run();
      }
    },
    data: {
      feeds: []
    }
  })
  
  
})
