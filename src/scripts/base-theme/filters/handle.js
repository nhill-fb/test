import Vue from 'vue';
import {handleize} from '../utils/common';

Vue.filter('handle', value => {
  return handleize(value)
});

Vue.filter('within', (value, handle) => {
  if(handle) 
    return `/collections/${handle}/products/${value}`;
  else
    return `/products/${value}`;
})
