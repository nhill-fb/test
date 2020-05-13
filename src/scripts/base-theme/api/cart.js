/*============================================================================
  Modified version of Timber AJAX Cart to utilize Promises instead of callbacks
*/
/*============================================================================
  Ajax the add to cart experience by revealing it in a side drawer
  Plugin Documentation - http://shopify.github.io/Timber/#ajax-cart
  (c) Copyright 2015 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

  This file includes:
    - Basic Shopify Ajax API calls
    - Ajax cart plugin

  This requires:
    - jQuery 1.8+
    - handlebars.min.js (for cart template)
    - modernizr.min.js
    - snippet/ajax-cart-template.liquid

  Customized version of Shopify's jQuery API
  (c) Copyright 2009-2015 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.
==============================================================================*/
const ShopifyAPI = {};

/*============================================================================
  API Helper Functions
==============================================================================*/
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
};

/*============================================================================
  API Functions
==============================================================================*/

ShopifyAPI.updateCartNote = function(note, options) {
  const params = $.extend({
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json'
  }, options);
  
  return jQuery.ajax(params);
};

// log error to console, but invoker should alert customer in a popup or toast
ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
  var data = eval('(' + XMLHttpRequest.responseText + ')');
  if (!!data.message) {
    console.error(data.message + '(' + data.status  + '): ' + data.description);
  }
};

/*============================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/
ShopifyAPI.addItem = function(data, options) {
  const params = $.extend({
    type: 'POST',
    url: '/cart/add.js',
    data: data,
    dataType: 'json'
  }, options);

  return jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function() {
  return jQuery.getJSON('/cart.js');
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.updateItem = function(data, options) {
  const params = $.extend({
    type: 'POST',
    url: '/cart/update.js',
    data: data,
    dataType: 'json'   
  }, options);

  return jQuery.ajax(params);
};

export default ShopifyAPI;
