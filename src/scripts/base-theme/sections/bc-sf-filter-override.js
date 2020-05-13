import store from '../store';

if(window.BCSfFilter) {
  window.BCSfFilter.prototype.buildProductGridItem = function(data, index) {
    return '';
  }
  window.BCSfFilter.prototype.buildProductListItem = function(data) {
    return '';
  }

  const before = window.BCSfFilter.prototype.buildProductList;
  window.BCSfFilter.prototype.buildProductList = function(a,b) {
    if(b == "page" && this.getSettingValue('general.paginationType') == "default") {
      //scroll to top
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }

    before.call(this, a, b);

    if(b != "page" || (b == "page" && this.getSettingValue('general.paginationType') == "default"))
      store.dispatch('products/setProducts', {products: []})
    
    store.dispatch('products/concatProducts', {products: a});
  }

  window.onSelectFilterOptionItem = function(a, b) {
    jQ(b).data("count") > 0 && (bcsffilter.selectFilter = !0,
    jQ(b).hasClass("selected") ? jQ(b).parent().children().removeClass("selected") : jQ(b).parent().children().addClass("selected"))

    var e = jQ(b).parents('.'+bcsffilter.class.filterOption)
      , f = e.data("type")
      , g = e.data("display-type")
      , h = e.data("select-type")
      , i = e.attr("data-id")
      , j = e.find('.selected.' + bcsffilter.class.filterOptionItem).map(function(i, item) {
        return $(item).data("value");
      }).toArray()
      , k = bcsffilter.buildSubmitLink(i, j, f, g, h);
    bcsffilter.internalClick = !0,
    bcsffilter.onChangeData(k, f, j, i);
  }
}
