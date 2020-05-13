import Vue from 'vue';

document.querySelectorAll(".vue-accounts").forEach(el => {
  new Vue({
    el: el,
    delimiters: ['${', '}'], // This is important to not cause liquid errors with {{ ... }}
    data: {
      recoverPass: {
        isVisible: false
      },
      login: {
        isVisible: true
      },
      addresses: {
        newFormVisible: false,
        formId: 0
      }
    },
    created() {
      var hash = window.location.hash;

      // Allow deep linking to recover password form
      if (hash === '#recover') {
        this.recoverPass.isVisible = true;
        this.login.isVisible = false;
      }

      $(function() {
        var $newAddressForm = $('#AddressNewForm');

        // Initialize observers on address selectors, defined in shopify_common.js
        if ($newAddressForm.length && Shopify) {
          new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
            hideElement: 'AddressProvinceContainerNew'
          });
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
        }
      })    

    },
    methods: {
      toggleRecover() {
        this.recoverPass.isVisible = !this.recoverPass.isVisible;
        this.login.isVisible = !this.login.isVisible;
      },
      deleteAddress(formId, confirmMessage) {
        if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
          Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
        }
      },
      countryChanged(formId) {
        var countrySelector = 'AddressCountry_' + formId;
        var provinceSelector = 'AddressProvince_' + formId;
        var containerSelector = 'AddressProvinceContainer_' + formId;

        if(Shopify) {
          new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
            hideElement: containerSelector
          });
        }
      }
    }
  })
})
