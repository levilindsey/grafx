/**
 * This module defines a collection of static general utility functions.
 */

// TODO: This should be set from somewhere else (probably as a param to controller like before; but then I need to make this updatable)
const isInDevMode = true;

/**
 * Adds an event listener for each of the given events to each of the given elements.
 *
 * @param {Array.<HTMLElement>} elements The elements to add event listeners to.
 * @param {Array.<String>} events The event listeners to add to the elements.
 * @param {Function} callback The single callback for handling the events.
 */
function listenToMultipleForMultiple(elements, events, callback) {
  elements.forEach(element => {
    events.forEach(event => {
      element.addEventListener(event, callback, false);
    });
  });
}

/**
 * Creates a DOM element with the given tag name, appends it to the given parent element, and
 * gives it the given id and classes.
 *
 * @param {string} tagName The tag name to give the new element.
 * @param {HTMLElement} [parent] The parent element to append the new element to.
 * @param {string} [id] The id to give the new element.
 * @param {Array.<String>} [classes] The classes to give the new element.
 * @returns {HTMLElement} The new element.
 */
function createElement(tagName, parent, id, classes) {
  const element = document.createElement(tagName);
  if (parent) {
    parent.appendChild(element);
  }
  if (id) {
    element.id = id;
  }
  if (classes) {
    classes.forEach(className => addClass(element, className));
  }
  return element;
}

/**
 * Determines whether the given element contains the given class.
 *
 * @param {HTMLElement} element The element to check.
 * @param {string} className The class to check for.
 * @returns {boolean} True if the element does contain the class.
 */
function containsClass(element, className) {
  let startIndex;
  let indexAfterEnd;
  startIndex = element.className.indexOf(className);
  if (startIndex >= 0) {
    if (startIndex === 0 || element.className[startIndex - 1] === ' ') {
      indexAfterEnd = startIndex + className.length;
      if (indexAfterEnd === element.className.length ||
        element.className[indexAfterEnd] === ' ') {
        return true;
      }
    }
  }
  return false;
}

/**
 * Toggles whether the given element has the given class. If the enabled argument is given, then
 * the inclusion of the class will be forced. That is, if enabled=true, then this will ensure the
 * element has the class; if enabled=false, then this will ensure the element does NOT have the
 * class; if enabled=undefined, then this will simply toggle whether the element has the class.
 *
 * @param {HTMLElement} element The element to add the class to or remove the class from.
 * @param {string} className The class to add or remove.
 * @param {boolean} [enabled] If given, then the inclusion of the class will be forced.
 */
function toggleClass(element, className, enabled) {
  if (typeof enabled === 'undefined') {
    if (containsClass(element, className)) {
      removeClass(element, className);
    }
    else {
      addClass(element, className);
    }
  }
  else if (enabled) {
    addClass(element, className);
  }
  else {
    removeClass(element, className);
  }
}

/**
 * Gets the coordinates of the element relative to the top-left corner of the page.
 *
 * @param {HTMLElement} element The element to get the coordinates of.
 * @returns {{x: Number, y: Number}} The coordinates of the element relative to the top-left
 * corner of the page.
 */
function getPageOffset(element) {
  let x = 0;
  let y = 0;
  while (element) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  }
  x -= document.documentElement.scrollLeft;
  y -= document.documentElement.scrollTop;
  return { x: x, y: y };
}

/**
 * Gets the dimensions of the viewport.
 *
 * @returns {{w: Number, h: Number}} The dimensions of the viewport.
 */
function getViewportSize() {
  let w;
  let h;
  if (typeof window.innerWidth !== 'undefined') {
    // Good browsers
    w = window.innerWidth;
    h = window.innerHeight;
  }
  else if (typeof document.documentElement !== 'undefined' &&
    typeof document.documentElement.clientWidth !== 'undefined' &&
    document.documentElement.clientWidth !== 0) {
    // IE6 in standards compliant mode
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;
  }
  else {
    // Older versions of IE
    w = document.getElementsByTagName('body')[0].clientWidth;
    h = document.getElementsByTagName('body')[0].clientHeight;
  }
  return { w: w, h: h };
}

/**
 * Removes the given child element from the given parent element if the child does indeed belong
 * to the parent.
 *
 * @param {HTMLElement} parent The parent to remove the child from.
 * @param {HTMLElement} child The child to remove.
 * @returns {boolean} True if the child did indeed belong to the parent.
 */
function removeChildIfPresent(parent, child) {
  if (child && child.parentNode === parent) {
    parent.removeChild(child);
    return true;
  }
  return false;
}

/**
 * Adds the given class to the given element.
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
function addClass(element, className) {
  element.setAttribute('class', element.className + ' ' + className);
}

/**
 * Removes the given class from the given element.
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
function removeClass(element, className) {
  element.setAttribute('class',
    element.className
    .split(' ')
    .filter(value => value !== className)
    .join(' '));
}

/**
 * Removes all classes from the given element.
 *
 * @param {HTMLElement} element The element to remove all classes from.
 */
function clearClasses(element) {
  element.className = '';
}

/**
 * Calculates the width that the DOM would give to a div with the given text. The given tag
 * name, parent, id, and classes allow the width to be affected by various CSS rules.
 *
 * @param {string} text The text to determine the width of.
 * @param {string} tagName The tag name this text would supposedly have.
 * @param {HTMLElement} [parent] The parent this text would supposedly be a child of; defaults
 * to the document body.
 * @param {string} [id] The id this text would supposedly have.
 * @param {Array.<String>} [classes] The classes this text would supposedly have.
 * @returns {number} The width of the text under these conditions.
 */
function getTextWidth(text, tagName, parent, id, classes) {
  let tmpElement;
  let width;
  parent = parent || document.getElementsByTagName('body')[0];
  tmpElement = createElement(tagName, null, id, classes);
  tmpElement.style.position = 'absolute';
  tmpElement.style.visibility = 'hidden';
  tmpElement.style.whiteSpace = 'nowrap';
  parent.appendChild(tmpElement);
  tmpElement.innerHTML = text;
  width = tmpElement.clientWidth;
  parent.removeChild(tmpElement);
  return width;
}

/**
 * Encodes and concatenates the given URL parameters into a single query string.
 *
 * @param {Object} rawParams An object whose properties represent the URL query string
 * parameters.
 * @returns {string} The query string.
 */
function encodeQueryString(rawParams) {
  let parameter;
  let encodedParams;
  encodedParams = [];
  for (parameter in rawParams) {
    if (rawParams.hasOwnProperty(parameter)) {
      encodedParams.push(encodeURIComponent(parameter) + '=' +
        encodeURIComponent(rawParams[parameter]));
    }
  }
  return '?' + encodedParams.join('&');
}

/**
 * Retrieves the value corresponding to the given name from the given query string.
 *
 * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
 *
 * @param {string} queryString The query string containing the parameter.
 * @param {string} name The (non-encoded) name of the parameter value to retrieve.
 * @returns {string} The query string parameter value, or null if the parameter was not found.
 */
function getQueryStringParameterValue(queryString, name) {
  let regex;
  let results;
  name = encodeURIComponent(name);
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
  results = regex.exec(queryString);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Sets the CSS transition style of the given element.
 *
 * @param {HTMLElement} element The element.
 * @param {number} value The transition string.
 */
function setTransition(element, value) {
  element.style.transition = value;
  element.style.WebkitTransition = value;
  element.style.MozTransition = value;
  element.style.msTransition = value;
  element.style.OTransition = value;
}

/**
 * Sets the CSS transition duration style of the given element.
 *
 * @param {HTMLElement} element The element.
 * @param {number} value The duration.
 */
function setTransitionDurationSeconds(element, value) {
  element.style.transitionDuration = value + 's';
  element.style.WebkitTransitionDuration = value + 's';
  element.style.MozTransitionDuration = value + 's';
  element.style.msTransitionDuration = value + 's';
  element.style.OTransitionDuration = value + 's';
}

/**
 * Sets the CSS transition delay style of the given element.
 *
 * @param {HTMLElement} element The element.
 * @param {number} value The delay.
 */
function setTransitionDelaySeconds(element, value) {
  element.style.transitionDelay = value + 's';
  element.style.WebkitTransitionDelay = value + 's';
  element.style.MozTransitionDelay = value + 's';
  element.style.msTransitionDelay = value + 's';
  element.style.OTransitionDelay = value + 's';
}

/**
 * Sets the userSelect style of the given element to 'none'.
 *
 * @param {HTMLElement} element
 */
function setUserSelectNone(element) {
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';
  element.style.MozUserSelect = 'none';
  element.style.msUserSelect = 'none';
}

/**
 * Removes any children elements from the given parent that have the given class.
 *
 * @param {HTMLElement} parent The parent to remove children from.
 * @param {string} className The class to match.
 */
function removeChildrenWithClass(parent, className) {
  let matchingChildren = parent.querySelectorAll('.' + className);

  for (let i = 0, count = matchingChildren.length; i < count; i++) {
    parent.removeChild(matchingChildren[i]);
  }
}

/**
 * Sets the CSS transition-timing-function style of the given element with the given cubic-
 * bezier points.
 *
 * @param {HTMLElement} element The element.
 * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
 * points to use for this timing function.
 */
function setTransitionCubicBezierTimingFunction(element, bezierPts) {
  const value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' +
    bezierPts.p2y + ')';
  element.style.transitionTimingFunction = value;
  element.style.WebkitTransitionTimingFunction = value;
  element.style.MozTransitionTimingFunction = value;
  element.style.msTransitionTimingFunction = value;
  element.style.OTransitionTimingFunction = value;
}

// A collection of different types of easing functions.
const easingFunctions = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => 1 + --t * t * t,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
};

// A collection of the inverses of different types of easing functions.
const inverseEasingFunctions = {
  linear: t => t,
  easeInQuad: t => Math.sqrt(t),
  easeOutQuad: t => 1 - Math.sqrt(1 - t),
  easeInOutQuad: t => t < 0.5 ? Math.sqrt(t * 0.5) : 1 - 0.70710678 * Math.sqrt(1 - t)
};

/**
 * Calculates the x and y coordinates represented by the given Bezier curve at the given
 * percentage.
 *
 * @param {number} percent Expressed as a number between 0 and 1.
 * @param {Array.<{x:Number,y:Number}>} controlPoints
 * @returns {{x:Number,y:Number}}
 */
function getXYFromPercentWithBezier(percent, controlPoints) {
  let x;
  let y;
  let oneMinusPercent;
  let tmp1;
  let tmp2;
  let tmp3;
  let tmp4;

  oneMinusPercent = 1 - percent;
  tmp1 = oneMinusPercent * oneMinusPercent * oneMinusPercent;
  tmp2 = 3 * percent * oneMinusPercent * oneMinusPercent;
  tmp3 = 3 * percent * percent * oneMinusPercent;
  tmp4 = percent * percent * percent;

  x = controlPoints[0].x * tmp1 +
    controlPoints[1].x * tmp2 +
    controlPoints[2].x * tmp3 +
    controlPoints[3].x * tmp4;
  y = controlPoints[0].y * tmp1 +
    controlPoints[1].y * tmp2 +
    controlPoints[2].y * tmp3 +
    controlPoints[3].y * tmp4;

  return { x: x, y: y };
}

/**
 * Applies the given transform to the given element as a CSS style in a cross-browser compatible
 * manner.
 *
 * @param {HTMLElement} element
 * @param {string} transform
 */
function setTransform(element, transform) {
  element.style.webkitTransform = transform;
  element.style.MozTransform = transform;
  element.style.msTransform = transform;
  element.style.OTransform = transform;
  element.style.transform = transform;
}

/**
 * Returns a copy of the given array with its contents re-arranged in a random order.
 *
 * The original array is left in its original order.
 *
 * @param {Array} array
 * @returns {Array}
 */
function shuffle(array) {
  let i;
  let j;
  let count;
  let temp;

  for (i = 0, count = array.length; i < count; i++) {
    j = parseInt(Math.random() * count);
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
}

/**
 * Performs a shallow copy of the given object.
 *
 * This only copies enumerable properties.
 *
 * @param {Object} object
 * @returns {Object}
 */
function shallowCopy(object) {
  if (typeof object === 'object') {
    const cloneObject = {};

    Object.keys(object)
      .forEach(key => cloneObject[key] = object[key]);

    return cloneObject;
  }
  else {
    return object;
  }
}

/**
 * Performs a deep copy of the given object.
 *
 * This only copies enumerable properties.
 *
 * @param {Object} object
 * @returns {Object}
 */
function deepCopy(object) {
  if (typeof object === 'object') {
    // Hack: Not a robust copy policy
    let cloneObject;
    if (object instanceof Array) {
      cloneObject = [];
    }
    else {
      cloneObject = {};
    }

    Object.keys(object)
      .forEach(key => cloneObject[key] = deepCopy(object[key]));

    return cloneObject;
  }
  else {
    return object;
  }
}

/**
 * Converts the given HSL color values to HSV color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * @param {HslColor} hsl
 * @returns {{h:Number,s:Number,v:Number}}
 */
function hslToHsv(hsl) {
  const temp = hsl.s * (hsl.l < 0.5 ? hsl.l : 1 - hsl.l);
  return {
    h: hsl.h,
    s: 2 * temp / (hsl.l + temp),
    v: hsl.l + temp
  };
}

/**
 * Converts the given HSV color values to HSL color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * @param {{h:Number,s:Number,v:Number}} hsv
 * @returns {HslColor}
 */
function hsvToHsl(hsv) {
  const temp = (2 - hsv.s) * hsv.v;
  return {
    h: hsv.h,
    s: hsv.s * hsv.v / (temp < 1 ? temp : 2.00000001 - temp),
    l: temp * 0.5
  };
}

/**
 * Converts the given HSL color values to RGB color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * Originally adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *
 * @param {HslColor} hsl
 * @returns {RgbColor} rgb
 */
function hslToRgb(hsl) {
  let r;
  let g;
  let b;

  if (hsl.s === 0) {
    // Achromatic.
    r = hsl.l;
    g = hsl.l;
    b = hsl.l;
  }
  else {
    const q = hsl.l < 0.5 ?
      hsl.l * (1 + hsl.s) :
      hsl.l + hsl.s - hsl.l * hsl.s;
    const p = 2 * hsl.l - q;

    r = _hue2Rgb(p, q, hsl.h + 1 / 3);
    g = _hue2Rgb(p, q, hsl.h);
    b = _hue2Rgb(p, q, hsl.h - 1 / 3);
  }

  return {
    r: r,
    g: g,
    b: b
  };
}

function _hue2Rgb(p, q, t) {
  if (t < 0) {
    t++;
  }
  else if (t > 1) {
    t--;
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  else if (t < 1 / 2) {
    return q;
  }
  else if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  else {
    return p;
  }
}

/**
 * Converts the given RGB color values to HSL color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * Originally adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *
 * @param {{r:Number,g:Number,b:Number}} rgb
 * @returns {HslColor} hsl
 */
function rgbToHsl(rgb) {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    // Achromatic.
    h = 0;
    s = 0;
  }
  else {
    const d = max - min;
    s = l > 0.5 ?
      d / (2 - max - min) :
      d / (max + min);

    switch (max) {
      case rgb.r:
        h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
        break;
      case rgb.g:
        h = (rgb.b - rgb.r) / d + 2;
        break;
      case rgb.b:
        h = (rgb.r - rgb.g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l
  };
}

/**
 * Creates a valid color string to assign to a CSS property from the given h/s/l color values.
 *
 * Given values should be in the range of [0,1].
 *
 * @param {HslColor} hsl
 * @returns {string}
 */
function createHslColorString(hsl) {
  return typeof hsl.a !== 'undefined' ?
    `hsla(${hsl.h * 360},${hsl.s * 100}%,${hsl.l * 100}%,${hsl.a})` :
    `hsl(${hsl.h * 360},${hsl.s * 100}%,${hsl.l * 100}%)`;
}

/**
 * Checks the given element and all of its ancestors, and returns the first that contains the
 * given class.
 *
 * @param {?HTMLElement} element
 * @param {string} className
 * @returns {?HTMLElement}
 */
function findClassInSelfOrAncestors(element, className) {
  while (element) {
    if (containsClass(element, className)) {
      return element;
    }
  }

  return null;
}

let utilStyleSheet;

/**
 * Adds the given style rule to a style sheet for the current document.
 *
 * @param {string} styleRule
 */
function addRuleToStyleSheet(styleRule) {
  // Create the custom style sheet if it doesn't already exist
  if (!utilStyleSheet) {
    utilStyleSheet = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(utilStyleSheet);
  }

  // Add the given rule to the custom style sheet
  if (utilStyleSheet.styleSheet) {
    utilStyleSheet.styleSheet.cssText = styleRule;
  }
  else {
    utilStyleSheet.appendChild(document.createTextNode(styleRule));
  }
}

function checkForSafari() {
  return /Safari/i.test(window.navigator.userAgent) && !/Chrome/i.test(window.navigator.userAgent);
}

function checkForIos() {
  return /iPhone|iPod|iPad/i.test(window.navigator.userAgent);
}

/**
 * Returns a debounced version of the given function.
 *
 * Even if the debounced function is invoked many times, the wrapped function will only be invoked
 * after the given delay has ellapsed since the last invocation.
 *
 * If isInvokedImmediately is true, then the wrapped function will be triggered at the start of the
 * invocation group rather than at the end.
 *
 * @param {Function} wrappedFunction
 * @param {number} delay In milliseconds.
 * @param {boolean} [isInvokedImmediately=false]
 * @returns {Function}
 */
function debounce(wrappedFunction, delay, isInvokedImmediately = false) {
  let timeoutId;

  return () => {
    // Save the context and arguments passed from the client (this will use the values from the
    // first invocation of the invocation group.
    const context = this;
    const args = arguments;

    // Invoke immediately only if this is the first invocation of a group.
    if (isInvokedImmediately && !timeoutId) {
      wrappedFunction.apply(context, args);
    }

    // Reset the delay.
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // The invocation group has ended.
      timeoutId = null;
      if (!isInvokedImmediately) {
        wrappedFunction.apply(context, args);
      }
    }, delay);
  };
}

/**
 * Returns a throttled version of the given function.
 *
 * Even if the throttled function is invoked many times, the wrapped function will only be invoked
 * at each interval of the given delay. After the throttled function stops being invoked, then
 * wrapped function will also stop being invoked.
 *
 * If isInvokedImmediately is true, then the wrapped function will be triggered at the start of the
 * invocation delay rather than at the end.
 *
 * @param {Function} wrappedFunction
 * @param {number} delay In milliseconds.
 * @param {boolean} [isInvokedImmediately=false]
 * @returns {Function}
 */
function throttle(wrappedFunction, delay, isInvokedImmediately = false) {
  let timeoutId;

  return () => {
    // Save the context and arguments passed from the client (this will use the values from the
    // first invocation of the invocation group.
    const context = this;
    const args = arguments;

    // Only trigger a new invocation group if we are not already/still waiting on the delay from a
    // previous invocation.
    if (!timeoutId) {
      if (isInvokedImmediately) {
        wrappedFunction.apply(context, args);
      }

      // Start the delay.
      timeoutId = setTimeout(() => {
        // The invocation group has ended.
        timeoutId = null;
        if (!isInvokedImmediately) {
          wrappedFunction.apply(context, args);
        }
      }, delay);
    }
  };
}

/**
 * @param {Array.<*>|String} array
 * @param {*} delimiter
 * @returns {Array.<*>}
 * @private
 */
function _interleave(array, delimiter) {
  const result = new Array(array.length * 2 - 1);
  if (array.length) {
    result.push(array[0]);
  }
  for (let i = 1, count = array.length; i < count; i++) {
    result.push(delimiter);
    result.push(array[i]);
  }
  return result;
}

/**
 * Loads the given src for the given image.
 *
 * @param {HTMLImageElement} image
 * @param {string} src
 * @returns {Promise.<HTMLImageElement, Error>}
 */
function loadImageSrc(image, src) {
  return new Promise((resolve, reject) => {
    console.debug(`Loading image: ${src}`);

    image.addEventListener('load', _ => resolve(image));
    image.addEventListener('error', reject);
    image.addEventListener('abort', reject);

    image.src = src;
  });
}

/**
 * Loads text from the given URL.
 *
 * @param {string} url
 * @returns {Promise.<String, Error>}
 */
function loadText(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', _ => resolve(xhr.response));
    xhr.addEventListener('error', reject);
    xhr.addEventListener('abort', reject);

    console.debug(`Loading text: ${url}`);

    xhr.open('GET', url);
    xhr.send();
  });
}

/**
 * Loads a JSON object from the given URL.
 *
 * @param {string} url
 * @returns {Promise.<Object, Error>}
 */
function loadJson(url) {
  return loadText(url).then(jsonText => JSON.parse(jsonText));
}

/**
 * Gets the current stack trace.
 *
 * @returns {string}
 */
function getStackTrace() {
  return new Error().stack;
}

/**
 * Freezes the given object and recursively freezes all of its properties.
 *
 * @param {Object} object
 */
function deepFreeze(object) {
  if (typeof object === 'object') {
    Object.freeze(object);
    Object.keys(object).forEach(key => deepFreeze(object[key]));
  }
}

/**
 * Creates a GUID.
 *
 * GUID specification: http://www.ietf.org/rfc/rfc4122.txt
 *
 * Logic adopted from http://stackoverflow.com/a/2117523/489568.
 *
 * @returns {string}
 */
function createGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * -11 % 3 === -2
 * mod(-11, 3) === 1
 *
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomFloatInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * @param {number} min Inclusive
 * @param {number} max Exclusive
 * @returns {number}
 */
function randomIntInRange(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

/**
 * @param {Array} list
 * @returns {*}
 */
function pickRandom(list) {
  return list[randomIntInRange(0, list.length)];
}

/**
 * Triggers the given callback when either the current tab or the browser window loses/gains focus.
 *
 * @param {Function} focusChangeHandler
 */
function handlePageFocusChange(focusChangeHandler) {
  // Pause/unpause the app when the tab loses/gains focus.
  document.addEventListener('visibilitychange', () => focusChangeHandler(!document.hidden));
  // Pause/unpause the app when the browser window loses/gains focus.
  window.addEventListener('blur', () => focusChangeHandler(false));
  window.addEventListener('focus', () => focusChangeHandler(true));
}

/**
 * Creates an array with all the consecutive numbers from start (inclusive) to end (exclusive).
 *
 * @param {number} start
 * @param {number} end
 * @returns {Array.<Number>}
 */
function range(start, end) {
  const r = [];
  for (let i = 0, j = start; j < end; i++, j++) {
    r[i] = j;
  }
  return r;
}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isInt(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    parseInt(value) === value;
}

/**
 * Find the first value in a list that satisfies a predicate.
 *
 * @param {Array} list
 * @param {Function} predicate
 * @returns {*}
 */
function find(list, predicate) {
  for (var i = 0, count = list.length; i < count; i++) {
    const value = list[i];
    if (predicate.call(null, value, i, list)) {
      return value;
    }
  }
  return null;
}

const keyCodes = {
  'a': 65,
  'b': 66,
  'c': 67,
  'd': 68,
  'e': 69,
  'f': 70,
  'g': 71,
  'h': 72,
  'i': 73,
  'j': 74,
  'k': 75,
  'l': 76,
  'm': 77,
  'n': 78,
  'o': 79,
  'p': 80,
  'q': 81,
  'r': 82,
  's': 83,
  't': 84,
  'u': 85,
  'v': 86,
  'w': 87,
  'x': 88,
  'y': 89,
  'z': 90,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'SPACE': 32,
  'ENTER': 13,
  'ESCAPE': 27,
  'LEFT': 37,
  'UP': 38,
  'RIGHT': 39,
  'DOWN': 40
};

const svgNamespace = 'http://www.w3.org/2000/svg';
const xlinkNamespace = 'http://www.w3.org/1999/xlink';

export {
  isInDevMode,
  listenToMultipleForMultiple,
  createElement,
  containsClass,
  toggleClass,
  getPageOffset,
  getViewportSize,
  removeChildIfPresent,
  addClass,
  removeClass,
  clearClasses,
  getTextWidth,
  encodeQueryString,
  getQueryStringParameterValue,
  setTransition,
  setTransitionDurationSeconds,
  setTransitionDelaySeconds,
  setUserSelectNone,
  removeChildrenWithClass,
  setTransitionCubicBezierTimingFunction,
  easingFunctions,
  inverseEasingFunctions,
  getXYFromPercentWithBezier,
  setTransform,
  shuffle,
  shallowCopy,
  deepCopy,
  hsvToHsl,
  hslToHsv,
  hslToRgb,
  rgbToHsl,
  createHslColorString,
  findClassInSelfOrAncestors,
  addRuleToStyleSheet,
  checkForSafari,
  checkForIos,
  debounce,
  throttle,
  loadImageSrc,
  loadText,
  loadJson,
  getStackTrace,
  deepFreeze,
  createGuid,
  mod,
  randomFloatInRange,
  randomIntInRange,
  pickRandom,
  handlePageFocusChange,
  range,
  isInt,
  find,
  keyCodes,
  svgNamespace,
  xlinkNamespace,
};

/**
 * @typedef {Object} HslColor
 * @property {Number} h In the range of [0, 1].
 * @property {Number} s In the range of [0, 1].
 * @property {Number} l In the range of [0, 1].
 * @property {Number} [a] In the range of [0, 1].
 */

/**
 * @typedef {Object} RgbColor
 * @property {Number} r In the range of [0, 1].
 * @property {Number} g In the range of [0, 1].
 * @property {Number} b In the range of [0, 1].
 * @property {Number} [a] In the range of [0, 1].
 */
