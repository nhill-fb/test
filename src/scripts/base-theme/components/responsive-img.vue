<template>
  <img :src="resized" v-if="useSrcSet" :srcset="srcSet" sizes="100vw" />
  <img :src="resized" v-else />
</template>

<script>
import {getSizedImageUrl} from '../utils/common';

export default {
  props: {
    src: String,
    size: String,
    useSrcSet: Boolean
  },
  computed: {
    resized() {
      if(this.size)
        return getSizedImageUrl(this.src, this.size)
      else
        return this.src;
    },
    srcSet() {
      const sizes = ['480x','765x','1000x','1300x','1700x','2000x'];
      if(!this.src)
        return null;
        
      const srcSet = sizes.map(size => `${getSizedImageUrl(this.src, `${size}.progressive`)} ${size.replace('x', 'w')}`);
      return srcSet.join(",")
    }
  }
}
</script>
