import Vue from 'vue';
import ProductOption from '../components/product-option.vue';
import Carousel from '../components/carousel.vue';
import ResponsiveImage from '../components/responsive-img.vue'
import store from '../store'
import {mapActions, mapState} from 'vuex'
import { noImageSrc } from '../utils/common';

document.querySelectorAll(".vue-product-detail").forEach(el => {
  new Vue({
    el: el,
    store,
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    mounted() {
      this.setProductId(this.$el.attributes['product-id'].value);
      /**
       * If the current page is PDP and has grouping enabled, then we kick off ajax call to retrieve additional color products
       */
      const groupByType = this.settings['product_groupby_type'];
      const groupByPrefix = this.settings['product_groupby_prefix'];
      const prod = window.VuexState.products[0];
      let url = '';
      if(groupByType == 'tag' && groupByPrefix && prod) {
        let tag = prod.tags.find(t => t.toLowerCase().indexOf(groupByPrefix) >= 0);
        if(tag) {
          url = `/collections/all/${encodeURIComponent(tag)}?view=json`
        }
      } else if(groupByType == 'type' && prod) {
        url = `/collections/all/${prod.type}?view=json`
      }
      if(url) {
        $.get(url).then(raw => {
          try{
            this.setProducts({products: JSON.parse(raw), groupByType, groupByPrefix});
          } catch {
            
          }
        })
      }
    },
    data: {quantity: 1},
    components: {
      'carousel': Carousel,
      'product-option': ProductOption,
      'responsive-img': ResponsiveImage
    },
    computed: {
      ...mapState('global', ['settings']),
      ...mapState('cart', ['isBusy']),
      ...mapState('products', {
        'productGroup': 'single_product_group'
      }),
      product() {
        if(!this.productGroup)
          return null;

        let product = this.productGroup.products.find(p => p.variants.find(v => v.is_selected));
        // some clients doesn't pre-select variants so we have to set first product in product group as default
        if(!product)
          product = this.productGroup.products[0];
  
        return product;
      },
      variant() {
        return this.productGroup.variants.find(v => v.is_selected);
      },
      featuredImage() {
        if(this.product.images_info && this.product.images_info.length) {
          return this.product.images_info[0].src
        }
        return noImageSrc;
      },
      altImages() {
        return this.product.images_info.filter(i => i.src != this.featuredImage);
      }
    },
    methods: {
      ...mapActions('cart', ['addItem']),
      ...mapActions('global', ['openCartDrawer', 'openSizeChart']),
      ...mapActions('products', {
        setProductId(dispatch, payload) { dispatch('setProductId', payload) },
        setProducts(dispatch, payload) { dispatch('setProducts', payload) },
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
      addQty() {
        this.quantity++
      },
      decQty() {
        if(this.quantity > 1)
          this.quantity--;
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
  })
})
