<template>
  <div class="carousel">
    <div ref="thumbs" class="swiper-container" v-if="thumbnailOptions">
      <div class="swiper-wrapper">
          <!-- Slides -->
          <slot name="thumbs"></slot>
      </div>
    </div>
    <!-- Slider main container -->
    <div ref="main" class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
          <!-- Slides -->
          <slot></slot>
      </div>
      <!-- If we need pagination -->
      <div v-if="pagination" ref="pagination" class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div v-if="navigation" ref="prevButton" class="swiper-button-prev">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z' fill='#231f20'/></svg>
      </div>
      <div v-if="navigation" ref="nextButton" class="swiper-button-next">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z' fill='#231f20'/></svg>
      </div>

      <!-- If we need scrollbar -->
      <div v-if="scrollbar" ref="scrollbar" class="swiper-scrollbar"></div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';

export default {
  mounted() {
    const options = {
      speed: 800,
      loop: false,
      ...this.options
    };
    if(this.pagination) {
      options.pagination = {
        el: this.$refs.pagination,
        clickable: true,
        ...this.pagination
      };
    }
    if(this.navigation) {
      options.navigation = {
        nextEl: this.$refs.nextButton,
        prevEl: this.$refs.prevButton
      }
    }
    if(this.scrollbar) {
      options.scrollbar = {
        el: this.$refs.scrollbar
      }
    }
    
    if(this.thumbnailOptions) {
      const thumbSwiper = new Swiper(this.$refs.thumbs, {
        spaceBetween: 15,
        slidesPerView: 'auto',
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        ...this.thumbnailOptions
      });
      options.thumbs = { swiper: thumbSwiper };
    }

    const swiper = new Swiper(this.$refs.main, options);
    
  },
  props: {
    options: Object,
    pagination: Object,
    navigation: { type: Boolean, default: true },
    scrollbar: { type: Boolean, default: false },
    thumbnailOptions: Object
  }
}
</script>
