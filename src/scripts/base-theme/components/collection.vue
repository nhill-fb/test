<template>
  <div v-if="list && list.length">
    <product v-for="group in list" :key="group.key" :product-group="group" :collection-handle="collectionHandle"></product>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Product from './product.vue'

export default {
  props: {
    collectionHandle: String,
    list: Array
  },
  components: {
    'product': Product
  }
}
</script>
