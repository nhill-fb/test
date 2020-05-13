export const handleize = name => {
  return name.toLowerCase().replace(/\'/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .replace(/\-{2,}/g, '-');
}

export const getQueryString = () => {
  var qs = window.location.search.substr(1).split("&");
  var res = {};
  $(qs).each(function(i, s) {
    var split = s.split("=")
    res[split[0]] = split[1];
  });
  return res; 
}

export const animationEnd = (function(el) {
  var animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement('div'));



function removeProtocol(path) {
  return path.replace(/http(s)?:/, '');
}

export const noImageSrc = "https://cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c.gif";

/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */
export const getSizedImageUrl = (src, size) => {
  if (size === null) {
    return src;
  }

  if (size === 'master') {
    return removeProtocol(src);
  }

  if(!src)
    return noImageSrc;

  const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

  if (match) {
    const prefix = src.split(match[0]);
    const suffix = match[0];

    return removeProtocol(prefix[0] + '_' + size + suffix);
  } else {
    return null;
  }
}

// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
  var timeout;

  // This is the function that is actually executed when
  // the DOM event is triggered.
  return function executedFunction() {
    // Store the context of this and any
    // parameters passed to executedFunction
    var context = this;
    var args = arguments;
	    
    // The function to be called after 
    // the debounce time has elapsed
    var later = function() {
      // null timeout to indicate the debounce ended
      timeout = null;
	    
      // Call function now if you did not on the leading end
      if (!immediate) func.apply(context, args);
    };

    // Determine if you should call the function
    // on the leading or trail end
    var callNow = immediate && !timeout;
	
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the 
    // inside of the previous setTimeout  
    clearTimeout(timeout);
	
    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs node)
    timeout = setTimeout(later, wait);
	
    // Call immediately if you're dong a leading
    // end execution
    if (callNow) func.apply(context, args);
  };
};
