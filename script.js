function debounce(func, threshold, callImmediately) {
  var timeout = void 0;

  return function () {
    var obj = this;
    var args = arguments;

    function delayed() {
      timeout = null;
      if (!callImmediately) func.apply(obj, args);
    }

    var callNow = callImmediately && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(delayed, threshold);

    if (callNow) {
      func.apply(obj, args);
    }
  };
}
