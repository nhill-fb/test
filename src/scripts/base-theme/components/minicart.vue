<template>
  <div class="minicart">
    <div class="minicart__container">
      <div class="minicart__before-form">
        <div class="minicart__message" v-show="cart.item_count == 0">
          <p class="minicart__empty">{{ translations.empty }}</p>
        </div>
      </div>
      <div class="minicart__form" v-show="cart.item_count > 0">   
        <transition-group name="minicart__items" 
          class="minicart__items" 
          tag="div">
          <div class="minicart__item" v-for="item in cart.items" :key="item.id">
            <a class="minicart__item-link" :href="item.url">
              <div class="minicart__item-image" v-if="item.image">
                <img :src="getImage(item.image, '320x')" :alt="item.product_title" />
              </div>
            </a>
            <div class="minicart__item-detail">
              <a class="item_title" :href="item.url">
                <span>{{item.product_title}}</span>
              </a>
              <div class="minicart__item-price"><span class="money">{{item.price | money}}</span></div>
              <div class="minicart__options">
                <dl class="minicart__item-option" v-for="opt in item.variant_options" :key="opt">
                  <dd>{{opt}}</dd>
                </dl>
              
                <div v-if="item.properties">
                  <dl class="minicart__item-property" v-for="(val,key) in item.properties" :key="key">
                    <dt>{{key}}</dt>
                    <dd>{{val}}</dd>
                  </dl>
                </div>
              </div>     
              <div class="minicart__item-actions">
                <div class="minicart__quantity-box">
                  <span class="minus" @click="decQty(item)">-</span>
                  <input type="number" min="0" size="2" class="quantity" :value="item.quantity" @change="updateQty({item: item, qty: $event.target.value})"/>
                  <span class="plus" @click="addQty(item)">+</span>
                </div>
                <span class="preloader small" v-if="isBusy"></span>
                <a href="#" v-else @click.prevent="removeItem(item)">{{ translations.remove }}</a>
              </div>
            </div>
          </div>
        </transition-group>
        <div class="minicart__summary">
          <dl class="minicart__subtotal">
            <dt>{{ translations.subtotal }}</dt>
            <dd>
              <span class="money">{{cart.total_price | money}}</span>
            </dd>
          </dl>
          <p class="minicart__ship-msg" v-if="settings.display_ship_msg">{{ translations.shipping_at_checkout }}</p>
          <dl class="minicart_savings" v-if="settings.display_savings && cart.total_discounts > 0">
            <dt>{{ translations.savings }}</dt>
            <dd>
              <span class="money">{{cart.total_discounts | money}}</span>
            </dd>
          </dl>
          <a class="btn btn-primary btn-block" :href="settings.goto_checkout ? '/checkout' : '/cart'">
            <span v-text="settings.goto_checkout ? translations.checkout : translations.cart"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store';
import {getSizedImageUrl} from '../utils/common'
import { mapActions, mapState } from 'vuex';

export default {
  store,
  computed: {
    ...mapState('cart', {
      'cart': 'cart', 
      'isBusy': 'isBusy'
    }),
    ...mapState('global', {
      'translations': state => state.translations.cart, 
      'settings': 'settings'
    })
  },
  methods: {
    ...mapActions('cart', ['removeItem', 'addQty', 'decQty', 'updateQty']),
    getImage: getSizedImageUrl
  }
}
</script>
