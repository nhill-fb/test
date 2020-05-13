<template>
  <div class="product__item" v-if="product" :class="{'sold-out': allSoldOut}">
    <div class="product__item-media">
      <a class="product__item-images" :href="productUrl">
        <responsive-img class="product__item-img primary" :size="'480x'" :src="featuredImage"></responsive-img>
        <responsive-img class="product__item-img secondary" v-if="altImage" :size="'480x'" :src="altImage"></responsive-img>
      </a>
      <div class="product__item-quickshop" v-if="sizeOption">
        <div class="product__item-options">
          <product-option :option="sizeOption" @selected="selectOption" :is-available="isAvailable"></product-option>
        </div>
        <button @click="addToCart()" :disabled="!(variant && variant.available)" class="btn btn-primary btn-block">
          <span v-if="variant && variant.available">{{translations.add_to_cart}}</span>
          <span v-else-if="!variant">{{translations.unavailable}}</span>
          <span v-else>{{translations.sold_out}}</span>
        </button>
      </div>
    </div>
    <a class="product__item-summary" :href="productUrl">
      <h3 class="product__item-name">
        <span>{{ product.title }}</span>
        <span class="label final-sale" v-if="variant && variant.compare_at_price > variant.price">{{translations.sale_price}}</span>
      </h3>

      <div class="product__item-extra">
        <span class="product__item-prices" v-if="variant">
          <span class="money" v-if="variant.compare_at_price > variant.price">
            <span>{{variant.price | money_nodec}}</span>
            <s>{{ variant.compare_at_price | money_nodec }}</s>
          </span>
          <span class="money" v-else> 
            <span>{{ variant.price | money_nodec }}</span>
          </span>
        </span>
        <span class="label" v-else>{{translations.unavailable}}</span>

        <span class="label" v-if="allSoldOut">{{translations.sold_out}}</span>
      </div>
    </a>
    <product-option :option="colorOption" @selected="selectOption" :is-available="isAvailable"></product-option>
  </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex'
import {handleize, getQueryString, noImageSrc} from '../utils/common'
import ProductOption from './product-option.vue'
import ResponsiveImg from './responsive-img.vue'

export default {
  components: {
    'product-option': ProductOption,
    'responsive-img': ResponsiveImg
  },
  computed: {
    ...mapState('global', {
      'settings': 'settings',
      'translations': state => state.translations.products
    }),
    product() {
      let product = this.productGroup.products.find(p => p.variants.find(v => v.is_selected));
      // some clients doesn't pre-select variants so we have to set first product in product group as default
      if(!product)
        product = this.productGroup.products[0];

      return product;
    },
    productUrl() {
      let url = `${this.collectionHandle ? `/collections/${this.collectionHandle}` : ''}/products/${this.product.handle}`;
      if(this.variant) 
        url += `?variant=${this.variant.id}`;
      return url;
    },
    allSoldOut() {
      return !this.productGroup.variants.filter(v => v.available).length
    },
    variant() {
      return this.productGroup.variants.find(v => v.is_selected);
    },
    // TODO: use this to maybe select image by color swatch
    // selectedOption() {
    //   return {
    //     color: this.variant[`option${this.colorOption.position}`],
    //     size: this.variant[`option${this.sizeOption.position}`] 
    //   };
    // },
    colorOption() {
      return this.productGroup.options_with_values.find(o => o.isColor);
    },
    sizeOption() {
      return this.productGroup.options_with_values.find(o => o.isSize);
    },
    featuredImage() {
      if(this.product.images_info && this.product.images_info.length) {
        return this.product.images_info[0].src
      }
      return noImageSrc;
    },
    altImage() {
      if(!this.settings['collection_enabled-img-hover'])
        return null;

      if(this.product.images_info && this.product.images_info.length > 1) {
        return this.product.images_info[1].src
      }
      return null;
    }
  },
  data() { return {quantity: 1} },
  props: {
    productGroup: Object,
    collectionHandle: String
  },
  methods: {
    ...mapActions('cart', ['addItem']),
    ...mapActions('global', ['openCartDrawer']),
    ...mapActions('products', {
      selectOption(dispatch, {position, value}) {
        dispatch('selectOption', { key: this.productGroup.key, position, value });
        const opt = this.productGroup.options_with_values.map(o => { 
          if(position == o.position)
            return { position, selected_value: value };
          return { position: o.position, selected_value: o.selected_value }
        });
        
        const variant = this.getVariant(opt);
        let id = null;
        if(variant) {
          id = variant.id;
        }
        dispatch('selectVariant', {key: this.productGroup.key, id})
      }
    }),
    // TODO: Maybe this is needed sometime in the future
    // incrementQuantity() {
    //   this.quantity = this.quantity + 1;
    // },
    // decrementQuantity() {
    //   if (this.quantity > 1)
    //     this.quantity = this.quantity - 1;
    // },
    getVariant(options) {
      const group = this.productGroup;
      if(group && group.variants.length) {
        return group.variants.find(v => {
          return options.every(opt => {
            return v.merged_options[opt.position - 1].split(":")[1] == opt.selected_value;
          })
        })
      }
      return null;
    },
    addToCart() {

      if(!this.variant) 
        console.log('Unable to add item to cart, variant not found')
      
      this.addItem({id: this.variant.id, quantity: this.quantity})
        .then(_ => {
          this.openCartDrawer();
        });
    },
    /**
     * Returns -1 if variant combination doesn't exist, 1 if variant is available, 0 if variant exists but is not available or has no inventory
     */
    isAvailable(position, value) {
      const opt = this.productGroup.options_with_values.map(o => { 
        if(position == o.position)
          return { position, selected_value: value };
        return { position: o.position, selected_value: o.selected_value }
      });
      
      const variant = this.getVariant(opt);
      if(!variant)
        return -1;
      return variant.available ? 1 : 0
    }
  }
}
</script>
