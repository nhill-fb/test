import Vue from 'vue';
import formatCurrency from '../utils/currency';

Vue.filter('money', value => {
  return formatCurrency(value)
});

Vue.filter('money_nodec', value => {
  return formatCurrency(value).replace(/\.00$/, '');
})
