<template>
  <div class="product__item-option" 
    v-if="option"
    :class="[option.isColor ? 'color':'', option.isSize ? 'size':'', !option.isColor && !option.isSize ? handle(option.name):'']">
    <span class="option-name">
      <span>{{option.name}}</span>
      <em>{{option.selected_value}}</em>
    </span>
     <div class="option-labels">
      <label class="option" 
        v-for="val in option.values" 
        :key="val.title"
        :title="val.title" 
        :class="{disabled: isAvailable(option.position, val.title) != 1, selected: option.selected_value == val.title}">
        <input 
          type="radio" 
          :value="val.title" 
          :checked="option.selected_value == val.title"
          @click="$emit('selected', {position: option.position, value: val.title})"
        />
        <span class="swatch-wrapper" v-if="option.isColor" v-html="val.image"></span>
        <span v-else>{{val.display || val.title}}</span>
        <div class="tooltip" role="tooltip">{{val.title}}</div>
      </label>
    </div>
  </div>
</template>

<script>
import {handleize} from '../utils/common';

export default {
  props: {
    option: Object,
    isAvailable: Function
  },
  methods: {
    handle(val) {
      return handleize(val)
    }
  }
}
</script>
