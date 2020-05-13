window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/

/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


$(document).ready(function () {
  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $(".in-page-link").on("click", function (evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = ".rte table";

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: "rte__table-wrapper"
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: "rte__video-wrapper"
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      "supports-no-cookies",
      "supports-cookies"
    );
  }

  var tryInit = function () {
    if (site) {
      site.init();
    } else {
      setTimeout(tryInit, 200);
    }
  };

  // Init Corpus
  tryInit();
});

var site = {
  blockScroll: false,
  introHiding: false,

  init: function () {
    var sections = [
      "tracking",
      "intro",
      "landing",
      "scentMenu",
      "purchase",
      "customers",
      "footer",
      "reviews",
      "passwords",
      "details",
      "header",
      "trios",
      "cart",
      "video",
      "about",
      "learnMore"
    ];

    _.each(sections, function (section) {
      window[section].init();
    });

    $(window).on("beforeunload unload", function () {
      $(window).scrollTop(0);
    });

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) {
      $("html").addClass("ios");
    }
  },

  closeAllPopups: function () {
    cart.close();
    purchase.close();
    video.close();
    reviews.close();
    trios.close();
    scentMenu.close();
    footer.close();
  },
  mobileScrollHandler: function (event) {
    event.preventDefault();
  },

  lockForModal: function (disableMobileTouch) {
    site.blockScroll = true;

    $(".header, .header-bg").css({
      position: "fixed",
      top: ""
    });

    site.scrollTop = $(window).scrollTop();
    $("html, body").addClass("noscroll");

    // Prevent Mobile Scrolling
    if (disableMobileTouch === true) {
      document.addEventListener("touchmove", site.mobileScrollHandler, {
        passive: false
      });
    }
  },

  unlockForModal: function (enableMobileTouch) {
    $("html, body").removeClass("noscroll");
    $(window).scrollTop(site.scrollTop);

    setTimeout(function () {
      site.blockScroll = false;
    }, 400);

    if (carousel.swiper) {
      carousel.swiper.update();
      carousel.swiperHeader.update();
    }

    // rm event listeners
    if (enableMobileTouch === true) {
      document.removeEventListener("touchmove", site.mobileScrollHandler, {
        passive: false
      });
    }
  },
  lockForLearnMenu: () => {
    // Prevent Mobile Scrolling
    document.addEventListener("touchmove", site.mobileScrollHandler, {
      passive: false
    });
  },
  unlockForLearnMenu: () => {
    // rm event listeners
    if (enableMobileTouch === true) {
      document.removeEventListener("touchmove", site.mobileScrollHandler, {
        passive: false
      });
    }
  }
};

var intro = {
  cancel: false,
  data: null,

  init: function () {
    if (!$(".block-intro").length) {
      $("html").removeClass("intro noscroll");
      return;
    }

    if (intro.approved) {
      // intro.loadJSON();
      intro.addEventListeners();
    } else {
      $(".block-intro").css("display", "none");
      $("html").removeClass("intro");
    }
  },

  // loadJSON: function() {
  //   $.ajax({
  //     dataType: "json",
  //     url: window.introJSON,
  //     success: function(data) {
  //       intro.data = data;
  //       intro.parseJSON();
  //     }
  //   });
  // },

  // parseJSON: function() {
  //   var dateObj = new Date();

  //   // -- Get season
  //   var season = "winter";
  //   if (dateObj.getMonth() >= 2) {
  //     if (dateObj.getMonth() == 2 && dateObj.getUTCDate() >= 19) {
  //       season = "spring";
  //     } else {
  //       if (dateObj.getMonth() > 2) {
  //         season = "spring";
  //       }
  //     }
  //   }

  //   if (dateObj.getMonth() >= 5) {
  //     if (dateObj.getMonth() == 5 && dateObj.getUTCDate() >= 21) {
  //       season = "summer";
  //     } else {
  //       if (dateObj.getMonth() > 5) {
  //         season = "summer";
  //       }
  //     }
  //   }

  //   if (dateObj.getMonth() >= 8) {
  //     if (dateObj.getMonth() == 8 && dateObj.getUTCDate() >= 22) {
  //       season = "fall";
  //     } else {
  //       if (dateObj.getMonth() > 8) {
  //         season = "fall";
  //       }
  //     }
  //   }

  //   if (dateObj.getMonth() >= 11) {
  //     if (dateObj.getMonth() == 11 && dateObj.getUTCDate() >= 21) {
  //       season = "winter";
  //     } else {
  //       if (dateObj.getMonth() > 11) {
  //         season = "winter";
  //       }
  //     }
  //   }

  //   // -- Determine morning/night
  //   var time = "night";
  //   if (dateObj.getHours() >= 6 && dateObj.getHours() <= 17) {
  //     time = "day";
  //   }

  //   // -- Get bg options

  //   // var options = _.findWhere(intro.data.seasons, {season: season}) != undefined ? _.findWhere(intro.data.seasons, {season: season }) : _.findWhere(intro.data.seasons, {season: 'fallback'});

  //   // hardcoding fallback season for now to use single video. use above to get season and day/night
  //   var options = _.findWhere(intro.data.seasons, { season: "fallback" });

  //   options = options[time].anywhere;

  //   // -- Pick 1 at random
  //   // var bgItem = options[Math.floor(Math.random()*options.length)];

  //   // we are just hardcoding the first video in the fallback json for launch, use above to randomize video
  //   var bgItem = options[0];

  //   // -- Load asset
  //   var urlPrefix = "";
  //   var assetUrl;

  //   if ($(window).width() <= 736) {
  //     assetUrl = urlPrefix + bgItem.mobile;
  //   } else {
  //     assetUrl = urlPrefix + bgItem.desktop;
  //   }

  //   if (bgItem.type == "image") {
  //     $(".block-intro").css("background-image", "url(" + assetUrl + ")");
  //     $(".block-intro__videowrap").remove();

  //     $(".block-intro").imagesLoaded({ background: true }, function() {
  //       $(".block-intro").css("opacity", 1);
  //       site.blockScroll = true;
  //       $("html").addClass("noscroll");
  //     });
  //   } else {
  //     var markup =
  //       '<video autoplay loop muted playsinline src="' +
  //       assetUrl +
  //       '"></video>';
  //     $(".block-intro__videowrap").html(markup);
  //     $(".block-intro__videowrap").addClass("show");
  //     $(".block-intro__videowrap video")[0].load();
  //     $(".block-intro__videowrap video")[0].play();

  //     $(".block-intro").css("opacity", 1);
  //     site.blockScroll = true;
  //     $("html").addClass("noscroll");
  //   }
  // },

  addEventListeners: function () {
    $(".btn__intro__email").click(function () {
      intro.sendEmail();
      return false;
    });

    $(".btn__intro__emailonly").click(function () {
      intro.sendEmail(true);
      return false;
    });

    $(".btn__intro__cta, .intro__soldout").click(function () {
      intro.close(); 
      landing.updateHistory(); // update URL to reflect loaded product in carousel
      return false;
    });

    $(".input__wrapper input").on("keyup", function () {
      var ok = false;
      if (
        validator.checkBlankSimple(".input__email__intro") &&
        validator.checkBlankSimple(".input__fullname__intro")
      ) {
        $(
          ".btn__intro__cta, .btn__intro__email, .btn__intro__emailonly"
        ).removeClass("disabled");
      } else {
        $(
          ".btn__intro__cta, .btn__intro__email, .btn__intro__emailonly"
        ).addClass("disabled");
      }
    });

    $(window).on("scroll", intro.scrolled);
    intro.scrolled();

    $(window).on("resize", intro.resized);
    setTimeout(intro.resized, 250);
  },

  sendEmail: function (emailonly) {
    var a = validator.checkEmail(".input__email__intro");
    var b = validator.checkBlanks([{ id: ".input__fullname__intro", msg: "" }]);

    if (a && b) {
      tracking.emailCapture(
        $(".input__email__intro").val(),
        $(".input__fullname__intro").val(),
        "intro"
      );

      if (emailonly) {
        $(".input__email__intro").attr(
          "placeholder",
          "Thank you for signing up."
        );
        $(".input__email__intro").val("");
        $(".input__fullname__intro").val("");

        setTimeout(function () {
          $(".input__email__intro").attr("placeholder", "Email Address");
        }, 3500);
      } else {
        $(".input__email__intro").attr(
          "placeholder",
          "Thank you for signing up."
        );
        $(".input__email__intro").val("");
        $(".input__fullname__intro").val("");

        setTimeout(function () {
          intro.close();
        }, 3500);
      }
    }
  },

  close: function () {
    $(".block-intro").removeClass("first");
    site.blockScroll = false;
    $("html").removeClass("noscroll");
    $("html").addClass("intro-hiding");
    TweenLite.to($(".block-intro__content"), 0.5, { autoAlpha: 0 });
    TweenLite.to($(".btn__intro__cta"), 0.25, { autoAlpha: 0 });
    $(".block-intro").slideUp(750, function () {
      $("html").removeClass("intro intro-hiding");
      $(".block-intro__video").remove();
    });

    var _rsq = window._rsq || [];
    var id = landing.getActiveProduct().id;
    _rsq.push(["_addItem", { id: id }]);
    _rsq.push(["_track"]);

    if (!tracking.verbose) return;

    // console.log("// -- Tracking: itemPageView()");
    // console.log(_rsq);
  },

  approved: function () {
    var status = false;

    if (window.homePage && !intro.cancel) {
      status = true;
    }

    if (utils.getCookie("intro_showIntro") == "no") {
      status = false;

      var cookieVersion = parseInt(utils.getCookie("intro_version"));
      var introVersion = parseInt($(".block-intro").attr("data-version"));
      if (introVersion > cookieVersion) {
        status = true;
      }
    }

    if ($(".block-intro").attr("data-force") == "true") {
      if (window.homePage && !intro.cancel) {
        status = true;
      }
    }

    if (status == true) {
      utils.setCookie("intro_showIntro", "no", 30);
      utils.setCookie(
        "intro_version",
        $(".block-intro").attr("data-version"),
        30
      );
    }

    return status;
  },

  getForAbout_: function () {
    $(".header, .header-bg, .block-carousel__header").addClass(
      "freeze-for-about"
    );
    $(".header, .header-bg, .block-carousel__header").css({
      top: 0,
      position: "fixed"
    });

    $(".block-intro").addClass("for-about");
    $(".block-intro").css("opacity", 1);
    $(
      ".block-intro__content .btn.primary, .block-intro__content .input__wrapper"
    ).css("display", "none");
    TweenLite.to($(".block-intro__content"), 0.5, { autoAlpha: 1 });
    $("html, body").animate(
      { scrollTop: 0 },
      {
        duration: 750,
        complete: function () {
          $(".header, .header-bg, .block-carousel__header").css({
            position: "",
            top: 0
          });
          $(".header, .header-bg, .block-carousel__header").removeClass(
            "freeze-for-about"
          );
        }
      }
    );
    $(".block-intro").slideDown(750);
  },

  getForAbout: function () {
    // -- Add some classes onto html to make sure scrolling works but the nav stuff is hidden again
    $("html").addClass("intro intro-hiding");

    // -- Hide cta buttons then show the content again
    $(
      ".block-intro__content .btn.primary, .block-intro__content .input__wrapper"
    ).css("display", "none");
    $(".block-intro__arrow").css("opacity", 1);
    TweenLite.to($(".block-intro__content"), 0.5, { autoAlpha: 1 });

    // -- Switch out body from intro to about
    $(".block-intro__text-intro").css("display", "none");
    $(".block-intro__text-about").css("display", "block");

    // -- Scroll up & slide down intro
    $("html, body").animate(
      { scrollTop: 0 },
      {
        duration: 750,
        complete: function () {
          $("html").addClass("about");
        }
      }
    );

    $(".block-intro").css("opacity", 1);
    $(".block-intro").slideDown(750);
  },

  scrolled: function () {
    var sTop = $(window).scrollTop();
    var introH = $(".block-intro").outerHeight();

    if ($("html").hasClass("about")) {
      if (sTop > introH) {
        $("html").removeClass("intro intro-hiding about");
        $(".block-intro").css({
          opacity: 0,
          display: "none"
        });
      }
    }
  },

  resized: function () {
    var tH = $(".block-intro__content").height();
    tH = tH / 2;
    tH += 30;

    if ($("html").hasClass("ios")) {
      tH -= 40;
    }

    $(".btn__intro__cta").css("margin-top", tH);
    TweenLite.to($(".btn__intro__cta"), 0.5, { autoAlpha: 1 });
  }
};

var header = {
  isOpen: false,
  lastScroll: 0,

  init: function () {
    $(".header__select").click(function (event) {
      $(".header__select__toggle")
        .toggleClass("fa-bars")
        .toggleClass("fa-times");

      if (!header.isOpen) {
        header.open();
        $(this).addClass("active");
      } else {
        header.close();
        $(this).removeClass("active");
      }

      return false;
    });

    $(window).on("scroll", header.scrolled);
    header.scrolled();
  },

  open: function () {
    header.isOpen = true;

    site.lockForModal();
    TweenLite.to($(".header__mobile__takeover"), 0.5, { autoAlpha: 1 });
  },

  close: function () {
    header.isOpen = false;

    site.unlockForModal();
    TweenLite.to($(".header__mobile__takeover"), 0.5, { autoAlpha: 0 });
  },

  scrolled: function () {
    if (site.blockScroll) return;

    var hH = $(".header").outerHeight();
    var sTop = $(window).scrollTop();
    var sTopMatched = sTop * 2;
    var posBase = -1 * hH;

    // -- If scroll amount is less then height of header (header on screen)
    if (sTopMatched < hH) {
      // $('.header, .header-bg, .block-carousel__header').css({
      //   top: 0 - sTop,
      //   position: ''
      // });
      $(".block-carousel__header").css({
        top: 0 - sTop,
        position: ""
      });
      $(".header, .header-bg").addClass("sticky");

      TweenLite.killTweensOf($(".header, .header-bg, .block-carousel__header"));
      // $('.header, .header-bg, .block-carousel__header').css('marginTop', 0);
      $(".block-carousel__header").css("marginTop", 0);
      // $('.header, .header-bg, .block-carousel__header').removeClass('tweened');
    } // -- If scroll amount is greater then height of header (header off screen)
    else {
      // -- Keep header fixed right off the screen
      // $('.header, .header-bg').css({
      //   position: 'fixed',
      //   top: posBase
      // });
      $(".header, .header-bg").removeClass("sticky");

      // -- Check if carousel header is in range of sticky details
      if ($(".block-carousel")[0]) {
        var offset = sTop - $(".block-details").position().top;
        if (offset >= 0) {
          // -- Carousel header should be sticky moving up page in sync with details as normal
          $(".block-carousel__header").css({
            position: "fixed",
            top: posBase - offset
          });
        } // -- Carousel header should remain fixed at its base position
        else {
          $(".block-carousel__header").css({
            position: "fixed",
            top: posBase
          });
        }
      }

      if (header.lastScroll > sTop) {
        // -- If we scrolled up and want to slide down header
        // -- Move base header components
        if (!$(".header, .header-bg").hasClass("tweened")) {
          // TweenLite.to($('.header, .header-bg'), 0.5, {css:{marginTop:hH}});
          $(".header, .header-bg").addClass("tweened");
          $(".header, .header-bg").addClass("sticky");
        }

        // -- Check if carousel header is sticky with page, if not slide it, else leave it alone
        if (offset < 0) {
          if (!$(".block-carousel__header").hasClass("tweened")) {
            TweenLite.to($(".block-carousel__header"), 0.5, {
              css: { marginTop: hH }
            });
            $(".block-carousel__header").addClass("tweened");
          }
        }
      } else {
        // -- No harm in letting all go back to defaults here at once
        TweenLite.killTweensOf(
          $(".header, .header-bg, .block-carousel__header")
        );
        // TweenLite.to($('.header, .header-bg, .block-carousel__header'), 0.5, {css:{marginTop:0}});
        TweenLite.to($(".block-carousel__header"), 0.5, {
          css: { marginTop: 0 }
        });
        $(".header, .header-bg, .block-carousel__header").removeClass(
          "tweened"
        );
      }
    }

    header.lastScroll = sTop;
  }
};

var about = {
  init: function () {
    if (!$(".block-about").length) return;

    $("html").removeClass("intro noscroll");
    $(".header__about").addClass("active");
    $(".header__select__label").html("About Corpus");
  }
};

var learnMore = {
  init: () => {
    learnMore.setClickListeners();
  },
  setClickListeners: () => {
    learnMore.onMenuClick();
  },
  onMenuClick: () => {
    $(".nav__wrap__device > a").on("click", function (event) {
      if (!$(this).hasClass("menu-active")) {
        $(this).addClass("menu-active");
        $(".learn__more__menu").addClass("active");
        // Lock Scrolling
        site.lockForModal(true);
      } else {
        $(this).removeClass("menu-active");
        $(".learn__more__menu").removeClass("active");
        // Lock Scrolling
        site.unlockForModal(true);
      }
    });
  }
};

var landing = {
  firstLoad: true,
  prevState: null,
  defaultState: null,
  changedOnHistoryRequest: false,

  init: function () {
    if (!$(".block-carousel").length) return;

    carousel.init();
    landing.initHistory();

    // -- Set deodorant active by default
    $(".header__navlist__item")
      .eq(0)
      .addClass("active");
  },

  getActiveProduct: function () {
    var product = $(
      ".block-carousel__product[data-swiper-slide-index='" +
      carousel.swiper.realIndex +
      "']"
    );

    var data = {
      available: product.attr("data-available"),
      id: product.attr("data-product-id"),
      variant_id: product.attr("data-variant-id"),
      price: product.attr("data-price"),
      title: product.attr("data-title"),
      handle: product.attr("data-handle"),
      scent_notes: $(
        ".block-carousel__headerswiper .swiper-slide[data-product-id='" +
        product.attr("data-product-id") +
        "']"
      )
        .find("h2")
        .html()
    };

    return data;
  },

  getProductBySlideIndex: function (index) {
    var product = $(
      ".block-carousel__product[data-swiper-slide-index='" + index + "']"
    );

    var data = {
      available: product.attr("data-available"),
      id: product.attr("data-product-id"),
      variant_id: product.attr("data-variant-id"),
      price: product.attr("data-price"),
      title: product.attr("data-title"),
      handle: product.attr("data-handle"),
      scent_notes: $(
        ".block-carousel__headerswiper .swiper-slide[data-product-id='" +
        product.attr("data-product-id") +
        "']"
      )
        .find("h2")
        .html()
    };

    return data;
  },

  addActiveProductToCart: function (qty) {
    cart.addItem(
      landing.getActiveProduct().variant_id,
      qty,
      null,
      landing.getActiveProduct().id
    );
  },

  updateActiveProduct: function () {
    var activeProduct = landing.getActiveProduct();

    // console.log("Active product", activeProduct);

    // -- Load video & four up images & motion block
    video.swapPanel(activeProduct.id);
    motion.swapPanel(activeProduct.id);
    fourup.swapPanel(activeProduct.id);

    // -- Alter a few things incase it is a trio or standard
    if (activeProduct.handle == "mini-trio") {
      $(".block-carousel__header__col").addClass("trio");
      $(".block-triospromo").slideUp(500);
    } else {
      $(".block-carousel__header__col").removeClass("trio");
      $(".block-triospromo").slideDown(500);
    }

    // -- Toggle details
    $(".block-details__panel").addClass("is-hidden");
    $(
      ".block-details__panel[data-product-id='" + activeProduct.id + "']"
    ).removeClass("is-hidden");

    // -- Toggle reviews
    $(".block-reviews__panel").css("display", "none");
    $(".block-reviews__panel[data-product-id='" + activeProduct.id + "']").css(
      "display",
      "block"
    );

    // -- Set price on landing buttons
    if (activeProduct.available == "false") {
      $(".btn__purchase").addClass("inactive");
      $(".btn__purchase .btn__purchase__label").html("Out of Stock");
      $(".btn__purchase .btn__purchase__price").html("Out of<br/> Stock");
    } else {
      $(".btn__purchase").removeClass("inactive");
      $(".btn__purchase .btn__purchase__label").html(
        "Add to cart $" + utils.priceNoDecimals(activeProduct.price)
      );
      $(".btn__purchase .btn__purchase__price").html(
        "Buy<br/>$" + utils.priceNoDecimals(activeProduct.price)
      );
    }

    // -- Set active in scent menu
    $(".block-scentmenu__menu__link").removeClass("active");
    $(
      '.block-scentmenu__menu__link[data-product-id="' + activeProduct.id + '"]'
    ).addClass("active");

    $(".block-scentmenu__moment").removeClass("active active-hide");
    $(
      '.block-scentmenu__moment[data-product-id="' + activeProduct.id + '"]'
    ).addClass("active");

    // -- Set labels on reviewentry
    $(".block-reviewentry__header h1").html(activeProduct.title);
    $(".block-reviewentry__header h2").html(activeProduct.scent_notes);

    // -- Set labels on video overlay
    $(".block-video__overlay__header h1").html(activeProduct.title);
    $(".block-video__overlay__header h2").html(activeProduct.scent_notes);

    // -- Set links on carousel for SEO help 
    var prevIndex = carousel.getPreviousSlideRealIndex();
    var prevProduct = landing.getProductBySlideIndex(prevIndex);

    var nextIndex = carousel.getNextSlideRealIndex();
    var nextProduct = landing.getProductBySlideIndex(nextIndex);

    var searchParam = window.location.search;
    // console.log(searchParam);
    if (searchParam) {

      $(".block-carousel__mainswiper .swiper-button-prev").attr(
        "href",
        "/products/" + prevProduct.handle + searchParam
      );
      $(".block-carousel__mainswiper .swiper-button-next").attr(
        "href",
        "/products/" + nextProduct.handle + searchParam
      );
    } else {

      $(".block-carousel__mainswiper .swiper-button-prev").attr(
        "href",
        "/products/" + prevProduct.handle
      );
      $(".block-carousel__mainswiper .swiper-button-next").attr(
        "href",
        "/products/" + nextProduct.handle
      );
    }


    // -- Set default for history
    if (landing.firstLoad || window.productPage) {
      landing.defaultState = activeProduct.handle;
    } else {
      // -- ReSci / Tracking
      tracking.itemPageView(activeProduct.id);
    }

    landing.firstLoad = false;
    window.productPage = false;
  },

  initHistory: function () {
    window.addEventListener("popstate", function (event) {
      var state = event.state;
      if (state == null) state = landing.defaultState;

      landing.changedOnHistoryRequest = true;
      carousel.moveToSlideByProductHandle(state);
      site.closeAllPopups();
    });
  },

  updateHistory: function () { //testing
    // -- Including initial window search parameter to allow for URL Tracking
    var searchParam = window.location.search;
    var activeProduct = landing.getActiveProduct();

    if (!landing.changedOnHistoryRequest) {
      history.pushState(
        activeProduct.handle,
        null,
        "/products/" + activeProduct.handle + searchParam
      );
      landing.prevState = activeProduct.handle;
    }

    landing.changedOnHistoryRequest = false;
  }
};

var carousel = {
  swiper: null,
  swiperHeader: null,
  fadeLimit: 0,

  init: function () {

    if (!$(".block-carousel").length) return;
    
    carousel.initSwipers();
    // carousel.checkForPromo();
    carousel.checkForSafari();

    // Load first slide active product
    if (carousel.swiper) {      
      carousel.swiperHeader.slideTo(carousel.swiper.realIndex + 1);
      // landing.updateHistory(); //testing
      setTimeout(landing.updateActiveProduct, 405);
    }
    
    $(".block-carousel__arrow").click(function () {
      var pos = $(".block-video").offset().top;
      $("html, body").animate({ scrollTop: pos }, 500);

      return false;
    });
  },

  scrolled: function () {
    carousel.checkPositions();
  },

  resized: function () {
    carousel.checkPositions();
  },

  initSwipers: function () {
    carousel.swiperHeader = new Swiper(".block-carousel__headerswiper", {
      speed: 400,
      slidesPerView: 1,
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      allowTouchMove: false,
      initialSlide: 0,
      //shortSwipes: false,
      resistance: false
    });

    carousel.swiper = new Swiper(".block-carousel__mainswiper", {
      speed: 400,
      slidesPerView: 2,
      centeredSlides: true,
      loop: true,
      allowTouchMove: true,
      // Disable initialization setting here, it produces a bug where one slide gets misplaced
      // slideToClickedSlide: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      pagination: {
        el: '.block-carousel__mainswiper__pagination',
        clickable: true,
      },
      on: {
        slideChange: function () {
          if (carousel.swiper) {
            carousel.swiperHeader.slideTo(carousel.swiper.realIndex + 1);
            landing.updateHistory();
            setTimeout(landing.updateActiveProduct, 405);
          }
        }
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      shortSwipes: true,
      resistance: false,
      followFinger: $("html").hasClass("no-touchevents") ? true : false
    });

    // Force slide on click prev or next
    $(document).on("click", ".swiper-slide-next", function (event) {
      carousel.swiper.slideNext();
    });
    $(document).on("click", ".swiper-slide-prev", function (event) {
      carousel.swiper.slidePrev();
    });

    $(window).on("scroll", carousel.scrolled);
    $(window).on("resize", carousel.resized);
    carousel.scrolled();
    carousel.resized();

    if (window.productPage) {
      carousel.moveToSlideByProductId(window.productPage);
    } else {
      landing.updateActiveProduct();
    }
  },

  checkPositions: function () {
    if (site.blockScroll) return;

    // -- Media area to change header to white version
    var padding =
      parseInt($(".block-carousel__header").css("padding-top")) +
      $(".block-carousel__header").height() / 2;
    if (
      utils.isAtTopOfView(
        document.getElementsByClassName("block-video")[0],
        padding
      )
    ) {
      // -- Lets see if we need to be green or white for bottom portion now
      var paddingDetails = parseInt($(".block-details").outerHeight());
      paddingDetails -= $(".block-carousel__header").outerHeight();
      if (
        utils.isScrolledIntoView(
          document.getElementsByClassName("block-details")[0],
          false,
          paddingDetails
        )
      ) {
        $(".block-carousel__header").removeClass(
          "block-carousel__header--white"
        );
        $(".block-carousel__header").addClass("block-carousel__header--green");

        $(".block-carousel__header .btn").addClass("on-light-bg");
        $(".block-carousel__header .btn").removeClass("on-dark-bg");
      } else {
        $(".block-carousel__header").removeClass(
          "block-carousel__header--green"
        );
        $(".block-carousel__header").addClass("block-carousel__header--white");

        $(".block-carousel__header .btn").removeClass("on-light-bg");
        $(".block-carousel__header .btn").addClass("on-dark-bg");
      }
    } else {
      $(".block-carousel__header").removeClass("block-carousel__header--white");
      $(".block-carousel__header .btn").addClass("on-light-bg");
      $(".block-carousel__header .btn").removeClass("on-dark-bg");
    }

    var paddingPromo = parseInt($(".block-carousel__promo").outerHeight() + 60);
    if (
      utils.isAtTopOfView(
        document.getElementsByClassName("block-video")[0],
        paddingPromo
      )
    ) {
      if (!$(".block-carousel__promo").hasClass("hidden")) {
        $(".block-carousel__promo").addClass("hidden");
        TweenLite.to($(".block-carousel__promo"), 1, { autoAlpha: 0 });
      }
    } else {
      if ($(".block-carousel__promo").hasClass("hidden")) {
        $(".block-carousel__promo").removeClass("hidden");
        TweenLite.to($(".block-carousel__promo"), 1, { autoAlpha: 1 });
      }
    }

    setTimeout(function () {
      carousel.fadeLimit = -110;
    }, 500);
  },
  moveToSlideOnClick: function (idx) {
    carousel.swiper.slideTo(idx);
  },
  moveToSlideByProductId: function (id) {
    var slide, index;
    _.each(carousel.swiper.slides, function (tarSlide, tarIndex) {
      if (tarSlide.dataset.productId == id && !index) {
        index = tarIndex;
      }
    });
    carousel.swiper.slideTo(index);
  },

  moveToSlideByProductHandle: function (id) {
    var slide, index;
    _.each(carousel.swiper.slides, function (tarSlide, tarIndex) {
      if (tarSlide.dataset.handle == id && !index) {
        index = tarIndex;
      }
    });
    carousel.swiper.slideTo(index);
  },

  getPreviousSlideRealIndex: function () {
    var index = carousel.swiper.realIndex;
    if (index != 0) {
      index--;
    } else {
      var numSlides = 0;
      $(".block-carousel__product").each(function () {
        var thisIndex = parseInt($(this).attr("data-swiper-slide-index"));
        if (thisIndex > numSlides) {
          numSlides = thisIndex;
        }
      });

      index = numSlides;
    }

    return index;
  },

  getNextSlideRealIndex: function () {
    var numSlides = 0;
    $(".block-carousel__product").each(function () {
      var thisIndex = parseInt($(this).attr("data-swiper-slide-index"));
      if (thisIndex > numSlides) {
        numSlides = thisIndex;
      }
    });

    var index = carousel.swiper.realIndex;
    if (index != numSlides) {
      index++;
    } else {
      index = 0;
    }

    return index;
  },

  // checkForPromo: function () {
  //   var promoOk = false;

  //   if ($(".block-carousel__promo").length) {
  //     // console.log(typeof utils.getCookie("promo"));
  //     promoOk = true;
  //     // if (utils.getCookie('promo') != 'true')
  //     // {
  //     //   console.log('up in here');
  //     //   promoOk = true;
  //     //   // utils.setCookie('promo', true, 5);
  //     // } else {
  //     // }
  //   }

  //   if (promoOk) {
  //     $(".block-carousel__arrow").css(
  //       "bottom",
  //       44 + $(".block-carousel__promo").outerHeight()
  //     );
  //     $(".block-carousel__mainswiper__pagination").css(
  //       "bottom",
  //       44 + $(".block-carousel__promo").outerHeight()
  //     );
  //   } else {
  //     $(".block-carousel__promo").css("display", "none");
  //   }
  // },

  checkForSafari: function () {
    var safariCheck = false; 
    
    if ($(".block-carousel__mainswiper.swiper-container-ios").length) {
      safariCheck = true;
    }

    if(safariCheck) {
      $(".block-carousel").addClass('ios');
    }
  }
};

var video = {
  prev: null,
  player: null,
  isOpen: false,
  inlinePlayers: [],
  currentInline: null,

  init: function () {
    if (!$(".block-video").length) return;

    $(".block-video__play").click(function () {
      if ($("html").hasClass("no-touchevents")) {
        video.launchInline(
          $(this)
            .parent()
            .parent()
        );
      } else {
        var id = $(this)
          .parent()
          .parent()
          .attr("data-vimeo");
        if ($(".block-video__poster--mobile").css("display") == "block") {
          id = $(this)
            .parent()
            .parent()
            .attr("data-vimeo-mobile");
        }

        video.launch(
          id,
          $(this)
            .parent()
            .parent()
        );
      }
      return false;
    });

    $(".block-video__overlay__close").click(function () {
      video.close();
      return false;
    });

    video.setupInline();
    // if ($('html').hasClass('no-touchevents')) {
    // }
  },

  swapPanel: function (id) {
    if (video.currentInline) {
      video.currentInline.player.pause();

      var panel = $(
        ".block-video__panel[data-product-id='" + video.currentInline.id + "']"
      );

      var poster = panel.find(".block-video__poster__inline");
      TweenLite.to(poster, 0.3, { autoAlpha: 1 });

      var playBtn = panel.find(".block-video__play");
      TweenLite.to(playBtn, 0.3, { autoAlpha: 1 });
    }

    if (video.prev) {
      TweenLite.to(video.prev, 0.5, {
        autoAlpha: 0,
        onComplete: function () {
          video.loadPanel(id);
        }
      });
    } else {
      video.loadPanel(id);
    }

    // -- Prep overlay video so its ready incase
    var vimeoId = $(".block-video__panel[data-product-id='" + id + "']").attr(
      "data-vimeo"
    );
    if ($(".block-video__poster--mobile").css("display") == "block") {
      vimeoId = $(".block-video__panel[data-product-id='" + id + "']").attr(
        "data-vimeo-mobile"
      );
    }

    if (vimeoId) {
      if (!video.player) {
        video.player = new Vimeo.Player("block-video__overlay__vimeo", {
          id: vimeoId,
          loop: true,
          muted: false,
          playsinline: false,
          color: "154734"
        });
      }

      video.player.loadVideo(vimeoId);
    }
  },

  loadPanel: function (id) {
    var panel = $('.block-video__panel[data-product-id="' + id + '"]');

    if (!panel.hasClass("loaded")) {
      $(
        '.block-video__panel[data-product-id="' + id + '"] .block-video__poster'
      ).each(function () {
        var img = $(this).attr("data-src");
        $(this).attr("src", img);
      });

      $(
        '.block-video__panel[data-product-id="' +
        id +
        '"] .block-video__poster__inline'
      ).each(function () {
        var img = $(this).attr("data-src");
        $(this).css("background-image", "url('" + img + "')");
      });

      panel.imagesLoaded(function () {
        video.showPanel(panel);
      });
    } else {
      video.showPanel(panel);
    }
  },

  showPanel: function (panel) {
    if (video.prev) {
      video.prev.css("display", "none");
    }

    panel.css("display", "block");
    TweenLite.to(panel, 0.5, { autoAlpha: 1 });
    video.prev = panel;

    panel.addClass("loaded");
  },

  launch: function (id, panel) {
    // video.playVideo();

    // video.isOpen = true;
    // site.lockForModal();
    // TweenLite.to($('.block-video__overlay'), 0.5, {autoAlpha:1});

    var id = panel.attr("data-product-id");
    var playerObj = _.find(video.inlinePlayers, function (player) {
      return player.id == id;
    });
    panel.find("iframe").attr("height", "100%");
    panel.find("iframe").attr("width", "100%");
    panel.addClass("open");
    playerObj.player.play();
    video.currentInline = playerObj;

    var poster = panel.find(".block-video__poster__inline--mobile");
    TweenLite.to(poster, 0.3, { autoAlpha: 0 });

    var playBtn = panel.find(".block-video__play");
    TweenLite.to(playBtn, 0.3, { autoAlpha: 0 });
  },

  close: function () {
    video.isOpen = false;
    site.unlockForModal();
    TweenLite.to($(".block-video__overlay"), 0.5, { autoAlpha: 0 });

    if (video.player) video.player.pause();
  },

  playVideo: function () {
    video.player.setVolume(0);
    video.player.play();
  },

  setupInline: function () {
    // console.log("inside setup inline");
    $(".block-video__panel").each(function () {
      $(this)
        .find(".block-video__panel__content")
        .addClass("inline");
      var id = $(this).attr("data-product-id");
      var vimeoId = $("html").hasClass("no-touchevents")
        ? $(this).attr("data-vimeo")
        : $(this).attr("data-vimeo-mobile");
      // var vimeoId = $(this).attr('data-vimeo');
      // console.log(vimeoId);
      var player = new Vimeo.Player("block-video__panel__vimeo__" + id, {
        id: vimeoId,
        loop: false
      });

      var playerObj = { player: player, id: id };
      video.inlinePlayers.push(playerObj);
    });
  },

  launchInline: function (panel) {
    var id = panel.attr("data-product-id");
    var playerObj = _.find(video.inlinePlayers, function (player) {
      return player.id == id;
    });
    panel.find("iframe").attr("height", "100%");
    panel.find("iframe").attr("width", "100%");
    panel.addClass("open");
    playerObj.player.play();
    video.currentInline = playerObj;

    var poster = panel.find(
      ".block-video__poster__inline--desktop, .block-video__poster__inline--mobile"
    );
    TweenLite.to(poster, 0.3, { autoAlpha: 0 });

    var playBtn = panel.find(".block-video__play");
    TweenLite.to(playBtn, 0.3, { autoAlpha: 0 });
  }
};

var motion = {
  prev: null,

  swapPanel: function (id) {
    if (motion.prev) {
      TweenLite.to(motion.prev, 0.5, {
        autoAlpha: 0,
        onComplete: function () {
          motion.loadPanel(id);
        }
      });
    } else {
      motion.loadPanel(id);
    }
  },

  loadPanel: function (id) {
    var panel = $('.block-motion__panel[data-product-id="' + id + '"]');

    if (panel.length && !panel.hasClass("loaded")) {
      $('.block-motion__panel[data-product-id="' + id + '"] img').each(
        function () {
          $(this).attr("src", $(this).attr("data-src"));
        }
      );

      var assetUrl = $(
        '.block-motion__panel[data-product-id="' + id + '"]'
      ).attr("data-src");
      var markup =
        '<video autoplay loop muted playsinline src="' +
        assetUrl +
        '"></video>';
      $(
        '.block-motion__panel[data-product-id="' +
        id +
        '"] .block-motion__video'
      ).html(markup);
      $(
        '.block-motion__panel[data-product-id="' +
        id +
        '"] .block-motion__video video'
      )[0].load();

      motion.showPanel(panel);
    } else {
      motion.showPanel(panel);
    }
  },

  showPanel: function (panel) {
    if (motion.prev) {
      motion.prev.css("display", "none");
      $(motion.prev)
        .find(".block-motion__video video")[0]
        .pause();
    }

    if (panel.length) {
      panel.css("display", "block");
      $(panel)
        .find(".block-motion__video video")[0]
        .play();
      TweenLite.to(panel, 0.5, { autoAlpha: 1 });
      motion.prev = panel;

      panel.addClass("loaded");
    }
  }
};

var fourup = {
  prev: null,

  swapPanel: function (id) {
    if (fourup.prev) {
      TweenLite.to(fourup.prev, 0.5, {
        autoAlpha: 0,
        onComplete: function () {
          fourup.loadPanel(id);
        }
      });
    } else {
      fourup.loadPanel(id);
    }
  },

  loadPanel: function (id) {
    var panel = $('.block-fourup__panel[data-product-id="' + id + '"]');

    if (!panel.hasClass("loaded")) {
      $('.block-fourup__panel[data-product-id="' + id + '"] img').each(
        function () {
          $(this).attr("src", $(this).attr("data-src"));
        }
      );

      panel.imagesLoaded(function () {
        fourup.showPanel(panel);
      });
    } else {
      fourup.showPanel(panel);
    }
  },

  showPanel: function (panel) {
    if (fourup.prev) {
      fourup.prev.css("display", "none");
    }

    panel.css("display", "block");
    TweenLite.to(panel, 0.5, { autoAlpha: 1 });
    fourup.prev = panel;

    panel.addClass("loaded");
  }
};

var details = {
  reset: true,

  init: function () {
    if (!$(".block-details").length) return;

    $(".block-details__toggle").click(function () {
      var par = $(this)
        .parent()
        .parent();
      var content = par.find(".block-details__col__content");

      if (!$(this).hasClass("open")) {
        $(this).addClass("open");

        $(this)
          .find(".more")
          .css("display", "none");
        $(this)
          .find(".less")
          .css("display", "block");

        content.css("opacity", "0");
        content.slideDown(400);
        TweenLite.to(content, 0.4, { alpha: 1 });
      } else {
        $(this).removeClass("open");

        $(this)
          .find(".more")
          .css("display", "block");
        $(this)
          .find(".less")
          .css("display", "none");

        content.slideUp(400);
        TweenLite.to(content, 0.4, { alpha: 0 });
      }

      return false;
    });

    $(window).on("resize", details.resized);
    details.resized();
  },

  resized: function () {
    if ($(".block-details__toggle").css("display") != "block") {
      if (!details.reset) {
        details.resetToggles();
      }
    } else {
      details.reset = false;
    }
  },

  resetToggles: function () {
    details.reset = true;

    $(".block-details__toggle").removeClass("open");

    $(".block-details__col").each(function (i, el) {
      $(el)
        .find(".block-details__toggle .less")
        .css("display", "");
      $(el)
        .find(".block-details__toggle .more")
        .css("display", "");
      $(el)
        .find(".block-details__col__content")
        .css({
          display: "",
          opacity: ""
        });
    });
  }
};

var reviews = {
  isOpen: false,

  init: function () {
    if (!$(".block-reviews").length) return;

    reviews.checkForReviews();
    reviews.addEventListeners();
    reviews.watchBodyCount();
  },
  watchBodyCount: () => {
    $(document).on("input propertychange", "#reviewentry__body", function (
      event
    ) {
      let len = $(this).val().length;
      $(".body__count-value").text(len);
    });
  },

  checkForReviews: function () {
    if (!$(".spr-review-header-byline").length) {
      setTimeout(reviews.checkForReviews, 100);
    } else {
      setTimeout(reviews.modifyReviews, 100);
    }

    $(window).on("resize", reviews.resized);
    reviews.resized();
  },

  resized: function () {
    var inputs = [
      "#reviewentry__heading",
      "#reviewentry__name",
      "#reviewentry__email",
      "#reviewentry__location"
    ];
    if ($(".block-reviewentry__form").css("max-width") == "none") {
      _.each(inputs, function (el) {
        // console.log($(el).attr('data-placeholder'));
        $(el).attr("placeholder", $(el).attr("data-placeholder"));
      });
    } else {
      _.each(inputs, function (el) {
        $(el).attr("placeholder", "");
      });
    }
  },

  modifyReviews: function () {
    // -- Remove onclick from write-review buttons and replace
    $(".spr-summary-actions-newreview").attr("onclick", "return false");
    $(".spr-summary-actions-newreview").click(function () {
      reviews.open();
      return false;
    });

    // -- Move bylines
    $(".spr-review").each(function (i, el) {
      $(el)
        .find(".spr-review-header-byline")
        .appendTo($(el).find(".spr-review-content"));
      $(el)
        .find(".spr-review-header-byline")
        .css("display", "block");
    });

    $(".spr-reviews").each(function () {
      var count = $(this).find(".spr-review").length;
      if (count == 1) {
        $(this).addClass("is-single");
        $(this)
          .find(".spr-review")
          .addClass("is-single");
      }

      if (count == 0) {
        $(this)
          .parent()
          .parent()
          .parent()
          .addClass("empty");
      }
    });
  },
  tryReviewCheck: () => {
    reviews.checkForReviews();
    var hasByline = $(".spr-review-header-byline");
    if (hasByline.length > 0 || hasByline !== undefined) {
      // console.log("Review bylines OK");
    } else {
      // console.log("Bylines not found, checking again");
      setTimeout(tryReviewCheck, 200);
    }
  },

  addEventListeners: function () {
    $(".block-reviewentry__close").click(function (event) {
      reviews.close();
      return false;
    });

    $(".block-reviewentry__form input, .block-reviewentry__form textarea").on(
      "keyup, change",
      function () {
        if (reviews.checkSubmitOk()) {
          $(".btn__reviewentry__post").removeClass("disabled");
        } else {
          $(".btn__reviewentry__post").addClass("disabled");
        }

        return false;
      }
    );

    $(".btn__reviewentry__post").click(function () {
      if (!$(this).hasClass("disabled")) {
        reviews.submitReview();
      }

      return false;
    });

    // Return false for href clicks
    $("body").on(
      "click",
      ".spr-pagination-prev a, .spr-pagination-page a, .spr-pagination-next a",
      function () {
        setTimeout(function () {
          $("html, body").scrollTo(".block-reviews", 500, { offset: 175 });
          reviews.tryReviewCheck();
        }, 500);
        return false;
      }
    );
  },

  checkSubmitOk: function () {
    var a = validator.checkBlanks([
      { id: "#reviewentry__heading", msg: "" },
      { id: "#reviewentry__name", msg: "" },
      { id: "#reviewentry__email", msg: "" },
      { id: "#reviewentry__body", msg: "" }
    ]);

    var b = false;
    $(".reviewentry__input__wrapper .spr-icon-star").each(function (i, el) {
      if (!$(el).hasClass("spr-icon-star-empty")) {
        b = true;
      }
    });

    var c = validator.checkEmail("#reviewentry__email");

    if (a && b && c) {
      return true;
    } else {
      return false;
    }
  },

  submitReview: function () {
    var id = landing.getActiveProduct().id;

    $("#review_title_" + id).val($("#reviewentry__heading").val());
    $("#review_author_" + id).val($("#reviewentry__name").val());
    $("#review_email_" + id).val($("#reviewentry__email").val());
    $("#review_location_" + id).val($("#reviewentry__location").val());
    $("#review_body_" + id).val($("#reviewentry__body").val());

    var starIndex =
      5 -
      $(".reviewentry__input__wrapper .spr-icon-star.spr-icon-star-empty")
        .length;
    $("#new-review-form_" + id)
      .find(".spr-icon-star")
      .eq(starIndex - 1)
      .trigger("click");

    $("#new-review-form_" + id).submit();

    reviews.close();
  },

  open: function () {
    $(
      "#reviewentry__heading, #reviewentry__name, #reviewentry__email, #reviewentry__location, #reviewentry__body"
    ).val("");
    // $('#reviewentry__email').attr('placeholder', '');
    $(".reviewentry__input__wrapper .spr-icon-star").addClass(
      "spr-icon-star-empty"
    );

    reviews.isOpen = true;
    site.lockForModal();
    TweenLite.to($(".block-reviewentry"), 0.5, { autoAlpha: 1 });
  },

  close: function () {
    reviews.isOpen = false;
    site.unlockForModal();
    TweenLite.to($(".block-reviewentry"), 0.5, { autoAlpha: 0 });
  }
};

var trios = {
  isOpen: false,
  count: 0,

  init: function () {
    if (!$(".block-triospromo").length) return;

    trios.addEventListeners();
  },

  addEventListeners: function () {
    function clear() {
      $(".btn__addtrios").addClass("disabled");
      $(".block-trios__item").removeClass("selected");
      $(".block-trios__header h1").html("0/3 Scents Selected");
      $(".block-trios__items.selection2,.block-trios__items.selection3").removeClass("active");
      $(".block-trios__responsive").animate({scrollLeft: 0}, 550);
      trios.count = 0;
    }
    $(".btn__trios").click(function (event) {
      clear();

      trios.open();
      return false;
    });

    $(".btn__clearselection").click(function(e) {
      e.preventDefault();
      clear();
      if($(window).width() < 768)
        $(".block-trios__responsive").animate({scrollLeft: 0}, 550);
    })
    $(".block-trios__close").click(function (event) {
      trios.close();
      return false;
    });

    $(".block-trios__item").click(function () {
      var $parent = $(this).parent();
      if(!$parent.hasClass("active"))
        return;

      $parent.find('.selected').removeClass("selected");
      $(this).addClass("selected");
      if($parent.hasClass("selection1")) {
        if($(window).width() < 768 && !$(".block-trios__items.selection2").hasClass("active"))
          $(".block-trios__responsive").animate({scrollLeft: $(window).width()}, 550);
        $(".block-trios__items.selection2").addClass("active");
      } else if($parent.hasClass("selection2")) {
        if($(window).width() < 768 && !$(".block-trios__items.selection3").hasClass("active"))
          $(".block-trios__responsive").animate({scrollLeft: $(window).width() * 2}, 550)
        $(".block-trios__items.selection3").addClass("active");
      }
      var count = $(".block-trios__item.selected").length;

      if (count == 3) {
        $(".btn__addtrios").removeClass("disabled");
      } else {
        $(".btn__addtrios").addClass("disabled");
      }

      $(".block-trios__header h1").html(count + "/3 Scents Selected");
      
      return false;
    });

    $(".btn__addtrios").click(function () {
      if (!$(this).hasClass("disabled")) {
        // fbq('track', 'AddToCart');
        trios.addToCart();
      }

      return false;
    });
  },

  open: function () {
    trios.isOpen = true;
    site.lockForModal();
    TweenLite.to($(".block-trios"), 0.5, { autoAlpha: 1 });
  },

  close: function () {
    trios.isOpen = false;
    site.unlockForModal();
    TweenLite.to($(".block-trios"), 0.5, { autoAlpha: 0 });
  },

  addToCart: function () {
    var properties = {};
    var i = 1;
    $(".block-trios__item.selected").each(function () {
      var label = "scent" + i;
      var val = $(this)
        .find("h1")
        .html();

      properties[label] = val;
      i++;
    });

    cart.addItem(
      $(".block-trios").attr("data-variant-id"),
      1,
      properties,
      $(".block-trios").attr("data-product-id")
    );
    trios.close();
  }
};

var scentMenu = {
  isOpen: false,

  init: function () {
    $("body").on("click", ".btn__scentmenu", function (event) {
      scentMenu.open();
      return false;
    });

    $(".block-scentmenu__close").click(function (event) {
      scentMenu.close();
      return false;
    });

    $(".block-scentmenu__menu__link").click(function () {
      if (!$(this).hasClass("active")) {
        scentMenu.getScent($(this));
      } else {
        scentMenu.close();
      }

      return false;
    });

    $(".block-scentmenu__menu__link").hover(
      function () {
        if ($(this).hasClass("active")) return;

        var id = $(this).attr("data-product-id");
        $('.block-scentmenu__moment[data-product-id="' + id + '"]').addClass(
          "hover"
        );

        $(".block-scentmenu__moment")
          .filter(".active")
          .addClass("active-hide");
      },
      function () {
        if ($(this).hasClass("active")) return;

        var id = $(this).attr("data-product-id");
        $('.block-scentmenu__moment[data-product-id="' + id + '"]').removeClass(
          "hover"
        );

        $(".block-scentmenu__moment")
          .filter(".active")
          .removeClass("active-hide");
      }
    );

    $(window).on("resize", scentMenu.resized);
    scentMenu.resized();
  },

  resized: function () {
    var mH = $(".block-scentmenu__menu").height();
    var cH = $(".block-scentmenu__content").height();

    if (cH <= mH) {
      $(".block-scentmenu__content").addClass(
        "block-scentmenu__content--short"
      );
    } else {
      $(".block-scentmenu__content").removeClass(
        "block-scentmenu__content--short"
      );
    }
  },

  open: function () {
    scentMenu.isOpen = true;
    site.lockForModal();
    TweenLite.to($(".block-scentmenu"), 0.5, { autoAlpha: 1 });

    $(".header__center, .header__right, .header__mobile__cart").addClass(
      "scentmenuopen"
    );
    $(".header, .header-bg").addClass("tweened");
  },

  close: function () {
    scentMenu.isOpen = false;
    site.unlockForModal();
    TweenLite.to($(".block-scentmenu"), 0.5, { autoAlpha: 0 });

    $(".header__center, .header__right, .header__mobile__cart").removeClass(
      "scentmenuopen"
    );
    $(".header, .header-bg").removeClass("tweened");
  },

  getScent(target) {
    // -- Set active
    $(".block-scentmenu__menu__link").removeClass("active");
    target.addClass("active");

    // -- Find slide
    var id = target.attr("data-product-id");
    carousel.moveToSlideByProductId(id);

    // -- Close it
    // TODO: I think eventually there will be some sort of intersisital
    scentMenu.close();
  }
};

var purchase = {
  isOpen: false,

  init: function () {
    $(".btn__purchase").click(function (event) {
      // -- Set price label on button
      var price = landing.getActiveProduct().price;
      price = utils.priceNoDecimals(price);

      $(".block-purchase__button a").html("Add To Cart $" + price);
      $(".block-purchase__header h1").html(landing.getActiveProduct().title);
      $(".block-purchase__header h2").html(
        landing.getActiveProduct().scent_notes
      );

      // -- Set qty back to 1
      $(".block-purchase__qtywrap select").val(1);
      var activeProduct = landing.getActiveProduct();
      purchase.open();
      return false;
    });

    $(".block-purchase__close").click(function (event) {
      purchase.close();
      return false;
    });

    $(".block-purchase__button a").click(function (event) {
      // fbq('track', 'AddToCart');
      var qty = $(".block-purchase__qtywrap select").val();
      landing.addActiveProductToCart(qty);

      return false;
    });
  },

  open: function () {
    purchase.isOpen = true;
    site.lockForModal();
    TweenLite.to($(".block-purchase"), 0.5, { autoAlpha: 1 });
  },

  close: function () {
    purchase.isOpen = false;
    site.unlockForModal();
    TweenLite.to($(".block-purchase"), 0.5, { autoAlpha: 0 });
  }
};

var cart = {
  isOpen: false,
  data: [],

  init: function () {
    cart.addEventListeners();
    cart.update();
  },

  addEventListeners: function () {
    $(".btn__cart").click(function () {
      cart.open();
      return false;
    });

    $(".block-cart__close").click(function () {
      cart.close();
      return false;
    });

    $("body").on("click", ".btn__qtymore", function () {
      var el = $(this)
        .parent()
        .parent();
      cart.increaseQty(el);

      return false;
    });

    $("body").on("click", ".btn__qtyless", function () {
      var el = $(this)
        .parent()
        .parent();
      cart.decreaseQty(el);

      return false;
    });

    $("body").on("click", ".btn__removeitem", function () {
      var el = $(this)
        .parent()
        .parent();
      cart.removeItem(el);

      return false;
    });

    $(".btn__checkout").click(function () {
      // fbq('track', 'InitiateCheckout');
      if ($(this).hasClass("disabled")) return false;
    });
  },

  open: function () {
    cart.isOpen = true;

    site.lockForModal();
    TweenLite.to($(".block-cart"), 0.5, { autoAlpha: 1 });

    // -- ReSci / Tracking
    var items = [];
    if (cart.data && cart.data.item_count > 0) {
      _.each(cart.data.items, function (item) {
        items.push(item.product_id);
      });
    }
    tracking.shoppingCartView(items);
  },

  close: function () {
    cart.isOpen = false;

    site.unlockForModal();
    TweenLite.to($(".block-cart"), 0.5, { autoAlpha: 0 });
  },

  update: function () {
    $.ajax({
      url: "/cart.js",
      type: "GET",
      complete: function (response) {
        if (response.status == 200) {
          response = JSON.parse(response.responseText);

          cart.updateSymbol(response);
          cart.updateFull(response);

          if (window.cartPage) {
            intro.cancel = true;
            window.cartPage = false;

            cart.open();
          }
        }
      }
    });
  },

  updateSymbol: function (response) {
    cart.data = response;

    if (response.item_count > 0) {
      $(".header__carticon").addClass("header__carticon--filled");
      $(".header__carticon .count, .count__to__cart").html(response.item_count);
      $(".total__to__cart").html(
        "$" + utils.priceDecimals(response.total_price) + " USD"
      );
      if (response.item_count === 1) {
        $(".item__to__cart").html("Item");
      } else {
        $(".item__to__cart").html("Items");
      }
    } else {
      $(".header__carticon").removeClass("header__carticon--filled");
      $(".header__carticon .count, .count__to__cart").empty();
    }
  },

  updateFull: function (response) {
    cart.data = response;

    if (response.item_count > 0) {
      // -- Cart Header
      $(".block-cart__header h2").html(response.item_count + " item");
      if (response.item_count > 1) {
        $(".block-cart__header h2").append("s");
      }

      // -- Cart Items
      $(".block-cart__row--item").remove();
      _.each(response.items, function (item, index) {
        // console.log(item);
        var el = $(".block-cart__row.clone-template").clone();

        el.attr("data-id", item.product_id);
        el.attr("data-variantid", item.variant_id);
        el.attr("data-lineindex", index);
        el.attr("data-handle", item.handle);

        el.find("h1").html(item.product_title);

        var h2Label;
        if (item.handle == "mini-trio") {
          h2Label =
            item.properties.scent1 +
            ", " +
            item.properties.scent2 +
            ", " +
            item.properties.scent3;
          el.find("h2").html(h2Label);
        } else {
          h2Label = item.product_description;
          el.find("h2").html(h2Label);
        }

        var grams = item.grams;
        var oz = grams * 0.035274;
        oz = Math.round(oz * 10) / 10;
        // el.find(".block-cart__col")
        //   .eq(1)
        //   .html(oz + "oz / " + grams + "g. <br/>Natural Deodorant");

        el.find(".block-cart__qty__amount").html(item.quantity);

        el.find(".block-cart__itemprice").html(utils.priceDecimals(item.price));
        el.find(".block-cart__itemsubtotal").html(
          utils.priceDecimals(item.line_price)
        );

        $(".block-cart__content").append(el);
        el.addClass("block-cart__row--item");
        el.removeClass("clone-template");
      });

      // -- Cart Footer
      $(".block-cart__totals__subtotal").html(
        "$" + utils.priceDecimals(response.total_price) + " USD"
      );
      $(".block-cart__totals__total").html(
        "$" + utils.priceDecimals(response.total_price) + " USD"
      );
      $(".block-cart__checkout .btn__checkout").html(
        "Checkout $" + utils.priceDecimals(response.total_price)
      );
      $(".block-cart__checkout .btn__checkout").removeClass("disabled");
    } else {
      $(".block-cart__header h2").html("Your cart is empty");
      $(".block-cart__row--item").remove();

      // -- Cart Footer
      $(".block-cart__totals__subtotal").html("$0.00 USD");
      $(".block-cart__totals__total").html("$0.00 USD");
      $(".block-cart__checkout .btn__checkout").html("Checkout");
      $(".block-cart__checkout .btn__checkout").addClass("disabled");
    }
  },

  addItem: function (id, qty, properties, prodId) {
    var data = {
      quantity: qty,
      id: id
    };

    if (properties) {
      data.properties = properties;
    }

    $.ajax({
      url: "/cart/add.js",
      type: "POST",
      data: data,
      complete: function (response) {
        if (response.status == 200) {
          $(window).scrollTop(0);
          purchase.close();
          cart.update();
          cart.initCalloutAfterAdd();

          // -- ReSci / Tracking
          tracking.addToCart(prodId);
        }
      }
    });
  },

  adjustItem: function (id, qty) {
    $.ajax({
      url: "/cart/change.js",
      type: "POST",
      data: {
        quantity: qty,
        line: parseInt(id) + 1
      },
      complete: function (response) {
        if (response.status == 200) {
          cart.update();
        }
      }
    });
  },

  increaseQty: function (el) {
    var id = parseInt(el.attr("data-lineindex"));
    var qty = parseInt(el.find(".block-cart__qty__amount").html());

    cart.adjustItem(id, qty + 1);
  },

  decreaseQty: function (el) {
    var id = parseInt(el.attr("data-lineindex"));
    var qty = parseInt(el.find(".block-cart__qty__amount").html());

    cart.adjustItem(id, qty - 1);
  },

  removeItem: function (el) {
    var id = parseInt(el.attr("data-lineindex"));
    var qty = parseInt(el.find(".block-cart__qty__amount").html());

    cart.adjustItem(id, 0);
  },

  initCalloutAfterAdd: () => {
    $(
      ".header__to__cart, .header, .header-bg, .block-carousel__header"
    ).toggleClass("callout-active");
    $(".header__to__cart").toggleClass("visible");
    setTimeout(function () {
      $(
        ".header__to__cart, .header, .header-bg, .block-carousel__header"
      ).toggleClass("callout-active");
    }, 5000);
    setTimeout(function () {
      $(".header__to__cart").toggleClass("visible");
    }, 5400);
  }
};

var customers = {
  onSection: "profile",
  busy: false,

  init: function () {
    // -- Nav listeners
    $(".customers__nav__item").click(function () {
      if (!$(this).hasClass("active")) {
        if (!customers.busy) {
          customers.getSection($(this));
          customers.closeNav();
        }
      } else {
        customers.closeNav();
      }

      return false;
    });

    $(".customers__mobile__navtrigger").click(function () {
      customers.openNav();
      return false;
    });

    // -- Orders listeners
    if ($(".customers__orders").length) {
      $(
        ".customers__orders__item__link, .customers__orders__item__title"
      ).click(function () {
        customers.toggleOrder($(this));
        return false;
      });

      $(".customers__order__close").click(function () {
        customers.toggleOrder(
          $(this)
            .parent()
            .parent()
        );
        return false;
      });
    }

    // -- Addresses listeners
    if ($(".customers__addresses").length) {
      $(".address-edit-toggle").click(function () {
        var addr = $(this)
          .parent()
          .parent();

        if (!addr.hasClass("open")) {
          addr.addClass("open");
          $(this).html("Cancel");
        } else {
          addr.removeClass("open");
          $(this).html("Edit");
        }

        return false;
      });
    }

    // -- Check if not profile by default
    if ($('.customers__nav__item[href="#addresses"]').hasClass("active")) {
      customers.getSection($('.customers__nav__item[href="#addresses"]'));
    }

    // -- If on customer page set the nav highlight
    if ($(".customers").length) {
      $(".header__navitem__customers").addClass("active");
    }
  },

  getSection: function (target) {
    customers.busy = true;

    $(".customers__nav__item").removeClass("active");
    $(target).addClass("active");

    var newId = $(target)
      .attr("href")
      .substr(1);

    TweenLite.to($(".customers__" + customers.onSection), 0.2, {
      autoAlpha: 0,
      onComplete: function () {
        $(".customers__" + customers.onSection).css("display", "none");
        $(".customers__" + newId).css("display", "block");
        TweenLite.to($(".customers__" + newId), 0.2, {
          autoAlpha: 1,
          onComplete: function () {
            customers.onSection = newId;
            customers.busy = false;
          }
        });
      }
    });
  },

  closeNav: function () {
    $("html, body").removeClass("noscroll");
    $(".customers__nav").removeClass("open");
  },

  openNav: function () {
    $("html, body").addClass("noscroll");
    $(".customers__nav").addClass("open");
  },

  toggleOrder: function (target) {
    var order = $(target).parent();

    if (!order.hasClass("open")) {
      order.addClass("open");
      order.find(".customers__order").addClass("open");

      order.find(".more").css("display", "none");
      order.find(".less").css("display", "block");

      if (
        order.find(".customers__order").css("background-color") !=
        "rgb(242, 249, 245)"
      ) {
        // -- mobile check
        order.find(".customers__orders__item__brief").slideUp(400);
        TweenLite.to(order.find(".customers__orders__item__brief"), 0.4, {
          autoAlpha: 0
        });

        order.find(".customers__order").slideDown(400);
        TweenLite.to(order.find(".customers__order"), 0.4, { autoAlpha: 1 });
      } else {
        $("html, body").addClass("noscroll");
      }
    } else {
      order.removeClass("open");
      order.find(".customers__order").removeClass("open");

      order.find(".more").css("display", "block");
      order.find(".less").css("display", "none");

      if (
        order.find(".customers__order").css("background-color") !=
        "rgb(242, 249, 245)"
      ) {
        // -- mobile check
        order.find(".customers__orders__item__brief").slideDown(400);
        TweenLite.to(order.find(".customers__orders__item__brief"), 0.4, {
          autoAlpha: 1
        });

        order.find(".customers__order").slideUp(400);
        TweenLite.to(order.find(".customers__order"), 0.4, { autoAlpha: 0 });
      } else {
        $("html, body").addClass("noscroll");
      }
    }
  }
};

var footer = {
  activeSection: null,
  busy: false,
  menuOpen: false,
  activePage: "",

  init: function () {
    footer.addEventListeners();
    if (window.footerPage) {
      footer.activePage = window.location.pathname.split("/pages/")[1];
      footer.initHistory();
    }
  },

  addEventListeners: function () {
    $(".footer__link").click(function () {
      if (footer.busy) return;

      footer.open($(this).attr("href"));
      return false;
    });

    $(".block-footer__close").click(function () {
      footer.close();
      return false;
    });

    $(".block-footer__link").click(function () {
      if (!$(this).hasClass("active") && !footer.busy) {
        var id = $(this)
          .attr("href")
          .substr(1);
        footer.switchSections(id);
      }

      return false;
    });

    $(".block-footer__menu h1").click(function () {
      if (!footer.menuOpen) {
        footer.openMenu();
      } else {
        footer.closeMenu();
      }

      return false;
    });

    $(".btn__footer__email").click(function () {
      var ok = validator.checkEmail(".input__footer__email");

      if (ok) {
        tracking.emailCapture($(".input__footer__email").val(), "footer");

        $(".input__footer__email").attr(
          "placeholder",
          "Thank you for signing up."
        );
        $(".input__footer__email").val("");

        setTimeout(function () {
          $(".input__footer__email").attr("placeholder", "Email Address");
        }, 3500);
      }

      return false;
    });

    $(".input__footer__email").on("keyup", function (event) {
      if (event.keyCode == 13) {
        $(".btn__footer__email").trigger("click");
      }
    });
  },

  open: function (id) {
    footer.busy = true;

    // -- Set active
    $(".block-footer__link").removeClass("active");
    $('.block-footer__link[href="' + id + '"]').addClass("active");
    var label = $('.block-footer__link[href="' + id + '"]').html();
    $(".block-footer__menu h1 span").html(label);

    // -- Show requested section
    id = id.includes("#") ? id.substr(1) : id;
    footer.activeSection = id;
    $(".block-footer__section").css("display", "none");
    $(".block-footer__" + id).css("display", "block");

    if ($(".block-footer__menu").css("visibility") == "hidden") {
      // -- Position it
      var wH = $(window).height();
      var footerPos = $(".footer").offset().top;
      var scrollPos = $(window).scrollTop();
      var pos = Math.abs(footerPos - wH - scrollPos);
      pos = wH - pos;
      pos -= 30; // padding on block vs footer

      $(".block-footer").css("top", pos);

      // -- Show it
      $("html, body").addClass("noscroll");
      TweenLite.to($(".block-footer"), 0.5, { autoAlpha: 1 });
      TweenLite.to($(".block-footer"), 0.5, {
        delay: 0.5,
        top: 0,
        onComplete: function () {
          footer.busy = false;
        }
      });
      this.updateHistory();
    } else {
      $(".block-footer").css("top", 0);

      // -- Show it
      $("html, body").addClass("noscroll");
      TweenLite.to($(".block-footer"), 0.5, {
        delay: 0.01,
        autoAlpha: 1,
        onComplete: function () {
          footer.busy = false;
        }
      });
    }
  },

  close: function () {
    $("html, body").removeClass("noscroll");
    $(window).scrollTop(site.scrollTop);
    TweenLite.to($(".block-footer"), 0.5, { autoAlpha: 0 });
  },

  switchSections: function (id) {
    footer.busy = true;

    // -- Switch section panels
    TweenLite.to($(".block-footer__" + footer.activeSection), 0.2, {
      autoAlpha: 0,
      onComplete: function () {
        $(".block-footer__" + footer.activeSection).css("display", "none");
        $(".block-footer__" + id).css("display", "block");

        TweenLite.to($(".block-footer__" + id), 0.35, {
          autoAlpha: 1,
          onComplete: function () {
            footer.activeSection = id;
            footer.busy = false;
            footer.updateHistory();
          }
        });
      }
    });

    // -- Adjust higlight
    $(".block-footer__link").removeClass("active");
    $('.block-footer__link[href="#' + id + '"]').addClass("active");
    var label = $('.block-footer__link[href="#' + id + '"]').html();
    $(".block-footer__menu h1 span").html(label);

    // -- Close menu
    if (footer.menuOpen) footer.closeMenu();
  },

  openMenu: function () {
    footer.menuOpen = true;

    $(".block-footer__menu__links__wrapper").slideDown(400);
  },

  closeMenu: function () {
    footer.menuOpen = false;

    $(".block-footer__menu__links__wrapper").slideUp(400);
  },
  initHistory: function () {
    var activePage = footer.activePage;
    footer.open(activePage);
  },
  updateHistory: function () {
    var activePage = footer.activeSection;
    history.pushState(activePage, null, "/pages/" + activePage);
  }
};

var tracking = {
  rsqActive: true,
  verbose: true,

  init: function () {
    window._rsq = [];
    if (tracking.rsqActive) tracking.initRSQ();
  },

  initRSQ: function () {
    var _rsq = window._rsq || [];

    // -- Setup
    _rsq.push(["_setSiteId", "544"]); // TODO: replace site_id with your static Site ID
    _rsq.push(["_enableOnsite"]);

    var id = $("body").attr("data-customer");
    if (id && id.length > 0) {
      _rsq.push(["_setUserId", id]);
      _rsq.push(["_setUserEmail", $("body").attr("data-customer-email")]);
    }

    _rsq.push(["_track"]);

    // -- Wave callback
    (function () {
      var rScix = document.createElement("script");
      rScix.type = "text/javascript";
      rScix.async = true;
      rScix.src =
        ("https:" == document.location.protocol ? "https://" : "http://") +
        "d1stxfv94hrhia.cloudfront.net/waves/v2/w.js";
      (
        document.getElementsByTagName("head")[0] ||
        document.getElementsByTagName("body")[0]
      ).appendChild(rScix);
    })();
  },

  itemPageView: function (id) {
    var _rsq = window._rsq || [];

    _rsq.push(["_addItem", { id: id }]);
    _rsq.push(["_track"]);

    if (!tracking.verbose) return;

    // console.log("// -- Tracking: itemPageView()");
    // console.log(_rsq);
  },

  addToCart: function (id) {
    var _rsq = window._rsq || [];

    _rsq.push(["_addItem", { id: id }]);
    _rsq.push(["_setAction", "shopping_cart"]);
    _rsq.push(["_track"]);

    if (!tracking.verbose) return;

    // console.log("// -- Tracking: addToCart()");
    // console.log(_rsq);
  },

  shoppingCartView: function (items) {
    var _rsq = window._rsq || [];

    _.each(items, function (id) {
      _rsq.push(["_addItem", { id: id }]);
    });

    _rsq.push(["_setAction", "shopping_cart"]);
    _rsq.push(["_track"]);

    if (!tracking.verbose) return;

    // console.log("// -- Tracking: shoppingCartView()");
    // console.log(_rsq);
  },

  emailCapture: function (email, fullname, source) {
    var _rsq = window._rsq || [];

    _rsq.push(["_setUserEmail", email]);

    if (fullname) {
      _rsq.push([
        "_setUserProperties",
        {
          record_id: "db-user-id",
          email: email,
          registration_source: source,
          full_name: fullname
        }
      ]);
    } else {
      _rsq.push([
        "_setUserProperties",
        { record_id: "db-user-id", email: email, registration_source: source }
      ]);
    }

    _rsq.push(["_setAction", "email_entered"]);
    _rsq.push(["_track"]);

    if (!tracking.verbose) return;

    // console.log("// -- Tracking: emailCapture()");
    // console.log(_rsq);
  }
};

var utils = {
  isScrolledIntoView: function (el, fullView, padding) {
    var padding = padding || 0;
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    if (fullView) {
      return elemTop >= 0 && elemBottom <= window.innerHeight;
    } else {
      return elemTop < window.innerHeight - padding;
    }
  },

  isAtTopOfView: function (el, padding) {
    var padding = padding || 0;
    var elemTop = el.getBoundingClientRect().top;

    return elemTop <= 0 + padding;
  },

  priceNoDecimals: function (price) {
    // 22.00

    price = "" + price;
    return price.split(".")[0];
  },

  priceDecimals: function (price) {
    // 2200

    price = "" + price;
    var base = price.slice(0, -2);
    var decimals = price.slice(-2);
    return base + "." + decimals;
  },

  setCookie: function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },

  getCookie: function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
};

var validator = {
  clearErrors: function (form) {
    $("" + form)
      .find(".error")
      .each(function (index, el) {
        $(el).removeClass("error");
      });
  },

  checkBlanks: function (fields, nextlevel) {
    var status = true;
    _.each(fields, function (fieldItem) {
      var field = fieldItem.id;
      var msg = fieldItem.msg;

      if ($("" + field).val() !== "" && $("" + field).val().length > 0) {
        $("" + field)
          .parent()
          .removeClass("error");

        if (nextlevel) {
          $("" + field)
            .parent()
            .parent()
            .removeClass("error");
        }
      } else {
        $("" + field)
          .parent()
          .addClass("error");

        if (nextlevel) {
          $("" + field)
            .parent()
            .parent()
            .addClass("error");
        }

        if (msg.length > 0) {
          $("" + field).val("");
          $("" + field).attr("placeholder", msg);
        }

        status = false;
      }
    });

    return status;
  },

  checkBlankSimple: function (field) {
    if ($("" + field).val() !== "" && $("" + field).val().length > 0) {
      return true;
    } else {
      return false;
    }
  },

  checkEmail: function (field) {
    var email = $("" + field).val();
    var x = email;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
      $("" + field)
        .parent()
        .addClass("error");
      if (email !== "") {
        //$(''+field).attr('placeholder', 'Please enter a valid email address');
      }
      $("" + field).val("");

      return false;
    }

    $("" + field)
      .parent()
      .removeClass("error");
    return true;
  },

  checkEmailSimple: function (field) {
    var email = $("" + field).val();
    var x = email;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
      return false;
    }

    return true;
  },

  matchFields: function (fields, minLength) {
    var status = true;

    var val1 = $("" + fields[0]).val();
    var val2 = $("" + fields[1]).val();

    if (val1 != val2) {
      status = false;
    } else {
      _.each(fields, function (field) {
        if ($("" + field).val().length < length) {
          status = false;
        }
      });
    }

    if (status) {
      $("" + fields[0])
        .parent()
        .removeClass("error");
      $("" + fields[1])
        .parent()
        .removeClass("error");
    } else {
      $("" + fields[0])
        .parent()
        .addClass("error");
      $("" + fields[1])
        .parent()
        .addClass("error");
    }

    return status;
  },

  passwordCheck: function (fields, minLength) {
    var status = true;
    var setText = false;

    var val1 = $("" + fields[0]).val();
    var val2 = $("" + fields[1]).val();

    if (val1 != val2) {
      status = false;
      setText = true;

      $("" + fields[0]).val("");
      $("" + fields[1]).val("");
      $("" + fields[0]).attr("placeholder", "Passwords must match");
      $("" + fields[1]).attr("placeholder", "Passwords must match");
    } else {
      _.each(fields, function (field) {
        if ($("" + field).val().length < minLength) {
          status = false;
        }
      });

      if (!status) {
        setText = true;
        $("" + fields[0]).val("");
        $("" + fields[1]).val("");
        $("" + fields[0]).attr(
          "placeholder",
          "Passwords must be at least " + minLength + " characters"
        );
        $("" + fields[1]).attr(
          "placeholder",
          "Passwords must be at least " + minLength + " characters"
        );
      }
    }

    if (status) {
      $("" + fields[0])
        .parent()
        .removeClass("error");
      $("" + fields[1])
        .parent()
        .removeClass("error");
    } else {
      $("" + fields[0])
        .parent()
        .addClass("error");
      $("" + fields[1])
        .parent()
        .addClass("error");

      if (!setText) {
        $("" + fields[0]).val("");
        $("" + fields[0]).attr("placeholder", "Please enter a password");

        $("" + fields[1]).val("");
        $("" + fields[1]).attr("placeholder", "Please confirm your password");
      }
    }

    return status;
  },

  minLength: function (fields, length) {
    var status = true;
    _.each(fields, function (field) {
      if ($("" + field).val().length < length) {
        $("" + field)
          .parent()
          .addClass("error");
        status = false;
      } else {
        $("" + field)
          .parent()
          .removeClass("error");
      }
    });

    return status;
  },

  isLength: function (fields, length) {
    var status = true;
    _.each(fields, function (field) {
      if ($("" + field).val().length != length) {
        $("" + field)
          .parent()
          .addClass("error");
        status = false;
      } else {
        $("" + field)
          .parent()
          .removeClass("error");
      }
    });

    return status;
  },

  isChecked: function (fields) {
    var status = true;
    _.each(fields, function (field) {
      if (!$("" + field).is(":checked")) {
        $("" + field)
          .parent()
          .addClass("error");
        status = false;
      } else {
        $("" + field)
          .parent()
          .removeClass("error");
      }
    });

    return status;
  },

  maxWords: function (fields, length) {
    var status = true;
    _.each(fields, function (field) {
      var value = $("" + field).val();
      var regex = /\s+/gi;
      count = value
        .trim()
        .replace(regex, " ")
        .split(" ").length;

      if (count > length) {
        $("" + field)
          .parent()
          .addClass("error");
        status = false;
      } else {
        $("" + field)
          .parent()
          .removeClass("error");
      }
    });

    return status;
  }
};

var passwords = {
  
  init: function () {
    passwords.toggleShowPasswords();
  },

  toggleShowPasswords: function() {
    $(".toggle__password").click(function () {

      $(this).toggleClass("hide-password show-password");

      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
        if($(this).hasClass('hide-password')) {
          $(this).text('Hide');
        }
      } else {
        input.attr("type", "password");
        if ($(this).hasClass('show-password')) {
          $(this).text('Show');
        }
      }
    });
  }
};
