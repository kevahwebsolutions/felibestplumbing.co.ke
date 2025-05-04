!(function (global, factory) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = factory())
    : "function" == typeof define && define.amd
    ? define(factory)
    : ((global =
        "undefined" != typeof globalThis ? globalThis : global || self).Swiper =
        factory());
})(this, function () {
  "use strict";
  function isObject$1(obj) {
    return (
      null !== obj &&
      "object" == typeof obj &&
      "constructor" in obj &&
      obj.constructor === Object
    );
  }
  function extend$1(target, src) {
    void 0 === target && (target = {}),
      void 0 === src && (src = {}),
      Object.keys(src).forEach((key) => {
        void 0 === target[key]
          ? (target[key] = src[key])
          : isObject$1(src[key]) &&
            isObject$1(target[key]) &&
            Object.keys(src[key]).length > 0 &&
            extend$1(target[key], src[key]);
      });
  }
  const ssrDocument = {
    body: {},
    addEventListener() {},
    removeEventListener() {},
    activeElement: { blur() {}, nodeName: "" },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createEvent: () => ({ initEvent() {} }),
    createElement: () => ({
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName: () => [],
    }),
    createElementNS: () => ({}),
    importNode: () => null,
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
  };
  function getDocument() {
    const doc = "undefined" != typeof document ? document : {};
    return extend$1(doc, ssrDocument), doc;
  }
  const ssrWindow = {
    document: ssrDocument,
    navigator: { userAgent: "" },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
    history: { replaceState() {}, pushState() {}, go() {}, back() {} },
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    Image() {},
    Date() {},
    screen: {},
    setTimeout() {},
    clearTimeout() {},
    matchMedia: () => ({}),
    requestAnimationFrame: (callback) =>
      "undefined" == typeof setTimeout
        ? (callback(), null)
        : setTimeout(callback, 0),
    cancelAnimationFrame(id) {
      "undefined" != typeof setTimeout && clearTimeout(id);
    },
  };
  function getWindow() {
    const win = "undefined" != typeof window ? window : {};
    return extend$1(win, ssrWindow), win;
  }
  class Dom7 extends Array {
    constructor(items) {
      "number" == typeof items
        ? super(items)
        : (super(...(items || [])),
          (function makeReactive(obj) {
            const proto = obj.__proto__;
            Object.defineProperty(obj, "__proto__", {
              get: () => proto,
              set(value) {
                proto.__proto__ = value;
              },
            });
          })(this));
    }
  }
  function arrayFlat(arr) {
    void 0 === arr && (arr = []);
    const res = [];
    return (
      arr.forEach((el) => {
        Array.isArray(el) ? res.push(...arrayFlat(el)) : res.push(el);
      }),
      res
    );
  }
  function arrayFilter(arr, callback) {
    return Array.prototype.filter.call(arr, callback);
  }
  function $(selector, context) {
    const window = getWindow(),
      document = getDocument();
    let arr = [];
    if (!context && selector instanceof Dom7) return selector;
    if (!selector) return new Dom7(arr);
    if ("string" == typeof selector) {
      const html = selector.trim();
      if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
        let toCreate = "div";
        0 === html.indexOf("<li") && (toCreate = "ul"),
          0 === html.indexOf("<tr") && (toCreate = "tbody"),
          (0 !== html.indexOf("<td") && 0 !== html.indexOf("<th")) ||
            (toCreate = "tr"),
          0 === html.indexOf("<tbody") && (toCreate = "table"),
          0 === html.indexOf("<option") && (toCreate = "select");
        const tempParent = document.createElement(toCreate);
        tempParent.innerHTML = html;
        for (let i = 0; i < tempParent.childNodes.length; i += 1)
          arr.push(tempParent.childNodes[i]);
      } else
        arr = (function qsa(selector, context) {
          if ("string" != typeof selector) return [selector];
          const a = [],
            res = context.querySelectorAll(selector);
          for (let i = 0; i < res.length; i += 1) a.push(res[i]);
          return a;
        })(selector.trim(), context || document);
    } else if (
      selector.nodeType ||
      selector === window ||
      selector === document
    )
      arr.push(selector);
    else if (Array.isArray(selector)) {
      if (selector instanceof Dom7) return selector;
      arr = selector;
    }
    return new Dom7(
      (function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1)
          -1 === uniqueArray.indexOf(arr[i]) && uniqueArray.push(arr[i]);
        return uniqueArray;
      })(arr)
    );
  }
  $.fn = Dom7.prototype;
  const Methods = {
    addClass: function addClass() {
      for (
        var _len = arguments.length, classes = new Array(_len), _key = 0;
        _key < _len;
        _key++
      )
        classes[_key] = arguments[_key];
      const classNames = arrayFlat(classes.map((c) => c.split(" ")));
      return (
        this.forEach((el) => {
          el.classList.add(...classNames);
        }),
        this
      );
    },
    removeClass: function removeClass() {
      for (
        var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      )
        classes[_key2] = arguments[_key2];
      const classNames = arrayFlat(classes.map((c) => c.split(" ")));
      return (
        this.forEach((el) => {
          el.classList.remove(...classNames);
        }),
        this
      );
    },
    hasClass: function hasClass() {
      for (
        var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0;
        _key4 < _len4;
        _key4++
      )
        classes[_key4] = arguments[_key4];
      const classNames = arrayFlat(classes.map((c) => c.split(" ")));
      return (
        arrayFilter(
          this,
          (el) =>
            classNames.filter((className) => el.classList.contains(className))
              .length > 0
        ).length > 0
      );
    },
    toggleClass: function toggleClass() {
      for (
        var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0;
        _key3 < _len3;
        _key3++
      )
        classes[_key3] = arguments[_key3];
      const classNames = arrayFlat(classes.map((c) => c.split(" ")));
      this.forEach((el) => {
        classNames.forEach((className) => {
          el.classList.toggle(className);
        });
      });
    },
    attr: function attr(attrs, value) {
      if (1 === arguments.length && "string" == typeof attrs)
        return this[0] ? this[0].getAttribute(attrs) : void 0;
      for (let i = 0; i < this.length; i += 1)
        if (2 === arguments.length) this[i].setAttribute(attrs, value);
        else
          for (const attrName in attrs)
            (this[i][attrName] = attrs[attrName]),
              this[i].setAttribute(attrName, attrs[attrName]);
      return this;
    },
    removeAttr: function removeAttr(attr) {
      for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
      return this;
    },
    transform: function transform(transform) {
      for (let i = 0; i < this.length; i += 1)
        this[i].style.transform = transform;
      return this;
    },
    transition: function transition$1(duration) {
      for (let i = 0; i < this.length; i += 1)
        this[i].style.transitionDuration =
          "string" != typeof duration ? `${duration}ms` : duration;
      return this;
    },
    on: function on() {
      for (
        var _len5 = arguments.length, args = new Array(_len5), _key5 = 0;
        _key5 < _len5;
        _key5++
      )
        args[_key5] = arguments[_key5];
      let [eventType, targetSelector, listener, capture] = args;
      function handleLiveEvent(e) {
        const target = e.target;
        if (!target) return;
        const eventData = e.target.dom7EventData || [];
        if (
          (eventData.indexOf(e) < 0 && eventData.unshift(e),
          $(target).is(targetSelector))
        )
          listener.apply(target, eventData);
        else {
          const parents = $(target).parents();
          for (let k = 0; k < parents.length; k += 1)
            $(parents[k]).is(targetSelector) &&
              listener.apply(parents[k], eventData);
        }
      }
      function handleEvent(e) {
        const eventData = (e && e.target && e.target.dom7EventData) || [];
        eventData.indexOf(e) < 0 && eventData.unshift(e),
          listener.apply(this, eventData);
      }
      "function" == typeof args[1] &&
        (([eventType, listener, capture] = args), (targetSelector = void 0)),
        capture || (capture = !1);
      const events = eventType.split(" ");
      let j;
      for (let i = 0; i < this.length; i += 1) {
        const el = this[i];
        if (targetSelector)
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            el.dom7LiveListeners || (el.dom7LiveListeners = {}),
              el.dom7LiveListeners[event] || (el.dom7LiveListeners[event] = []),
              el.dom7LiveListeners[event].push({
                listener: listener,
                proxyListener: handleLiveEvent,
              }),
              el.addEventListener(event, handleLiveEvent, capture);
          }
        else
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            el.dom7Listeners || (el.dom7Listeners = {}),
              el.dom7Listeners[event] || (el.dom7Listeners[event] = []),
              el.dom7Listeners[event].push({
                listener: listener,
                proxyListener: handleEvent,
              }),
              el.addEventListener(event, handleEvent, capture);
          }
      }
      return this;
    },
    off: function off() {
      for (
        var _len6 = arguments.length, args = new Array(_len6), _key6 = 0;
        _key6 < _len6;
        _key6++
      )
        args[_key6] = arguments[_key6];
      let [eventType, targetSelector, listener, capture] = args;
      "function" == typeof args[1] &&
        (([eventType, listener, capture] = args), (targetSelector = void 0)),
        capture || (capture = !1);
      const events = eventType.split(" ");
      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];
        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];
          let handlers;
          if (
            (!targetSelector && el.dom7Listeners
              ? (handlers = el.dom7Listeners[event])
              : targetSelector &&
                el.dom7LiveListeners &&
                (handlers = el.dom7LiveListeners[event]),
            handlers && handlers.length)
          )
            for (let k = handlers.length - 1; k >= 0; k -= 1) {
              const handler = handlers[k];
              (listener && handler.listener === listener) ||
              (listener &&
                handler.listener &&
                handler.listener.dom7proxy &&
                handler.listener.dom7proxy === listener)
                ? (el.removeEventListener(
                    event,
                    handler.proxyListener,
                    capture
                  ),
                  handlers.splice(k, 1))
                : listener ||
                  (el.removeEventListener(
                    event,
                    handler.proxyListener,
                    capture
                  ),
                  handlers.splice(k, 1));
            }
        }
      }
      return this;
    },
    trigger: function trigger() {
      const window = getWindow();
      for (
        var _len9 = arguments.length, args = new Array(_len9), _key9 = 0;
        _key9 < _len9;
        _key9++
      )
        args[_key9] = arguments[_key9];
      const events = args[0].split(" "),
        eventData = args[1];
      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];
        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];
          if (window.CustomEvent) {
            const evt = new window.CustomEvent(event, {
              detail: eventData,
              bubbles: !0,
              cancelable: !0,
            });
            (el.dom7EventData = args.filter(
              (data, dataIndex) => dataIndex > 0
            )),
              el.dispatchEvent(evt),
              (el.dom7EventData = []),
              delete el.dom7EventData;
          }
        }
      }
      return this;
    },
    transitionEnd: function transitionEnd$1(callback) {
      const dom = this;
      return (
        callback &&
          dom.on("transitionend", function fireCallBack(e) {
            e.target === this &&
              (callback.call(this, e), dom.off("transitionend", fireCallBack));
          }),
        this
      );
    },
    outerWidth: function outerWidth(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return (
            this[0].offsetWidth +
            parseFloat(styles.getPropertyValue("margin-right")) +
            parseFloat(styles.getPropertyValue("margin-left"))
          );
        }
        return this[0].offsetWidth;
      }
      return null;
    },
    outerHeight: function outerHeight(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return (
            this[0].offsetHeight +
            parseFloat(styles.getPropertyValue("margin-top")) +
            parseFloat(styles.getPropertyValue("margin-bottom"))
          );
        }
        return this[0].offsetHeight;
      }
      return null;
    },
    styles: function styles() {
      const window = getWindow();
      return this[0] ? window.getComputedStyle(this[0], null) : {};
    },
    offset: function offset() {
      if (this.length > 0) {
        const window = getWindow(),
          document = getDocument(),
          el = this[0],
          box = el.getBoundingClientRect(),
          body = document.body,
          clientTop = el.clientTop || body.clientTop || 0,
          clientLeft = el.clientLeft || body.clientLeft || 0,
          scrollTop = el === window ? window.scrollY : el.scrollTop,
          scrollLeft = el === window ? window.scrollX : el.scrollLeft;
        return {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft,
        };
      }
      return null;
    },
    css: function css(props, value) {
      const window = getWindow();
      let i;
      if (1 === arguments.length) {
        if ("string" != typeof props) {
          for (i = 0; i < this.length; i += 1)
            for (const prop in props) this[i].style[prop] = props[prop];
          return this;
        }
        if (this[0])
          return window.getComputedStyle(this[0], null).getPropertyValue(props);
      }
      if (2 === arguments.length && "string" == typeof props) {
        for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
        return this;
      }
      return this;
    },
    each: function each(callback) {
      return callback
        ? (this.forEach((el, index) => {
            callback.apply(el, [el, index]);
          }),
          this)
        : this;
    },
    html: function html(html) {
      if (void 0 === html) return this[0] ? this[0].innerHTML : null;
      for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
      return this;
    },
    text: function text(text) {
      if (void 0 === text) return this[0] ? this[0].textContent.trim() : null;
      for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
      return this;
    },
    is: function is(selector) {
      const window = getWindow(),
        document = getDocument(),
        el = this[0];
      let compareWith, i;
      if (!el || void 0 === selector) return !1;
      if ("string" == typeof selector) {
        if (el.matches) return el.matches(selector);
        if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
        if (el.msMatchesSelector) return el.msMatchesSelector(selector);
        for (compareWith = $(selector), i = 0; i < compareWith.length; i += 1)
          if (compareWith[i] === el) return !0;
        return !1;
      }
      if (selector === document) return el === document;
      if (selector === window) return el === window;
      if (selector.nodeType || selector instanceof Dom7) {
        for (
          compareWith = selector.nodeType ? [selector] : selector, i = 0;
          i < compareWith.length;
          i += 1
        )
          if (compareWith[i] === el) return !0;
        return !1;
      }
      return !1;
    },
    index: function index() {
      let i,
        child = this[0];
      if (child) {
        for (i = 0; null !== (child = child.previousSibling); )
          1 === child.nodeType && (i += 1);
        return i;
      }
    },
    eq: function eq(index) {
      if (void 0 === index) return this;
      const length = this.length;
      if (index > length - 1) return $([]);
      if (index < 0) {
        const returnIndex = length + index;
        return $(returnIndex < 0 ? [] : [this[returnIndex]]);
      }
      return $([this[index]]);
    },
    append: function append() {
      let newChild;
      const document = getDocument();
      for (let k = 0; k < arguments.length; k += 1) {
        newChild = k < 0 || arguments.length <= k ? void 0 : arguments[k];
        for (let i = 0; i < this.length; i += 1)
          if ("string" == typeof newChild) {
            const tempDiv = document.createElement("div");
            for (tempDiv.innerHTML = newChild; tempDiv.firstChild; )
              this[i].appendChild(tempDiv.firstChild);
          } else if (newChild instanceof Dom7)
            for (let j = 0; j < newChild.length; j += 1)
              this[i].appendChild(newChild[j]);
          else this[i].appendChild(newChild);
      }
      return this;
    },
    prepend: function prepend(newChild) {
      const document = getDocument();
      let i, j;
      for (i = 0; i < this.length; i += 1)
        if ("string" == typeof newChild) {
          const tempDiv = document.createElement("div");
          for (
            tempDiv.innerHTML = newChild, j = tempDiv.childNodes.length - 1;
            j >= 0;
            j -= 1
          )
            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7)
          for (j = 0; j < newChild.length; j += 1)
            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
        else this[i].insertBefore(newChild, this[i].childNodes[0]);
      return this;
    },
    next: function next(selector) {
      return this.length > 0
        ? selector
          ? this[0].nextElementSibling &&
            $(this[0].nextElementSibling).is(selector)
            ? $([this[0].nextElementSibling])
            : $([])
          : this[0].nextElementSibling
          ? $([this[0].nextElementSibling])
          : $([])
        : $([]);
    },
    nextAll: function nextAll(selector) {
      const nextEls = [];
      let el = this[0];
      if (!el) return $([]);
      for (; el.nextElementSibling; ) {
        const next = el.nextElementSibling;
        selector
          ? $(next).is(selector) && nextEls.push(next)
          : nextEls.push(next),
          (el = next);
      }
      return $(nextEls);
    },
    prev: function prev(selector) {
      if (this.length > 0) {
        const el = this[0];
        return selector
          ? el.previousElementSibling &&
            $(el.previousElementSibling).is(selector)
            ? $([el.previousElementSibling])
            : $([])
          : el.previousElementSibling
          ? $([el.previousElementSibling])
          : $([]);
      }
      return $([]);
    },
    prevAll: function prevAll(selector) {
      const prevEls = [];
      let el = this[0];
      if (!el) return $([]);
      for (; el.previousElementSibling; ) {
        const prev = el.previousElementSibling;
        selector
          ? $(prev).is(selector) && prevEls.push(prev)
          : prevEls.push(prev),
          (el = prev);
      }
      return $(prevEls);
    },
    parent: function parent(selector) {
      const parents = [];
      for (let i = 0; i < this.length; i += 1)
        null !== this[i].parentNode &&
          (selector
            ? $(this[i].parentNode).is(selector) &&
              parents.push(this[i].parentNode)
            : parents.push(this[i].parentNode));
      return $(parents);
    },
    parents: function parents(selector) {
      const parents = [];
      for (let i = 0; i < this.length; i += 1) {
        let parent = this[i].parentNode;
        for (; parent; )
          selector
            ? $(parent).is(selector) && parents.push(parent)
            : parents.push(parent),
            (parent = parent.parentNode);
      }
      return $(parents);
    },
    closest: function closest(selector) {
      let closest = this;
      return void 0 === selector
        ? $([])
        : (closest.is(selector) || (closest = closest.parents(selector).eq(0)),
          closest);
    },
    find: function find(selector) {
      const foundElements = [];
      for (let i = 0; i < this.length; i += 1) {
        const found = this[i].querySelectorAll(selector);
        for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
      }
      return $(foundElements);
    },
    children: function children(selector) {
      const children = [];
      for (let i = 0; i < this.length; i += 1) {
        const childNodes = this[i].children;
        for (let j = 0; j < childNodes.length; j += 1)
          (selector && !$(childNodes[j]).is(selector)) ||
            children.push(childNodes[j]);
      }
      return $(children);
    },
    filter: function filter(callback) {
      return $(arrayFilter(this, callback));
    },
    remove: function remove() {
      for (let i = 0; i < this.length; i += 1)
        this[i].parentNode && this[i].parentNode.removeChild(this[i]);
      return this;
    },
  };
  function nextTick(callback, delay) {
    return void 0 === delay && (delay = 0), setTimeout(callback, delay);
  }
  function now() {
    return Date.now();
  }
  function getTranslate(el, axis) {
    void 0 === axis && (axis = "x");
    const window = getWindow();
    let matrix, curTransform, transformMatrix;
    const curStyle = (function getComputedStyle$1(el) {
      const window = getWindow();
      let style;
      return (
        window.getComputedStyle && (style = window.getComputedStyle(el, null)),
        !style && el.currentStyle && (style = el.currentStyle),
        style || (style = el.style),
        style
      );
    })(el);
    return (
      window.WebKitCSSMatrix
        ? ((curTransform = curStyle.transform || curStyle.webkitTransform),
          curTransform.split(",").length > 6 &&
            (curTransform = curTransform
              .split(", ")
              .map((a) => a.replace(",", "."))
              .join(", ")),
          (transformMatrix = new window.WebKitCSSMatrix(
            "none" === curTransform ? "" : curTransform
          )))
        : ((transformMatrix =
            curStyle.MozTransform ||
            curStyle.OTransform ||
            curStyle.MsTransform ||
            curStyle.msTransform ||
            curStyle.transform ||
            curStyle
              .getPropertyValue("transform")
              .replace("translate(", "matrix(1, 0, 0, 1,")),
          (matrix = transformMatrix.toString().split(","))),
      "x" === axis &&
        (curTransform = window.WebKitCSSMatrix
          ? transformMatrix.m41
          : 16 === matrix.length
          ? parseFloat(matrix[12])
          : parseFloat(matrix[4])),
      "y" === axis &&
        (curTransform = window.WebKitCSSMatrix
          ? transformMatrix.m42
          : 16 === matrix.length
          ? parseFloat(matrix[13])
          : parseFloat(matrix[5])),
      curTransform || 0
    );
  }
  function isObject(o) {
    return (
      "object" == typeof o &&
      null !== o &&
      o.constructor &&
      "Object" === Object.prototype.toString.call(o).slice(8, -1)
    );
  }
  function isNode(node) {
    return "undefined" != typeof window && void 0 !== window.HTMLElement
      ? node instanceof HTMLElement
      : node && (1 === node.nodeType || 11 === node.nodeType);
  }
  function extend() {
    const to = Object(arguments.length <= 0 ? void 0 : arguments[0]),
      noExtend = ["__proto__", "constructor", "prototype"];
    for (let i = 1; i < arguments.length; i += 1) {
      const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
      if (null != nextSource && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter(
          (key) => noExtend.indexOf(key) < 0
        );
        for (
          let nextIndex = 0, len = keysArray.length;
          nextIndex < len;
          nextIndex += 1
        ) {
          const nextKey = keysArray[nextIndex],
            desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          void 0 !== desc &&
            desc.enumerable &&
            (isObject(to[nextKey]) && isObject(nextSource[nextKey])
              ? nextSource[nextKey].__swiper__
                ? (to[nextKey] = nextSource[nextKey])
                : extend(to[nextKey], nextSource[nextKey])
              : !isObject(to[nextKey]) && isObject(nextSource[nextKey])
              ? ((to[nextKey] = {}),
                nextSource[nextKey].__swiper__
                  ? (to[nextKey] = nextSource[nextKey])
                  : extend(to[nextKey], nextSource[nextKey]))
              : (to[nextKey] = nextSource[nextKey]));
        }
      }
    }
    return to;
  }
  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll(_ref) {
    let { swiper: swiper, targetPosition: targetPosition, side: side } = _ref;
    const window = getWindow(),
      startPosition = -swiper.translate;
    let time,
      startTime = null;
    const duration = swiper.params.speed;
    (swiper.wrapperEl.style.scrollSnapType = "none"),
      window.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev",
      isOutOfBound = (current, target) =>
        ("next" === dir && current >= target) ||
        ("prev" === dir && current <= target),
      animate = () => {
        (time = new Date().getTime()), null === startTime && (startTime = time);
        const progress = Math.max(
            Math.min((time - startTime) / duration, 1),
            0
          ),
          easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        let currentPosition =
          startPosition + easeProgress * (targetPosition - startPosition);
        if (
          (isOutOfBound(currentPosition, targetPosition) &&
            (currentPosition = targetPosition),
          swiper.wrapperEl.scrollTo({ [side]: currentPosition }),
          isOutOfBound(currentPosition, targetPosition))
        )
          return (
            (swiper.wrapperEl.style.overflow = "hidden"),
            (swiper.wrapperEl.style.scrollSnapType = ""),
            setTimeout(() => {
              (swiper.wrapperEl.style.overflow = ""),
                swiper.wrapperEl.scrollTo({ [side]: currentPosition });
            }),
            void window.cancelAnimationFrame(swiper.cssModeFrameID)
          );
        swiper.cssModeFrameID = window.requestAnimationFrame(animate);
      };
    animate();
  }
  let support, deviceCached, browser;
  function getSupport() {
    return (
      support ||
        (support = (function calcSupport() {
          const window = getWindow(),
            document = getDocument();
          return {
            smoothScroll:
              document.documentElement &&
              "scrollBehavior" in document.documentElement.style,
            touch: !!(
              "ontouchstart" in window ||
              (window.DocumentTouch && document instanceof window.DocumentTouch)
            ),
            passiveListener: (function checkPassiveListener() {
              let supportsPassive = !1;
              try {
                const opts = Object.defineProperty({}, "passive", {
                  get() {
                    supportsPassive = !0;
                  },
                });
                window.addEventListener("testPassiveListener", null, opts);
              } catch (e) {}
              return supportsPassive;
            })(),
            gestures: (function checkGestures() {
              return "ongesturestart" in window;
            })(),
          };
        })()),
      support
    );
  }
  function getDevice(overrides) {
    return (
      void 0 === overrides && (overrides = {}),
      deviceCached ||
        (deviceCached = (function calcDevice(_temp) {
          let { userAgent: userAgent } = void 0 === _temp ? {} : _temp;
          const support = getSupport(),
            window = getWindow(),
            platform = window.navigator.platform,
            ua = userAgent || window.navigator.userAgent,
            device = { ios: !1, android: !1 },
            screenWidth = window.screen.width,
            screenHeight = window.screen.height,
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
          let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
          const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
            windows = "Win32" === platform;
          let macos = "MacIntel" === platform;
          return (
            !ipad &&
              macos &&
              support.touch &&
              [
                "1024x1366",
                "1366x1024",
                "834x1194",
                "1194x834",
                "834x1112",
                "1112x834",
                "768x1024",
                "1024x768",
                "820x1180",
                "1180x820",
                "810x1080",
                "1080x810",
              ].indexOf(`${screenWidth}x${screenHeight}`) >= 0 &&
              ((ipad = ua.match(/(Version)\/([\d.]+)/)),
              ipad || (ipad = [0, 1, "13_0_0"]),
              (macos = !1)),
            android &&
              !windows &&
              ((device.os = "android"), (device.android = !0)),
            (ipad || iphone || ipod) &&
              ((device.os = "ios"), (device.ios = !0)),
            device
          );
        })(overrides)),
      deviceCached
    );
  }
  function getBrowser() {
    return (
      browser ||
        (browser = (function calcBrowser() {
          const window = getWindow();
          return {
            isSafari: (function isSafari() {
              const ua = window.navigator.userAgent.toLowerCase();
              return (
                ua.indexOf("safari") >= 0 &&
                ua.indexOf("chrome") < 0 &&
                ua.indexOf("android") < 0
              );
            })(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
              window.navigator.userAgent
            ),
          };
        })()),
      browser
    );
  }
  Object.keys(Methods).forEach((methodName) => {
    Object.defineProperty($.fn, methodName, {
      value: Methods[methodName],
      writable: !0,
    });
  });
  var eventsEmitter = {
    on(events, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if ("function" != typeof handler) return self;
      const method = priority ? "unshift" : "push";
      return (
        events.split(" ").forEach((event) => {
          self.eventsListeners[event] || (self.eventsListeners[event] = []),
            self.eventsListeners[event][method](handler);
        }),
        self
      );
    },
    once(events, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if ("function" != typeof handler) return self;
      function onceHandler() {
        self.off(events, onceHandler),
          onceHandler.__emitterProxy && delete onceHandler.__emitterProxy;
        for (
          var _len = arguments.length, args = new Array(_len), _key = 0;
          _key < _len;
          _key++
        )
          args[_key] = arguments[_key];
        handler.apply(self, args);
      }
      return (
        (onceHandler.__emitterProxy = handler),
        self.on(events, onceHandler, priority)
      );
    },
    onAny(handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if ("function" != typeof handler) return self;
      const method = priority ? "unshift" : "push";
      return (
        self.eventsAnyListeners.indexOf(handler) < 0 &&
          self.eventsAnyListeners[method](handler),
        self
      );
    },
    offAny(handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsAnyListeners) return self;
      const index = self.eventsAnyListeners.indexOf(handler);
      return index >= 0 && self.eventsAnyListeners.splice(index, 1), self;
    },
    off(events, handler) {
      const self = this;
      return !self.eventsListeners || self.destroyed
        ? self
        : self.eventsListeners
        ? (events.split(" ").forEach((event) => {
            void 0 === handler
              ? (self.eventsListeners[event] = [])
              : self.eventsListeners[event] &&
                self.eventsListeners[event].forEach((eventHandler, index) => {
                  (eventHandler === handler ||
                    (eventHandler.__emitterProxy &&
                      eventHandler.__emitterProxy === handler)) &&
                    self.eventsListeners[event].splice(index, 1);
                });
          }),
          self)
        : self;
    },
    emit() {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsListeners) return self;
      let events, data, context;
      for (
        var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      )
        args[_key2] = arguments[_key2];
      "string" == typeof args[0] || Array.isArray(args[0])
        ? ((events = args[0]),
          (data = args.slice(1, args.length)),
          (context = self))
        : ((events = args[0].events),
          (data = args[0].data),
          (context = args[0].context || self)),
        data.unshift(context);
      return (
        (Array.isArray(events) ? events : events.split(" ")).forEach(
          (event) => {
            self.eventsAnyListeners &&
              self.eventsAnyListeners.length &&
              self.eventsAnyListeners.forEach((eventHandler) => {
                eventHandler.apply(context, [event, ...data]);
              }),
              self.eventsListeners &&
                self.eventsListeners[event] &&
                self.eventsListeners[event].forEach((eventHandler) => {
                  eventHandler.apply(context, data);
                });
          }
        ),
        self
      );
    },
  };
  var update = {
    updateSize: function updateSize() {
      const swiper = this;
      let width, height;
      const $el = swiper.$el;
      (width =
        void 0 !== swiper.params.width && null !== swiper.params.width
          ? swiper.params.width
          : $el[0].clientWidth),
        (height =
          void 0 !== swiper.params.height && null !== swiper.params.height
            ? swiper.params.height
            : $el[0].clientHeight),
        (0 === width && swiper.isHorizontal()) ||
          (0 === height && swiper.isVertical()) ||
          ((width =
            width -
            parseInt($el.css("padding-left") || 0, 10) -
            parseInt($el.css("padding-right") || 0, 10)),
          (height =
            height -
            parseInt($el.css("padding-top") || 0, 10) -
            parseInt($el.css("padding-bottom") || 0, 10)),
          Number.isNaN(width) && (width = 0),
          Number.isNaN(height) && (height = 0),
          Object.assign(swiper, {
            width: width,
            height: height,
            size: swiper.isHorizontal() ? width : height,
          }));
    },
    updateSlides: function updateSlides() {
      const swiper = this;
      function getDirectionLabel(property) {
        return swiper.isHorizontal()
          ? property
          : {
              width: "height",
              "margin-top": "margin-left",
              "margin-bottom ": "margin-right",
              "margin-left": "margin-top",
              "margin-right": "margin-bottom",
              "padding-left": "padding-top",
              "padding-right": "padding-bottom",
              marginRight: "marginBottom",
            }[property];
      }
      function getDirectionPropertyValue(node, label) {
        return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      }
      const params = swiper.params,
        {
          $wrapperEl: $wrapperEl,
          size: swiperSize,
          rtlTranslate: rtl,
          wrongRTL: wrongRTL,
        } = swiper,
        isVirtual = swiper.virtual && params.virtual.enabled,
        previousSlidesLength = isVirtual
          ? swiper.virtual.slides.length
          : swiper.slides.length,
        slides = $wrapperEl.children(`.${swiper.params.slideClass}`),
        slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
      let snapGrid = [];
      const slidesGrid = [],
        slidesSizesGrid = [];
      let offsetBefore = params.slidesOffsetBefore;
      "function" == typeof offsetBefore &&
        (offsetBefore = params.slidesOffsetBefore.call(swiper));
      let offsetAfter = params.slidesOffsetAfter;
      "function" == typeof offsetAfter &&
        (offsetAfter = params.slidesOffsetAfter.call(swiper));
      const previousSnapGridLength = swiper.snapGrid.length,
        previousSlidesGridLength = swiper.slidesGrid.length;
      let spaceBetween = params.spaceBetween,
        slidePosition = -offsetBefore,
        prevSlideSize = 0,
        index = 0;
      if (void 0 === swiperSize) return;
      "string" == typeof spaceBetween &&
        spaceBetween.indexOf("%") >= 0 &&
        (spaceBetween =
          (parseFloat(spaceBetween.replace("%", "")) / 100) * swiperSize),
        (swiper.virtualSize = -spaceBetween),
        rtl
          ? slides.css({ marginLeft: "", marginBottom: "", marginTop: "" })
          : slides.css({ marginRight: "", marginBottom: "", marginTop: "" }),
        params.centeredSlides &&
          params.cssMode &&
          (setCSSProperty(
            swiper.wrapperEl,
            "--swiper-centered-offset-before",
            ""
          ),
          setCSSProperty(
            swiper.wrapperEl,
            "--swiper-centered-offset-after",
            ""
          ));
      const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
      let slideSize;
      gridEnabled && swiper.grid.initSlides(slidesLength);
      const shouldResetSlideSize =
        "auto" === params.slidesPerView &&
        params.breakpoints &&
        Object.keys(params.breakpoints).filter(
          (key) => void 0 !== params.breakpoints[key].slidesPerView
        ).length > 0;
      for (let i = 0; i < slidesLength; i += 1) {
        slideSize = 0;
        const slide = slides.eq(i);
        if (
          (gridEnabled &&
            swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel),
          "none" !== slide.css("display"))
        ) {
          if ("auto" === params.slidesPerView) {
            shouldResetSlideSize &&
              (slides[i].style[getDirectionLabel("width")] = "");
            const slideStyles = getComputedStyle(slide[0]),
              currentTransform = slide[0].style.transform,
              currentWebKitTransform = slide[0].style.webkitTransform;
            if (
              (currentTransform && (slide[0].style.transform = "none"),
              currentWebKitTransform &&
                (slide[0].style.webkitTransform = "none"),
              params.roundLengths)
            )
              slideSize = swiper.isHorizontal()
                ? slide.outerWidth(!0)
                : slide.outerHeight(!0);
            else {
              const width = getDirectionPropertyValue(slideStyles, "width"),
                paddingLeft = getDirectionPropertyValue(
                  slideStyles,
                  "padding-left"
                ),
                paddingRight = getDirectionPropertyValue(
                  slideStyles,
                  "padding-right"
                ),
                marginLeft = getDirectionPropertyValue(
                  slideStyles,
                  "margin-left"
                ),
                marginRight = getDirectionPropertyValue(
                  slideStyles,
                  "margin-right"
                ),
                boxSizing = slideStyles.getPropertyValue("box-sizing");
              if (boxSizing && "border-box" === boxSizing)
                slideSize = width + marginLeft + marginRight;
              else {
                const { clientWidth: clientWidth, offsetWidth: offsetWidth } =
                  slide[0];
                slideSize =
                  width +
                  paddingLeft +
                  paddingRight +
                  marginLeft +
                  marginRight +
                  (offsetWidth - clientWidth);
              }
            }
            currentTransform && (slide[0].style.transform = currentTransform),
              currentWebKitTransform &&
                (slide[0].style.webkitTransform = currentWebKitTransform),
              params.roundLengths && (slideSize = Math.floor(slideSize));
          } else
            (slideSize =
              (swiperSize - (params.slidesPerView - 1) * spaceBetween) /
              params.slidesPerView),
              params.roundLengths && (slideSize = Math.floor(slideSize)),
              slides[i] &&
                (slides[i].style[
                  getDirectionLabel("width")
                ] = `${slideSize}px`);
          slides[i] && (slides[i].swiperSlideSize = slideSize),
            slidesSizesGrid.push(slideSize),
            params.centeredSlides
              ? ((slidePosition =
                  slidePosition +
                  slideSize / 2 +
                  prevSlideSize / 2 +
                  spaceBetween),
                0 === prevSlideSize &&
                  0 !== i &&
                  (slidePosition =
                    slidePosition - swiperSize / 2 - spaceBetween),
                0 === i &&
                  (slidePosition =
                    slidePosition - swiperSize / 2 - spaceBetween),
                Math.abs(slidePosition) < 0.001 && (slidePosition = 0),
                params.roundLengths &&
                  (slidePosition = Math.floor(slidePosition)),
                index % params.slidesPerGroup == 0 &&
                  snapGrid.push(slidePosition),
                slidesGrid.push(slidePosition))
              : (params.roundLengths &&
                  (slidePosition = Math.floor(slidePosition)),
                (index - Math.min(swiper.params.slidesPerGroupSkip, index)) %
                  swiper.params.slidesPerGroup ==
                  0 && snapGrid.push(slidePosition),
                slidesGrid.push(slidePosition),
                (slidePosition = slidePosition + slideSize + spaceBetween)),
            (swiper.virtualSize += slideSize + spaceBetween),
            (prevSlideSize = slideSize),
            (index += 1);
        }
      }
      if (
        ((swiper.virtualSize =
          Math.max(swiper.virtualSize, swiperSize) + offsetAfter),
        rtl &&
          wrongRTL &&
          ("slide" === params.effect || "coverflow" === params.effect) &&
          $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`,
          }),
        params.setWrapperSize &&
          $wrapperEl.css({
            [getDirectionLabel("width")]: `${
              swiper.virtualSize + params.spaceBetween
            }px`,
          }),
        gridEnabled &&
          swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel),
        !params.centeredSlides)
      ) {
        const newSlidesGrid = [];
        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          params.roundLengths && (slidesGridItem = Math.floor(slidesGridItem)),
            snapGrid[i] <= swiper.virtualSize - swiperSize &&
              newSlidesGrid.push(slidesGridItem);
        }
        (snapGrid = newSlidesGrid),
          Math.floor(swiper.virtualSize - swiperSize) -
            Math.floor(snapGrid[snapGrid.length - 1]) >
            1 && snapGrid.push(swiper.virtualSize - swiperSize);
      }
      if (
        (0 === snapGrid.length && (snapGrid = [0]), 0 !== params.spaceBetween)
      ) {
        const key =
          swiper.isHorizontal() && rtl
            ? "marginLeft"
            : getDirectionLabel("marginRight");
        slides
          .filter(
            (_, slideIndex) =>
              !params.cssMode || slideIndex !== slides.length - 1
          )
          .css({ [key]: `${spaceBetween}px` });
      }
      if (params.centeredSlides && params.centeredSlidesBounds) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach((slideSizeValue) => {
          allSlidesSize +=
            slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        }),
          (allSlidesSize -= params.spaceBetween);
        const maxSnap = allSlidesSize - swiperSize;
        snapGrid = snapGrid.map((snap) =>
          snap < 0
            ? -offsetBefore
            : snap > maxSnap
            ? maxSnap + offsetAfter
            : snap
        );
      }
      if (params.centerInsufficientSlides) {
        let allSlidesSize = 0;
        if (
          (slidesSizesGrid.forEach((slideSizeValue) => {
            allSlidesSize +=
              slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
          }),
          (allSlidesSize -= params.spaceBetween),
          allSlidesSize < swiperSize)
        ) {
          const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
          snapGrid.forEach((snap, snapIndex) => {
            snapGrid[snapIndex] = snap - allSlidesOffset;
          }),
            slidesGrid.forEach((snap, snapIndex) => {
              slidesGrid[snapIndex] = snap + allSlidesOffset;
            });
        }
      }
      if (
        (Object.assign(swiper, {
          slides: slides,
          snapGrid: snapGrid,
          slidesGrid: slidesGrid,
          slidesSizesGrid: slidesSizesGrid,
        }),
        params.centeredSlides && params.cssMode && !params.centeredSlidesBounds)
      ) {
        setCSSProperty(
          swiper.wrapperEl,
          "--swiper-centered-offset-before",
          -snapGrid[0] + "px"
        ),
          setCSSProperty(
            swiper.wrapperEl,
            "--swiper-centered-offset-after",
            swiper.size / 2 -
              slidesSizesGrid[slidesSizesGrid.length - 1] / 2 +
              "px"
          );
        const addToSnapGrid = -swiper.snapGrid[0],
          addToSlidesGrid = -swiper.slidesGrid[0];
        (swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid)),
          (swiper.slidesGrid = swiper.slidesGrid.map(
            (v) => v + addToSlidesGrid
          ));
      }
      if (
        (slidesLength !== previousSlidesLength &&
          swiper.emit("slidesLengthChange"),
        snapGrid.length !== previousSnapGridLength &&
          (swiper.params.watchOverflow && swiper.checkOverflow(),
          swiper.emit("snapGridLengthChange")),
        slidesGrid.length !== previousSlidesGridLength &&
          swiper.emit("slidesGridLengthChange"),
        params.watchSlidesProgress && swiper.updateSlidesOffset(),
        !(
          isVirtual ||
          params.cssMode ||
          ("slide" !== params.effect && "fade" !== params.effect)
        ))
      ) {
        const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`,
          hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
        slidesLength <= params.maxBackfaceHiddenSlides
          ? hasClassBackfaceClassAdded ||
            swiper.$el.addClass(backFaceHiddenClass)
          : hasClassBackfaceClassAdded &&
            swiper.$el.removeClass(backFaceHiddenClass);
      }
    },
    updateAutoHeight: function updateAutoHeight(speed) {
      const swiper = this,
        activeSlides = [],
        isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let i,
        newHeight = 0;
      "number" == typeof speed
        ? swiper.setTransition(speed)
        : !0 === speed && swiper.setTransition(swiper.params.speed);
      const getSlideByIndex = (index) =>
        isVirtual
          ? swiper.slides.filter(
              (el) =>
                parseInt(el.getAttribute("data-swiper-slide-index"), 10) ===
                index
            )[0]
          : swiper.slides.eq(index)[0];
      if (
        "auto" !== swiper.params.slidesPerView &&
        swiper.params.slidesPerView > 1
      )
        if (swiper.params.centeredSlides)
          (swiper.visibleSlides || $([])).each((slide) => {
            activeSlides.push(slide);
          });
        else
          for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
          }
      else activeSlides.push(getSlideByIndex(swiper.activeIndex));
      for (i = 0; i < activeSlides.length; i += 1)
        if (void 0 !== activeSlides[i]) {
          const height = activeSlides[i].offsetHeight;
          newHeight = height > newHeight ? height : newHeight;
        }
      (newHeight || 0 === newHeight) &&
        swiper.$wrapperEl.css("height", `${newHeight}px`);
    },
    updateSlidesOffset: function updateSlidesOffset() {
      const swiper = this,
        slides = swiper.slides;
      for (let i = 0; i < slides.length; i += 1)
        slides[i].swiperSlideOffset = swiper.isHorizontal()
          ? slides[i].offsetLeft
          : slides[i].offsetTop;
    },
    updateSlidesProgress: function updateSlidesProgress(translate) {
      void 0 === translate && (translate = (this && this.translate) || 0);
      const swiper = this,
        params = swiper.params,
        { slides: slides, rtlTranslate: rtl, snapGrid: snapGrid } = swiper;
      if (0 === slides.length) return;
      void 0 === slides[0].swiperSlideOffset && swiper.updateSlidesOffset();
      let offsetCenter = -translate;
      rtl && (offsetCenter = translate),
        slides.removeClass(params.slideVisibleClass),
        (swiper.visibleSlidesIndexes = []),
        (swiper.visibleSlides = []);
      for (let i = 0; i < slides.length; i += 1) {
        const slide = slides[i];
        let slideOffset = slide.swiperSlideOffset;
        params.cssMode &&
          params.centeredSlides &&
          (slideOffset -= slides[0].swiperSlideOffset);
        const slideProgress =
            (offsetCenter +
              (params.centeredSlides ? swiper.minTranslate() : 0) -
              slideOffset) /
            (slide.swiperSlideSize + params.spaceBetween),
          originalSlideProgress =
            (offsetCenter -
              snapGrid[0] +
              (params.centeredSlides ? swiper.minTranslate() : 0) -
              slideOffset) /
            (slide.swiperSlideSize + params.spaceBetween),
          slideBefore = -(offsetCenter - slideOffset),
          slideAfter = slideBefore + swiper.slidesSizesGrid[i];
        ((slideBefore >= 0 && slideBefore < swiper.size - 1) ||
          (slideAfter > 1 && slideAfter <= swiper.size) ||
          (slideBefore <= 0 && slideAfter >= swiper.size)) &&
          (swiper.visibleSlides.push(slide),
          swiper.visibleSlidesIndexes.push(i),
          slides.eq(i).addClass(params.slideVisibleClass)),
          (slide.progress = rtl ? -slideProgress : slideProgress),
          (slide.originalProgress = rtl
            ? -originalSlideProgress
            : originalSlideProgress);
      }
      swiper.visibleSlides = $(swiper.visibleSlides);
    },
    updateProgress: function updateProgress(translate) {
      const swiper = this;
      if (void 0 === translate) {
        const multiplier = swiper.rtlTranslate ? -1 : 1;
        translate =
          (swiper && swiper.translate && swiper.translate * multiplier) || 0;
      }
      const params = swiper.params,
        translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      let {
        progress: progress,
        isBeginning: isBeginning,
        isEnd: isEnd,
      } = swiper;
      const wasBeginning = isBeginning,
        wasEnd = isEnd;
      0 === translatesDiff
        ? ((progress = 0), (isBeginning = !0), (isEnd = !0))
        : ((progress = (translate - swiper.minTranslate()) / translatesDiff),
          (isBeginning = progress <= 0),
          (isEnd = progress >= 1)),
        Object.assign(swiper, {
          progress: progress,
          isBeginning: isBeginning,
          isEnd: isEnd,
        }),
        (params.watchSlidesProgress ||
          (params.centeredSlides && params.autoHeight)) &&
          swiper.updateSlidesProgress(translate),
        isBeginning && !wasBeginning && swiper.emit("reachBeginning toEdge"),
        isEnd && !wasEnd && swiper.emit("reachEnd toEdge"),
        ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) &&
          swiper.emit("fromEdge"),
        swiper.emit("progress", progress);
    },
    updateSlidesClasses: function updateSlidesClasses() {
      const swiper = this,
        {
          slides: slides,
          params: params,
          $wrapperEl: $wrapperEl,
          activeIndex: activeIndex,
          realIndex: realIndex,
        } = swiper,
        isVirtual = swiper.virtual && params.virtual.enabled;
      let activeSlide;
      slides.removeClass(
        `${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`
      ),
        (activeSlide = isVirtual
          ? swiper.$wrapperEl.find(
              `.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`
            )
          : slides.eq(activeIndex)),
        activeSlide.addClass(params.slideActiveClass),
        params.loop &&
          (activeSlide.hasClass(params.slideDuplicateClass)
            ? $wrapperEl
                .children(
                  `.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`
                )
                .addClass(params.slideDuplicateActiveClass)
            : $wrapperEl
                .children(
                  `.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`
                )
                .addClass(params.slideDuplicateActiveClass));
      let nextSlide = activeSlide
        .nextAll(`.${params.slideClass}`)
        .eq(0)
        .addClass(params.slideNextClass);
      params.loop &&
        0 === nextSlide.length &&
        ((nextSlide = slides.eq(0)), nextSlide.addClass(params.slideNextClass));
      let prevSlide = activeSlide
        .prevAll(`.${params.slideClass}`)
        .eq(0)
        .addClass(params.slidePrevClass);
      params.loop &&
        0 === prevSlide.length &&
        ((prevSlide = slides.eq(-1)),
        prevSlide.addClass(params.slidePrevClass)),
        params.loop &&
          (nextSlide.hasClass(params.slideDuplicateClass)
            ? $wrapperEl
                .children(
                  `.${params.slideClass}:not(.${
                    params.slideDuplicateClass
                  })[data-swiper-slide-index="${nextSlide.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(params.slideDuplicateNextClass)
            : $wrapperEl
                .children(
                  `.${params.slideClass}.${
                    params.slideDuplicateClass
                  }[data-swiper-slide-index="${nextSlide.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(params.slideDuplicateNextClass),
          prevSlide.hasClass(params.slideDuplicateClass)
            ? $wrapperEl
                .children(
                  `.${params.slideClass}:not(.${
                    params.slideDuplicateClass
                  })[data-swiper-slide-index="${prevSlide.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(params.slideDuplicatePrevClass)
            : $wrapperEl
                .children(
                  `.${params.slideClass}.${
                    params.slideDuplicateClass
                  }[data-swiper-slide-index="${prevSlide.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(params.slideDuplicatePrevClass)),
        swiper.emitSlidesClasses();
    },
    updateActiveIndex: function updateActiveIndex(newActiveIndex) {
      const swiper = this,
        translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate,
        {
          slidesGrid: slidesGrid,
          snapGrid: snapGrid,
          params: params,
          activeIndex: previousIndex,
          realIndex: previousRealIndex,
          snapIndex: previousSnapIndex,
        } = swiper;
      let snapIndex,
        activeIndex = newActiveIndex;
      if (void 0 === activeIndex) {
        for (let i = 0; i < slidesGrid.length; i += 1)
          void 0 !== slidesGrid[i + 1]
            ? translate >= slidesGrid[i] &&
              translate <
                slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2
              ? (activeIndex = i)
              : translate >= slidesGrid[i] &&
                translate < slidesGrid[i + 1] &&
                (activeIndex = i + 1)
            : translate >= slidesGrid[i] && (activeIndex = i);
        params.normalizeSlideIndex &&
          (activeIndex < 0 || void 0 === activeIndex) &&
          (activeIndex = 0);
      }
      if (snapGrid.indexOf(translate) >= 0)
        snapIndex = snapGrid.indexOf(translate);
      else {
        const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
        snapIndex =
          skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }
      if (
        (snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1),
        activeIndex === previousIndex)
      )
        return void (
          snapIndex !== previousSnapIndex &&
          ((swiper.snapIndex = snapIndex), swiper.emit("snapIndexChange"))
        );
      const realIndex = parseInt(
        swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") ||
          activeIndex,
        10
      );
      Object.assign(swiper, {
        snapIndex: snapIndex,
        realIndex: realIndex,
        previousIndex: previousIndex,
        activeIndex: activeIndex,
      }),
        swiper.emit("activeIndexChange"),
        swiper.emit("snapIndexChange"),
        previousRealIndex !== realIndex && swiper.emit("realIndexChange"),
        (swiper.initialized || swiper.params.runCallbacksOnInit) &&
          swiper.emit("slideChange");
    },
    updateClickedSlide: function updateClickedSlide(e) {
      const swiper = this,
        params = swiper.params,
        slide = $(e).closest(`.${params.slideClass}`)[0];
      let slideIndex,
        slideFound = !1;
      if (slide)
        for (let i = 0; i < swiper.slides.length; i += 1)
          if (swiper.slides[i] === slide) {
            (slideFound = !0), (slideIndex = i);
            break;
          }
      if (!slide || !slideFound)
        return (
          (swiper.clickedSlide = void 0), void (swiper.clickedIndex = void 0)
        );
      (swiper.clickedSlide = slide),
        swiper.virtual && swiper.params.virtual.enabled
          ? (swiper.clickedIndex = parseInt(
              $(slide).attr("data-swiper-slide-index"),
              10
            ))
          : (swiper.clickedIndex = slideIndex),
        params.slideToClickedSlide &&
          void 0 !== swiper.clickedIndex &&
          swiper.clickedIndex !== swiper.activeIndex &&
          swiper.slideToClickedSlide();
    },
  };
  var translate = {
    getTranslate: function getSwiperTranslate(axis) {
      void 0 === axis && (axis = this.isHorizontal() ? "x" : "y");
      const {
        params: params,
        rtlTranslate: rtl,
        translate: translate,
        $wrapperEl: $wrapperEl,
      } = this;
      if (params.virtualTranslate) return rtl ? -translate : translate;
      if (params.cssMode) return translate;
      let currentTranslate = getTranslate($wrapperEl[0], axis);
      return (
        rtl && (currentTranslate = -currentTranslate), currentTranslate || 0
      );
    },
    setTranslate: function setTranslate(translate, byController) {
      const swiper = this,
        {
          rtlTranslate: rtl,
          params: params,
          $wrapperEl: $wrapperEl,
          wrapperEl: wrapperEl,
          progress: progress,
        } = swiper;
      let newProgress,
        x = 0,
        y = 0;
      swiper.isHorizontal()
        ? (x = rtl ? -translate : translate)
        : (y = translate),
        params.roundLengths && ((x = Math.floor(x)), (y = Math.floor(y))),
        params.cssMode
          ? (wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] =
              swiper.isHorizontal() ? -x : -y)
          : params.virtualTranslate ||
            $wrapperEl.transform(`translate3d(${x}px, ${y}px, 0px)`),
        (swiper.previousTranslate = swiper.translate),
        (swiper.translate = swiper.isHorizontal() ? x : y);
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      (newProgress =
        0 === translatesDiff
          ? 0
          : (translate - swiper.minTranslate()) / translatesDiff),
        newProgress !== progress && swiper.updateProgress(translate),
        swiper.emit("setTranslate", swiper.translate, byController);
    },
    minTranslate: function minTranslate() {
      return -this.snapGrid[0];
    },
    maxTranslate: function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
    },
    translateTo: function translateTo(
      translate,
      speed,
      runCallbacks,
      translateBounds,
      internal
    ) {
      void 0 === translate && (translate = 0),
        void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0),
        void 0 === translateBounds && (translateBounds = !0);
      const swiper = this,
        { params: params, wrapperEl: wrapperEl } = swiper;
      if (swiper.animating && params.preventInteractionOnTransition) return !1;
      const minTranslate = swiper.minTranslate(),
        maxTranslate = swiper.maxTranslate();
      let newTranslate;
      if (
        ((newTranslate =
          translateBounds && translate > minTranslate
            ? minTranslate
            : translateBounds && translate < maxTranslate
            ? maxTranslate
            : translate),
        swiper.updateProgress(newTranslate),
        params.cssMode)
      ) {
        const isH = swiper.isHorizontal();
        if (0 === speed)
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
        else {
          if (!swiper.support.smoothScroll)
            return (
              animateCSSModeScroll({
                swiper: swiper,
                targetPosition: -newTranslate,
                side: isH ? "left" : "top",
              }),
              !0
            );
          wrapperEl.scrollTo({
            [isH ? "left" : "top"]: -newTranslate,
            behavior: "smooth",
          });
        }
        return !0;
      }
      return (
        0 === speed
          ? (swiper.setTransition(0),
            swiper.setTranslate(newTranslate),
            runCallbacks &&
              (swiper.emit("beforeTransitionStart", speed, internal),
              swiper.emit("transitionEnd")))
          : (swiper.setTransition(speed),
            swiper.setTranslate(newTranslate),
            runCallbacks &&
              (swiper.emit("beforeTransitionStart", speed, internal),
              swiper.emit("transitionStart")),
            swiper.animating ||
              ((swiper.animating = !0),
              swiper.onTranslateToWrapperTransitionEnd ||
                (swiper.onTranslateToWrapperTransitionEnd =
                  function transitionEnd(e) {
                    swiper &&
                      !swiper.destroyed &&
                      e.target === this &&
                      (swiper.$wrapperEl[0].removeEventListener(
                        "transitionend",
                        swiper.onTranslateToWrapperTransitionEnd
                      ),
                      swiper.$wrapperEl[0].removeEventListener(
                        "webkitTransitionEnd",
                        swiper.onTranslateToWrapperTransitionEnd
                      ),
                      (swiper.onTranslateToWrapperTransitionEnd = null),
                      delete swiper.onTranslateToWrapperTransitionEnd,
                      runCallbacks && swiper.emit("transitionEnd"));
                  }),
              swiper.$wrapperEl[0].addEventListener(
                "transitionend",
                swiper.onTranslateToWrapperTransitionEnd
              ),
              swiper.$wrapperEl[0].addEventListener(
                "webkitTransitionEnd",
                swiper.onTranslateToWrapperTransitionEnd
              ))),
        !0
      );
    },
  };
  function transitionEmit(_ref) {
    let {
      swiper: swiper,
      runCallbacks: runCallbacks,
      direction: direction,
      step: step,
    } = _ref;
    const { activeIndex: activeIndex, previousIndex: previousIndex } = swiper;
    let dir = direction;
    if (
      (dir ||
        (dir =
          activeIndex > previousIndex
            ? "next"
            : activeIndex < previousIndex
            ? "prev"
            : "reset"),
      swiper.emit(`transition${step}`),
      runCallbacks && activeIndex !== previousIndex)
    ) {
      if ("reset" === dir)
        return void swiper.emit(`slideResetTransition${step}`);
      swiper.emit(`slideChangeTransition${step}`),
        "next" === dir
          ? swiper.emit(`slideNextTransition${step}`)
          : swiper.emit(`slidePrevTransition${step}`);
    }
  }
  var slide = {
    slideTo: function slideTo(index, speed, runCallbacks, internal, initial) {
      if (
        (void 0 === index && (index = 0),
        void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0),
        "number" != typeof index && "string" != typeof index)
      )
        throw new Error(
          `The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`
        );
      if ("string" == typeof index) {
        const indexAsNumber = parseInt(index, 10);
        if (!isFinite(indexAsNumber))
          throw new Error(
            `The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`
          );
        index = indexAsNumber;
      }
      const swiper = this;
      let slideIndex = index;
      slideIndex < 0 && (slideIndex = 0);
      const {
        params: params,
        snapGrid: snapGrid,
        slidesGrid: slidesGrid,
        previousIndex: previousIndex,
        activeIndex: activeIndex,
        rtlTranslate: rtl,
        wrapperEl: wrapperEl,
        enabled: enabled,
      } = swiper;
      if (
        (swiper.animating && params.preventInteractionOnTransition) ||
        (!enabled && !internal && !initial)
      )
        return !1;
      const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
      let snapIndex =
        skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
      snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1),
        (activeIndex || params.initialSlide || 0) === (previousIndex || 0) &&
          runCallbacks &&
          swiper.emit("beforeSlideChangeStart");
      const translate = -snapGrid[snapIndex];
      if ((swiper.updateProgress(translate), params.normalizeSlideIndex))
        for (let i = 0; i < slidesGrid.length; i += 1) {
          const normalizedTranslate = -Math.floor(100 * translate),
            normalizedGrid = Math.floor(100 * slidesGrid[i]),
            normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
          void 0 !== slidesGrid[i + 1]
            ? normalizedTranslate >= normalizedGrid &&
              normalizedTranslate <
                normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2
              ? (slideIndex = i)
              : normalizedTranslate >= normalizedGrid &&
                normalizedTranslate < normalizedGridNext &&
                (slideIndex = i + 1)
            : normalizedTranslate >= normalizedGrid && (slideIndex = i);
        }
      if (swiper.initialized && slideIndex !== activeIndex) {
        if (
          !swiper.allowSlideNext &&
          translate < swiper.translate &&
          translate < swiper.minTranslate()
        )
          return !1;
        if (
          !swiper.allowSlidePrev &&
          translate > swiper.translate &&
          translate > swiper.maxTranslate() &&
          (activeIndex || 0) !== slideIndex
        )
          return !1;
      }
      let direction;
      if (
        ((direction =
          slideIndex > activeIndex
            ? "next"
            : slideIndex < activeIndex
            ? "prev"
            : "reset"),
        (rtl && -translate === swiper.translate) ||
          (!rtl && translate === swiper.translate))
      )
        return (
          swiper.updateActiveIndex(slideIndex),
          params.autoHeight && swiper.updateAutoHeight(),
          swiper.updateSlidesClasses(),
          "slide" !== params.effect && swiper.setTranslate(translate),
          "reset" !== direction &&
            (swiper.transitionStart(runCallbacks, direction),
            swiper.transitionEnd(runCallbacks, direction)),
          !1
        );
      if (params.cssMode) {
        const isH = swiper.isHorizontal(),
          t = rtl ? translate : -translate;
        if (0 === speed) {
          const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
          isVirtual &&
            ((swiper.wrapperEl.style.scrollSnapType = "none"),
            (swiper._immediateVirtual = !0)),
            (wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t),
            isVirtual &&
              requestAnimationFrame(() => {
                (swiper.wrapperEl.style.scrollSnapType = ""),
                  (swiper._swiperImmediateVirtual = !1);
              });
        } else {
          if (!swiper.support.smoothScroll)
            return (
              animateCSSModeScroll({
                swiper: swiper,
                targetPosition: t,
                side: isH ? "left" : "top",
              }),
              !0
            );
          wrapperEl.scrollTo({ [isH ? "left" : "top"]: t, behavior: "smooth" });
        }
        return !0;
      }
      return (
        swiper.setTransition(speed),
        swiper.setTranslate(translate),
        swiper.updateActiveIndex(slideIndex),
        swiper.updateSlidesClasses(),
        swiper.emit("beforeTransitionStart", speed, internal),
        swiper.transitionStart(runCallbacks, direction),
        0 === speed
          ? swiper.transitionEnd(runCallbacks, direction)
          : swiper.animating ||
            ((swiper.animating = !0),
            swiper.onSlideToWrapperTransitionEnd ||
              (swiper.onSlideToWrapperTransitionEnd = function transitionEnd(
                e
              ) {
                swiper &&
                  !swiper.destroyed &&
                  e.target === this &&
                  (swiper.$wrapperEl[0].removeEventListener(
                    "transitionend",
                    swiper.onSlideToWrapperTransitionEnd
                  ),
                  swiper.$wrapperEl[0].removeEventListener(
                    "webkitTransitionEnd",
                    swiper.onSlideToWrapperTransitionEnd
                  ),
                  (swiper.onSlideToWrapperTransitionEnd = null),
                  delete swiper.onSlideToWrapperTransitionEnd,
                  swiper.transitionEnd(runCallbacks, direction));
              }),
            swiper.$wrapperEl[0].addEventListener(
              "transitionend",
              swiper.onSlideToWrapperTransitionEnd
            ),
            swiper.$wrapperEl[0].addEventListener(
              "webkitTransitionEnd",
              swiper.onSlideToWrapperTransitionEnd
            )),
        !0
      );
    },
    slideToLoop: function slideToLoop(index, speed, runCallbacks, internal) {
      void 0 === index && (index = 0),
        void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0);
      const swiper = this;
      let newIndex = index;
      return (
        swiper.params.loop && (newIndex += swiper.loopedSlides),
        swiper.slideTo(newIndex, speed, runCallbacks, internal)
      );
    },
    slideNext: function slideNext(speed, runCallbacks, internal) {
      void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0);
      const swiper = this,
        { animating: animating, enabled: enabled, params: params } = swiper;
      if (!enabled) return swiper;
      let perGroup = params.slidesPerGroup;
      "auto" === params.slidesPerView &&
        1 === params.slidesPerGroup &&
        params.slidesPerGroupAuto &&
        (perGroup = Math.max(swiper.slidesPerViewDynamic("current", !0), 1));
      const increment =
        swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
      if (params.loop) {
        if (animating && params.loopPreventsSlide) return !1;
        swiper.loopFix(),
          (swiper._clientLeft = swiper.$wrapperEl[0].clientLeft);
      }
      return params.rewind && swiper.isEnd
        ? swiper.slideTo(0, speed, runCallbacks, internal)
        : swiper.slideTo(
            swiper.activeIndex + increment,
            speed,
            runCallbacks,
            internal
          );
    },
    slidePrev: function slidePrev(speed, runCallbacks, internal) {
      void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0);
      const swiper = this,
        {
          params: params,
          animating: animating,
          snapGrid: snapGrid,
          slidesGrid: slidesGrid,
          rtlTranslate: rtlTranslate,
          enabled: enabled,
        } = swiper;
      if (!enabled) return swiper;
      if (params.loop) {
        if (animating && params.loopPreventsSlide) return !1;
        swiper.loopFix(),
          (swiper._clientLeft = swiper.$wrapperEl[0].clientLeft);
      }
      function normalize(val) {
        return val < 0 ? -Math.floor(Math.abs(val)) : Math.floor(val);
      }
      const normalizedTranslate = normalize(
          rtlTranslate ? swiper.translate : -swiper.translate
        ),
        normalizedSnapGrid = snapGrid.map((val) => normalize(val));
      let prevSnap =
        snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
      if (void 0 === prevSnap && params.cssMode) {
        let prevSnapIndex;
        snapGrid.forEach((snap, snapIndex) => {
          normalizedTranslate >= snap && (prevSnapIndex = snapIndex);
        }),
          void 0 !== prevSnapIndex &&
            (prevSnap =
              snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex]);
      }
      let prevIndex = 0;
      if (
        (void 0 !== prevSnap &&
          ((prevIndex = slidesGrid.indexOf(prevSnap)),
          prevIndex < 0 && (prevIndex = swiper.activeIndex - 1),
          "auto" === params.slidesPerView &&
            1 === params.slidesPerGroup &&
            params.slidesPerGroupAuto &&
            ((prevIndex =
              prevIndex - swiper.slidesPerViewDynamic("previous", !0) + 1),
            (prevIndex = Math.max(prevIndex, 0)))),
        params.rewind && swiper.isBeginning)
      ) {
        const lastIndex =
          swiper.params.virtual &&
          swiper.params.virtual.enabled &&
          swiper.virtual
            ? swiper.virtual.slides.length - 1
            : swiper.slides.length - 1;
        return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
      }
      return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    },
    slideReset: function slideReset(speed, runCallbacks, internal) {
      return (
        void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0),
        this.slideTo(this.activeIndex, speed, runCallbacks, internal)
      );
    },
    slideToClosest: function slideToClosest(
      speed,
      runCallbacks,
      internal,
      threshold
    ) {
      void 0 === speed && (speed = this.params.speed),
        void 0 === runCallbacks && (runCallbacks = !0),
        void 0 === threshold && (threshold = 0.5);
      const swiper = this;
      let index = swiper.activeIndex;
      const skip = Math.min(swiper.params.slidesPerGroupSkip, index),
        snapIndex =
          skip + Math.floor((index - skip) / swiper.params.slidesPerGroup),
        translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
      if (translate >= swiper.snapGrid[snapIndex]) {
        const currentSnap = swiper.snapGrid[snapIndex];
        translate - currentSnap >
          (swiper.snapGrid[snapIndex + 1] - currentSnap) * threshold &&
          (index += swiper.params.slidesPerGroup);
      } else {
        const prevSnap = swiper.snapGrid[snapIndex - 1];
        translate - prevSnap <=
          (swiper.snapGrid[snapIndex] - prevSnap) * threshold &&
          (index -= swiper.params.slidesPerGroup);
      }
      return (
        (index = Math.max(index, 0)),
        (index = Math.min(index, swiper.slidesGrid.length - 1)),
        swiper.slideTo(index, speed, runCallbacks, internal)
      );
    },
    slideToClickedSlide: function slideToClickedSlide() {
      const swiper = this,
        { params: params, $wrapperEl: $wrapperEl } = swiper,
        slidesPerView =
          "auto" === params.slidesPerView
            ? swiper.slidesPerViewDynamic()
            : params.slidesPerView;
      let realIndex,
        slideToIndex = swiper.clickedIndex;
      if (params.loop) {
        if (swiper.animating) return;
        (realIndex = parseInt(
          $(swiper.clickedSlide).attr("data-swiper-slide-index"),
          10
        )),
          params.centeredSlides
            ? slideToIndex < swiper.loopedSlides - slidesPerView / 2 ||
              slideToIndex >
                swiper.slides.length - swiper.loopedSlides + slidesPerView / 2
              ? (swiper.loopFix(),
                (slideToIndex = $wrapperEl
                  .children(
                    `.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`
                  )
                  .eq(0)
                  .index()),
                nextTick(() => {
                  swiper.slideTo(slideToIndex);
                }))
              : swiper.slideTo(slideToIndex)
            : slideToIndex > swiper.slides.length - slidesPerView
            ? (swiper.loopFix(),
              (slideToIndex = $wrapperEl
                .children(
                  `.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`
                )
                .eq(0)
                .index()),
              nextTick(() => {
                swiper.slideTo(slideToIndex);
              }))
            : swiper.slideTo(slideToIndex);
      } else swiper.slideTo(slideToIndex);
    },
  };
  var loop = {
    loopCreate: function loopCreate() {
      const swiper = this,
        document = getDocument(),
        { params: params, $wrapperEl: $wrapperEl } = swiper,
        $selector =
          $wrapperEl.children().length > 0
            ? $($wrapperEl.children()[0].parentNode)
            : $wrapperEl;
      $selector
        .children(`.${params.slideClass}.${params.slideDuplicateClass}`)
        .remove();
      let slides = $selector.children(`.${params.slideClass}`);
      if (params.loopFillGroupWithBlank) {
        const blankSlidesNum =
          params.slidesPerGroup - (slides.length % params.slidesPerGroup);
        if (blankSlidesNum !== params.slidesPerGroup) {
          for (let i = 0; i < blankSlidesNum; i += 1) {
            const blankNode = $(document.createElement("div")).addClass(
              `${params.slideClass} ${params.slideBlankClass}`
            );
            $selector.append(blankNode);
          }
          slides = $selector.children(`.${params.slideClass}`);
        }
      }
      "auto" !== params.slidesPerView ||
        params.loopedSlides ||
        (params.loopedSlides = slides.length),
        (swiper.loopedSlides = Math.ceil(
          parseFloat(params.loopedSlides || params.slidesPerView, 10)
        )),
        (swiper.loopedSlides += params.loopAdditionalSlides),
        swiper.loopedSlides > slides.length &&
          (swiper.loopedSlides = slides.length);
      const prependSlides = [],
        appendSlides = [];
      slides.each((el, index) => {
        const slide = $(el);
        index < swiper.loopedSlides && appendSlides.push(el),
          index < slides.length &&
            index >= slides.length - swiper.loopedSlides &&
            prependSlides.push(el),
          slide.attr("data-swiper-slide-index", index);
      });
      for (let i = 0; i < appendSlides.length; i += 1)
        $selector.append(
          $(appendSlides[i].cloneNode(!0)).addClass(params.slideDuplicateClass)
        );
      for (let i = prependSlides.length - 1; i >= 0; i -= 1)
        $selector.prepend(
          $(prependSlides[i].cloneNode(!0)).addClass(params.slideDuplicateClass)
        );
    },
    loopFix: function loopFix() {
      const swiper = this;
      swiper.emit("beforeLoopFix");
      const {
        activeIndex: activeIndex,
        slides: slides,
        loopedSlides: loopedSlides,
        allowSlidePrev: allowSlidePrev,
        allowSlideNext: allowSlideNext,
        snapGrid: snapGrid,
        rtlTranslate: rtl,
      } = swiper;
      let newIndex;
      (swiper.allowSlidePrev = !0), (swiper.allowSlideNext = !0);
      const diff = -snapGrid[activeIndex] - swiper.getTranslate();
      if (activeIndex < loopedSlides) {
        (newIndex = slides.length - 3 * loopedSlides + activeIndex),
          (newIndex += loopedSlides);
        swiper.slideTo(newIndex, 0, !1, !0) &&
          0 !== diff &&
          swiper.setTranslate(
            (rtl ? -swiper.translate : swiper.translate) - diff
          );
      } else if (activeIndex >= slides.length - loopedSlides) {
        (newIndex = -slides.length + activeIndex + loopedSlides),
          (newIndex += loopedSlides);
        swiper.slideTo(newIndex, 0, !1, !0) &&
          0 !== diff &&
          swiper.setTranslate(
            (rtl ? -swiper.translate : swiper.translate) - diff
          );
      }
      (swiper.allowSlidePrev = allowSlidePrev),
        (swiper.allowSlideNext = allowSlideNext),
        swiper.emit("loopFix");
    },
    loopDestroy: function loopDestroy() {
      const { $wrapperEl: $wrapperEl, params: params, slides: slides } = this;
      $wrapperEl
        .children(
          `.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`
        )
        .remove(),
        slides.removeAttr("data-swiper-slide-index");
    },
  };
  function onTouchStart(event) {
    const swiper = this,
      document = getDocument(),
      window = getWindow(),
      data = swiper.touchEventsData,
      { params: params, touches: touches, enabled: enabled } = swiper;
    if (!enabled) return;
    if (swiper.animating && params.preventInteractionOnTransition) return;
    !swiper.animating && params.cssMode && params.loop && swiper.loopFix();
    let e = event;
    e.originalEvent && (e = e.originalEvent);
    let $targetEl = $(e.target);
    if (
      "wrapper" === params.touchEventsTarget &&
      !$targetEl.closest(swiper.wrapperEl).length
    )
      return;
    if (
      ((data.isTouchEvent = "touchstart" === e.type),
      !data.isTouchEvent && "which" in e && 3 === e.which)
    )
      return;
    if (!data.isTouchEvent && "button" in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return;
    !!params.noSwipingClass &&
      "" !== params.noSwipingClass &&
      e.target &&
      e.target.shadowRoot &&
      event.path &&
      event.path[0] &&
      ($targetEl = $(event.path[0]));
    const noSwipingSelector = params.noSwipingSelector
        ? params.noSwipingSelector
        : `.${params.noSwipingClass}`,
      isTargetShadow = !(!e.target || !e.target.shadowRoot);
    if (
      params.noSwiping &&
      (isTargetShadow
        ? (function closestElement(selector, base) {
            return (
              void 0 === base && (base = this),
              (function __closestFrom(el) {
                if (!el || el === getDocument() || el === getWindow())
                  return null;
                el.assignedSlot && (el = el.assignedSlot);
                const found = el.closest(selector);
                return found || el.getRootNode
                  ? found || __closestFrom(el.getRootNode().host)
                  : null;
              })(base)
            );
          })(noSwipingSelector, $targetEl[0])
        : $targetEl.closest(noSwipingSelector)[0])
    )
      return void (swiper.allowClick = !0);
    if (params.swipeHandler && !$targetEl.closest(params.swipeHandler)[0])
      return;
    (touches.currentX =
      "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX),
      (touches.currentY =
        "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY);
    const startX = touches.currentX,
      startY = touches.currentY,
      edgeSwipeDetection =
        params.edgeSwipeDetection || params.iOSEdgeSwipeDetection,
      edgeSwipeThreshold =
        params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
    if (
      edgeSwipeDetection &&
      (startX <= edgeSwipeThreshold ||
        startX >= window.innerWidth - edgeSwipeThreshold)
    ) {
      if ("prevent" !== edgeSwipeDetection) return;
      event.preventDefault();
    }
    if (
      (Object.assign(data, {
        isTouched: !0,
        isMoved: !1,
        allowTouchCallbacks: !0,
        isScrolling: void 0,
        startMoving: void 0,
      }),
      (touches.startX = startX),
      (touches.startY = startY),
      (data.touchStartTime = now()),
      (swiper.allowClick = !0),
      swiper.updateSize(),
      (swiper.swipeDirection = void 0),
      params.threshold > 0 && (data.allowThresholdMove = !1),
      "touchstart" !== e.type)
    ) {
      let preventDefault = !0;
      $targetEl.is(data.focusableElements) &&
        ((preventDefault = !1),
        "SELECT" === $targetEl[0].nodeName && (data.isTouched = !1)),
        document.activeElement &&
          $(document.activeElement).is(data.focusableElements) &&
          document.activeElement !== $targetEl[0] &&
          document.activeElement.blur();
      const shouldPreventDefault =
        preventDefault &&
        swiper.allowTouchMove &&
        params.touchStartPreventDefault;
      (!params.touchStartForcePreventDefault && !shouldPreventDefault) ||
        $targetEl[0].isContentEditable ||
        e.preventDefault();
    }
    swiper.params.freeMode &&
      swiper.params.freeMode.enabled &&
      swiper.freeMode &&
      swiper.animating &&
      !params.cssMode &&
      swiper.freeMode.onTouchStart(),
      swiper.emit("touchStart", e);
  }
  function onTouchMove(event) {
    const document = getDocument(),
      swiper = this,
      data = swiper.touchEventsData,
      {
        params: params,
        touches: touches,
        rtlTranslate: rtl,
        enabled: enabled,
      } = swiper;
    if (!enabled) return;
    let e = event;
    if ((e.originalEvent && (e = e.originalEvent), !data.isTouched))
      return void (
        data.startMoving &&
        data.isScrolling &&
        swiper.emit("touchMoveOpposite", e)
      );
    if (data.isTouchEvent && "touchmove" !== e.type) return;
    const targetTouch =
        "touchmove" === e.type &&
        e.targetTouches &&
        (e.targetTouches[0] || e.changedTouches[0]),
      pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX,
      pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
    if (e.preventedByNestedSwiper)
      return (touches.startX = pageX), void (touches.startY = pageY);
    if (!swiper.allowTouchMove)
      return (
        $(e.target).is(data.focusableElements) || (swiper.allowClick = !1),
        void (
          data.isTouched &&
          (Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY,
          }),
          (data.touchStartTime = now()))
        )
      );
    if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop)
      if (swiper.isVertical()) {
        if (
          (pageY < touches.startY &&
            swiper.translate <= swiper.maxTranslate()) ||
          (pageY > touches.startY && swiper.translate >= swiper.minTranslate())
        )
          return (data.isTouched = !1), void (data.isMoved = !1);
      } else if (
        (pageX < touches.startX && swiper.translate <= swiper.maxTranslate()) ||
        (pageX > touches.startX && swiper.translate >= swiper.minTranslate())
      )
        return;
    if (
      data.isTouchEvent &&
      document.activeElement &&
      e.target === document.activeElement &&
      $(e.target).is(data.focusableElements)
    )
      return (data.isMoved = !0), void (swiper.allowClick = !1);
    if (
      (data.allowTouchCallbacks && swiper.emit("touchMove", e),
      e.targetTouches && e.targetTouches.length > 1)
    )
      return;
    (touches.currentX = pageX), (touches.currentY = pageY);
    const diffX = touches.currentX - touches.startX,
      diffY = touches.currentY - touches.startY;
    if (
      swiper.params.threshold &&
      Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold
    )
      return;
    if (void 0 === data.isScrolling) {
      let touchAngle;
      (swiper.isHorizontal() && touches.currentY === touches.startY) ||
      (swiper.isVertical() && touches.currentX === touches.startX)
        ? (data.isScrolling = !1)
        : diffX * diffX + diffY * diffY >= 25 &&
          ((touchAngle =
            (180 * Math.atan2(Math.abs(diffY), Math.abs(diffX))) / Math.PI),
          (data.isScrolling = swiper.isHorizontal()
            ? touchAngle > params.touchAngle
            : 90 - touchAngle > params.touchAngle));
    }
    if (
      (data.isScrolling && swiper.emit("touchMoveOpposite", e),
      void 0 === data.startMoving &&
        ((touches.currentX === touches.startX &&
          touches.currentY === touches.startY) ||
          (data.startMoving = !0)),
      data.isScrolling)
    )
      return void (data.isTouched = !1);
    if (!data.startMoving) return;
    (swiper.allowClick = !1),
      !params.cssMode && e.cancelable && e.preventDefault(),
      params.touchMoveStopPropagation && !params.nested && e.stopPropagation(),
      data.isMoved ||
        (params.loop && !params.cssMode && swiper.loopFix(),
        (data.startTranslate = swiper.getTranslate()),
        swiper.setTransition(0),
        swiper.animating &&
          swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
        (data.allowMomentumBounce = !1),
        !params.grabCursor ||
          (!0 !== swiper.allowSlideNext && !0 !== swiper.allowSlidePrev) ||
          swiper.setGrabCursor(!0),
        swiper.emit("sliderFirstMove", e)),
      swiper.emit("sliderMove", e),
      (data.isMoved = !0);
    let diff = swiper.isHorizontal() ? diffX : diffY;
    (touches.diff = diff),
      (diff *= params.touchRatio),
      rtl && (diff = -diff),
      (swiper.swipeDirection = diff > 0 ? "prev" : "next"),
      (data.currentTranslate = diff + data.startTranslate);
    let disableParentSwiper = !0,
      resistanceRatio = params.resistanceRatio;
    if (
      (params.touchReleaseOnEdges && (resistanceRatio = 0),
      diff > 0 && data.currentTranslate > swiper.minTranslate()
        ? ((disableParentSwiper = !1),
          params.resistance &&
            (data.currentTranslate =
              swiper.minTranslate() -
              1 +
              (-swiper.minTranslate() + data.startTranslate + diff) **
                resistanceRatio))
        : diff < 0 &&
          data.currentTranslate < swiper.maxTranslate() &&
          ((disableParentSwiper = !1),
          params.resistance &&
            (data.currentTranslate =
              swiper.maxTranslate() +
              1 -
              (swiper.maxTranslate() - data.startTranslate - diff) **
                resistanceRatio)),
      disableParentSwiper && (e.preventedByNestedSwiper = !0),
      !swiper.allowSlideNext &&
        "next" === swiper.swipeDirection &&
        data.currentTranslate < data.startTranslate &&
        (data.currentTranslate = data.startTranslate),
      !swiper.allowSlidePrev &&
        "prev" === swiper.swipeDirection &&
        data.currentTranslate > data.startTranslate &&
        (data.currentTranslate = data.startTranslate),
      swiper.allowSlidePrev ||
        swiper.allowSlideNext ||
        (data.currentTranslate = data.startTranslate),
      params.threshold > 0)
    ) {
      if (!(Math.abs(diff) > params.threshold || data.allowThresholdMove))
        return void (data.currentTranslate = data.startTranslate);
      if (!data.allowThresholdMove)
        return (
          (data.allowThresholdMove = !0),
          (touches.startX = touches.currentX),
          (touches.startY = touches.currentY),
          (data.currentTranslate = data.startTranslate),
          void (touches.diff = swiper.isHorizontal()
            ? touches.currentX - touches.startX
            : touches.currentY - touches.startY)
        );
    }
    params.followFinger &&
      !params.cssMode &&
      (((params.freeMode && params.freeMode.enabled && swiper.freeMode) ||
        params.watchSlidesProgress) &&
        (swiper.updateActiveIndex(), swiper.updateSlidesClasses()),
      swiper.params.freeMode &&
        params.freeMode.enabled &&
        swiper.freeMode &&
        swiper.freeMode.onTouchMove(),
      swiper.updateProgress(data.currentTranslate),
      swiper.setTranslate(data.currentTranslate));
  }
  function onTouchEnd(event) {
    const swiper = this,
      data = swiper.touchEventsData,
      {
        params: params,
        touches: touches,
        rtlTranslate: rtl,
        slidesGrid: slidesGrid,
        enabled: enabled,
      } = swiper;
    if (!enabled) return;
    let e = event;
    if (
      (e.originalEvent && (e = e.originalEvent),
      data.allowTouchCallbacks && swiper.emit("touchEnd", e),
      (data.allowTouchCallbacks = !1),
      !data.isTouched)
    )
      return (
        data.isMoved && params.grabCursor && swiper.setGrabCursor(!1),
        (data.isMoved = !1),
        void (data.startMoving = !1)
      );
    params.grabCursor &&
      data.isMoved &&
      data.isTouched &&
      (!0 === swiper.allowSlideNext || !0 === swiper.allowSlidePrev) &&
      swiper.setGrabCursor(!1);
    const touchEndTime = now(),
      timeDiff = touchEndTime - data.touchStartTime;
    if (swiper.allowClick) {
      const pathTree = e.path || (e.composedPath && e.composedPath());
      swiper.updateClickedSlide((pathTree && pathTree[0]) || e.target),
        swiper.emit("tap click", e),
        timeDiff < 300 &&
          touchEndTime - data.lastClickTime < 300 &&
          swiper.emit("doubleTap doubleClick", e);
    }
    if (
      ((data.lastClickTime = now()),
      nextTick(() => {
        swiper.destroyed || (swiper.allowClick = !0);
      }),
      !data.isTouched ||
        !data.isMoved ||
        !swiper.swipeDirection ||
        0 === touches.diff ||
        data.currentTranslate === data.startTranslate)
    )
      return (
        (data.isTouched = !1), (data.isMoved = !1), void (data.startMoving = !1)
      );
    let currentPos;
    if (
      ((data.isTouched = !1),
      (data.isMoved = !1),
      (data.startMoving = !1),
      (currentPos = params.followFinger
        ? rtl
          ? swiper.translate
          : -swiper.translate
        : -data.currentTranslate),
      params.cssMode)
    )
      return;
    if (swiper.params.freeMode && params.freeMode.enabled)
      return void swiper.freeMode.onTouchEnd({ currentPos: currentPos });
    let stopIndex = 0,
      groupSize = swiper.slidesSizesGrid[0];
    for (
      let i = 0;
      i < slidesGrid.length;
      i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup
    ) {
      const increment =
        i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      void 0 !== slidesGrid[i + increment]
        ? currentPos >= slidesGrid[i] &&
          currentPos < slidesGrid[i + increment] &&
          ((stopIndex = i),
          (groupSize = slidesGrid[i + increment] - slidesGrid[i]))
        : currentPos >= slidesGrid[i] &&
          ((stopIndex = i),
          (groupSize =
            slidesGrid[slidesGrid.length - 1] -
            slidesGrid[slidesGrid.length - 2]));
    }
    let rewindFirstIndex = null,
      rewindLastIndex = null;
    params.rewind &&
      (swiper.isBeginning
        ? (rewindLastIndex =
            swiper.params.virtual &&
            swiper.params.virtual.enabled &&
            swiper.virtual
              ? swiper.virtual.slides.length - 1
              : swiper.slides.length - 1)
        : swiper.isEnd && (rewindFirstIndex = 0));
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize,
      increment =
        stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      if (!params.longSwipes) return void swiper.slideTo(swiper.activeIndex);
      "next" === swiper.swipeDirection &&
        (ratio >= params.longSwipesRatio
          ? swiper.slideTo(
              params.rewind && swiper.isEnd
                ? rewindFirstIndex
                : stopIndex + increment
            )
          : swiper.slideTo(stopIndex)),
        "prev" === swiper.swipeDirection &&
          (ratio > 1 - params.longSwipesRatio
            ? swiper.slideTo(stopIndex + increment)
            : null !== rewindLastIndex &&
              ratio < 0 &&
              Math.abs(ratio) > params.longSwipesRatio
            ? swiper.slideTo(rewindLastIndex)
            : swiper.slideTo(stopIndex));
    } else {
      if (!params.shortSwipes) return void swiper.slideTo(swiper.activeIndex);
      swiper.navigation &&
      (e.target === swiper.navigation.nextEl ||
        e.target === swiper.navigation.prevEl)
        ? e.target === swiper.navigation.nextEl
          ? swiper.slideTo(stopIndex + increment)
          : swiper.slideTo(stopIndex)
        : ("next" === swiper.swipeDirection &&
            swiper.slideTo(
              null !== rewindFirstIndex
                ? rewindFirstIndex
                : stopIndex + increment
            ),
          "prev" === swiper.swipeDirection &&
            swiper.slideTo(
              null !== rewindLastIndex ? rewindLastIndex : stopIndex
            ));
    }
  }
  function onResize() {
    const swiper = this,
      { params: params, el: el } = swiper;
    if (el && 0 === el.offsetWidth) return;
    params.breakpoints && swiper.setBreakpoint();
    const {
      allowSlideNext: allowSlideNext,
      allowSlidePrev: allowSlidePrev,
      snapGrid: snapGrid,
    } = swiper;
    (swiper.allowSlideNext = !0),
      (swiper.allowSlidePrev = !0),
      swiper.updateSize(),
      swiper.updateSlides(),
      swiper.updateSlidesClasses(),
      ("auto" === params.slidesPerView || params.slidesPerView > 1) &&
      swiper.isEnd &&
      !swiper.isBeginning &&
      !swiper.params.centeredSlides
        ? swiper.slideTo(swiper.slides.length - 1, 0, !1, !0)
        : swiper.slideTo(swiper.activeIndex, 0, !1, !0),
      swiper.autoplay &&
        swiper.autoplay.running &&
        swiper.autoplay.paused &&
        swiper.autoplay.run(),
      (swiper.allowSlidePrev = allowSlidePrev),
      (swiper.allowSlideNext = allowSlideNext),
      swiper.params.watchOverflow &&
        snapGrid !== swiper.snapGrid &&
        swiper.checkOverflow();
  }
  function onClick(e) {
    const swiper = this;
    swiper.enabled &&
      (swiper.allowClick ||
        (swiper.params.preventClicks && e.preventDefault(),
        swiper.params.preventClicksPropagation &&
          swiper.animating &&
          (e.stopPropagation(), e.stopImmediatePropagation())));
  }
  function onScroll() {
    const swiper = this,
      {
        wrapperEl: wrapperEl,
        rtlTranslate: rtlTranslate,
        enabled: enabled,
      } = swiper;
    if (!enabled) return;
    let newProgress;
    (swiper.previousTranslate = swiper.translate),
      swiper.isHorizontal()
        ? (swiper.translate = -wrapperEl.scrollLeft)
        : (swiper.translate = -wrapperEl.scrollTop),
      0 === swiper.translate && (swiper.translate = 0),
      swiper.updateActiveIndex(),
      swiper.updateSlidesClasses();
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    (newProgress =
      0 === translatesDiff
        ? 0
        : (swiper.translate - swiper.minTranslate()) / translatesDiff),
      newProgress !== swiper.progress &&
        swiper.updateProgress(
          rtlTranslate ? -swiper.translate : swiper.translate
        ),
      swiper.emit("setTranslate", swiper.translate, !1);
  }
  let dummyEventAttached = !1;
  function dummyEventListener() {}
  const events = (swiper, method) => {
    const document = getDocument(),
      {
        params: params,
        touchEvents: touchEvents,
        el: el,
        wrapperEl: wrapperEl,
        device: device,
        support: support,
      } = swiper,
      capture = !!params.nested,
      domMethod = "on" === method ? "addEventListener" : "removeEventListener",
      swiperMethod = method;
    if (support.touch) {
      const passiveListener = !(
        "touchstart" !== touchEvents.start ||
        !support.passiveListener ||
        !params.passiveListeners
      ) && { passive: !0, capture: !1 };
      el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener),
        el[domMethod](
          touchEvents.move,
          swiper.onTouchMove,
          support.passiveListener ? { passive: !1, capture: capture } : capture
        ),
        el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener),
        touchEvents.cancel &&
          el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    } else
      el[domMethod](touchEvents.start, swiper.onTouchStart, !1),
        document[domMethod](touchEvents.move, swiper.onTouchMove, capture),
        document[domMethod](touchEvents.end, swiper.onTouchEnd, !1);
    (params.preventClicks || params.preventClicksPropagation) &&
      el[domMethod]("click", swiper.onClick, !0),
      params.cssMode && wrapperEl[domMethod]("scroll", swiper.onScroll),
      params.updateOnWindowResize
        ? swiper[swiperMethod](
            device.ios || device.android
              ? "resize orientationchange observerUpdate"
              : "resize observerUpdate",
            onResize,
            !0
          )
        : swiper[swiperMethod]("observerUpdate", onResize, !0);
  };
  var events$1 = {
    attachEvents: function attachEvents() {
      const swiper = this,
        document = getDocument(),
        { params: params, support: support } = swiper;
      (swiper.onTouchStart = onTouchStart.bind(swiper)),
        (swiper.onTouchMove = onTouchMove.bind(swiper)),
        (swiper.onTouchEnd = onTouchEnd.bind(swiper)),
        params.cssMode && (swiper.onScroll = onScroll.bind(swiper)),
        (swiper.onClick = onClick.bind(swiper)),
        support.touch &&
          !dummyEventAttached &&
          (document.addEventListener("touchstart", dummyEventListener),
          (dummyEventAttached = !0)),
        events(swiper, "on");
    },
    detachEvents: function detachEvents() {
      events(this, "off");
    },
  };
  const isGridEnabled = (swiper, params) =>
    swiper.grid && params.grid && params.grid.rows > 1;
  var classes = {
    addClasses: function addClasses() {
      const {
          classNames: classNames,
          params: params,
          rtl: rtl,
          $el: $el,
          device: device,
          support: support,
        } = this,
        suffixes = (function prepareClasses(entries, prefix) {
          const resultClasses = [];
          return (
            entries.forEach((item) => {
              "object" == typeof item
                ? Object.keys(item).forEach((classNames) => {
                    item[classNames] && resultClasses.push(prefix + classNames);
                  })
                : "string" == typeof item && resultClasses.push(prefix + item);
            }),
            resultClasses
          );
        })(
          [
            "initialized",
            params.direction,
            { "pointer-events": !support.touch },
            { "free-mode": this.params.freeMode && params.freeMode.enabled },
            { autoheight: params.autoHeight },
            { rtl: rtl },
            { grid: params.grid && params.grid.rows > 1 },
            {
              "grid-column":
                params.grid &&
                params.grid.rows > 1 &&
                "column" === params.grid.fill,
            },
            { android: device.android },
            { ios: device.ios },
            { "css-mode": params.cssMode },
            { centered: params.cssMode && params.centeredSlides },
            { "watch-progress": params.watchSlidesProgress },
          ],
          params.containerModifierClass
        );
      classNames.push(...suffixes),
        $el.addClass([...classNames].join(" ")),
        this.emitContainerClasses();
    },
    removeClasses: function removeClasses() {
      const { $el: $el, classNames: classNames } = this;
      $el.removeClass(classNames.join(" ")), this.emitContainerClasses();
    },
  };
  var defaults = {
    init: !0,
    direction: "horizontal",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: !1,
    updateOnWindowResize: !0,
    resizeObserver: !0,
    nested: !1,
    createElements: !1,
    enabled: !0,
    focusableElements: "input, select, option, textarea, button, video, label",
    width: null,
    height: null,
    preventInteractionOnTransition: !1,
    userAgent: null,
    url: null,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsBase: "window",
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: !1,
    centeredSlides: !1,
    centeredSlidesBounds: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !0,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 0,
    touchMoveStopPropagation: !1,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: 0.85,
    watchSlidesProgress: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    preloadImages: !0,
    updateOnImagesReady: !0,
    loop: !1,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopFillGroupWithBlank: !1,
    loopPreventsSlide: !0,
    rewind: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    maxBackfaceHiddenSlides: 10,
    containerModifierClass: "swiper-",
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-invisible-blank",
    slideActiveClass: "swiper-slide-active",
    slideDuplicateActiveClass: "swiper-slide-duplicate-active",
    slideVisibleClass: "swiper-slide-visible",
    slideDuplicateClass: "swiper-slide-duplicate",
    slideNextClass: "swiper-slide-next",
    slideDuplicateNextClass: "swiper-slide-duplicate-next",
    slidePrevClass: "swiper-slide-prev",
    slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
    wrapperClass: "swiper-wrapper",
    runCallbacksOnInit: !0,
    _emitClasses: !1,
  };
  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj) {
      void 0 === obj && (obj = {});
      const moduleParamName = Object.keys(obj)[0],
        moduleParams = obj[moduleParamName];
      "object" == typeof moduleParams && null !== moduleParams
        ? (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >=
            0 &&
            !0 === params[moduleParamName] &&
            (params[moduleParamName] = { auto: !0 }),
          moduleParamName in params && "enabled" in moduleParams
            ? (!0 === params[moduleParamName] &&
                (params[moduleParamName] = { enabled: !0 }),
              "object" != typeof params[moduleParamName] ||
                "enabled" in params[moduleParamName] ||
                (params[moduleParamName].enabled = !0),
              params[moduleParamName] ||
                (params[moduleParamName] = { enabled: !1 }),
              extend(allModulesParams, obj))
            : extend(allModulesParams, obj))
        : extend(allModulesParams, obj);
    };
  }
  const prototypes = {
      eventsEmitter: eventsEmitter,
      update: update,
      translate: translate,
      transition: {
        setTransition: function setTransition(duration, byController) {
          const swiper = this;
          swiper.params.cssMode || swiper.$wrapperEl.transition(duration),
            swiper.emit("setTransition", duration, byController);
        },
        transitionStart: function transitionStart(runCallbacks, direction) {
          void 0 === runCallbacks && (runCallbacks = !0);
          const swiper = this,
            { params: params } = swiper;
          params.cssMode ||
            (params.autoHeight && swiper.updateAutoHeight(),
            transitionEmit({
              swiper: swiper,
              runCallbacks: runCallbacks,
              direction: direction,
              step: "Start",
            }));
        },
        transitionEnd: function transitionEnd(runCallbacks, direction) {
          void 0 === runCallbacks && (runCallbacks = !0);
          const { params: params } = this;
          (this.animating = !1),
            params.cssMode ||
              (this.setTransition(0),
              transitionEmit({
                swiper: this,
                runCallbacks: runCallbacks,
                direction: direction,
                step: "End",
              }));
        },
      },
      slide: slide,
      loop: loop,
      grabCursor: {
        setGrabCursor: function setGrabCursor(moving) {
          if (
            this.support.touch ||
            !this.params.simulateTouch ||
            (this.params.watchOverflow && this.isLocked) ||
            this.params.cssMode
          )
            return;
          const el =
            "container" === this.params.touchEventsTarget
              ? this.el
              : this.wrapperEl;
          (el.style.cursor = "move"),
            (el.style.cursor = moving ? "grabbing" : "grab");
        },
        unsetGrabCursor: function unsetGrabCursor() {
          this.support.touch ||
            (this.params.watchOverflow && this.isLocked) ||
            this.params.cssMode ||
            (this[
              "container" === this.params.touchEventsTarget ? "el" : "wrapperEl"
            ].style.cursor = "");
        },
      },
      events: events$1,
      breakpoints: {
        setBreakpoint: function setBreakpoint() {
          const swiper = this,
            {
              activeIndex: activeIndex,
              initialized: initialized,
              loopedSlides: loopedSlides = 0,
              params: params,
              $el: $el,
            } = swiper,
            breakpoints = params.breakpoints;
          if (
            !breakpoints ||
            (breakpoints && 0 === Object.keys(breakpoints).length)
          )
            return;
          const breakpoint = swiper.getBreakpoint(
            breakpoints,
            swiper.params.breakpointsBase,
            swiper.el
          );
          if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
          const breakpointParams =
              (breakpoint in breakpoints ? breakpoints[breakpoint] : void 0) ||
              swiper.originalParams,
            wasMultiRow = isGridEnabled(swiper, params),
            isMultiRow = isGridEnabled(swiper, breakpointParams),
            wasEnabled = params.enabled;
          wasMultiRow && !isMultiRow
            ? ($el.removeClass(
                `${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`
              ),
              swiper.emitContainerClasses())
            : !wasMultiRow &&
              isMultiRow &&
              ($el.addClass(`${params.containerModifierClass}grid`),
              ((breakpointParams.grid.fill &&
                "column" === breakpointParams.grid.fill) ||
                (!breakpointParams.grid.fill &&
                  "column" === params.grid.fill)) &&
                $el.addClass(`${params.containerModifierClass}grid-column`),
              swiper.emitContainerClasses());
          const directionChanged =
              breakpointParams.direction &&
              breakpointParams.direction !== params.direction,
            needsReLoop =
              params.loop &&
              (breakpointParams.slidesPerView !== params.slidesPerView ||
                directionChanged);
          directionChanged && initialized && swiper.changeDirection(),
            extend(swiper.params, breakpointParams);
          const isEnabled = swiper.params.enabled;
          Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev,
          }),
            wasEnabled && !isEnabled
              ? swiper.disable()
              : !wasEnabled && isEnabled && swiper.enable(),
            (swiper.currentBreakpoint = breakpoint),
            swiper.emit("_beforeBreakpoint", breakpointParams),
            needsReLoop &&
              initialized &&
              (swiper.loopDestroy(),
              swiper.loopCreate(),
              swiper.updateSlides(),
              swiper.slideTo(
                activeIndex - loopedSlides + swiper.loopedSlides,
                0,
                !1
              )),
            swiper.emit("breakpoint", breakpointParams);
        },
        getBreakpoint: function getBreakpoint(breakpoints, base, containerEl) {
          if (
            (void 0 === base && (base = "window"),
            !breakpoints || ("container" === base && !containerEl))
          )
            return;
          let breakpoint = !1;
          const window = getWindow(),
            currentHeight =
              "window" === base ? window.innerHeight : containerEl.clientHeight,
            points = Object.keys(breakpoints).map((point) => {
              if ("string" == typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                return { value: currentHeight * minRatio, point: point };
              }
              return { value: point, point: point };
            });
          points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
          for (let i = 0; i < points.length; i += 1) {
            const { point: point, value: value } = points[i];
            "window" === base
              ? window.matchMedia(`(min-width: ${value}px)`).matches &&
                (breakpoint = point)
              : value <= containerEl.clientWidth && (breakpoint = point);
          }
          return breakpoint || "max";
        },
      },
      checkOverflow: {
        checkOverflow: function checkOverflow() {
          const swiper = this,
            { isLocked: wasLocked, params: params } = swiper,
            { slidesOffsetBefore: slidesOffsetBefore } = params;
          if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1,
              lastSlideRightEdge =
                swiper.slidesGrid[lastSlideIndex] +
                swiper.slidesSizesGrid[lastSlideIndex] +
                2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
          } else swiper.isLocked = 1 === swiper.snapGrid.length;
          !0 === params.allowSlideNext &&
            (swiper.allowSlideNext = !swiper.isLocked),
            !0 === params.allowSlidePrev &&
              (swiper.allowSlidePrev = !swiper.isLocked),
            wasLocked && wasLocked !== swiper.isLocked && (swiper.isEnd = !1),
            wasLocked !== swiper.isLocked &&
              swiper.emit(swiper.isLocked ? "lock" : "unlock");
        },
      },
      classes: classes,
      images: {
        loadImage: function loadImage(
          imageEl,
          src,
          srcset,
          sizes,
          checkForComplete,
          callback
        ) {
          const window = getWindow();
          let image;
          function onReady() {
            callback && callback();
          }
          $(imageEl).parent("picture")[0] ||
          (imageEl.complete && checkForComplete)
            ? onReady()
            : src
            ? ((image = new window.Image()),
              (image.onload = onReady),
              (image.onerror = onReady),
              sizes && (image.sizes = sizes),
              srcset && (image.srcset = srcset),
              src && (image.src = src))
            : onReady();
        },
        preloadImages: function preloadImages() {
          const swiper = this;
          function onReady() {
            null != swiper &&
              swiper &&
              !swiper.destroyed &&
              (void 0 !== swiper.imagesLoaded && (swiper.imagesLoaded += 1),
              swiper.imagesLoaded === swiper.imagesToLoad.length &&
                (swiper.params.updateOnImagesReady && swiper.update(),
                swiper.emit("imagesReady")));
          }
          swiper.imagesToLoad = swiper.$el.find("img");
          for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(
              imageEl,
              imageEl.currentSrc || imageEl.getAttribute("src"),
              imageEl.srcset || imageEl.getAttribute("srcset"),
              imageEl.sizes || imageEl.getAttribute("sizes"),
              !0,
              onReady
            );
          }
        },
      },
    },
    extendedDefaults = {};
  class Swiper {
    constructor() {
      let el, params;
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      )
        args[_key] = arguments[_key];
      if (
        (1 === args.length &&
        args[0].constructor &&
        "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)
          ? (params = args[0])
          : ([el, params] = args),
        params || (params = {}),
        (params = extend({}, params)),
        el && !params.el && (params.el = el),
        params.el && $(params.el).length > 1)
      ) {
        const swipers = [];
        return (
          $(params.el).each((containerEl) => {
            const newParams = extend({}, params, { el: containerEl });
            swipers.push(new Swiper(newParams));
          }),
          swipers
        );
      }
      const swiper = this;
      (swiper.__swiper__ = !0),
        (swiper.support = getSupport()),
        (swiper.device = getDevice({ userAgent: params.userAgent })),
        (swiper.browser = getBrowser()),
        (swiper.eventsListeners = {}),
        (swiper.eventsAnyListeners = []),
        (swiper.modules = [...swiper.__modules__]),
        params.modules &&
          Array.isArray(params.modules) &&
          swiper.modules.push(...params.modules);
      const allModulesParams = {};
      swiper.modules.forEach((mod) => {
        mod({
          swiper: swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper),
        });
      });
      const swiperParams = extend({}, defaults, allModulesParams);
      return (
        (swiper.params = extend({}, swiperParams, extendedDefaults, params)),
        (swiper.originalParams = extend({}, swiper.params)),
        (swiper.passedParams = extend({}, params)),
        swiper.params &&
          swiper.params.on &&
          Object.keys(swiper.params.on).forEach((eventName) => {
            swiper.on(eventName, swiper.params.on[eventName]);
          }),
        swiper.params &&
          swiper.params.onAny &&
          swiper.onAny(swiper.params.onAny),
        (swiper.$ = $),
        Object.assign(swiper, {
          enabled: swiper.params.enabled,
          el: el,
          classNames: [],
          slides: $(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: () => "horizontal" === swiper.params.direction,
          isVertical: () => "vertical" === swiper.params.direction,
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: swiper.params.allowSlideNext,
          allowSlidePrev: swiper.params.allowSlidePrev,
          touchEvents: (function touchEvents() {
            const touch = [
                "touchstart",
                "touchmove",
                "touchend",
                "touchcancel",
              ],
              desktop = ["pointerdown", "pointermove", "pointerup"];
            return (
              (swiper.touchEventsTouch = {
                start: touch[0],
                move: touch[1],
                end: touch[2],
                cancel: touch[3],
              }),
              (swiper.touchEventsDesktop = {
                start: desktop[0],
                move: desktop[1],
                end: desktop[2],
              }),
              swiper.support.touch || !swiper.params.simulateTouch
                ? swiper.touchEventsTouch
                : swiper.touchEventsDesktop
            );
          })(),
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: swiper.params.focusableElements,
            lastClickTime: now(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            isTouchEvent: void 0,
            startMoving: void 0,
          },
          allowClick: !0,
          allowTouchMove: swiper.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        swiper.emit("_swiper"),
        swiper.params.init && swiper.init(),
        swiper
      );
    }
    enable() {
      const swiper = this;
      swiper.enabled ||
        ((swiper.enabled = !0),
        swiper.params.grabCursor && swiper.setGrabCursor(),
        swiper.emit("enable"));
    }
    disable() {
      const swiper = this;
      swiper.enabled &&
        ((swiper.enabled = !1),
        swiper.params.grabCursor && swiper.unsetGrabCursor(),
        swiper.emit("disable"));
    }
    setProgress(progress, speed) {
      progress = Math.min(Math.max(progress, 0), 1);
      const min = this.minTranslate(),
        current = (this.maxTranslate() - min) * progress + min;
      this.translateTo(current, void 0 === speed ? 0 : speed),
        this.updateActiveIndex(),
        this.updateSlidesClasses();
    }
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className
        .split(" ")
        .filter(
          (className) =>
            0 === className.indexOf("swiper") ||
            0 === className.indexOf(swiper.params.containerModifierClass)
        );
      swiper.emit("_containerClasses", cls.join(" "));
    }
    getSlideClasses(slideEl) {
      const swiper = this;
      return swiper.destroyed
        ? ""
        : slideEl.className
            .split(" ")
            .filter(
              (className) =>
                0 === className.indexOf("swiper-slide") ||
                0 === className.indexOf(swiper.params.slideClass)
            )
            .join(" ");
    }
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.slides.each((slideEl) => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({ slideEl: slideEl, classNames: classNames }),
          swiper.emit("_slideClass", slideEl, classNames);
      }),
        swiper.emit("_slideClasses", updates);
    }
    slidesPerViewDynamic(view, exact) {
      void 0 === view && (view = "current"), void 0 === exact && (exact = !1);
      const {
        params: params,
        slides: slides,
        slidesGrid: slidesGrid,
        slidesSizesGrid: slidesSizesGrid,
        size: swiperSize,
        activeIndex: activeIndex,
      } = this;
      let spv = 1;
      if (params.centeredSlides) {
        let breakLoop,
          slideSize = slides[activeIndex].swiperSlideSize;
        for (let i = activeIndex + 1; i < slides.length; i += 1)
          slides[i] &&
            !breakLoop &&
            ((slideSize += slides[i].swiperSlideSize),
            (spv += 1),
            slideSize > swiperSize && (breakLoop = !0));
        for (let i = activeIndex - 1; i >= 0; i -= 1)
          slides[i] &&
            !breakLoop &&
            ((slideSize += slides[i].swiperSlideSize),
            (spv += 1),
            slideSize > swiperSize && (breakLoop = !0));
      } else if ("current" === view)
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          (exact
            ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] <
              swiperSize
            : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) &&
            (spv += 1);
        }
      else
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          slidesGrid[activeIndex] - slidesGrid[i] < swiperSize && (spv += 1);
        }
      return spv;
    }
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const { snapGrid: snapGrid, params: params } = swiper;
      function setTranslate() {
        const translateValue = swiper.rtlTranslate
            ? -1 * swiper.translate
            : swiper.translate,
          newTranslate = Math.min(
            Math.max(translateValue, swiper.maxTranslate()),
            swiper.minTranslate()
          );
        swiper.setTranslate(newTranslate),
          swiper.updateActiveIndex(),
          swiper.updateSlidesClasses();
      }
      let translated;
      params.breakpoints && swiper.setBreakpoint(),
        swiper.updateSize(),
        swiper.updateSlides(),
        swiper.updateProgress(),
        swiper.updateSlidesClasses(),
        swiper.params.freeMode && swiper.params.freeMode.enabled
          ? (setTranslate(),
            swiper.params.autoHeight && swiper.updateAutoHeight())
          : ((translated =
              ("auto" === swiper.params.slidesPerView ||
                swiper.params.slidesPerView > 1) &&
              swiper.isEnd &&
              !swiper.params.centeredSlides
                ? swiper.slideTo(swiper.slides.length - 1, 0, !1, !0)
                : swiper.slideTo(swiper.activeIndex, 0, !1, !0)),
            translated || setTranslate()),
        params.watchOverflow &&
          snapGrid !== swiper.snapGrid &&
          swiper.checkOverflow(),
        swiper.emit("update");
    }
    changeDirection(newDirection, needUpdate) {
      void 0 === needUpdate && (needUpdate = !0);
      const swiper = this,
        currentDirection = swiper.params.direction;
      return (
        newDirection ||
          (newDirection =
            "horizontal" === currentDirection ? "vertical" : "horizontal"),
        newDirection === currentDirection ||
          ("horizontal" !== newDirection && "vertical" !== newDirection) ||
          (swiper.$el
            .removeClass(
              `${swiper.params.containerModifierClass}${currentDirection}`
            )
            .addClass(`${swiper.params.containerModifierClass}${newDirection}`),
          swiper.emitContainerClasses(),
          (swiper.params.direction = newDirection),
          swiper.slides.each((slideEl) => {
            "vertical" === newDirection
              ? (slideEl.style.width = "")
              : (slideEl.style.height = "");
          }),
          swiper.emit("changeDirection"),
          needUpdate && swiper.update()),
        swiper
      );
    }
    mount(el) {
      const swiper = this;
      if (swiper.mounted) return !0;
      const $el = $(el || swiper.params.el);
      if (!(el = $el[0])) return !1;
      el.swiper = swiper;
      const getWrapperSelector = () =>
        `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
      let $wrapperEl = (() => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = $(el.shadowRoot.querySelector(getWrapperSelector()));
          return (res.children = (options) => $el.children(options)), res;
        }
        return $el.children
          ? $el.children(getWrapperSelector())
          : $($el).children(getWrapperSelector());
      })();
      if (0 === $wrapperEl.length && swiper.params.createElements) {
        const wrapper = getDocument().createElement("div");
        ($wrapperEl = $(wrapper)),
          (wrapper.className = swiper.params.wrapperClass),
          $el.append(wrapper),
          $el.children(`.${swiper.params.slideClass}`).each((slideEl) => {
            $wrapperEl.append(slideEl);
          });
      }
      return (
        Object.assign(swiper, {
          $el: $el,
          el: el,
          $wrapperEl: $wrapperEl,
          wrapperEl: $wrapperEl[0],
          mounted: !0,
          rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
          rtlTranslate:
            "horizontal" === swiper.params.direction &&
            ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
          wrongRTL: "-webkit-box" === $wrapperEl.css("display"),
        }),
        !0
      );
    }
    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      return (
        !1 === swiper.mount(el) ||
          (swiper.emit("beforeInit"),
          swiper.params.breakpoints && swiper.setBreakpoint(),
          swiper.addClasses(),
          swiper.params.loop && swiper.loopCreate(),
          swiper.updateSize(),
          swiper.updateSlides(),
          swiper.params.watchOverflow && swiper.checkOverflow(),
          swiper.params.grabCursor && swiper.enabled && swiper.setGrabCursor(),
          swiper.params.preloadImages && swiper.preloadImages(),
          swiper.params.loop
            ? swiper.slideTo(
                swiper.params.initialSlide + swiper.loopedSlides,
                0,
                swiper.params.runCallbacksOnInit,
                !1,
                !0
              )
            : swiper.slideTo(
                swiper.params.initialSlide,
                0,
                swiper.params.runCallbacksOnInit,
                !1,
                !0
              ),
          swiper.attachEvents(),
          (swiper.initialized = !0),
          swiper.emit("init"),
          swiper.emit("afterInit")),
        swiper
      );
    }
    destroy(deleteInstance, cleanStyles) {
      void 0 === deleteInstance && (deleteInstance = !0),
        void 0 === cleanStyles && (cleanStyles = !0);
      const swiper = this,
        {
          params: params,
          $el: $el,
          $wrapperEl: $wrapperEl,
          slides: slides,
        } = swiper;
      return (
        void 0 === swiper.params ||
          swiper.destroyed ||
          (swiper.emit("beforeDestroy"),
          (swiper.initialized = !1),
          swiper.detachEvents(),
          params.loop && swiper.loopDestroy(),
          cleanStyles &&
            (swiper.removeClasses(),
            $el.removeAttr("style"),
            $wrapperEl.removeAttr("style"),
            slides &&
              slides.length &&
              slides
                .removeClass(
                  [
                    params.slideVisibleClass,
                    params.slideActiveClass,
                    params.slideNextClass,
                    params.slidePrevClass,
                  ].join(" ")
                )
                .removeAttr("style")
                .removeAttr("data-swiper-slide-index")),
          swiper.emit("destroy"),
          Object.keys(swiper.eventsListeners).forEach((eventName) => {
            swiper.off(eventName);
          }),
          !1 !== deleteInstance &&
            ((swiper.$el[0].swiper = null),
            (function deleteProps(obj) {
              const object = obj;
              Object.keys(object).forEach((key) => {
                try {
                  object[key] = null;
                } catch (e) {}
                try {
                  delete object[key];
                } catch (e) {}
              });
            })(swiper)),
          (swiper.destroyed = !0)),
        null
      );
    }
    static extendDefaults(newDefaults) {
      extend(extendedDefaults, newDefaults);
    }
    static get extendedDefaults() {
      return extendedDefaults;
    }
    static get defaults() {
      return defaults;
    }
    static installModule(mod) {
      Swiper.prototype.__modules__ || (Swiper.prototype.__modules__ = []);
      const modules = Swiper.prototype.__modules__;
      "function" == typeof mod && modules.indexOf(mod) < 0 && modules.push(mod);
    }
    static use(module) {
      return Array.isArray(module)
        ? (module.forEach((m) => Swiper.installModule(m)), Swiper)
        : (Swiper.installModule(module), Swiper);
    }
  }
  function createElementIfNotDefined(
    swiper,
    originalParams,
    params,
    checkProps
  ) {
    const document = getDocument();
    return (
      swiper.params.createElements &&
        Object.keys(checkProps).forEach((key) => {
          if (!params[key] && !0 === params.auto) {
            let element = swiper.$el.children(`.${checkProps[key]}`)[0];
            element ||
              ((element = document.createElement("div")),
              (element.className = checkProps[key]),
              swiper.$el.append(element)),
              (params[key] = element),
              (originalParams[key] = element);
          }
        }),
      params
    );
  }
  function classesToSelector(classes) {
    return (
      void 0 === classes && (classes = ""),
      `.${classes
        .trim()
        .replace(/([\.:!\/])/g, "\\$1")
        .replace(/ /g, ".")}`
    );
  }
  function appendSlide(slides) {
    const swiper = this,
      { $wrapperEl: $wrapperEl, params: params } = swiper;
    if (
      (params.loop && swiper.loopDestroy(),
      "object" == typeof slides && "length" in slides)
    )
      for (let i = 0; i < slides.length; i += 1)
        slides[i] && $wrapperEl.append(slides[i]);
    else $wrapperEl.append(slides);
    params.loop && swiper.loopCreate(), params.observer || swiper.update();
  }
  function prependSlide(slides) {
    const swiper = this,
      {
        params: params,
        $wrapperEl: $wrapperEl,
        activeIndex: activeIndex,
      } = swiper;
    params.loop && swiper.loopDestroy();
    let newActiveIndex = activeIndex + 1;
    if ("object" == typeof slides && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1)
        slides[i] && $wrapperEl.prepend(slides[i]);
      newActiveIndex = activeIndex + slides.length;
    } else $wrapperEl.prepend(slides);
    params.loop && swiper.loopCreate(),
      params.observer || swiper.update(),
      swiper.slideTo(newActiveIndex, 0, !1);
  }
  function addSlide(index, slides) {
    const swiper = this,
      {
        $wrapperEl: $wrapperEl,
        params: params,
        activeIndex: activeIndex,
      } = swiper;
    let activeIndexBuffer = activeIndex;
    params.loop &&
      ((activeIndexBuffer -= swiper.loopedSlides),
      swiper.loopDestroy(),
      (swiper.slides = $wrapperEl.children(`.${params.slideClass}`)));
    const baseLength = swiper.slides.length;
    if (index <= 0) return void swiper.prependSlide(slides);
    if (index >= baseLength) return void swiper.appendSlide(slides);
    let newActiveIndex =
      activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
    const slidesBuffer = [];
    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides.eq(i);
      currentSlide.remove(), slidesBuffer.unshift(currentSlide);
    }
    if ("object" == typeof slides && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1)
        slides[i] && $wrapperEl.append(slides[i]);
      newActiveIndex =
        activeIndexBuffer > index
          ? activeIndexBuffer + slides.length
          : activeIndexBuffer;
    } else $wrapperEl.append(slides);
    for (let i = 0; i < slidesBuffer.length; i += 1)
      $wrapperEl.append(slidesBuffer[i]);
    params.loop && swiper.loopCreate(),
      params.observer || swiper.update(),
      params.loop
        ? swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, !1)
        : swiper.slideTo(newActiveIndex, 0, !1);
  }
  function removeSlide(slidesIndexes) {
    const swiper = this,
      {
        params: params,
        $wrapperEl: $wrapperEl,
        activeIndex: activeIndex,
      } = swiper;
    let activeIndexBuffer = activeIndex;
    params.loop &&
      ((activeIndexBuffer -= swiper.loopedSlides),
      swiper.loopDestroy(),
      (swiper.slides = $wrapperEl.children(`.${params.slideClass}`)));
    let indexToRemove,
      newActiveIndex = activeIndexBuffer;
    if ("object" == typeof slidesIndexes && "length" in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1)
        (indexToRemove = slidesIndexes[i]),
          swiper.slides[indexToRemove] &&
            swiper.slides.eq(indexToRemove).remove(),
          indexToRemove < newActiveIndex && (newActiveIndex -= 1);
      newActiveIndex = Math.max(newActiveIndex, 0);
    } else (indexToRemove = slidesIndexes), swiper.slides[indexToRemove] && swiper.slides.eq(indexToRemove).remove(), indexToRemove < newActiveIndex && (newActiveIndex -= 1), (newActiveIndex = Math.max(newActiveIndex, 0));
    params.loop && swiper.loopCreate(),
      params.observer || swiper.update(),
      params.loop
        ? swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, !1)
        : swiper.slideTo(newActiveIndex, 0, !1);
  }
  function removeAllSlides() {
    const swiper = this,
      slidesIndexes = [];
    for (let i = 0; i < swiper.slides.length; i += 1) slidesIndexes.push(i);
    swiper.removeSlide(slidesIndexes);
  }
  function effectInit(params) {
    const {
      effect: effect,
      swiper: swiper,
      on: on,
      setTranslate: setTranslate,
      setTransition: setTransition,
      overwriteParams: overwriteParams,
      perspective: perspective,
      recreateShadows: recreateShadows,
      getEffectParams: getEffectParams,
    } = params;
    let requireUpdateOnVirtual;
    on("beforeInit", () => {
      if (swiper.params.effect !== effect) return;
      swiper.classNames.push(
        `${swiper.params.containerModifierClass}${effect}`
      ),
        perspective &&
          perspective() &&
          swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
      Object.assign(swiper.params, overwriteParamsResult),
        Object.assign(swiper.originalParams, overwriteParamsResult);
    }),
      on("setTranslate", () => {
        swiper.params.effect === effect && setTranslate();
      }),
      on("setTransition", (_s, duration) => {
        swiper.params.effect === effect && setTransition(duration);
      }),
      on("transitionEnd", () => {
        if (swiper.params.effect === effect && recreateShadows) {
          if (!getEffectParams || !getEffectParams().slideShadows) return;
          swiper.slides.each((slideEl) => {
            swiper
              .$(slideEl)
              .find(
                ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
              )
              .remove();
          }),
            recreateShadows();
        }
      }),
      on("virtualUpdate", () => {
        swiper.params.effect === effect &&
          (swiper.slides.length || (requireUpdateOnVirtual = !0),
          requestAnimationFrame(() => {
            requireUpdateOnVirtual &&
              swiper.slides &&
              swiper.slides.length &&
              (setTranslate(), (requireUpdateOnVirtual = !1));
          }));
      });
  }
  function effectTarget(effectParams, $slideEl) {
    return effectParams.transformEl
      ? $slideEl.find(effectParams.transformEl).css({
          "backface-visibility": "hidden",
          "-webkit-backface-visibility": "hidden",
        })
      : $slideEl;
  }
  function effectVirtualTransitionEnd(_ref) {
    let {
      swiper: swiper,
      duration: duration,
      transformEl: transformEl,
      allSlides: allSlides,
    } = _ref;
    const {
      slides: slides,
      activeIndex: activeIndex,
      $wrapperEl: $wrapperEl,
    } = swiper;
    if (swiper.params.virtualTranslate && 0 !== duration) {
      let $transitionEndTarget,
        eventTriggered = !1;
      ($transitionEndTarget = allSlides
        ? transformEl
          ? slides.find(transformEl)
          : slides
        : transformEl
        ? slides.eq(activeIndex).find(transformEl)
        : slides.eq(activeIndex)),
        $transitionEndTarget.transitionEnd(() => {
          if (eventTriggered) return;
          if (!swiper || swiper.destroyed) return;
          (eventTriggered = !0), (swiper.animating = !1);
          const triggerEvents = ["webkitTransitionEnd", "transitionend"];
          for (let i = 0; i < triggerEvents.length; i += 1)
            $wrapperEl.trigger(triggerEvents[i]);
        });
    }
  }
  function createShadow(params, $slideEl, side) {
    const shadowClass = "swiper-slide-shadow" + (side ? `-${side}` : ""),
      $shadowContainer = params.transformEl
        ? $slideEl.find(params.transformEl)
        : $slideEl;
    let $shadowEl = $shadowContainer.children(`.${shadowClass}`);
    return (
      $shadowEl.length ||
        (($shadowEl = $(
          `<div class="swiper-slide-shadow${side ? `-${side}` : ""}"></div>`
        )),
        $shadowContainer.append($shadowEl)),
      $shadowEl
    );
  }
  Object.keys(prototypes).forEach((prototypeGroup) => {
    Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  }),
    Swiper.use([
      function Resize(_ref) {
        let { swiper: swiper, on: on, emit: emit } = _ref;
        const window = getWindow();
        let observer = null,
          animationFrame = null;
        const resizeHandler = () => {
            swiper &&
              !swiper.destroyed &&
              swiper.initialized &&
              (emit("beforeResize"), emit("resize"));
          },
          orientationChangeHandler = () => {
            swiper &&
              !swiper.destroyed &&
              swiper.initialized &&
              emit("orientationchange");
          };
        on("init", () => {
          swiper.params.resizeObserver && void 0 !== window.ResizeObserver
            ? swiper &&
              !swiper.destroyed &&
              swiper.initialized &&
              ((observer = new ResizeObserver((entries) => {
                animationFrame = window.requestAnimationFrame(() => {
                  const { width: width, height: height } = swiper;
                  let newWidth = width,
                    newHeight = height;
                  entries.forEach((_ref2) => {
                    let {
                      contentBoxSize: contentBoxSize,
                      contentRect: contentRect,
                      target: target,
                    } = _ref2;
                    (target && target !== swiper.el) ||
                      ((newWidth = contentRect
                        ? contentRect.width
                        : (contentBoxSize[0] || contentBoxSize).inlineSize),
                      (newHeight = contentRect
                        ? contentRect.height
                        : (contentBoxSize[0] || contentBoxSize).blockSize));
                  }),
                    (newWidth === width && newHeight === height) ||
                      resizeHandler();
                });
              })),
              observer.observe(swiper.el))
            : (window.addEventListener("resize", resizeHandler),
              window.addEventListener(
                "orientationchange",
                orientationChangeHandler
              ));
        }),
          on("destroy", () => {
            animationFrame && window.cancelAnimationFrame(animationFrame),
              observer &&
                observer.unobserve &&
                swiper.el &&
                (observer.unobserve(swiper.el), (observer = null)),
              window.removeEventListener("resize", resizeHandler),
              window.removeEventListener(
                "orientationchange",
                orientationChangeHandler
              );
          });
      },
      function Observer(_ref) {
        let {
          swiper: swiper,
          extendParams: extendParams,
          on: on,
          emit: emit,
        } = _ref;
        const observers = [],
          window = getWindow(),
          attach = function (target, options) {
            void 0 === options && (options = {});
            const observer = new (window.MutationObserver ||
              window.WebkitMutationObserver)((mutations) => {
              if (1 === mutations.length)
                return void emit("observerUpdate", mutations[0]);
              const observerUpdate = function observerUpdate() {
                emit("observerUpdate", mutations[0]);
              };
              window.requestAnimationFrame
                ? window.requestAnimationFrame(observerUpdate)
                : window.setTimeout(observerUpdate, 0);
            });
            observer.observe(target, {
              attributes: void 0 === options.attributes || options.attributes,
              childList: void 0 === options.childList || options.childList,
              characterData:
                void 0 === options.characterData || options.characterData,
            }),
              observers.push(observer);
          };
        extendParams({
          observer: !1,
          observeParents: !1,
          observeSlideChildren: !1,
        }),
          on("init", () => {
            if (swiper.params.observer) {
              if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1)
                  attach(containerParents[i]);
              }
              attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren,
              }),
                attach(swiper.$wrapperEl[0], { attributes: !1 });
            }
          }),
          on("destroy", () => {
            observers.forEach((observer) => {
              observer.disconnect();
            }),
              observers.splice(0, observers.length);
          });
      },
    ]);
  const modules = [
    function Virtual(_ref) {
      let cssModeTimeout,
        {
          swiper: swiper,
          extendParams: extendParams,
          on: on,
          emit: emit,
        } = _ref;
      function renderSlide(slide, index) {
        const params = swiper.params.virtual;
        if (params.cache && swiper.virtual.cache[index])
          return swiper.virtual.cache[index];
        const $slideEl = params.renderSlide
          ? $(params.renderSlide.call(swiper, slide, index))
          : $(
              `<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`
            );
        return (
          $slideEl.attr("data-swiper-slide-index") ||
            $slideEl.attr("data-swiper-slide-index", index),
          params.cache && (swiper.virtual.cache[index] = $slideEl),
          $slideEl
        );
      }
      function update(force) {
        const {
            slidesPerView: slidesPerView,
            slidesPerGroup: slidesPerGroup,
            centeredSlides: centeredSlides,
          } = swiper.params,
          { addSlidesBefore: addSlidesBefore, addSlidesAfter: addSlidesAfter } =
            swiper.params.virtual,
          {
            from: previousFrom,
            to: previousTo,
            slides: slides,
            slidesGrid: previousSlidesGrid,
            offset: previousOffset,
          } = swiper.virtual;
        swiper.params.cssMode || swiper.updateActiveIndex();
        const activeIndex = swiper.activeIndex || 0;
        let offsetProp, slidesAfter, slidesBefore;
        (offsetProp = swiper.rtlTranslate
          ? "right"
          : swiper.isHorizontal()
          ? "left"
          : "top"),
          centeredSlides
            ? ((slidesAfter =
                Math.floor(slidesPerView / 2) +
                slidesPerGroup +
                addSlidesAfter),
              (slidesBefore =
                Math.floor(slidesPerView / 2) +
                slidesPerGroup +
                addSlidesBefore))
            : ((slidesAfter =
                slidesPerView + (slidesPerGroup - 1) + addSlidesAfter),
              (slidesBefore = slidesPerGroup + addSlidesBefore));
        const from = Math.max((activeIndex || 0) - slidesBefore, 0),
          to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1),
          offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
        function onRendered() {
          swiper.updateSlides(),
            swiper.updateProgress(),
            swiper.updateSlidesClasses(),
            swiper.lazy && swiper.params.lazy.enabled && swiper.lazy.load(),
            emit("virtualUpdate");
        }
        if (
          (Object.assign(swiper.virtual, {
            from: from,
            to: to,
            offset: offset,
            slidesGrid: swiper.slidesGrid,
          }),
          previousFrom === from && previousTo === to && !force)
        )
          return (
            swiper.slidesGrid !== previousSlidesGrid &&
              offset !== previousOffset &&
              swiper.slides.css(offsetProp, `${offset}px`),
            swiper.updateProgress(),
            void emit("virtualUpdate")
          );
        if (swiper.params.virtual.renderExternal)
          return (
            swiper.params.virtual.renderExternal.call(swiper, {
              offset: offset,
              from: from,
              to: to,
              slides: (function getSlides() {
                const slidesToRender = [];
                for (let i = from; i <= to; i += 1)
                  slidesToRender.push(slides[i]);
                return slidesToRender;
              })(),
            }),
            void (swiper.params.virtual.renderExternalUpdate
              ? onRendered()
              : emit("virtualUpdate"))
          );
        const prependIndexes = [],
          appendIndexes = [];
        if (force)
          swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
        else
          for (let i = previousFrom; i <= previousTo; i += 1)
            (i < from || i > to) &&
              swiper.$wrapperEl
                .find(
                  `.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`
                )
                .remove();
        for (let i = 0; i < slides.length; i += 1)
          i >= from &&
            i <= to &&
            (void 0 === previousTo || force
              ? appendIndexes.push(i)
              : (i > previousTo && appendIndexes.push(i),
                i < previousFrom && prependIndexes.push(i)));
        appendIndexes.forEach((index) => {
          swiper.$wrapperEl.append(renderSlide(slides[index], index));
        }),
          prependIndexes
            .sort((a, b) => b - a)
            .forEach((index) => {
              swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
            }),
          swiper.$wrapperEl
            .children(".swiper-slide")
            .css(offsetProp, `${offset}px`),
          onRendered();
      }
      extendParams({
        virtual: {
          enabled: !1,
          slides: [],
          cache: !0,
          renderSlide: null,
          renderExternal: null,
          renderExternalUpdate: !0,
          addSlidesBefore: 0,
          addSlidesAfter: 0,
        },
      }),
        (swiper.virtual = {
          cache: {},
          from: void 0,
          to: void 0,
          slides: [],
          offset: 0,
          slidesGrid: [],
        }),
        on("beforeInit", () => {
          swiper.params.virtual.enabled &&
            ((swiper.virtual.slides = swiper.params.virtual.slides),
            swiper.classNames.push(
              `${swiper.params.containerModifierClass}virtual`
            ),
            (swiper.params.watchSlidesProgress = !0),
            (swiper.originalParams.watchSlidesProgress = !0),
            swiper.params.initialSlide || update());
        }),
        on("setTranslate", () => {
          swiper.params.virtual.enabled &&
            (swiper.params.cssMode && !swiper._immediateVirtual
              ? (clearTimeout(cssModeTimeout),
                (cssModeTimeout = setTimeout(() => {
                  update();
                }, 100)))
              : update());
        }),
        on("init update resize", () => {
          swiper.params.virtual.enabled &&
            swiper.params.cssMode &&
            setCSSProperty(
              swiper.wrapperEl,
              "--swiper-virtual-size",
              `${swiper.virtualSize}px`
            );
        }),
        Object.assign(swiper.virtual, {
          appendSlide: function appendSlide(slides) {
            if ("object" == typeof slides && "length" in slides)
              for (let i = 0; i < slides.length; i += 1)
                slides[i] && swiper.virtual.slides.push(slides[i]);
            else swiper.virtual.slides.push(slides);
            update(!0);
          },
          prependSlide: function prependSlide(slides) {
            const activeIndex = swiper.activeIndex;
            let newActiveIndex = activeIndex + 1,
              numberOfNewSlides = 1;
            if (Array.isArray(slides)) {
              for (let i = 0; i < slides.length; i += 1)
                slides[i] && swiper.virtual.slides.unshift(slides[i]);
              (newActiveIndex = activeIndex + slides.length),
                (numberOfNewSlides = slides.length);
            } else swiper.virtual.slides.unshift(slides);
            if (swiper.params.virtual.cache) {
              const cache = swiper.virtual.cache,
                newCache = {};
              Object.keys(cache).forEach((cachedIndex) => {
                const $cachedEl = cache[cachedIndex],
                  cachedElIndex = $cachedEl.attr("data-swiper-slide-index");
                cachedElIndex &&
                  $cachedEl.attr(
                    "data-swiper-slide-index",
                    parseInt(cachedElIndex, 10) + numberOfNewSlides
                  ),
                  (newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] =
                    $cachedEl);
              }),
                (swiper.virtual.cache = newCache);
            }
            update(!0), swiper.slideTo(newActiveIndex, 0);
          },
          removeSlide: function removeSlide(slidesIndexes) {
            if (null == slidesIndexes) return;
            let activeIndex = swiper.activeIndex;
            if (Array.isArray(slidesIndexes))
              for (let i = slidesIndexes.length - 1; i >= 0; i -= 1)
                swiper.virtual.slides.splice(slidesIndexes[i], 1),
                  swiper.params.virtual.cache &&
                    delete swiper.virtual.cache[slidesIndexes[i]],
                  slidesIndexes[i] < activeIndex && (activeIndex -= 1),
                  (activeIndex = Math.max(activeIndex, 0));
            else
              swiper.virtual.slides.splice(slidesIndexes, 1),
                swiper.params.virtual.cache &&
                  delete swiper.virtual.cache[slidesIndexes],
                slidesIndexes < activeIndex && (activeIndex -= 1),
                (activeIndex = Math.max(activeIndex, 0));
            update(!0), swiper.slideTo(activeIndex, 0);
          },
          removeAllSlides: function removeAllSlides() {
            (swiper.virtual.slides = []),
              swiper.params.virtual.cache && (swiper.virtual.cache = {}),
              update(!0),
              swiper.slideTo(0, 0);
          },
          update: update,
        });
    },
    function Keyboard(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      const document = getDocument(),
        window = getWindow();
      function handle(event) {
        if (!swiper.enabled) return;
        const { rtlTranslate: rtl } = swiper;
        let e = event;
        e.originalEvent && (e = e.originalEvent);
        const kc = e.keyCode || e.charCode,
          pageUpDown = swiper.params.keyboard.pageUpDown,
          isPageUp = pageUpDown && 33 === kc,
          isPageDown = pageUpDown && 34 === kc,
          isArrowLeft = 37 === kc,
          isArrowRight = 39 === kc,
          isArrowUp = 38 === kc,
          isArrowDown = 40 === kc;
        if (
          !swiper.allowSlideNext &&
          ((swiper.isHorizontal() && isArrowRight) ||
            (swiper.isVertical() && isArrowDown) ||
            isPageDown)
        )
          return !1;
        if (
          !swiper.allowSlidePrev &&
          ((swiper.isHorizontal() && isArrowLeft) ||
            (swiper.isVertical() && isArrowUp) ||
            isPageUp)
        )
          return !1;
        if (
          !(
            e.shiftKey ||
            e.altKey ||
            e.ctrlKey ||
            e.metaKey ||
            (document.activeElement &&
              document.activeElement.nodeName &&
              ("input" === document.activeElement.nodeName.toLowerCase() ||
                "textarea" === document.activeElement.nodeName.toLowerCase()))
          )
        ) {
          if (
            swiper.params.keyboard.onlyInViewport &&
            (isPageUp ||
              isPageDown ||
              isArrowLeft ||
              isArrowRight ||
              isArrowUp ||
              isArrowDown)
          ) {
            let inView = !1;
            if (
              swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 &&
              0 ===
                swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length
            )
              return;
            const $el = swiper.$el,
              swiperWidth = $el[0].clientWidth,
              swiperHeight = $el[0].clientHeight,
              windowWidth = window.innerWidth,
              windowHeight = window.innerHeight,
              swiperOffset = swiper.$el.offset();
            rtl && (swiperOffset.left -= swiper.$el[0].scrollLeft);
            const swiperCoord = [
              [swiperOffset.left, swiperOffset.top],
              [swiperOffset.left + swiperWidth, swiperOffset.top],
              [swiperOffset.left, swiperOffset.top + swiperHeight],
              [
                swiperOffset.left + swiperWidth,
                swiperOffset.top + swiperHeight,
              ],
            ];
            for (let i = 0; i < swiperCoord.length; i += 1) {
              const point = swiperCoord[i];
              if (
                point[0] >= 0 &&
                point[0] <= windowWidth &&
                point[1] >= 0 &&
                point[1] <= windowHeight
              ) {
                if (0 === point[0] && 0 === point[1]) continue;
                inView = !0;
              }
            }
            if (!inView) return;
          }
          swiper.isHorizontal()
            ? ((isPageUp || isPageDown || isArrowLeft || isArrowRight) &&
                (e.preventDefault ? e.preventDefault() : (e.returnValue = !1)),
              (((isPageDown || isArrowRight) && !rtl) ||
                ((isPageUp || isArrowLeft) && rtl)) &&
                swiper.slideNext(),
              (((isPageUp || isArrowLeft) && !rtl) ||
                ((isPageDown || isArrowRight) && rtl)) &&
                swiper.slidePrev())
            : ((isPageUp || isPageDown || isArrowUp || isArrowDown) &&
                (e.preventDefault ? e.preventDefault() : (e.returnValue = !1)),
              (isPageDown || isArrowDown) && swiper.slideNext(),
              (isPageUp || isArrowUp) && swiper.slidePrev()),
            emit("keyPress", kc);
        }
      }
      function enable() {
        swiper.keyboard.enabled ||
          ($(document).on("keydown", handle), (swiper.keyboard.enabled = !0));
      }
      function disable() {
        swiper.keyboard.enabled &&
          ($(document).off("keydown", handle), (swiper.keyboard.enabled = !1));
      }
      (swiper.keyboard = { enabled: !1 }),
        extendParams({
          keyboard: { enabled: !1, onlyInViewport: !0, pageUpDown: !0 },
        }),
        on("init", () => {
          swiper.params.keyboard.enabled && enable();
        }),
        on("destroy", () => {
          swiper.keyboard.enabled && disable();
        }),
        Object.assign(swiper.keyboard, { enable: enable, disable: disable });
    },
    function Mousewheel(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      const window = getWindow();
      let timeout;
      extendParams({
        mousewheel: {
          enabled: !1,
          releaseOnEdges: !1,
          invert: !1,
          forceToAxis: !1,
          sensitivity: 1,
          eventsTarget: "container",
          thresholdDelta: null,
          thresholdTime: null,
        },
      }),
        (swiper.mousewheel = { enabled: !1 });
      let lastEventBeforeSnap,
        lastScrollTime = now();
      const recentWheelEvents = [];
      function handleMouseEnter() {
        swiper.enabled && (swiper.mouseEntered = !0);
      }
      function handleMouseLeave() {
        swiper.enabled && (swiper.mouseEntered = !1);
      }
      function animateSlider(newEvent) {
        return (
          !(
            swiper.params.mousewheel.thresholdDelta &&
            newEvent.delta < swiper.params.mousewheel.thresholdDelta
          ) &&
          !(
            swiper.params.mousewheel.thresholdTime &&
            now() - lastScrollTime < swiper.params.mousewheel.thresholdTime
          ) &&
          ((newEvent.delta >= 6 && now() - lastScrollTime < 60) ||
            (newEvent.direction < 0
              ? (swiper.isEnd && !swiper.params.loop) ||
                swiper.animating ||
                (swiper.slideNext(), emit("scroll", newEvent.raw))
              : (swiper.isBeginning && !swiper.params.loop) ||
                swiper.animating ||
                (swiper.slidePrev(), emit("scroll", newEvent.raw)),
            (lastScrollTime = new window.Date().getTime()),
            !1))
        );
      }
      function handle(event) {
        let e = event,
          disableParentSwiper = !0;
        if (!swiper.enabled) return;
        const params = swiper.params.mousewheel;
        swiper.params.cssMode && e.preventDefault();
        let target = swiper.$el;
        if (
          ("container" !== swiper.params.mousewheel.eventsTarget &&
            (target = $(swiper.params.mousewheel.eventsTarget)),
          !swiper.mouseEntered &&
            !target[0].contains(e.target) &&
            !params.releaseOnEdges)
        )
          return !0;
        e.originalEvent && (e = e.originalEvent);
        let delta = 0;
        const rtlFactor = swiper.rtlTranslate ? -1 : 1,
          data = (function normalize(e) {
            let sX = 0,
              sY = 0,
              pX = 0,
              pY = 0;
            return (
              "detail" in e && (sY = e.detail),
              "wheelDelta" in e && (sY = -e.wheelDelta / 120),
              "wheelDeltaY" in e && (sY = -e.wheelDeltaY / 120),
              "wheelDeltaX" in e && (sX = -e.wheelDeltaX / 120),
              "axis" in e &&
                e.axis === e.HORIZONTAL_AXIS &&
                ((sX = sY), (sY = 0)),
              (pX = 10 * sX),
              (pY = 10 * sY),
              "deltaY" in e && (pY = e.deltaY),
              "deltaX" in e && (pX = e.deltaX),
              e.shiftKey && !pX && ((pX = pY), (pY = 0)),
              (pX || pY) &&
                e.deltaMode &&
                (1 === e.deltaMode
                  ? ((pX *= 40), (pY *= 40))
                  : ((pX *= 800), (pY *= 800))),
              pX && !sX && (sX = pX < 1 ? -1 : 1),
              pY && !sY && (sY = pY < 1 ? -1 : 1),
              { spinX: sX, spinY: sY, pixelX: pX, pixelY: pY }
            );
          })(e);
        if (params.forceToAxis)
          if (swiper.isHorizontal()) {
            if (!(Math.abs(data.pixelX) > Math.abs(data.pixelY))) return !0;
            delta = -data.pixelX * rtlFactor;
          } else {
            if (!(Math.abs(data.pixelY) > Math.abs(data.pixelX))) return !0;
            delta = -data.pixelY;
          }
        else
          delta =
            Math.abs(data.pixelX) > Math.abs(data.pixelY)
              ? -data.pixelX * rtlFactor
              : -data.pixelY;
        if (0 === delta) return !0;
        params.invert && (delta = -delta);
        let positions = swiper.getTranslate() + delta * params.sensitivity;
        if (
          (positions >= swiper.minTranslate() &&
            (positions = swiper.minTranslate()),
          positions <= swiper.maxTranslate() &&
            (positions = swiper.maxTranslate()),
          (disableParentSwiper =
            !!swiper.params.loop ||
            !(
              positions === swiper.minTranslate() ||
              positions === swiper.maxTranslate()
            )),
          disableParentSwiper && swiper.params.nested && e.stopPropagation(),
          swiper.params.freeMode && swiper.params.freeMode.enabled)
        ) {
          const newEvent = {
              time: now(),
              delta: Math.abs(delta),
              direction: Math.sign(delta),
            },
            ignoreWheelEvents =
              lastEventBeforeSnap &&
              newEvent.time < lastEventBeforeSnap.time + 500 &&
              newEvent.delta <= lastEventBeforeSnap.delta &&
              newEvent.direction === lastEventBeforeSnap.direction;
          if (!ignoreWheelEvents) {
            (lastEventBeforeSnap = void 0),
              swiper.params.loop && swiper.loopFix();
            let position = swiper.getTranslate() + delta * params.sensitivity;
            const wasBeginning = swiper.isBeginning,
              wasEnd = swiper.isEnd;
            if (
              (position >= swiper.minTranslate() &&
                (position = swiper.minTranslate()),
              position <= swiper.maxTranslate() &&
                (position = swiper.maxTranslate()),
              swiper.setTransition(0),
              swiper.setTranslate(position),
              swiper.updateProgress(),
              swiper.updateActiveIndex(),
              swiper.updateSlidesClasses(),
              ((!wasBeginning && swiper.isBeginning) ||
                (!wasEnd && swiper.isEnd)) &&
                swiper.updateSlidesClasses(),
              swiper.params.freeMode.sticky)
            ) {
              clearTimeout(timeout),
                (timeout = void 0),
                recentWheelEvents.length >= 15 && recentWheelEvents.shift();
              const prevEvent = recentWheelEvents.length
                  ? recentWheelEvents[recentWheelEvents.length - 1]
                  : void 0,
                firstEvent = recentWheelEvents[0];
              if (
                (recentWheelEvents.push(newEvent),
                prevEvent &&
                  (newEvent.delta > prevEvent.delta ||
                    newEvent.direction !== prevEvent.direction))
              )
                recentWheelEvents.splice(0);
              else if (
                recentWheelEvents.length >= 15 &&
                newEvent.time - firstEvent.time < 500 &&
                firstEvent.delta - newEvent.delta >= 1 &&
                newEvent.delta <= 6
              ) {
                const snapToThreshold = delta > 0 ? 0.8 : 0.2;
                (lastEventBeforeSnap = newEvent),
                  recentWheelEvents.splice(0),
                  (timeout = nextTick(() => {
                    swiper.slideToClosest(
                      swiper.params.speed,
                      !0,
                      void 0,
                      snapToThreshold
                    );
                  }, 0));
              }
              timeout ||
                (timeout = nextTick(() => {
                  (lastEventBeforeSnap = newEvent),
                    recentWheelEvents.splice(0),
                    swiper.slideToClosest(swiper.params.speed, !0, void 0, 0.5);
                }, 500));
            }
            if (
              (ignoreWheelEvents || emit("scroll", e),
              swiper.params.autoplay &&
                swiper.params.autoplayDisableOnInteraction &&
                swiper.autoplay.stop(),
              position === swiper.minTranslate() ||
                position === swiper.maxTranslate())
            )
              return !0;
          }
        } else {
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta),
            raw: event,
          };
          recentWheelEvents.length >= 2 && recentWheelEvents.shift();
          const prevEvent = recentWheelEvents.length
            ? recentWheelEvents[recentWheelEvents.length - 1]
            : void 0;
          if (
            (recentWheelEvents.push(newEvent),
            prevEvent
              ? (newEvent.direction !== prevEvent.direction ||
                  newEvent.delta > prevEvent.delta ||
                  newEvent.time > prevEvent.time + 150) &&
                animateSlider(newEvent)
              : animateSlider(newEvent),
            (function releaseScroll(newEvent) {
              const params = swiper.params.mousewheel;
              if (newEvent.direction < 0) {
                if (
                  swiper.isEnd &&
                  !swiper.params.loop &&
                  params.releaseOnEdges
                )
                  return !0;
              } else if (
                swiper.isBeginning &&
                !swiper.params.loop &&
                params.releaseOnEdges
              )
                return !0;
              return !1;
            })(newEvent))
          )
            return !0;
        }
        return e.preventDefault ? e.preventDefault() : (e.returnValue = !1), !1;
      }
      function events(method) {
        let target = swiper.$el;
        "container" !== swiper.params.mousewheel.eventsTarget &&
          (target = $(swiper.params.mousewheel.eventsTarget)),
          target[method]("mouseenter", handleMouseEnter),
          target[method]("mouseleave", handleMouseLeave),
          target[method]("wheel", handle);
      }
      function enable() {
        return swiper.params.cssMode
          ? (swiper.wrapperEl.removeEventListener("wheel", handle), !0)
          : !swiper.mousewheel.enabled &&
              (events("on"), (swiper.mousewheel.enabled = !0), !0);
      }
      function disable() {
        return swiper.params.cssMode
          ? (swiper.wrapperEl.addEventListener(event, handle), !0)
          : !!swiper.mousewheel.enabled &&
              (events("off"), (swiper.mousewheel.enabled = !1), !0);
      }
      on("init", () => {
        !swiper.params.mousewheel.enabled && swiper.params.cssMode && disable(),
          swiper.params.mousewheel.enabled && enable();
      }),
        on("destroy", () => {
          swiper.params.cssMode && enable(),
            swiper.mousewheel.enabled && disable();
        }),
        Object.assign(swiper.mousewheel, { enable: enable, disable: disable });
    },
    function Navigation(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      function getEl(el) {
        let $el;
        return (
          el &&
            (($el = $(el)),
            swiper.params.uniqueNavElements &&
              "string" == typeof el &&
              $el.length > 1 &&
              1 === swiper.$el.find(el).length &&
              ($el = swiper.$el.find(el))),
          $el
        );
      }
      function toggleEl($el, disabled) {
        const params = swiper.params.navigation;
        $el &&
          $el.length > 0 &&
          ($el[disabled ? "addClass" : "removeClass"](params.disabledClass),
          $el[0] && "BUTTON" === $el[0].tagName && ($el[0].disabled = disabled),
          swiper.params.watchOverflow &&
            swiper.enabled &&
            $el[swiper.isLocked ? "addClass" : "removeClass"](
              params.lockClass
            ));
      }
      function update() {
        if (swiper.params.loop) return;
        const { $nextEl: $nextEl, $prevEl: $prevEl } = swiper.navigation;
        toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind),
          toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
      }
      function onPrevClick(e) {
        e.preventDefault(),
          (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) &&
            swiper.slidePrev();
      }
      function onNextClick(e) {
        e.preventDefault(),
          (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) &&
            swiper.slideNext();
      }
      function init() {
        const params = swiper.params.navigation;
        if (
          ((swiper.params.navigation = createElementIfNotDefined(
            swiper,
            swiper.originalParams.navigation,
            swiper.params.navigation,
            { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" }
          )),
          !params.nextEl && !params.prevEl)
        )
          return;
        const $nextEl = getEl(params.nextEl),
          $prevEl = getEl(params.prevEl);
        $nextEl && $nextEl.length > 0 && $nextEl.on("click", onNextClick),
          $prevEl && $prevEl.length > 0 && $prevEl.on("click", onPrevClick),
          Object.assign(swiper.navigation, {
            $nextEl: $nextEl,
            nextEl: $nextEl && $nextEl[0],
            $prevEl: $prevEl,
            prevEl: $prevEl && $prevEl[0],
          }),
          swiper.enabled ||
            ($nextEl && $nextEl.addClass(params.lockClass),
            $prevEl && $prevEl.addClass(params.lockClass));
      }
      function destroy() {
        const { $nextEl: $nextEl, $prevEl: $prevEl } = swiper.navigation;
        $nextEl &&
          $nextEl.length &&
          ($nextEl.off("click", onNextClick),
          $nextEl.removeClass(swiper.params.navigation.disabledClass)),
          $prevEl &&
            $prevEl.length &&
            ($prevEl.off("click", onPrevClick),
            $prevEl.removeClass(swiper.params.navigation.disabledClass));
      }
      extendParams({
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: !1,
          disabledClass: "swiper-button-disabled",
          hiddenClass: "swiper-button-hidden",
          lockClass: "swiper-button-lock",
        },
      }),
        (swiper.navigation = {
          nextEl: null,
          $nextEl: null,
          prevEl: null,
          $prevEl: null,
        }),
        on("init", () => {
          init(), update();
        }),
        on("toEdge fromEdge lock unlock", () => {
          update();
        }),
        on("destroy", () => {
          destroy();
        }),
        on("enable disable", () => {
          const { $nextEl: $nextEl, $prevEl: $prevEl } = swiper.navigation;
          $nextEl &&
            $nextEl[swiper.enabled ? "removeClass" : "addClass"](
              swiper.params.navigation.lockClass
            ),
            $prevEl &&
              $prevEl[swiper.enabled ? "removeClass" : "addClass"](
                swiper.params.navigation.lockClass
              );
        }),
        on("click", (_s, e) => {
          const { $nextEl: $nextEl, $prevEl: $prevEl } = swiper.navigation,
            targetEl = e.target;
          if (
            swiper.params.navigation.hideOnClick &&
            !$(targetEl).is($prevEl) &&
            !$(targetEl).is($nextEl)
          ) {
            if (
              swiper.pagination &&
              swiper.params.pagination &&
              swiper.params.pagination.clickable &&
              (swiper.pagination.el === targetEl ||
                swiper.pagination.el.contains(targetEl))
            )
              return;
            let isHidden;
            $nextEl
              ? (isHidden = $nextEl.hasClass(
                  swiper.params.navigation.hiddenClass
                ))
              : $prevEl &&
                (isHidden = $prevEl.hasClass(
                  swiper.params.navigation.hiddenClass
                )),
              emit(!0 === isHidden ? "navigationShow" : "navigationHide"),
              $nextEl &&
                $nextEl.toggleClass(swiper.params.navigation.hiddenClass),
              $prevEl &&
                $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
          }
        }),
        Object.assign(swiper.navigation, {
          update: update,
          init: init,
          destroy: destroy,
        });
    },
    function Pagination(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      const pfx = "swiper-pagination";
      let bulletSize;
      extendParams({
        pagination: {
          el: null,
          bulletElement: "span",
          clickable: !1,
          hideOnClick: !1,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: !1,
          type: "bullets",
          dynamicBullets: !1,
          dynamicMainBullets: 1,
          formatFractionCurrent: (number) => number,
          formatFractionTotal: (number) => number,
          bulletClass: `${pfx}-bullet`,
          bulletActiveClass: `${pfx}-bullet-active`,
          modifierClass: `${pfx}-`,
          currentClass: `${pfx}-current`,
          totalClass: `${pfx}-total`,
          hiddenClass: `${pfx}-hidden`,
          progressbarFillClass: `${pfx}-progressbar-fill`,
          progressbarOppositeClass: `${pfx}-progressbar-opposite`,
          clickableClass: `${pfx}-clickable`,
          lockClass: `${pfx}-lock`,
          horizontalClass: `${pfx}-horizontal`,
          verticalClass: `${pfx}-vertical`,
        },
      }),
        (swiper.pagination = { el: null, $el: null, bullets: [] });
      let dynamicBulletIndex = 0;
      function isPaginationDisabled() {
        return (
          !swiper.params.pagination.el ||
          !swiper.pagination.el ||
          !swiper.pagination.$el ||
          0 === swiper.pagination.$el.length
        );
      }
      function setSideBullets($bulletEl, position) {
        const { bulletActiveClass: bulletActiveClass } =
          swiper.params.pagination;
        $bulletEl[position]()
          .addClass(`${bulletActiveClass}-${position}`)
          [position]()
          .addClass(`${bulletActiveClass}-${position}-${position}`);
      }
      function update() {
        const rtl = swiper.rtl,
          params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const slidesLength =
            swiper.virtual && swiper.params.virtual.enabled
              ? swiper.virtual.slides.length
              : swiper.slides.length,
          $el = swiper.pagination.$el;
        let current;
        const total = swiper.params.loop
          ? Math.ceil(
              (slidesLength - 2 * swiper.loopedSlides) /
                swiper.params.slidesPerGroup
            )
          : swiper.snapGrid.length;
        if (
          (swiper.params.loop
            ? ((current = Math.ceil(
                (swiper.activeIndex - swiper.loopedSlides) /
                  swiper.params.slidesPerGroup
              )),
              current > slidesLength - 1 - 2 * swiper.loopedSlides &&
                (current -= slidesLength - 2 * swiper.loopedSlides),
              current > total - 1 && (current -= total),
              current < 0 &&
                "bullets" !== swiper.params.paginationType &&
                (current = total + current))
            : (current =
                void 0 !== swiper.snapIndex
                  ? swiper.snapIndex
                  : swiper.activeIndex || 0),
          "bullets" === params.type &&
            swiper.pagination.bullets &&
            swiper.pagination.bullets.length > 0)
        ) {
          const bullets = swiper.pagination.bullets;
          let firstIndex, lastIndex, midIndex;
          if (
            (params.dynamicBullets &&
              ((bulletSize = bullets
                .eq(0)
                [swiper.isHorizontal() ? "outerWidth" : "outerHeight"](!0)),
              $el.css(
                swiper.isHorizontal() ? "width" : "height",
                bulletSize * (params.dynamicMainBullets + 4) + "px"
              ),
              params.dynamicMainBullets > 1 &&
                void 0 !== swiper.previousIndex &&
                ((dynamicBulletIndex +=
                  current - (swiper.previousIndex - swiper.loopedSlides || 0)),
                dynamicBulletIndex > params.dynamicMainBullets - 1
                  ? (dynamicBulletIndex = params.dynamicMainBullets - 1)
                  : dynamicBulletIndex < 0 && (dynamicBulletIndex = 0)),
              (firstIndex = Math.max(current - dynamicBulletIndex, 0)),
              (lastIndex =
                firstIndex +
                (Math.min(bullets.length, params.dynamicMainBullets) - 1)),
              (midIndex = (lastIndex + firstIndex) / 2)),
            bullets.removeClass(
              ["", "-next", "-next-next", "-prev", "-prev-prev", "-main"]
                .map((suffix) => `${params.bulletActiveClass}${suffix}`)
                .join(" ")
            ),
            $el.length > 1)
          )
            bullets.each((bullet) => {
              const $bullet = $(bullet),
                bulletIndex = $bullet.index();
              bulletIndex === current &&
                $bullet.addClass(params.bulletActiveClass),
                params.dynamicBullets &&
                  (bulletIndex >= firstIndex &&
                    bulletIndex <= lastIndex &&
                    $bullet.addClass(`${params.bulletActiveClass}-main`),
                  bulletIndex === firstIndex && setSideBullets($bullet, "prev"),
                  bulletIndex === lastIndex && setSideBullets($bullet, "next"));
            });
          else {
            const $bullet = bullets.eq(current),
              bulletIndex = $bullet.index();
            if (
              ($bullet.addClass(params.bulletActiveClass),
              params.dynamicBullets)
            ) {
              const $firstDisplayedBullet = bullets.eq(firstIndex),
                $lastDisplayedBullet = bullets.eq(lastIndex);
              for (let i = firstIndex; i <= lastIndex; i += 1)
                bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
              if (swiper.params.loop)
                if (bulletIndex >= bullets.length) {
                  for (let i = params.dynamicMainBullets; i >= 0; i -= 1)
                    bullets
                      .eq(bullets.length - i)
                      .addClass(`${params.bulletActiveClass}-main`);
                  bullets
                    .eq(bullets.length - params.dynamicMainBullets - 1)
                    .addClass(`${params.bulletActiveClass}-prev`);
                } else
                  setSideBullets($firstDisplayedBullet, "prev"),
                    setSideBullets($lastDisplayedBullet, "next");
              else
                setSideBullets($firstDisplayedBullet, "prev"),
                  setSideBullets($lastDisplayedBullet, "next");
            }
          }
          if (params.dynamicBullets) {
            const dynamicBulletsLength = Math.min(
                bullets.length,
                params.dynamicMainBullets + 4
              ),
              bulletsOffset =
                (bulletSize * dynamicBulletsLength - bulletSize) / 2 -
                midIndex * bulletSize,
              offsetProp = rtl ? "right" : "left";
            bullets.css(
              swiper.isHorizontal() ? offsetProp : "top",
              `${bulletsOffset}px`
            );
          }
        }
        if (
          ("fraction" === params.type &&
            ($el
              .find(classesToSelector(params.currentClass))
              .text(params.formatFractionCurrent(current + 1)),
            $el
              .find(classesToSelector(params.totalClass))
              .text(params.formatFractionTotal(total))),
          "progressbar" === params.type)
        ) {
          let progressbarDirection;
          progressbarDirection = params.progressbarOpposite
            ? swiper.isHorizontal()
              ? "vertical"
              : "horizontal"
            : swiper.isHorizontal()
            ? "horizontal"
            : "vertical";
          const scale = (current + 1) / total;
          let scaleX = 1,
            scaleY = 1;
          "horizontal" === progressbarDirection
            ? (scaleX = scale)
            : (scaleY = scale),
            $el
              .find(classesToSelector(params.progressbarFillClass))
              .transform(
                `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`
              )
              .transition(swiper.params.speed);
        }
        "custom" === params.type && params.renderCustom
          ? ($el.html(params.renderCustom(swiper, current + 1, total)),
            emit("paginationRender", $el[0]))
          : emit("paginationUpdate", $el[0]),
          swiper.params.watchOverflow &&
            swiper.enabled &&
            $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
      }
      function render() {
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const slidesLength =
            swiper.virtual && swiper.params.virtual.enabled
              ? swiper.virtual.slides.length
              : swiper.slides.length,
          $el = swiper.pagination.$el;
        let paginationHTML = "";
        if ("bullets" === params.type) {
          let numberOfBullets = swiper.params.loop
            ? Math.ceil(
                (slidesLength - 2 * swiper.loopedSlides) /
                  swiper.params.slidesPerGroup
              )
            : swiper.snapGrid.length;
          swiper.params.freeMode &&
            swiper.params.freeMode.enabled &&
            !swiper.params.loop &&
            numberOfBullets > slidesLength &&
            (numberOfBullets = slidesLength);
          for (let i = 0; i < numberOfBullets; i += 1)
            params.renderBullet
              ? (paginationHTML += params.renderBullet.call(
                  swiper,
                  i,
                  params.bulletClass
                ))
              : (paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`);
          $el.html(paginationHTML),
            (swiper.pagination.bullets = $el.find(
              classesToSelector(params.bulletClass)
            ));
        }
        "fraction" === params.type &&
          ((paginationHTML = params.renderFraction
            ? params.renderFraction.call(
                swiper,
                params.currentClass,
                params.totalClass
              )
            : `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`),
          $el.html(paginationHTML)),
          "progressbar" === params.type &&
            ((paginationHTML = params.renderProgressbar
              ? params.renderProgressbar.call(
                  swiper,
                  params.progressbarFillClass
                )
              : `<span class="${params.progressbarFillClass}"></span>`),
            $el.html(paginationHTML)),
          "custom" !== params.type &&
            emit("paginationRender", swiper.pagination.$el[0]);
      }
      function init() {
        swiper.params.pagination = createElementIfNotDefined(
          swiper,
          swiper.originalParams.pagination,
          swiper.params.pagination,
          { el: "swiper-pagination" }
        );
        const params = swiper.params.pagination;
        if (!params.el) return;
        let $el = $(params.el);
        0 !== $el.length &&
          (swiper.params.uniqueNavElements &&
            "string" == typeof params.el &&
            $el.length > 1 &&
            (($el = swiper.$el.find(params.el)),
            $el.length > 1 &&
              ($el = $el.filter(
                (el) => $(el).parents(".swiper")[0] === swiper.el
              ))),
          "bullets" === params.type &&
            params.clickable &&
            $el.addClass(params.clickableClass),
          $el.addClass(params.modifierClass + params.type),
          $el.addClass(
            swiper.isHorizontal()
              ? params.horizontalClass
              : params.verticalClass
          ),
          "bullets" === params.type &&
            params.dynamicBullets &&
            ($el.addClass(`${params.modifierClass}${params.type}-dynamic`),
            (dynamicBulletIndex = 0),
            params.dynamicMainBullets < 1 && (params.dynamicMainBullets = 1)),
          "progressbar" === params.type &&
            params.progressbarOpposite &&
            $el.addClass(params.progressbarOppositeClass),
          params.clickable &&
            $el.on(
              "click",
              classesToSelector(params.bulletClass),
              function onClick(e) {
                e.preventDefault();
                let index = $(this).index() * swiper.params.slidesPerGroup;
                swiper.params.loop && (index += swiper.loopedSlides),
                  swiper.slideTo(index);
              }
            ),
          Object.assign(swiper.pagination, { $el: $el, el: $el[0] }),
          swiper.enabled || $el.addClass(params.lockClass));
      }
      function destroy() {
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const $el = swiper.pagination.$el;
        $el.removeClass(params.hiddenClass),
          $el.removeClass(params.modifierClass + params.type),
          $el.removeClass(
            swiper.isHorizontal()
              ? params.horizontalClass
              : params.verticalClass
          ),
          swiper.pagination.bullets &&
            swiper.pagination.bullets.removeClass &&
            swiper.pagination.bullets.removeClass(params.bulletActiveClass),
          params.clickable &&
            $el.off("click", classesToSelector(params.bulletClass));
      }
      on("init", () => {
        init(), render(), update();
      }),
        on("activeIndexChange", () => {
          (swiper.params.loop || void 0 === swiper.snapIndex) && update();
        }),
        on("snapIndexChange", () => {
          swiper.params.loop || update();
        }),
        on("slidesLengthChange", () => {
          swiper.params.loop && (render(), update());
        }),
        on("snapGridLengthChange", () => {
          swiper.params.loop || (render(), update());
        }),
        on("destroy", () => {
          destroy();
        }),
        on("enable disable", () => {
          const { $el: $el } = swiper.pagination;
          $el &&
            $el[swiper.enabled ? "removeClass" : "addClass"](
              swiper.params.pagination.lockClass
            );
        }),
        on("lock unlock", () => {
          update();
        }),
        on("click", (_s, e) => {
          const targetEl = e.target,
            { $el: $el } = swiper.pagination;
          if (
            swiper.params.pagination.el &&
            swiper.params.pagination.hideOnClick &&
            $el.length > 0 &&
            !$(targetEl).hasClass(swiper.params.pagination.bulletClass)
          ) {
            if (
              swiper.navigation &&
              ((swiper.navigation.nextEl &&
                targetEl === swiper.navigation.nextEl) ||
                (swiper.navigation.prevEl &&
                  targetEl === swiper.navigation.prevEl))
            )
              return;
            const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
            emit(!0 === isHidden ? "paginationShow" : "paginationHide"),
              $el.toggleClass(swiper.params.pagination.hiddenClass);
          }
        }),
        Object.assign(swiper.pagination, {
          render: render,
          update: update,
          init: init,
          destroy: destroy,
        });
    },
    function Scrollbar(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      const document = getDocument();
      let dragStartPos,
        dragSize,
        trackSize,
        divider,
        isTouched = !1,
        timeout = null,
        dragTimeout = null;
      function setTranslate() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        const {
            scrollbar: scrollbar,
            rtlTranslate: rtl,
            progress: progress,
          } = swiper,
          { $dragEl: $dragEl, $el: $el } = scrollbar,
          params = swiper.params.scrollbar;
        let newSize = dragSize,
          newPos = (trackSize - dragSize) * progress;
        rtl
          ? ((newPos = -newPos),
            newPos > 0
              ? ((newSize = dragSize - newPos), (newPos = 0))
              : -newPos + dragSize > trackSize &&
                (newSize = trackSize + newPos))
          : newPos < 0
          ? ((newSize = dragSize + newPos), (newPos = 0))
          : newPos + dragSize > trackSize && (newSize = trackSize - newPos),
          swiper.isHorizontal()
            ? ($dragEl.transform(`translate3d(${newPos}px, 0, 0)`),
              ($dragEl[0].style.width = `${newSize}px`))
            : ($dragEl.transform(`translate3d(0px, ${newPos}px, 0)`),
              ($dragEl[0].style.height = `${newSize}px`)),
          params.hide &&
            (clearTimeout(timeout),
            ($el[0].style.opacity = 1),
            (timeout = setTimeout(() => {
              ($el[0].style.opacity = 0), $el.transition(400);
            }, 1e3)));
      }
      function updateSize() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        const { scrollbar: scrollbar } = swiper,
          { $dragEl: $dragEl, $el: $el } = scrollbar;
        ($dragEl[0].style.width = ""),
          ($dragEl[0].style.height = ""),
          (trackSize = swiper.isHorizontal()
            ? $el[0].offsetWidth
            : $el[0].offsetHeight),
          (divider =
            swiper.size /
            (swiper.virtualSize +
              swiper.params.slidesOffsetBefore -
              (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0))),
          (dragSize =
            "auto" === swiper.params.scrollbar.dragSize
              ? trackSize * divider
              : parseInt(swiper.params.scrollbar.dragSize, 10)),
          swiper.isHorizontal()
            ? ($dragEl[0].style.width = `${dragSize}px`)
            : ($dragEl[0].style.height = `${dragSize}px`),
          ($el[0].style.display = divider >= 1 ? "none" : ""),
          swiper.params.scrollbar.hide && ($el[0].style.opacity = 0),
          swiper.params.watchOverflow &&
            swiper.enabled &&
            scrollbar.$el[swiper.isLocked ? "addClass" : "removeClass"](
              swiper.params.scrollbar.lockClass
            );
      }
      function getPointerPosition(e) {
        return swiper.isHorizontal()
          ? "touchstart" === e.type || "touchmove" === e.type
            ? e.targetTouches[0].clientX
            : e.clientX
          : "touchstart" === e.type || "touchmove" === e.type
          ? e.targetTouches[0].clientY
          : e.clientY;
      }
      function setDragPosition(e) {
        const { scrollbar: scrollbar, rtlTranslate: rtl } = swiper,
          { $el: $el } = scrollbar;
        let positionRatio;
        (positionRatio =
          (getPointerPosition(e) -
            $el.offset()[swiper.isHorizontal() ? "left" : "top"] -
            (null !== dragStartPos ? dragStartPos : dragSize / 2)) /
          (trackSize - dragSize)),
          (positionRatio = Math.max(Math.min(positionRatio, 1), 0)),
          rtl && (positionRatio = 1 - positionRatio);
        const position =
          swiper.minTranslate() +
          (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
        swiper.updateProgress(position),
          swiper.setTranslate(position),
          swiper.updateActiveIndex(),
          swiper.updateSlidesClasses();
      }
      function onDragStart(e) {
        const params = swiper.params.scrollbar,
          { scrollbar: scrollbar, $wrapperEl: $wrapperEl } = swiper,
          { $el: $el, $dragEl: $dragEl } = scrollbar;
        (isTouched = !0),
          (dragStartPos =
            e.target === $dragEl[0] || e.target === $dragEl
              ? getPointerPosition(e) -
                e.target.getBoundingClientRect()[
                  swiper.isHorizontal() ? "left" : "top"
                ]
              : null),
          e.preventDefault(),
          e.stopPropagation(),
          $wrapperEl.transition(100),
          $dragEl.transition(100),
          setDragPosition(e),
          clearTimeout(dragTimeout),
          $el.transition(0),
          params.hide && $el.css("opacity", 1),
          swiper.params.cssMode &&
            swiper.$wrapperEl.css("scroll-snap-type", "none"),
          emit("scrollbarDragStart", e);
      }
      function onDragMove(e) {
        const { scrollbar: scrollbar, $wrapperEl: $wrapperEl } = swiper,
          { $el: $el, $dragEl: $dragEl } = scrollbar;
        isTouched &&
          (e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
          setDragPosition(e),
          $wrapperEl.transition(0),
          $el.transition(0),
          $dragEl.transition(0),
          emit("scrollbarDragMove", e));
      }
      function onDragEnd(e) {
        const params = swiper.params.scrollbar,
          { scrollbar: scrollbar, $wrapperEl: $wrapperEl } = swiper,
          { $el: $el } = scrollbar;
        isTouched &&
          ((isTouched = !1),
          swiper.params.cssMode &&
            (swiper.$wrapperEl.css("scroll-snap-type", ""),
            $wrapperEl.transition("")),
          params.hide &&
            (clearTimeout(dragTimeout),
            (dragTimeout = nextTick(() => {
              $el.css("opacity", 0), $el.transition(400);
            }, 1e3))),
          emit("scrollbarDragEnd", e),
          params.snapOnRelease && swiper.slideToClosest());
      }
      function events(method) {
        const {
            scrollbar: scrollbar,
            touchEventsTouch: touchEventsTouch,
            touchEventsDesktop: touchEventsDesktop,
            params: params,
            support: support,
          } = swiper,
          target = scrollbar.$el[0],
          activeListener = !(
            !support.passiveListener || !params.passiveListeners
          ) && { passive: !1, capture: !1 },
          passiveListener = !(
            !support.passiveListener || !params.passiveListeners
          ) && { passive: !0, capture: !1 };
        if (!target) return;
        const eventMethod =
          "on" === method ? "addEventListener" : "removeEventListener";
        support.touch
          ? (target[eventMethod](
              touchEventsTouch.start,
              onDragStart,
              activeListener
            ),
            target[eventMethod](
              touchEventsTouch.move,
              onDragMove,
              activeListener
            ),
            target[eventMethod](
              touchEventsTouch.end,
              onDragEnd,
              passiveListener
            ))
          : (target[eventMethod](
              touchEventsDesktop.start,
              onDragStart,
              activeListener
            ),
            document[eventMethod](
              touchEventsDesktop.move,
              onDragMove,
              activeListener
            ),
            document[eventMethod](
              touchEventsDesktop.end,
              onDragEnd,
              passiveListener
            ));
      }
      function init() {
        const { scrollbar: scrollbar, $el: $swiperEl } = swiper;
        swiper.params.scrollbar = createElementIfNotDefined(
          swiper,
          swiper.originalParams.scrollbar,
          swiper.params.scrollbar,
          { el: "swiper-scrollbar" }
        );
        const params = swiper.params.scrollbar;
        if (!params.el) return;
        let $el = $(params.el);
        swiper.params.uniqueNavElements &&
          "string" == typeof params.el &&
          $el.length > 1 &&
          1 === $swiperEl.find(params.el).length &&
          ($el = $swiperEl.find(params.el));
        let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);
        0 === $dragEl.length &&
          (($dragEl = $(
            `<div class="${swiper.params.scrollbar.dragClass}"></div>`
          )),
          $el.append($dragEl)),
          Object.assign(scrollbar, {
            $el: $el,
            el: $el[0],
            $dragEl: $dragEl,
            dragEl: $dragEl[0],
          }),
          params.draggable &&
            (function enableDraggable() {
              swiper.params.scrollbar.el && events("on");
            })(),
          $el &&
            $el[swiper.enabled ? "removeClass" : "addClass"](
              swiper.params.scrollbar.lockClass
            );
      }
      function destroy() {
        !(function disableDraggable() {
          swiper.params.scrollbar.el && events("off");
        })();
      }
      extendParams({
        scrollbar: {
          el: null,
          dragSize: "auto",
          hide: !1,
          draggable: !1,
          snapOnRelease: !0,
          lockClass: "swiper-scrollbar-lock",
          dragClass: "swiper-scrollbar-drag",
        },
      }),
        (swiper.scrollbar = {
          el: null,
          dragEl: null,
          $el: null,
          $dragEl: null,
        }),
        on("init", () => {
          init(), updateSize(), setTranslate();
        }),
        on("update resize observerUpdate lock unlock", () => {
          updateSize();
        }),
        on("setTranslate", () => {
          setTranslate();
        }),
        on("setTransition", (_s, duration) => {
          !(function setTransition(duration) {
            swiper.params.scrollbar.el &&
              swiper.scrollbar.el &&
              swiper.scrollbar.$dragEl.transition(duration);
          })(duration);
        }),
        on("enable disable", () => {
          const { $el: $el } = swiper.scrollbar;
          $el &&
            $el[swiper.enabled ? "removeClass" : "addClass"](
              swiper.params.scrollbar.lockClass
            );
        }),
        on("destroy", () => {
          destroy();
        }),
        Object.assign(swiper.scrollbar, {
          updateSize: updateSize,
          setTranslate: setTranslate,
          init: init,
          destroy: destroy,
        });
    },
    function Parallax(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({ parallax: { enabled: !1 } });
      const setTransform = (el, progress) => {
          const { rtl: rtl } = swiper,
            $el = $(el),
            rtlFactor = rtl ? -1 : 1,
            p = $el.attr("data-swiper-parallax") || "0";
          let x = $el.attr("data-swiper-parallax-x"),
            y = $el.attr("data-swiper-parallax-y");
          const scale = $el.attr("data-swiper-parallax-scale"),
            opacity = $el.attr("data-swiper-parallax-opacity");
          if (
            (x || y
              ? ((x = x || "0"), (y = y || "0"))
              : swiper.isHorizontal()
              ? ((x = p), (y = "0"))
              : ((y = p), (x = "0")),
            (x =
              x.indexOf("%") >= 0
                ? parseInt(x, 10) * progress * rtlFactor + "%"
                : x * progress * rtlFactor + "px"),
            (y =
              y.indexOf("%") >= 0
                ? parseInt(y, 10) * progress + "%"
                : y * progress + "px"),
            null != opacity)
          ) {
            const currentOpacity =
              opacity - (opacity - 1) * (1 - Math.abs(progress));
            $el[0].style.opacity = currentOpacity;
          }
          if (null == scale) $el.transform(`translate3d(${x}, ${y}, 0px)`);
          else {
            const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
            $el.transform(
              `translate3d(${x}, ${y}, 0px) scale(${currentScale})`
            );
          }
        },
        setTranslate = () => {
          const {
            $el: $el,
            slides: slides,
            progress: progress,
            snapGrid: snapGrid,
          } = swiper;
          $el
            .children(
              "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
            )
            .each((el) => {
              setTransform(el, progress);
            }),
            slides.each((slideEl, slideIndex) => {
              let slideProgress = slideEl.progress;
              swiper.params.slidesPerGroup > 1 &&
                "auto" !== swiper.params.slidesPerView &&
                (slideProgress +=
                  Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1)),
                (slideProgress = Math.min(Math.max(slideProgress, -1), 1)),
                $(slideEl)
                  .find(
                    "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
                  )
                  .each((el) => {
                    setTransform(el, slideProgress);
                  });
            });
        };
      on("beforeInit", () => {
        swiper.params.parallax.enabled &&
          ((swiper.params.watchSlidesProgress = !0),
          (swiper.originalParams.watchSlidesProgress = !0));
      }),
        on("init", () => {
          swiper.params.parallax.enabled && setTranslate();
        }),
        on("setTranslate", () => {
          swiper.params.parallax.enabled && setTranslate();
        }),
        on("setTransition", (_swiper, duration) => {
          swiper.params.parallax.enabled &&
            (function (duration) {
              void 0 === duration && (duration = swiper.params.speed);
              const { $el: $el } = swiper;
              $el
                .find(
                  "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
                )
                .each((parallaxEl) => {
                  const $parallaxEl = $(parallaxEl);
                  let parallaxDuration =
                    parseInt(
                      $parallaxEl.attr("data-swiper-parallax-duration"),
                      10
                    ) || duration;
                  0 === duration && (parallaxDuration = 0),
                    $parallaxEl.transition(parallaxDuration);
                });
            })(duration);
        });
    },
    function Zoom(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      const window = getWindow();
      extendParams({
        zoom: {
          enabled: !1,
          maxRatio: 3,
          minRatio: 1,
          toggle: !0,
          containerClass: "swiper-zoom-container",
          zoomedSlideClass: "swiper-slide-zoomed",
        },
      }),
        (swiper.zoom = { enabled: !1 });
      let gesturesEnabled,
        fakeGestureTouched,
        fakeGestureMoved,
        currentScale = 1,
        isScaling = !1;
      const gesture = {
          $slideEl: void 0,
          slideWidth: void 0,
          slideHeight: void 0,
          $imageEl: void 0,
          $imageWrapEl: void 0,
          maxRatio: 3,
        },
        image = {
          isTouched: void 0,
          isMoved: void 0,
          currentX: void 0,
          currentY: void 0,
          minX: void 0,
          minY: void 0,
          maxX: void 0,
          maxY: void 0,
          width: void 0,
          height: void 0,
          startX: void 0,
          startY: void 0,
          touchesStart: {},
          touchesCurrent: {},
        },
        velocity = {
          x: void 0,
          y: void 0,
          prevPositionX: void 0,
          prevPositionY: void 0,
          prevTime: void 0,
        };
      let scale = 1;
      function getDistanceBetweenTouches(e) {
        if (e.targetTouches.length < 2) return 1;
        const x1 = e.targetTouches[0].pageX,
          y1 = e.targetTouches[0].pageY,
          x2 = e.targetTouches[1].pageX,
          y2 = e.targetTouches[1].pageY;
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      }
      function onGestureStart(e) {
        const support = swiper.support,
          params = swiper.params.zoom;
        if (
          ((fakeGestureTouched = !1),
          (fakeGestureMoved = !1),
          !support.gestures)
        ) {
          if (
            "touchstart" !== e.type ||
            ("touchstart" === e.type && e.targetTouches.length < 2)
          )
            return;
          (fakeGestureTouched = !0),
            (gesture.scaleStart = getDistanceBetweenTouches(e));
        }
        (gesture.$slideEl && gesture.$slideEl.length) ||
        ((gesture.$slideEl = $(e.target).closest(
          `.${swiper.params.slideClass}`
        )),
        0 === gesture.$slideEl.length &&
          (gesture.$slideEl = swiper.slides.eq(swiper.activeIndex)),
        (gesture.$imageEl = gesture.$slideEl
          .find(`.${params.containerClass}`)
          .eq(0)
          .find("picture, img, svg, canvas, .swiper-zoom-target")
          .eq(0)),
        (gesture.$imageWrapEl = gesture.$imageEl.parent(
          `.${params.containerClass}`
        )),
        (gesture.maxRatio =
          gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio),
        0 !== gesture.$imageWrapEl.length)
          ? (gesture.$imageEl && gesture.$imageEl.transition(0),
            (isScaling = !0))
          : (gesture.$imageEl = void 0);
      }
      function onGestureChange(e) {
        const support = swiper.support,
          params = swiper.params.zoom,
          zoom = swiper.zoom;
        if (!support.gestures) {
          if (
            "touchmove" !== e.type ||
            ("touchmove" === e.type && e.targetTouches.length < 2)
          )
            return;
          (fakeGestureMoved = !0),
            (gesture.scaleMove = getDistanceBetweenTouches(e));
        }
        gesture.$imageEl && 0 !== gesture.$imageEl.length
          ? (support.gestures
              ? (zoom.scale = e.scale * currentScale)
              : (zoom.scale =
                  (gesture.scaleMove / gesture.scaleStart) * currentScale),
            zoom.scale > gesture.maxRatio &&
              (zoom.scale =
                gesture.maxRatio -
                1 +
                (zoom.scale - gesture.maxRatio + 1) ** 0.5),
            zoom.scale < params.minRatio &&
              (zoom.scale =
                params.minRatio +
                1 -
                (params.minRatio - zoom.scale + 1) ** 0.5),
            gesture.$imageEl.transform(
              `translate3d(0,0,0) scale(${zoom.scale})`
            ))
          : "gesturechange" === e.type && onGestureStart(e);
      }
      function onGestureEnd(e) {
        const device = swiper.device,
          support = swiper.support,
          params = swiper.params.zoom,
          zoom = swiper.zoom;
        if (!support.gestures) {
          if (!fakeGestureTouched || !fakeGestureMoved) return;
          if (
            "touchend" !== e.type ||
            ("touchend" === e.type &&
              e.changedTouches.length < 2 &&
              !device.android)
          )
            return;
          (fakeGestureTouched = !1), (fakeGestureMoved = !1);
        }
        gesture.$imageEl &&
          0 !== gesture.$imageEl.length &&
          ((zoom.scale = Math.max(
            Math.min(zoom.scale, gesture.maxRatio),
            params.minRatio
          )),
          gesture.$imageEl
            .transition(swiper.params.speed)
            .transform(`translate3d(0,0,0) scale(${zoom.scale})`),
          (currentScale = zoom.scale),
          (isScaling = !1),
          1 === zoom.scale && (gesture.$slideEl = void 0));
      }
      function onTouchMove(e) {
        const zoom = swiper.zoom;
        if (!gesture.$imageEl || 0 === gesture.$imageEl.length) return;
        if (((swiper.allowClick = !1), !image.isTouched || !gesture.$slideEl))
          return;
        image.isMoved ||
          ((image.width = gesture.$imageEl[0].offsetWidth),
          (image.height = gesture.$imageEl[0].offsetHeight),
          (image.startX = getTranslate(gesture.$imageWrapEl[0], "x") || 0),
          (image.startY = getTranslate(gesture.$imageWrapEl[0], "y") || 0),
          (gesture.slideWidth = gesture.$slideEl[0].offsetWidth),
          (gesture.slideHeight = gesture.$slideEl[0].offsetHeight),
          gesture.$imageWrapEl.transition(0));
        const scaledWidth = image.width * zoom.scale,
          scaledHeight = image.height * zoom.scale;
        if (
          !(
            scaledWidth < gesture.slideWidth &&
            scaledHeight < gesture.slideHeight
          )
        ) {
          if (
            ((image.minX = Math.min(
              gesture.slideWidth / 2 - scaledWidth / 2,
              0
            )),
            (image.maxX = -image.minX),
            (image.minY = Math.min(
              gesture.slideHeight / 2 - scaledHeight / 2,
              0
            )),
            (image.maxY = -image.minY),
            (image.touchesCurrent.x =
              "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX),
            (image.touchesCurrent.y =
              "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY),
            !image.isMoved && !isScaling)
          ) {
            if (
              swiper.isHorizontal() &&
              ((Math.floor(image.minX) === Math.floor(image.startX) &&
                image.touchesCurrent.x < image.touchesStart.x) ||
                (Math.floor(image.maxX) === Math.floor(image.startX) &&
                  image.touchesCurrent.x > image.touchesStart.x))
            )
              return void (image.isTouched = !1);
            if (
              !swiper.isHorizontal() &&
              ((Math.floor(image.minY) === Math.floor(image.startY) &&
                image.touchesCurrent.y < image.touchesStart.y) ||
                (Math.floor(image.maxY) === Math.floor(image.startY) &&
                  image.touchesCurrent.y > image.touchesStart.y))
            )
              return void (image.isTouched = !1);
          }
          e.cancelable && e.preventDefault(),
            e.stopPropagation(),
            (image.isMoved = !0),
            (image.currentX =
              image.touchesCurrent.x - image.touchesStart.x + image.startX),
            (image.currentY =
              image.touchesCurrent.y - image.touchesStart.y + image.startY),
            image.currentX < image.minX &&
              (image.currentX =
                image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8),
            image.currentX > image.maxX &&
              (image.currentX =
                image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8),
            image.currentY < image.minY &&
              (image.currentY =
                image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8),
            image.currentY > image.maxY &&
              (image.currentY =
                image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8),
            velocity.prevPositionX ||
              (velocity.prevPositionX = image.touchesCurrent.x),
            velocity.prevPositionY ||
              (velocity.prevPositionY = image.touchesCurrent.y),
            velocity.prevTime || (velocity.prevTime = Date.now()),
            (velocity.x =
              (image.touchesCurrent.x - velocity.prevPositionX) /
              (Date.now() - velocity.prevTime) /
              2),
            (velocity.y =
              (image.touchesCurrent.y - velocity.prevPositionY) /
              (Date.now() - velocity.prevTime) /
              2),
            Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2 &&
              (velocity.x = 0),
            Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2 &&
              (velocity.y = 0),
            (velocity.prevPositionX = image.touchesCurrent.x),
            (velocity.prevPositionY = image.touchesCurrent.y),
            (velocity.prevTime = Date.now()),
            gesture.$imageWrapEl.transform(
              `translate3d(${image.currentX}px, ${image.currentY}px,0)`
            );
        }
      }
      function onTransitionEnd() {
        const zoom = swiper.zoom;
        gesture.$slideEl &&
          swiper.previousIndex !== swiper.activeIndex &&
          (gesture.$imageEl &&
            gesture.$imageEl.transform("translate3d(0,0,0) scale(1)"),
          gesture.$imageWrapEl &&
            gesture.$imageWrapEl.transform("translate3d(0,0,0)"),
          (zoom.scale = 1),
          (currentScale = 1),
          (gesture.$slideEl = void 0),
          (gesture.$imageEl = void 0),
          (gesture.$imageWrapEl = void 0));
      }
      function zoomIn(e) {
        const zoom = swiper.zoom,
          params = swiper.params.zoom;
        if (
          (gesture.$slideEl ||
            (e &&
              e.target &&
              (gesture.$slideEl = $(e.target).closest(
                `.${swiper.params.slideClass}`
              )),
            gesture.$slideEl ||
              (swiper.params.virtual &&
              swiper.params.virtual.enabled &&
              swiper.virtual
                ? (gesture.$slideEl = swiper.$wrapperEl.children(
                    `.${swiper.params.slideActiveClass}`
                  ))
                : (gesture.$slideEl = swiper.slides.eq(swiper.activeIndex))),
            (gesture.$imageEl = gesture.$slideEl
              .find(`.${params.containerClass}`)
              .eq(0)
              .find("picture, img, svg, canvas, .swiper-zoom-target")
              .eq(0)),
            (gesture.$imageWrapEl = gesture.$imageEl.parent(
              `.${params.containerClass}`
            ))),
          !gesture.$imageEl ||
            0 === gesture.$imageEl.length ||
            !gesture.$imageWrapEl ||
            0 === gesture.$imageWrapEl.length)
        )
          return;
        let touchX,
          touchY,
          offsetX,
          offsetY,
          diffX,
          diffY,
          translateX,
          translateY,
          imageWidth,
          imageHeight,
          scaledWidth,
          scaledHeight,
          translateMinX,
          translateMinY,
          translateMaxX,
          translateMaxY,
          slideWidth,
          slideHeight;
        swiper.params.cssMode &&
          ((swiper.wrapperEl.style.overflow = "hidden"),
          (swiper.wrapperEl.style.touchAction = "none")),
          gesture.$slideEl.addClass(`${params.zoomedSlideClass}`),
          void 0 === image.touchesStart.x && e
            ? ((touchX =
                "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX),
              (touchY =
                "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY))
            : ((touchX = image.touchesStart.x),
              (touchY = image.touchesStart.y)),
          (zoom.scale =
            gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio),
          (currentScale =
            gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio),
          e
            ? ((slideWidth = gesture.$slideEl[0].offsetWidth),
              (slideHeight = gesture.$slideEl[0].offsetHeight),
              (offsetX = gesture.$slideEl.offset().left + window.scrollX),
              (offsetY = gesture.$slideEl.offset().top + window.scrollY),
              (diffX = offsetX + slideWidth / 2 - touchX),
              (diffY = offsetY + slideHeight / 2 - touchY),
              (imageWidth = gesture.$imageEl[0].offsetWidth),
              (imageHeight = gesture.$imageEl[0].offsetHeight),
              (scaledWidth = imageWidth * zoom.scale),
              (scaledHeight = imageHeight * zoom.scale),
              (translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0)),
              (translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0)),
              (translateMaxX = -translateMinX),
              (translateMaxY = -translateMinY),
              (translateX = diffX * zoom.scale),
              (translateY = diffY * zoom.scale),
              translateX < translateMinX && (translateX = translateMinX),
              translateX > translateMaxX && (translateX = translateMaxX),
              translateY < translateMinY && (translateY = translateMinY),
              translateY > translateMaxY && (translateY = translateMaxY))
            : ((translateX = 0), (translateY = 0)),
          gesture.$imageWrapEl
            .transition(300)
            .transform(`translate3d(${translateX}px, ${translateY}px,0)`),
          gesture.$imageEl
            .transition(300)
            .transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }
      function zoomOut() {
        const zoom = swiper.zoom,
          params = swiper.params.zoom;
        gesture.$slideEl ||
          (swiper.params.virtual &&
          swiper.params.virtual.enabled &&
          swiper.virtual
            ? (gesture.$slideEl = swiper.$wrapperEl.children(
                `.${swiper.params.slideActiveClass}`
              ))
            : (gesture.$slideEl = swiper.slides.eq(swiper.activeIndex)),
          (gesture.$imageEl = gesture.$slideEl
            .find(`.${params.containerClass}`)
            .eq(0)
            .find("picture, img, svg, canvas, .swiper-zoom-target")
            .eq(0)),
          (gesture.$imageWrapEl = gesture.$imageEl.parent(
            `.${params.containerClass}`
          ))),
          gesture.$imageEl &&
            0 !== gesture.$imageEl.length &&
            gesture.$imageWrapEl &&
            0 !== gesture.$imageWrapEl.length &&
            (swiper.params.cssMode &&
              ((swiper.wrapperEl.style.overflow = ""),
              (swiper.wrapperEl.style.touchAction = "")),
            (zoom.scale = 1),
            (currentScale = 1),
            gesture.$imageWrapEl
              .transition(300)
              .transform("translate3d(0,0,0)"),
            gesture.$imageEl
              .transition(300)
              .transform("translate3d(0,0,0) scale(1)"),
            gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`),
            (gesture.$slideEl = void 0));
      }
      function zoomToggle(e) {
        const zoom = swiper.zoom;
        zoom.scale && 1 !== zoom.scale ? zoomOut() : zoomIn(e);
      }
      function getListeners() {
        const support = swiper.support;
        return {
          passiveListener: !(
            "touchstart" !== swiper.touchEvents.start ||
            !support.passiveListener ||
            !swiper.params.passiveListeners
          ) && { passive: !0, capture: !1 },
          activeListenerWithCapture: !support.passiveListener || {
            passive: !1,
            capture: !0,
          },
        };
      }
      function getSlideSelector() {
        return `.${swiper.params.slideClass}`;
      }
      function toggleGestures(method) {
        const { passiveListener: passiveListener } = getListeners(),
          slideSelector = getSlideSelector();
        swiper.$wrapperEl[method](
          "gesturestart",
          slideSelector,
          onGestureStart,
          passiveListener
        ),
          swiper.$wrapperEl[method](
            "gesturechange",
            slideSelector,
            onGestureChange,
            passiveListener
          ),
          swiper.$wrapperEl[method](
            "gestureend",
            slideSelector,
            onGestureEnd,
            passiveListener
          );
      }
      function enableGestures() {
        gesturesEnabled || ((gesturesEnabled = !0), toggleGestures("on"));
      }
      function disableGestures() {
        gesturesEnabled && ((gesturesEnabled = !1), toggleGestures("off"));
      }
      function enable() {
        const zoom = swiper.zoom;
        if (zoom.enabled) return;
        zoom.enabled = !0;
        const support = swiper.support,
          {
            passiveListener: passiveListener,
            activeListenerWithCapture: activeListenerWithCapture,
          } = getListeners(),
          slideSelector = getSlideSelector();
        support.gestures
          ? (swiper.$wrapperEl.on(
              swiper.touchEvents.start,
              enableGestures,
              passiveListener
            ),
            swiper.$wrapperEl.on(
              swiper.touchEvents.end,
              disableGestures,
              passiveListener
            ))
          : "touchstart" === swiper.touchEvents.start &&
            (swiper.$wrapperEl.on(
              swiper.touchEvents.start,
              slideSelector,
              onGestureStart,
              passiveListener
            ),
            swiper.$wrapperEl.on(
              swiper.touchEvents.move,
              slideSelector,
              onGestureChange,
              activeListenerWithCapture
            ),
            swiper.$wrapperEl.on(
              swiper.touchEvents.end,
              slideSelector,
              onGestureEnd,
              passiveListener
            ),
            swiper.touchEvents.cancel &&
              swiper.$wrapperEl.on(
                swiper.touchEvents.cancel,
                slideSelector,
                onGestureEnd,
                passiveListener
              )),
          swiper.$wrapperEl.on(
            swiper.touchEvents.move,
            `.${swiper.params.zoom.containerClass}`,
            onTouchMove,
            activeListenerWithCapture
          );
      }
      function disable() {
        const zoom = swiper.zoom;
        if (!zoom.enabled) return;
        const support = swiper.support;
        zoom.enabled = !1;
        const {
            passiveListener: passiveListener,
            activeListenerWithCapture: activeListenerWithCapture,
          } = getListeners(),
          slideSelector = getSlideSelector();
        support.gestures
          ? (swiper.$wrapperEl.off(
              swiper.touchEvents.start,
              enableGestures,
              passiveListener
            ),
            swiper.$wrapperEl.off(
              swiper.touchEvents.end,
              disableGestures,
              passiveListener
            ))
          : "touchstart" === swiper.touchEvents.start &&
            (swiper.$wrapperEl.off(
              swiper.touchEvents.start,
              slideSelector,
              onGestureStart,
              passiveListener
            ),
            swiper.$wrapperEl.off(
              swiper.touchEvents.move,
              slideSelector,
              onGestureChange,
              activeListenerWithCapture
            ),
            swiper.$wrapperEl.off(
              swiper.touchEvents.end,
              slideSelector,
              onGestureEnd,
              passiveListener
            ),
            swiper.touchEvents.cancel &&
              swiper.$wrapperEl.off(
                swiper.touchEvents.cancel,
                slideSelector,
                onGestureEnd,
                passiveListener
              )),
          swiper.$wrapperEl.off(
            swiper.touchEvents.move,
            `.${swiper.params.zoom.containerClass}`,
            onTouchMove,
            activeListenerWithCapture
          );
      }
      Object.defineProperty(swiper.zoom, "scale", {
        get: () => scale,
        set(value) {
          if (scale !== value) {
            const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : void 0,
              slideEl = gesture.$slideEl ? gesture.$slideEl[0] : void 0;
            emit("zoomChange", value, imageEl, slideEl);
          }
          scale = value;
        },
      }),
        on("init", () => {
          swiper.params.zoom.enabled && enable();
        }),
        on("destroy", () => {
          disable();
        }),
        on("touchStart", (_s, e) => {
          swiper.zoom.enabled &&
            (function onTouchStart(e) {
              const device = swiper.device;
              gesture.$imageEl &&
                0 !== gesture.$imageEl.length &&
                (image.isTouched ||
                  (device.android && e.cancelable && e.preventDefault(),
                  (image.isTouched = !0),
                  (image.touchesStart.x =
                    "touchstart" === e.type
                      ? e.targetTouches[0].pageX
                      : e.pageX),
                  (image.touchesStart.y =
                    "touchstart" === e.type
                      ? e.targetTouches[0].pageY
                      : e.pageY)));
            })(e);
        }),
        on("touchEnd", (_s, e) => {
          swiper.zoom.enabled &&
            (function onTouchEnd() {
              const zoom = swiper.zoom;
              if (!gesture.$imageEl || 0 === gesture.$imageEl.length) return;
              if (!image.isTouched || !image.isMoved)
                return (image.isTouched = !1), void (image.isMoved = !1);
              (image.isTouched = !1), (image.isMoved = !1);
              let momentumDurationX = 300,
                momentumDurationY = 300;
              const momentumDistanceX = velocity.x * momentumDurationX,
                newPositionX = image.currentX + momentumDistanceX,
                momentumDistanceY = velocity.y * momentumDurationY,
                newPositionY = image.currentY + momentumDistanceY;
              0 !== velocity.x &&
                (momentumDurationX = Math.abs(
                  (newPositionX - image.currentX) / velocity.x
                )),
                0 !== velocity.y &&
                  (momentumDurationY = Math.abs(
                    (newPositionY - image.currentY) / velocity.y
                  ));
              const momentumDuration = Math.max(
                momentumDurationX,
                momentumDurationY
              );
              (image.currentX = newPositionX), (image.currentY = newPositionY);
              const scaledWidth = image.width * zoom.scale,
                scaledHeight = image.height * zoom.scale;
              (image.minX = Math.min(
                gesture.slideWidth / 2 - scaledWidth / 2,
                0
              )),
                (image.maxX = -image.minX),
                (image.minY = Math.min(
                  gesture.slideHeight / 2 - scaledHeight / 2,
                  0
                )),
                (image.maxY = -image.minY),
                (image.currentX = Math.max(
                  Math.min(image.currentX, image.maxX),
                  image.minX
                )),
                (image.currentY = Math.max(
                  Math.min(image.currentY, image.maxY),
                  image.minY
                )),
                gesture.$imageWrapEl
                  .transition(momentumDuration)
                  .transform(
                    `translate3d(${image.currentX}px, ${image.currentY}px,0)`
                  );
            })();
        }),
        on("doubleTap", (_s, e) => {
          !swiper.animating &&
            swiper.params.zoom.enabled &&
            swiper.zoom.enabled &&
            swiper.params.zoom.toggle &&
            zoomToggle(e);
        }),
        on("transitionEnd", () => {
          swiper.zoom.enabled &&
            swiper.params.zoom.enabled &&
            onTransitionEnd();
        }),
        on("slideChange", () => {
          swiper.zoom.enabled &&
            swiper.params.zoom.enabled &&
            swiper.params.cssMode &&
            onTransitionEnd();
        }),
        Object.assign(swiper.zoom, {
          enable: enable,
          disable: disable,
          in: zoomIn,
          out: zoomOut,
          toggle: zoomToggle,
        });
    },
    function Lazy(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        on: on,
        emit: emit,
      } = _ref;
      extendParams({
        lazy: {
          checkInView: !1,
          enabled: !1,
          loadPrevNext: !1,
          loadPrevNextAmount: 1,
          loadOnTransitionStart: !1,
          scrollingElement: "",
          elementClass: "swiper-lazy",
          loadingClass: "swiper-lazy-loading",
          loadedClass: "swiper-lazy-loaded",
          preloaderClass: "swiper-lazy-preloader",
        },
      }),
        (swiper.lazy = {});
      let scrollHandlerAttached = !1,
        initialImageLoaded = !1;
      function loadInSlide(index, loadInDuplicate) {
        void 0 === loadInDuplicate && (loadInDuplicate = !0);
        const params = swiper.params.lazy;
        if (void 0 === index) return;
        if (0 === swiper.slides.length) return;
        const $slideEl =
            swiper.virtual && swiper.params.virtual.enabled
              ? swiper.$wrapperEl.children(
                  `.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`
                )
              : swiper.slides.eq(index),
          $images = $slideEl.find(
            `.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`
          );
        !$slideEl.hasClass(params.elementClass) ||
          $slideEl.hasClass(params.loadedClass) ||
          $slideEl.hasClass(params.loadingClass) ||
          $images.push($slideEl[0]),
          0 !== $images.length &&
            $images.each((imageEl) => {
              const $imageEl = $(imageEl);
              $imageEl.addClass(params.loadingClass);
              const background = $imageEl.attr("data-background"),
                src = $imageEl.attr("data-src"),
                srcset = $imageEl.attr("data-srcset"),
                sizes = $imageEl.attr("data-sizes"),
                $pictureEl = $imageEl.parent("picture");
              swiper.loadImage(
                $imageEl[0],
                src || background,
                srcset,
                sizes,
                !1,
                () => {
                  if (
                    null != swiper &&
                    swiper &&
                    (!swiper || swiper.params) &&
                    !swiper.destroyed
                  ) {
                    if (
                      (background
                        ? ($imageEl.css(
                            "background-image",
                            `url("${background}")`
                          ),
                          $imageEl.removeAttr("data-background"))
                        : (srcset &&
                            ($imageEl.attr("srcset", srcset),
                            $imageEl.removeAttr("data-srcset")),
                          sizes &&
                            ($imageEl.attr("sizes", sizes),
                            $imageEl.removeAttr("data-sizes")),
                          $pictureEl.length &&
                            $pictureEl.children("source").each((sourceEl) => {
                              const $source = $(sourceEl);
                              $source.attr("data-srcset") &&
                                ($source.attr(
                                  "srcset",
                                  $source.attr("data-srcset")
                                ),
                                $source.removeAttr("data-srcset"));
                            }),
                          src &&
                            ($imageEl.attr("src", src),
                            $imageEl.removeAttr("data-src"))),
                      $imageEl
                        .addClass(params.loadedClass)
                        .removeClass(params.loadingClass),
                      $slideEl.find(`.${params.preloaderClass}`).remove(),
                      swiper.params.loop && loadInDuplicate)
                    ) {
                      const slideOriginalIndex = $slideEl.attr(
                        "data-swiper-slide-index"
                      );
                      if (
                        $slideEl.hasClass(swiper.params.slideDuplicateClass)
                      ) {
                        loadInSlide(
                          swiper.$wrapperEl
                            .children(
                              `[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`
                            )
                            .index(),
                          !1
                        );
                      } else {
                        loadInSlide(
                          swiper.$wrapperEl
                            .children(
                              `.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`
                            )
                            .index(),
                          !1
                        );
                      }
                    }
                    emit("lazyImageReady", $slideEl[0], $imageEl[0]),
                      swiper.params.autoHeight && swiper.updateAutoHeight();
                  }
                }
              ),
                emit("lazyImageLoad", $slideEl[0], $imageEl[0]);
            });
      }
      function load() {
        const {
            $wrapperEl: $wrapperEl,
            params: swiperParams,
            slides: slides,
            activeIndex: activeIndex,
          } = swiper,
          isVirtual = swiper.virtual && swiperParams.virtual.enabled,
          params = swiperParams.lazy;
        let slidesPerView = swiperParams.slidesPerView;
        function slideExist(index) {
          if (isVirtual) {
            if (
              $wrapperEl.children(
                `.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`
              ).length
            )
              return !0;
          } else if (slides[index]) return !0;
          return !1;
        }
        function slideIndex(slideEl) {
          return isVirtual
            ? $(slideEl).attr("data-swiper-slide-index")
            : $(slideEl).index();
        }
        if (
          ("auto" === slidesPerView && (slidesPerView = 0),
          initialImageLoaded || (initialImageLoaded = !0),
          swiper.params.watchSlidesProgress)
        )
          $wrapperEl
            .children(`.${swiperParams.slideVisibleClass}`)
            .each((slideEl) => {
              loadInSlide(
                isVirtual
                  ? $(slideEl).attr("data-swiper-slide-index")
                  : $(slideEl).index()
              );
            });
        else if (slidesPerView > 1)
          for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1)
            slideExist(i) && loadInSlide(i);
        else loadInSlide(activeIndex);
        if (params.loadPrevNext)
          if (
            slidesPerView > 1 ||
            (params.loadPrevNextAmount && params.loadPrevNextAmount > 1)
          ) {
            const amount = params.loadPrevNextAmount,
              spv = slidesPerView,
              maxIndex = Math.min(
                activeIndex + spv + Math.max(amount, spv),
                slides.length
              ),
              minIndex = Math.max(activeIndex - Math.max(spv, amount), 0);
            for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1)
              slideExist(i) && loadInSlide(i);
            for (let i = minIndex; i < activeIndex; i += 1)
              slideExist(i) && loadInSlide(i);
          } else {
            const nextSlide = $wrapperEl.children(
              `.${swiperParams.slideNextClass}`
            );
            nextSlide.length > 0 && loadInSlide(slideIndex(nextSlide));
            const prevSlide = $wrapperEl.children(
              `.${swiperParams.slidePrevClass}`
            );
            prevSlide.length > 0 && loadInSlide(slideIndex(prevSlide));
          }
      }
      function checkInViewOnLoad() {
        const window = getWindow();
        if (!swiper || swiper.destroyed) return;
        const $scrollElement = swiper.params.lazy.scrollingElement
            ? $(swiper.params.lazy.scrollingElement)
            : $(window),
          isWindow = $scrollElement[0] === window,
          scrollElementWidth = isWindow
            ? window.innerWidth
            : $scrollElement[0].offsetWidth,
          scrollElementHeight = isWindow
            ? window.innerHeight
            : $scrollElement[0].offsetHeight,
          swiperOffset = swiper.$el.offset(),
          { rtlTranslate: rtl } = swiper;
        let inView = !1;
        rtl && (swiperOffset.left -= swiper.$el[0].scrollLeft);
        const swiperCoord = [
          [swiperOffset.left, swiperOffset.top],
          [swiperOffset.left + swiper.width, swiperOffset.top],
          [swiperOffset.left, swiperOffset.top + swiper.height],
          [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height],
        ];
        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];
          if (
            point[0] >= 0 &&
            point[0] <= scrollElementWidth &&
            point[1] >= 0 &&
            point[1] <= scrollElementHeight
          ) {
            if (0 === point[0] && 0 === point[1]) continue;
            inView = !0;
          }
        }
        const passiveListener = !(
          "touchstart" !== swiper.touchEvents.start ||
          !swiper.support.passiveListener ||
          !swiper.params.passiveListeners
        ) && { passive: !0, capture: !1 };
        inView
          ? (load(),
            $scrollElement.off("scroll", checkInViewOnLoad, passiveListener))
          : scrollHandlerAttached ||
            ((scrollHandlerAttached = !0),
            $scrollElement.on("scroll", checkInViewOnLoad, passiveListener));
      }
      on("beforeInit", () => {
        swiper.params.lazy.enabled &&
          swiper.params.preloadImages &&
          (swiper.params.preloadImages = !1);
      }),
        on("init", () => {
          swiper.params.lazy.enabled &&
            (swiper.params.lazy.checkInView ? checkInViewOnLoad() : load());
        }),
        on("scroll", () => {
          swiper.params.freeMode &&
            swiper.params.freeMode.enabled &&
            !swiper.params.freeMode.sticky &&
            load();
        }),
        on("scrollbarDragMove resize _freeModeNoMomentumRelease", () => {
          swiper.params.lazy.enabled &&
            (swiper.params.lazy.checkInView ? checkInViewOnLoad() : load());
        }),
        on("transitionStart", () => {
          swiper.params.lazy.enabled &&
            (swiper.params.lazy.loadOnTransitionStart ||
              (!swiper.params.lazy.loadOnTransitionStart &&
                !initialImageLoaded)) &&
            (swiper.params.lazy.checkInView ? checkInViewOnLoad() : load());
        }),
        on("transitionEnd", () => {
          swiper.params.lazy.enabled &&
            !swiper.params.lazy.loadOnTransitionStart &&
            (swiper.params.lazy.checkInView ? checkInViewOnLoad() : load());
        }),
        on("slideChange", () => {
          const {
            lazy: lazy,
            cssMode: cssMode,
            watchSlidesProgress: watchSlidesProgress,
            touchReleaseOnEdges: touchReleaseOnEdges,
            resistanceRatio: resistanceRatio,
          } = swiper.params;
          lazy.enabled &&
            (cssMode ||
              (watchSlidesProgress &&
                (touchReleaseOnEdges || 0 === resistanceRatio))) &&
            load();
        }),
        Object.assign(swiper.lazy, { load: load, loadInSlide: loadInSlide });
    },
    function Controller(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      function LinearSpline(x, y) {
        const binarySearch = (function search() {
          let maxIndex, minIndex, guess;
          return (array, val) => {
            for (
              minIndex = -1, maxIndex = array.length;
              maxIndex - minIndex > 1;

            )
              (guess = (maxIndex + minIndex) >> 1),
                array[guess] <= val ? (minIndex = guess) : (maxIndex = guess);
            return maxIndex;
          };
        })();
        let i1, i3;
        return (
          (this.x = x),
          (this.y = y),
          (this.lastIndex = x.length - 1),
          (this.interpolate = function interpolate(x2) {
            return x2
              ? ((i3 = binarySearch(this.x, x2)),
                (i1 = i3 - 1),
                ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) /
                  (this.x[i3] - this.x[i1]) +
                  this.y[i1])
              : 0;
          }),
          this
        );
      }
      function removeSpline() {
        swiper.controller.control &&
          swiper.controller.spline &&
          ((swiper.controller.spline = void 0),
          delete swiper.controller.spline);
      }
      extendParams({
        controller: { control: void 0, inverse: !1, by: "slide" },
      }),
        (swiper.controller = { control: void 0 }),
        on("beforeInit", () => {
          swiper.controller.control = swiper.params.controller.control;
        }),
        on("update", () => {
          removeSpline();
        }),
        on("resize", () => {
          removeSpline();
        }),
        on("observerUpdate", () => {
          removeSpline();
        }),
        on("setTranslate", (_s, translate, byController) => {
          swiper.controller.control &&
            swiper.controller.setTranslate(translate, byController);
        }),
        on("setTransition", (_s, duration, byController) => {
          swiper.controller.control &&
            swiper.controller.setTransition(duration, byController);
        }),
        Object.assign(swiper.controller, {
          setTranslate: function setTranslate(_t, byController) {
            const controlled = swiper.controller.control;
            let multiplier, controlledTranslate;
            const Swiper = swiper.constructor;
            function setControlledTranslate(c) {
              const translate = swiper.rtlTranslate
                ? -swiper.translate
                : swiper.translate;
              "slide" === swiper.params.controller.by &&
                (!(function getInterpolateFunction(c) {
                  swiper.controller.spline ||
                    (swiper.controller.spline = swiper.params.loop
                      ? new LinearSpline(swiper.slidesGrid, c.slidesGrid)
                      : new LinearSpline(swiper.snapGrid, c.snapGrid));
                })(c),
                (controlledTranslate = -swiper.controller.spline.interpolate(
                  -translate
                ))),
                (controlledTranslate &&
                  "container" !== swiper.params.controller.by) ||
                  ((multiplier =
                    (c.maxTranslate() - c.minTranslate()) /
                    (swiper.maxTranslate() - swiper.minTranslate())),
                  (controlledTranslate =
                    (translate - swiper.minTranslate()) * multiplier +
                    c.minTranslate())),
                swiper.params.controller.inverse &&
                  (controlledTranslate =
                    c.maxTranslate() - controlledTranslate),
                c.updateProgress(controlledTranslate),
                c.setTranslate(controlledTranslate, swiper),
                c.updateActiveIndex(),
                c.updateSlidesClasses();
            }
            if (Array.isArray(controlled))
              for (let i = 0; i < controlled.length; i += 1)
                controlled[i] !== byController &&
                  controlled[i] instanceof Swiper &&
                  setControlledTranslate(controlled[i]);
            else
              controlled instanceof Swiper &&
                byController !== controlled &&
                setControlledTranslate(controlled);
          },
          setTransition: function setTransition(duration, byController) {
            const Swiper = swiper.constructor,
              controlled = swiper.controller.control;
            let i;
            function setControlledTransition(c) {
              c.setTransition(duration, swiper),
                0 !== duration &&
                  (c.transitionStart(),
                  c.params.autoHeight &&
                    nextTick(() => {
                      c.updateAutoHeight();
                    }),
                  c.$wrapperEl.transitionEnd(() => {
                    controlled &&
                      (c.params.loop &&
                        "slide" === swiper.params.controller.by &&
                        c.loopFix(),
                      c.transitionEnd());
                  }));
            }
            if (Array.isArray(controlled))
              for (i = 0; i < controlled.length; i += 1)
                controlled[i] !== byController &&
                  controlled[i] instanceof Swiper &&
                  setControlledTransition(controlled[i]);
            else
              controlled instanceof Swiper &&
                byController !== controlled &&
                setControlledTransition(controlled);
          },
        });
    },
    function A11y(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        a11y: {
          enabled: !0,
          notificationClass: "swiper-notification",
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          firstSlideMessage: "This is the first slide",
          lastSlideMessage: "This is the last slide",
          paginationBulletMessage: "Go to slide {{index}}",
          slideLabelMessage: "{{index}} / {{slidesLength}}",
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null,
          slideRole: "group",
          id: null,
        },
      });
      let liveRegion = null;
      function notify(message) {
        const notification = liveRegion;
        0 !== notification.length &&
          (notification.html(""), notification.html(message));
      }
      function makeElFocusable($el) {
        $el.attr("tabIndex", "0");
      }
      function makeElNotFocusable($el) {
        $el.attr("tabIndex", "-1");
      }
      function addElRole($el, role) {
        $el.attr("role", role);
      }
      function addElRoleDescription($el, description) {
        $el.attr("aria-roledescription", description);
      }
      function addElLabel($el, label) {
        $el.attr("aria-label", label);
      }
      function disableEl($el) {
        $el.attr("aria-disabled", !0);
      }
      function enableEl($el) {
        $el.attr("aria-disabled", !1);
      }
      function onEnterOrSpaceKey(e) {
        if (13 !== e.keyCode && 32 !== e.keyCode) return;
        const params = swiper.params.a11y,
          $targetEl = $(e.target);
        swiper.navigation &&
          swiper.navigation.$nextEl &&
          $targetEl.is(swiper.navigation.$nextEl) &&
          ((swiper.isEnd && !swiper.params.loop) || swiper.slideNext(),
          swiper.isEnd
            ? notify(params.lastSlideMessage)
            : notify(params.nextSlideMessage)),
          swiper.navigation &&
            swiper.navigation.$prevEl &&
            $targetEl.is(swiper.navigation.$prevEl) &&
            ((swiper.isBeginning && !swiper.params.loop) || swiper.slidePrev(),
            swiper.isBeginning
              ? notify(params.firstSlideMessage)
              : notify(params.prevSlideMessage)),
          swiper.pagination &&
            $targetEl.is(
              classesToSelector(swiper.params.pagination.bulletClass)
            ) &&
            $targetEl[0].click();
      }
      function hasPagination() {
        return (
          swiper.pagination &&
          swiper.pagination.bullets &&
          swiper.pagination.bullets.length
        );
      }
      function hasClickablePagination() {
        return hasPagination() && swiper.params.pagination.clickable;
      }
      const initNavEl = ($el, wrapperId, message) => {
          makeElFocusable($el),
            "BUTTON" !== $el[0].tagName &&
              (addElRole($el, "button"), $el.on("keydown", onEnterOrSpaceKey)),
            addElLabel($el, message),
            (function addElControls($el, controls) {
              $el.attr("aria-controls", controls);
            })($el, wrapperId);
        },
        handleFocus = (e) => {
          const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
          if (!slideEl || !swiper.slides.includes(slideEl)) return;
          const isActive =
              swiper.slides.indexOf(slideEl) === swiper.activeIndex,
            isVisible =
              swiper.params.watchSlidesProgress &&
              swiper.visibleSlides &&
              swiper.visibleSlides.includes(slideEl);
          isActive ||
            isVisible ||
            swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
        };
      function init() {
        const params = swiper.params.a11y;
        swiper.$el.append(liveRegion);
        const $containerEl = swiper.$el;
        params.containerRoleDescriptionMessage &&
          addElRoleDescription(
            $containerEl,
            params.containerRoleDescriptionMessage
          ),
          params.containerMessage &&
            addElLabel($containerEl, params.containerMessage);
        const $wrapperEl = swiper.$wrapperEl,
          wrapperId =
            params.id ||
            $wrapperEl.attr("id") ||
            `swiper-wrapper-${(function getRandomNumber(size) {
              return (
                void 0 === size && (size = 16),
                "x"
                  .repeat(size)
                  .replace(/x/g, () =>
                    Math.round(16 * Math.random()).toString(16)
                  )
              );
            })(16)}`,
          live =
            swiper.params.autoplay && swiper.params.autoplay.enabled
              ? "off"
              : "polite";
        !(function addElId($el, id) {
          $el.attr("id", id);
        })($wrapperEl, wrapperId),
          (function addElLive($el, live) {
            $el.attr("aria-live", live);
          })($wrapperEl, live),
          params.itemRoleDescriptionMessage &&
            addElRoleDescription(
              $(swiper.slides),
              params.itemRoleDescriptionMessage
            ),
          addElRole($(swiper.slides), params.slideRole);
        const slidesLength = swiper.params.loop
          ? swiper.slides.filter(
              (el) => !el.classList.contains(swiper.params.slideDuplicateClass)
            ).length
          : swiper.slides.length;
        let $nextEl, $prevEl;
        swiper.slides.each((slideEl, index) => {
          const $slideEl = $(slideEl),
            slideIndex = swiper.params.loop
              ? parseInt($slideEl.attr("data-swiper-slide-index"), 10)
              : index;
          addElLabel(
            $slideEl,
            params.slideLabelMessage
              .replace(/\{\{index\}\}/, slideIndex + 1)
              .replace(/\{\{slidesLength\}\}/, slidesLength)
          );
        }),
          swiper.navigation &&
            swiper.navigation.$nextEl &&
            ($nextEl = swiper.navigation.$nextEl),
          swiper.navigation &&
            swiper.navigation.$prevEl &&
            ($prevEl = swiper.navigation.$prevEl),
          $nextEl &&
            $nextEl.length &&
            initNavEl($nextEl, wrapperId, params.nextSlideMessage),
          $prevEl &&
            $prevEl.length &&
            initNavEl($prevEl, wrapperId, params.prevSlideMessage),
          hasClickablePagination() &&
            swiper.pagination.$el.on(
              "keydown",
              classesToSelector(swiper.params.pagination.bulletClass),
              onEnterOrSpaceKey
            ),
          swiper.$el.on("focus", handleFocus, !0);
      }
      on("beforeInit", () => {
        liveRegion = $(
          `<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`
        );
      }),
        on("afterInit", () => {
          swiper.params.a11y.enabled && init();
        }),
        on("fromEdge toEdge afterInit lock unlock", () => {
          swiper.params.a11y.enabled &&
            (function updateNavigation() {
              if (
                swiper.params.loop ||
                swiper.params.rewind ||
                !swiper.navigation
              )
                return;
              const { $nextEl: $nextEl, $prevEl: $prevEl } = swiper.navigation;
              $prevEl &&
                $prevEl.length > 0 &&
                (swiper.isBeginning
                  ? (disableEl($prevEl), makeElNotFocusable($prevEl))
                  : (enableEl($prevEl), makeElFocusable($prevEl))),
                $nextEl &&
                  $nextEl.length > 0 &&
                  (swiper.isEnd
                    ? (disableEl($nextEl), makeElNotFocusable($nextEl))
                    : (enableEl($nextEl), makeElFocusable($nextEl)));
            })();
        }),
        on("paginationUpdate", () => {
          swiper.params.a11y.enabled &&
            (function updatePagination() {
              const params = swiper.params.a11y;
              hasPagination() &&
                swiper.pagination.bullets.each((bulletEl) => {
                  const $bulletEl = $(bulletEl);
                  swiper.params.pagination.clickable &&
                    (makeElFocusable($bulletEl),
                    swiper.params.pagination.renderBullet ||
                      (addElRole($bulletEl, "button"),
                      addElLabel(
                        $bulletEl,
                        params.paginationBulletMessage.replace(
                          /\{\{index\}\}/,
                          $bulletEl.index() + 1
                        )
                      ))),
                    $bulletEl.is(
                      `.${swiper.params.pagination.bulletActiveClass}`
                    )
                      ? $bulletEl.attr("aria-current", "true")
                      : $bulletEl.removeAttr("aria-current");
                });
            })();
        }),
        on("destroy", () => {
          swiper.params.a11y.enabled &&
            (function destroy() {
              let $nextEl, $prevEl;
              liveRegion && liveRegion.length > 0 && liveRegion.remove(),
                swiper.navigation &&
                  swiper.navigation.$nextEl &&
                  ($nextEl = swiper.navigation.$nextEl),
                swiper.navigation &&
                  swiper.navigation.$prevEl &&
                  ($prevEl = swiper.navigation.$prevEl),
                $nextEl && $nextEl.off("keydown", onEnterOrSpaceKey),
                $prevEl && $prevEl.off("keydown", onEnterOrSpaceKey),
                hasClickablePagination() &&
                  swiper.pagination.$el.off(
                    "keydown",
                    classesToSelector(swiper.params.pagination.bulletClass),
                    onEnterOrSpaceKey
                  ),
                swiper.$el.off("focus", handleFocus, !0);
            })();
        });
    },
    function History(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        history: {
          enabled: !1,
          root: "",
          replaceState: !1,
          key: "slides",
          keepQuery: !1,
        },
      });
      let initialized = !1,
        paths = {};
      const slugify = (text) =>
          text
            .toString()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, ""),
        getPathValues = (urlOverride) => {
          const window = getWindow();
          let location;
          location = urlOverride ? new URL(urlOverride) : window.location;
          const pathArray = location.pathname
              .slice(1)
              .split("/")
              .filter((part) => "" !== part),
            total = pathArray.length;
          return { key: pathArray[total - 2], value: pathArray[total - 1] };
        },
        setHistory = (key, index) => {
          const window = getWindow();
          if (!initialized || !swiper.params.history.enabled) return;
          let location;
          location = swiper.params.url
            ? new URL(swiper.params.url)
            : window.location;
          const slide = swiper.slides.eq(index);
          let value = slugify(slide.attr("data-history"));
          if (swiper.params.history.root.length > 0) {
            let root = swiper.params.history.root;
            "/" === root[root.length - 1] &&
              (root = root.slice(0, root.length - 1)),
              (value = `${root}/${key}/${value}`);
          } else location.pathname.includes(key) || (value = `${key}/${value}`);
          swiper.params.history.keepQuery && (value += location.search);
          const currentState = window.history.state;
          (currentState && currentState.value === value) ||
            (swiper.params.history.replaceState
              ? window.history.replaceState({ value: value }, null, value)
              : window.history.pushState({ value: value }, null, value));
        },
        scrollToSlide = (speed, value, runCallbacks) => {
          if (value)
            for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
              const slide = swiper.slides.eq(i);
              if (
                slugify(slide.attr("data-history")) === value &&
                !slide.hasClass(swiper.params.slideDuplicateClass)
              ) {
                const index = slide.index();
                swiper.slideTo(index, speed, runCallbacks);
              }
            }
          else swiper.slideTo(0, speed, runCallbacks);
        },
        setHistoryPopState = () => {
          (paths = getPathValues(swiper.params.url)),
            scrollToSlide(swiper.params.speed, paths.value, !1);
        };
      on("init", () => {
        swiper.params.history.enabled &&
          (() => {
            const window = getWindow();
            if (swiper.params.history) {
              if (!window.history || !window.history.pushState)
                return (
                  (swiper.params.history.enabled = !1),
                  void (swiper.params.hashNavigation.enabled = !0)
                );
              (initialized = !0),
                (paths = getPathValues(swiper.params.url)),
                (paths.key || paths.value) &&
                  (scrollToSlide(
                    0,
                    paths.value,
                    swiper.params.runCallbacksOnInit
                  ),
                  swiper.params.history.replaceState ||
                    window.addEventListener("popstate", setHistoryPopState));
            }
          })();
      }),
        on("destroy", () => {
          swiper.params.history.enabled &&
            (() => {
              const window = getWindow();
              swiper.params.history.replaceState ||
                window.removeEventListener("popstate", setHistoryPopState);
            })();
        }),
        on("transitionEnd _freeModeNoMomentumRelease", () => {
          initialized &&
            setHistory(swiper.params.history.key, swiper.activeIndex);
        }),
        on("slideChange", () => {
          initialized &&
            swiper.params.cssMode &&
            setHistory(swiper.params.history.key, swiper.activeIndex);
        });
    },
    function HashNavigation(_ref) {
      let {
          swiper: swiper,
          extendParams: extendParams,
          emit: emit,
          on: on,
        } = _ref,
        initialized = !1;
      const document = getDocument(),
        window = getWindow();
      extendParams({
        hashNavigation: { enabled: !1, replaceState: !1, watchState: !1 },
      });
      const onHashChange = () => {
          emit("hashChange");
          const newHash = document.location.hash.replace("#", "");
          if (
            newHash !== swiper.slides.eq(swiper.activeIndex).attr("data-hash")
          ) {
            const newIndex = swiper.$wrapperEl
              .children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`)
              .index();
            if (void 0 === newIndex) return;
            swiper.slideTo(newIndex);
          }
        },
        setHash = () => {
          if (initialized && swiper.params.hashNavigation.enabled)
            if (
              swiper.params.hashNavigation.replaceState &&
              window.history &&
              window.history.replaceState
            )
              window.history.replaceState(
                null,
                null,
                `#${swiper.slides.eq(swiper.activeIndex).attr("data-hash")}` ||
                  ""
              ),
                emit("hashSet");
            else {
              const slide = swiper.slides.eq(swiper.activeIndex),
                hash = slide.attr("data-hash") || slide.attr("data-history");
              (document.location.hash = hash || ""), emit("hashSet");
            }
        };
      on("init", () => {
        swiper.params.hashNavigation.enabled &&
          (() => {
            if (
              !swiper.params.hashNavigation.enabled ||
              (swiper.params.history && swiper.params.history.enabled)
            )
              return;
            initialized = !0;
            const hash = document.location.hash.replace("#", "");
            if (hash) {
              const speed = 0;
              for (
                let i = 0, length = swiper.slides.length;
                i < length;
                i += 1
              ) {
                const slide = swiper.slides.eq(i);
                if (
                  (slide.attr("data-hash") || slide.attr("data-history")) ===
                    hash &&
                  !slide.hasClass(swiper.params.slideDuplicateClass)
                ) {
                  const index = slide.index();
                  swiper.slideTo(
                    index,
                    speed,
                    swiper.params.runCallbacksOnInit,
                    !0
                  );
                }
              }
            }
            swiper.params.hashNavigation.watchState &&
              $(window).on("hashchange", onHashChange);
          })();
      }),
        on("destroy", () => {
          swiper.params.hashNavigation.enabled &&
            swiper.params.hashNavigation.watchState &&
            $(window).off("hashchange", onHashChange);
        }),
        on("transitionEnd _freeModeNoMomentumRelease", () => {
          initialized && setHash();
        }),
        on("slideChange", () => {
          initialized && swiper.params.cssMode && setHash();
        });
    },
    function Autoplay(_ref) {
      let timeout,
        {
          swiper: swiper,
          extendParams: extendParams,
          on: on,
          emit: emit,
        } = _ref;
      function run() {
        const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
        let delay = swiper.params.autoplay.delay;
        $activeSlideEl.attr("data-swiper-autoplay") &&
          (delay =
            $activeSlideEl.attr("data-swiper-autoplay") ||
            swiper.params.autoplay.delay),
          clearTimeout(timeout),
          (timeout = nextTick(() => {
            let autoplayResult;
            swiper.params.autoplay.reverseDirection
              ? swiper.params.loop
                ? (swiper.loopFix(),
                  (autoplayResult = swiper.slidePrev(
                    swiper.params.speed,
                    !0,
                    !0
                  )),
                  emit("autoplay"))
                : swiper.isBeginning
                ? swiper.params.autoplay.stopOnLastSlide
                  ? stop()
                  : ((autoplayResult = swiper.slideTo(
                      swiper.slides.length - 1,
                      swiper.params.speed,
                      !0,
                      !0
                    )),
                    emit("autoplay"))
                : ((autoplayResult = swiper.slidePrev(
                    swiper.params.speed,
                    !0,
                    !0
                  )),
                  emit("autoplay"))
              : swiper.params.loop
              ? (swiper.loopFix(),
                (autoplayResult = swiper.slideNext(
                  swiper.params.speed,
                  !0,
                  !0
                )),
                emit("autoplay"))
              : swiper.isEnd
              ? swiper.params.autoplay.stopOnLastSlide
                ? stop()
                : ((autoplayResult = swiper.slideTo(
                    0,
                    swiper.params.speed,
                    !0,
                    !0
                  )),
                  emit("autoplay"))
              : ((autoplayResult = swiper.slideNext(
                  swiper.params.speed,
                  !0,
                  !0
                )),
                emit("autoplay")),
              ((swiper.params.cssMode && swiper.autoplay.running) ||
                !1 === autoplayResult) &&
                run();
          }, delay));
      }
      function start() {
        return (
          void 0 === timeout &&
          !swiper.autoplay.running &&
          ((swiper.autoplay.running = !0), emit("autoplayStart"), run(), !0)
        );
      }
      function stop() {
        return (
          !!swiper.autoplay.running &&
          void 0 !== timeout &&
          (timeout && (clearTimeout(timeout), (timeout = void 0)),
          (swiper.autoplay.running = !1),
          emit("autoplayStop"),
          !0)
        );
      }
      function pause(speed) {
        swiper.autoplay.running &&
          (swiper.autoplay.paused ||
            (timeout && clearTimeout(timeout),
            (swiper.autoplay.paused = !0),
            0 !== speed && swiper.params.autoplay.waitForTransition
              ? ["transitionend", "webkitTransitionEnd"].forEach((event) => {
                  swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
                })
              : ((swiper.autoplay.paused = !1), run())));
      }
      function onVisibilityChange() {
        const document = getDocument();
        "hidden" === document.visibilityState &&
          swiper.autoplay.running &&
          pause(),
          "visible" === document.visibilityState &&
            swiper.autoplay.paused &&
            (run(), (swiper.autoplay.paused = !1));
      }
      function onTransitionEnd(e) {
        swiper &&
          !swiper.destroyed &&
          swiper.$wrapperEl &&
          e.target === swiper.$wrapperEl[0] &&
          (["transitionend", "webkitTransitionEnd"].forEach((event) => {
            swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
          }),
          (swiper.autoplay.paused = !1),
          swiper.autoplay.running ? run() : stop());
      }
      function onMouseEnter() {
        swiper.params.autoplay.disableOnInteraction
          ? stop()
          : (emit("autoplayPause"), pause()),
          ["transitionend", "webkitTransitionEnd"].forEach((event) => {
            swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
          });
      }
      function onMouseLeave() {
        swiper.params.autoplay.disableOnInteraction ||
          ((swiper.autoplay.paused = !1), emit("autoplayResume"), run());
      }
      (swiper.autoplay = { running: !1, paused: !1 }),
        extendParams({
          autoplay: {
            enabled: !1,
            delay: 3e3,
            waitForTransition: !0,
            disableOnInteraction: !0,
            stopOnLastSlide: !1,
            reverseDirection: !1,
            pauseOnMouseEnter: !1,
          },
        }),
        on("init", () => {
          if (swiper.params.autoplay.enabled) {
            start();
            getDocument().addEventListener(
              "visibilitychange",
              onVisibilityChange
            ),
              (function attachMouseEvents() {
                swiper.params.autoplay.pauseOnMouseEnter &&
                  (swiper.$el.on("mouseenter", onMouseEnter),
                  swiper.$el.on("mouseleave", onMouseLeave));
              })();
          }
        }),
        on("beforeTransitionStart", (_s, speed, internal) => {
          swiper.autoplay.running &&
            (internal || !swiper.params.autoplay.disableOnInteraction
              ? swiper.autoplay.pause(speed)
              : stop());
        }),
        on("sliderFirstMove", () => {
          swiper.autoplay.running &&
            (swiper.params.autoplay.disableOnInteraction ? stop() : pause());
        }),
        on("touchEnd", () => {
          swiper.params.cssMode &&
            swiper.autoplay.paused &&
            !swiper.params.autoplay.disableOnInteraction &&
            run();
        }),
        on("destroy", () => {
          !(function detachMouseEvents() {
            swiper.$el.off("mouseenter", onMouseEnter),
              swiper.$el.off("mouseleave", onMouseLeave);
          })(),
            swiper.autoplay.running && stop();
          getDocument().removeEventListener(
            "visibilitychange",
            onVisibilityChange
          );
        }),
        Object.assign(swiper.autoplay, {
          pause: pause,
          run: run,
          start: start,
          stop: stop,
        });
    },
    function Thumb(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        thumbs: {
          swiper: null,
          multipleActiveThumbs: !0,
          autoScrollOffset: 0,
          slideThumbActiveClass: "swiper-slide-thumb-active",
          thumbsContainerClass: "swiper-thumbs",
        },
      });
      let initialized = !1,
        swiperCreated = !1;
      function onThumbClick() {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        const clickedIndex = thumbsSwiper.clickedIndex,
          clickedSlide = thumbsSwiper.clickedSlide;
        if (
          clickedSlide &&
          $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)
        )
          return;
        if (null == clickedIndex) return;
        let slideToIndex;
        if (
          ((slideToIndex = thumbsSwiper.params.loop
            ? parseInt(
                $(thumbsSwiper.clickedSlide).attr("data-swiper-slide-index"),
                10
              )
            : clickedIndex),
          swiper.params.loop)
        ) {
          let currentIndex = swiper.activeIndex;
          swiper.slides
            .eq(currentIndex)
            .hasClass(swiper.params.slideDuplicateClass) &&
            (swiper.loopFix(),
            (swiper._clientLeft = swiper.$wrapperEl[0].clientLeft),
            (currentIndex = swiper.activeIndex));
          const prevIndex = swiper.slides
              .eq(currentIndex)
              .prevAll(`[data-swiper-slide-index="${slideToIndex}"]`)
              .eq(0)
              .index(),
            nextIndex = swiper.slides
              .eq(currentIndex)
              .nextAll(`[data-swiper-slide-index="${slideToIndex}"]`)
              .eq(0)
              .index();
          slideToIndex =
            void 0 === prevIndex
              ? nextIndex
              : void 0 === nextIndex
              ? prevIndex
              : nextIndex - currentIndex < currentIndex - prevIndex
              ? nextIndex
              : prevIndex;
        }
        swiper.slideTo(slideToIndex);
      }
      function init() {
        const { thumbs: thumbsParams } = swiper.params;
        if (initialized) return !1;
        initialized = !0;
        const SwiperClass = swiper.constructor;
        if (thumbsParams.swiper instanceof SwiperClass)
          (swiper.thumbs.swiper = thumbsParams.swiper),
            Object.assign(swiper.thumbs.swiper.originalParams, {
              watchSlidesProgress: !0,
              slideToClickedSlide: !1,
            }),
            Object.assign(swiper.thumbs.swiper.params, {
              watchSlidesProgress: !0,
              slideToClickedSlide: !1,
            });
        else if (isObject(thumbsParams.swiper)) {
          const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
          Object.assign(thumbsSwiperParams, {
            watchSlidesProgress: !0,
            slideToClickedSlide: !1,
          }),
            (swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams)),
            (swiperCreated = !0);
        }
        return (
          swiper.thumbs.swiper.$el.addClass(
            swiper.params.thumbs.thumbsContainerClass
          ),
          swiper.thumbs.swiper.on("tap", onThumbClick),
          !0
        );
      }
      function update(initial) {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        const slidesPerView =
            "auto" === thumbsSwiper.params.slidesPerView
              ? thumbsSwiper.slidesPerViewDynamic()
              : thumbsSwiper.params.slidesPerView,
          autoScrollOffset = swiper.params.thumbs.autoScrollOffset,
          useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
        if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
          let newThumbsIndex,
            direction,
            currentThumbsIndex = thumbsSwiper.activeIndex;
          if (thumbsSwiper.params.loop) {
            thumbsSwiper.slides
              .eq(currentThumbsIndex)
              .hasClass(thumbsSwiper.params.slideDuplicateClass) &&
              (thumbsSwiper.loopFix(),
              (thumbsSwiper._clientLeft =
                thumbsSwiper.$wrapperEl[0].clientLeft),
              (currentThumbsIndex = thumbsSwiper.activeIndex));
            const prevThumbsIndex = thumbsSwiper.slides
                .eq(currentThumbsIndex)
                .prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`)
                .eq(0)
                .index(),
              nextThumbsIndex = thumbsSwiper.slides
                .eq(currentThumbsIndex)
                .nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`)
                .eq(0)
                .index();
            (newThumbsIndex =
              void 0 === prevThumbsIndex
                ? nextThumbsIndex
                : void 0 === nextThumbsIndex
                ? prevThumbsIndex
                : nextThumbsIndex - currentThumbsIndex ==
                  currentThumbsIndex - prevThumbsIndex
                ? thumbsSwiper.params.slidesPerGroup > 1
                  ? nextThumbsIndex
                  : currentThumbsIndex
                : nextThumbsIndex - currentThumbsIndex <
                  currentThumbsIndex - prevThumbsIndex
                ? nextThumbsIndex
                : prevThumbsIndex),
              (direction =
                swiper.activeIndex > swiper.previousIndex ? "next" : "prev");
          } else
            (newThumbsIndex = swiper.realIndex),
              (direction =
                newThumbsIndex > swiper.previousIndex ? "next" : "prev");
          useOffset &&
            (newThumbsIndex +=
              "next" === direction ? autoScrollOffset : -1 * autoScrollOffset),
            thumbsSwiper.visibleSlidesIndexes &&
              thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0 &&
              (thumbsSwiper.params.centeredSlides
                ? (newThumbsIndex =
                    newThumbsIndex > currentThumbsIndex
                      ? newThumbsIndex - Math.floor(slidesPerView / 2) + 1
                      : newThumbsIndex + Math.floor(slidesPerView / 2) - 1)
                : newThumbsIndex > currentThumbsIndex &&
                  thumbsSwiper.params.slidesPerGroup,
              thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0));
        }
        let thumbsToActivate = 1;
        const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
        if (
          (swiper.params.slidesPerView > 1 &&
            !swiper.params.centeredSlides &&
            (thumbsToActivate = swiper.params.slidesPerView),
          swiper.params.thumbs.multipleActiveThumbs || (thumbsToActivate = 1),
          (thumbsToActivate = Math.floor(thumbsToActivate)),
          thumbsSwiper.slides.removeClass(thumbActiveClass),
          thumbsSwiper.params.loop ||
            (thumbsSwiper.params.virtual &&
              thumbsSwiper.params.virtual.enabled))
        )
          for (let i = 0; i < thumbsToActivate; i += 1)
            thumbsSwiper.$wrapperEl
              .children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`)
              .addClass(thumbActiveClass);
        else
          for (let i = 0; i < thumbsToActivate; i += 1)
            thumbsSwiper.slides
              .eq(swiper.realIndex + i)
              .addClass(thumbActiveClass);
      }
      (swiper.thumbs = { swiper: null }),
        on("beforeInit", () => {
          const { thumbs: thumbs } = swiper.params;
          thumbs && thumbs.swiper && (init(), update(!0));
        }),
        on("slideChange update resize observerUpdate", () => {
          update();
        }),
        on("setTransition", (_s, duration) => {
          const thumbsSwiper = swiper.thumbs.swiper;
          thumbsSwiper &&
            !thumbsSwiper.destroyed &&
            thumbsSwiper.setTransition(duration);
        }),
        on("beforeDestroy", () => {
          const thumbsSwiper = swiper.thumbs.swiper;
          thumbsSwiper &&
            !thumbsSwiper.destroyed &&
            swiperCreated &&
            thumbsSwiper.destroy();
        }),
        Object.assign(swiper.thumbs, { init: init, update: update });
    },
    function freeMode(_ref) {
      let {
        swiper: swiper,
        extendParams: extendParams,
        emit: emit,
        once: once,
      } = _ref;
      extendParams({
        freeMode: {
          enabled: !1,
          momentum: !0,
          momentumRatio: 1,
          momentumBounce: !0,
          momentumBounceRatio: 1,
          momentumVelocityRatio: 1,
          sticky: !1,
          minimumVelocity: 0.02,
        },
      }),
        Object.assign(swiper, {
          freeMode: {
            onTouchStart: function onTouchStart() {
              const translate = swiper.getTranslate();
              swiper.setTranslate(translate),
                swiper.setTransition(0),
                (swiper.touchEventsData.velocities.length = 0),
                swiper.freeMode.onTouchEnd({
                  currentPos: swiper.rtl ? swiper.translate : -swiper.translate,
                });
            },
            onTouchMove: function onTouchMove() {
              const { touchEventsData: data, touches: touches } = swiper;
              0 === data.velocities.length &&
                data.velocities.push({
                  position:
                    touches[swiper.isHorizontal() ? "startX" : "startY"],
                  time: data.touchStartTime,
                }),
                data.velocities.push({
                  position:
                    touches[swiper.isHorizontal() ? "currentX" : "currentY"],
                  time: now(),
                });
            },
            onTouchEnd: function onTouchEnd(_ref2) {
              let { currentPos: currentPos } = _ref2;
              const {
                  params: params,
                  $wrapperEl: $wrapperEl,
                  rtlTranslate: rtl,
                  snapGrid: snapGrid,
                  touchEventsData: data,
                } = swiper,
                timeDiff = now() - data.touchStartTime;
              if (currentPos < -swiper.minTranslate())
                swiper.slideTo(swiper.activeIndex);
              else if (currentPos > -swiper.maxTranslate())
                swiper.slides.length < snapGrid.length
                  ? swiper.slideTo(snapGrid.length - 1)
                  : swiper.slideTo(swiper.slides.length - 1);
              else {
                if (params.freeMode.momentum) {
                  if (data.velocities.length > 1) {
                    const lastMoveEvent = data.velocities.pop(),
                      velocityEvent = data.velocities.pop(),
                      distance =
                        lastMoveEvent.position - velocityEvent.position,
                      time = lastMoveEvent.time - velocityEvent.time;
                    (swiper.velocity = distance / time),
                      (swiper.velocity /= 2),
                      Math.abs(swiper.velocity) <
                        params.freeMode.minimumVelocity &&
                        (swiper.velocity = 0),
                      (time > 150 || now() - lastMoveEvent.time > 300) &&
                        (swiper.velocity = 0);
                  } else swiper.velocity = 0;
                  (swiper.velocity *= params.freeMode.momentumVelocityRatio),
                    (data.velocities.length = 0);
                  let momentumDuration = 1e3 * params.freeMode.momentumRatio;
                  const momentumDistance = swiper.velocity * momentumDuration;
                  let newPosition = swiper.translate + momentumDistance;
                  rtl && (newPosition = -newPosition);
                  let afterBouncePosition,
                    doBounce = !1;
                  const bounceAmount =
                    20 *
                    Math.abs(swiper.velocity) *
                    params.freeMode.momentumBounceRatio;
                  let needsLoopFix;
                  if (newPosition < swiper.maxTranslate())
                    params.freeMode.momentumBounce
                      ? (newPosition + swiper.maxTranslate() < -bounceAmount &&
                          (newPosition = swiper.maxTranslate() - bounceAmount),
                        (afterBouncePosition = swiper.maxTranslate()),
                        (doBounce = !0),
                        (data.allowMomentumBounce = !0))
                      : (newPosition = swiper.maxTranslate()),
                      params.loop &&
                        params.centeredSlides &&
                        (needsLoopFix = !0);
                  else if (newPosition > swiper.minTranslate())
                    params.freeMode.momentumBounce
                      ? (newPosition - swiper.minTranslate() > bounceAmount &&
                          (newPosition = swiper.minTranslate() + bounceAmount),
                        (afterBouncePosition = swiper.minTranslate()),
                        (doBounce = !0),
                        (data.allowMomentumBounce = !0))
                      : (newPosition = swiper.minTranslate()),
                      params.loop &&
                        params.centeredSlides &&
                        (needsLoopFix = !0);
                  else if (params.freeMode.sticky) {
                    let nextSlide;
                    for (let j = 0; j < snapGrid.length; j += 1)
                      if (snapGrid[j] > -newPosition) {
                        nextSlide = j;
                        break;
                      }
                    (newPosition =
                      Math.abs(snapGrid[nextSlide] - newPosition) <
                        Math.abs(snapGrid[nextSlide - 1] - newPosition) ||
                      "next" === swiper.swipeDirection
                        ? snapGrid[nextSlide]
                        : snapGrid[nextSlide - 1]),
                      (newPosition = -newPosition);
                  }
                  if (
                    (needsLoopFix &&
                      once("transitionEnd", () => {
                        swiper.loopFix();
                      }),
                    0 !== swiper.velocity)
                  ) {
                    if (
                      ((momentumDuration = rtl
                        ? Math.abs(
                            (-newPosition - swiper.translate) / swiper.velocity
                          )
                        : Math.abs(
                            (newPosition - swiper.translate) / swiper.velocity
                          )),
                      params.freeMode.sticky)
                    ) {
                      const moveDistance = Math.abs(
                          (rtl ? -newPosition : newPosition) - swiper.translate
                        ),
                        currentSlideSize =
                          swiper.slidesSizesGrid[swiper.activeIndex];
                      momentumDuration =
                        moveDistance < currentSlideSize
                          ? params.speed
                          : moveDistance < 2 * currentSlideSize
                          ? 1.5 * params.speed
                          : 2.5 * params.speed;
                    }
                  } else if (params.freeMode.sticky)
                    return void swiper.slideToClosest();
                  params.freeMode.momentumBounce && doBounce
                    ? (swiper.updateProgress(afterBouncePosition),
                      swiper.setTransition(momentumDuration),
                      swiper.setTranslate(newPosition),
                      swiper.transitionStart(!0, swiper.swipeDirection),
                      (swiper.animating = !0),
                      $wrapperEl.transitionEnd(() => {
                        swiper &&
                          !swiper.destroyed &&
                          data.allowMomentumBounce &&
                          (emit("momentumBounce"),
                          swiper.setTransition(params.speed),
                          setTimeout(() => {
                            swiper.setTranslate(afterBouncePosition),
                              $wrapperEl.transitionEnd(() => {
                                swiper &&
                                  !swiper.destroyed &&
                                  swiper.transitionEnd();
                              });
                          }, 0));
                      }))
                    : swiper.velocity
                    ? (emit("_freeModeNoMomentumRelease"),
                      swiper.updateProgress(newPosition),
                      swiper.setTransition(momentumDuration),
                      swiper.setTranslate(newPosition),
                      swiper.transitionStart(!0, swiper.swipeDirection),
                      swiper.animating ||
                        ((swiper.animating = !0),
                        $wrapperEl.transitionEnd(() => {
                          swiper && !swiper.destroyed && swiper.transitionEnd();
                        })))
                    : swiper.updateProgress(newPosition),
                    swiper.updateActiveIndex(),
                    swiper.updateSlidesClasses();
                } else {
                  if (params.freeMode.sticky)
                    return void swiper.slideToClosest();
                  params.freeMode && emit("_freeModeNoMomentumRelease");
                }
                (!params.freeMode.momentum ||
                  timeDiff >= params.longSwipesMs) &&
                  (swiper.updateProgress(),
                  swiper.updateActiveIndex(),
                  swiper.updateSlidesClasses());
              }
            },
          },
        });
    },
    function Grid(_ref) {
      let slidesNumberEvenToRows,
        slidesPerRow,
        numFullColumns,
        { swiper: swiper, extendParams: extendParams } = _ref;
      extendParams({ grid: { rows: 1, fill: "column" } }),
        (swiper.grid = {
          initSlides: (slidesLength) => {
            const { slidesPerView: slidesPerView } = swiper.params,
              { rows: rows, fill: fill } = swiper.params.grid;
            (slidesPerRow = slidesNumberEvenToRows / rows),
              (numFullColumns = Math.floor(slidesLength / rows)),
              (slidesNumberEvenToRows =
                Math.floor(slidesLength / rows) === slidesLength / rows
                  ? slidesLength
                  : Math.ceil(slidesLength / rows) * rows),
              "auto" !== slidesPerView &&
                "row" === fill &&
                (slidesNumberEvenToRows = Math.max(
                  slidesNumberEvenToRows,
                  slidesPerView * rows
                ));
          },
          updateSlide: (i, slide, slidesLength, getDirectionLabel) => {
            const {
                slidesPerGroup: slidesPerGroup,
                spaceBetween: spaceBetween,
              } = swiper.params,
              { rows: rows, fill: fill } = swiper.params.grid;
            let newSlideOrderIndex, column, row;
            if ("row" === fill && slidesPerGroup > 1) {
              const groupIndex = Math.floor(i / (slidesPerGroup * rows)),
                slideIndexInGroup = i - rows * slidesPerGroup * groupIndex,
                columnsInGroup =
                  0 === groupIndex
                    ? slidesPerGroup
                    : Math.min(
                        Math.ceil(
                          (slidesLength - groupIndex * rows * slidesPerGroup) /
                            rows
                        ),
                        slidesPerGroup
                      );
              (row = Math.floor(slideIndexInGroup / columnsInGroup)),
                (column =
                  slideIndexInGroup -
                  row * columnsInGroup +
                  groupIndex * slidesPerGroup),
                (newSlideOrderIndex =
                  column + (row * slidesNumberEvenToRows) / rows),
                slide.css({
                  "-webkit-order": newSlideOrderIndex,
                  order: newSlideOrderIndex,
                });
            } else
              "column" === fill
                ? ((column = Math.floor(i / rows)),
                  (row = i - column * rows),
                  (column > numFullColumns ||
                    (column === numFullColumns && row === rows - 1)) &&
                    ((row += 1), row >= rows && ((row = 0), (column += 1))))
                : ((row = Math.floor(i / slidesPerRow)),
                  (column = i - row * slidesPerRow));
            slide.css(
              getDirectionLabel("margin-top"),
              0 !== row ? spaceBetween && `${spaceBetween}px` : ""
            );
          },
          updateWrapperSize: (slideSize, snapGrid, getDirectionLabel) => {
            const {
                spaceBetween: spaceBetween,
                centeredSlides: centeredSlides,
                roundLengths: roundLengths,
              } = swiper.params,
              { rows: rows } = swiper.params.grid;
            if (
              ((swiper.virtualSize =
                (slideSize + spaceBetween) * slidesNumberEvenToRows),
              (swiper.virtualSize =
                Math.ceil(swiper.virtualSize / rows) - spaceBetween),
              swiper.$wrapperEl.css({
                [getDirectionLabel("width")]: `${
                  swiper.virtualSize + spaceBetween
                }px`,
              }),
              centeredSlides)
            ) {
              snapGrid.splice(0, snapGrid.length);
              const newSlidesGrid = [];
              for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                roundLengths && (slidesGridItem = Math.floor(slidesGridItem)),
                  snapGrid[i] < swiper.virtualSize + snapGrid[0] &&
                    newSlidesGrid.push(slidesGridItem);
              }
              snapGrid.push(...newSlidesGrid);
            }
          },
        });
    },
    function Manipulation(_ref) {
      let { swiper: swiper } = _ref;
      Object.assign(swiper, {
        appendSlide: appendSlide.bind(swiper),
        prependSlide: prependSlide.bind(swiper),
        addSlide: addSlide.bind(swiper),
        removeSlide: removeSlide.bind(swiper),
        removeAllSlides: removeAllSlides.bind(swiper),
      });
    },
    function EffectFade(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({ fadeEffect: { crossFade: !1, transformEl: null } }),
        effectInit({
          effect: "fade",
          swiper: swiper,
          on: on,
          setTranslate: () => {
            const { slides: slides } = swiper,
              params = swiper.params.fadeEffect;
            for (let i = 0; i < slides.length; i += 1) {
              const $slideEl = swiper.slides.eq(i);
              let tx = -$slideEl[0].swiperSlideOffset;
              swiper.params.virtualTranslate || (tx -= swiper.translate);
              let ty = 0;
              swiper.isHorizontal() || ((ty = tx), (tx = 0));
              const slideOpacity = swiper.params.fadeEffect.crossFade
                ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
                : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
              effectTarget(params, $slideEl)
                .css({ opacity: slideOpacity })
                .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
            }
          },
          setTransition: (duration) => {
            const { transformEl: transformEl } = swiper.params.fadeEffect;
            (transformEl
              ? swiper.slides.find(transformEl)
              : swiper.slides
            ).transition(duration),
              effectVirtualTransitionEnd({
                swiper: swiper,
                duration: duration,
                transformEl: transformEl,
                allSlides: !0,
              });
          },
          overwriteParams: () => ({
            slidesPerView: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: !0,
            spaceBetween: 0,
            virtualTranslate: !swiper.params.cssMode,
          }),
        });
    },
    function EffectCube(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        cubeEffect: {
          slideShadows: !0,
          shadow: !0,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
      });
      const createSlideShadows = ($slideEl, progress, isHorizontal) => {
        let shadowBefore = isHorizontal
            ? $slideEl.find(".swiper-slide-shadow-left")
            : $slideEl.find(".swiper-slide-shadow-top"),
          shadowAfter = isHorizontal
            ? $slideEl.find(".swiper-slide-shadow-right")
            : $slideEl.find(".swiper-slide-shadow-bottom");
        0 === shadowBefore.length &&
          ((shadowBefore = $(
            `<div class="swiper-slide-shadow-${
              isHorizontal ? "left" : "top"
            }"></div>`
          )),
          $slideEl.append(shadowBefore)),
          0 === shadowAfter.length &&
            ((shadowAfter = $(
              `<div class="swiper-slide-shadow-${
                isHorizontal ? "right" : "bottom"
              }"></div>`
            )),
            $slideEl.append(shadowAfter)),
          shadowBefore.length &&
            (shadowBefore[0].style.opacity = Math.max(-progress, 0)),
          shadowAfter.length &&
            (shadowAfter[0].style.opacity = Math.max(progress, 0));
      };
      effectInit({
        effect: "cube",
        swiper: swiper,
        on: on,
        setTranslate: () => {
          const {
              $el: $el,
              $wrapperEl: $wrapperEl,
              slides: slides,
              width: swiperWidth,
              height: swiperHeight,
              rtlTranslate: rtl,
              size: swiperSize,
              browser: browser,
            } = swiper,
            params = swiper.params.cubeEffect,
            isHorizontal = swiper.isHorizontal(),
            isVirtual = swiper.virtual && swiper.params.virtual.enabled;
          let $cubeShadowEl,
            wrapperRotate = 0;
          params.shadow &&
            (isHorizontal
              ? (($cubeShadowEl = $wrapperEl.find(".swiper-cube-shadow")),
                0 === $cubeShadowEl.length &&
                  (($cubeShadowEl = $(
                    '<div class="swiper-cube-shadow"></div>'
                  )),
                  $wrapperEl.append($cubeShadowEl)),
                $cubeShadowEl.css({ height: `${swiperWidth}px` }))
              : (($cubeShadowEl = $el.find(".swiper-cube-shadow")),
                0 === $cubeShadowEl.length &&
                  (($cubeShadowEl = $(
                    '<div class="swiper-cube-shadow"></div>'
                  )),
                  $el.append($cubeShadowEl))));
          for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            let slideIndex = i;
            isVirtual &&
              (slideIndex = parseInt(
                $slideEl.attr("data-swiper-slide-index"),
                10
              ));
            let slideAngle = 90 * slideIndex,
              round = Math.floor(slideAngle / 360);
            rtl &&
              ((slideAngle = -slideAngle),
              (round = Math.floor(-slideAngle / 360)));
            const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
            let tx = 0,
              ty = 0,
              tz = 0;
            slideIndex % 4 == 0
              ? ((tx = 4 * -round * swiperSize), (tz = 0))
              : (slideIndex - 1) % 4 == 0
              ? ((tx = 0), (tz = 4 * -round * swiperSize))
              : (slideIndex - 2) % 4 == 0
              ? ((tx = swiperSize + 4 * round * swiperSize), (tz = swiperSize))
              : (slideIndex - 3) % 4 == 0 &&
                ((tx = -swiperSize),
                (tz = 3 * swiperSize + 4 * swiperSize * round)),
              rtl && (tx = -tx),
              isHorizontal || ((ty = tx), (tx = 0));
            const transform = `rotateX(${
              isHorizontal ? 0 : -slideAngle
            }deg) rotateY(${
              isHorizontal ? slideAngle : 0
            }deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
            progress <= 1 &&
              progress > -1 &&
              ((wrapperRotate = 90 * slideIndex + 90 * progress),
              rtl && (wrapperRotate = 90 * -slideIndex - 90 * progress)),
              $slideEl.transform(transform),
              params.slideShadows &&
                createSlideShadows($slideEl, progress, isHorizontal);
          }
          if (
            ($wrapperEl.css({
              "-webkit-transform-origin": `50% 50% -${swiperSize / 2}px`,
              "transform-origin": `50% 50% -${swiperSize / 2}px`,
            }),
            params.shadow)
          )
            if (isHorizontal)
              $cubeShadowEl.transform(
                `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${
                  -swiperWidth / 2
                }px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`
              );
            else {
              const shadowAngle =
                  Math.abs(wrapperRotate) -
                  90 * Math.floor(Math.abs(wrapperRotate) / 90),
                multiplier =
                  1.5 -
                  (Math.sin((2 * shadowAngle * Math.PI) / 360) / 2 +
                    Math.cos((2 * shadowAngle * Math.PI) / 360) / 2),
                scale1 = params.shadowScale,
                scale2 = params.shadowScale / multiplier,
                offset = params.shadowOffset;
              $cubeShadowEl.transform(
                `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${
                  swiperHeight / 2 + offset
                }px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`
              );
            }
          const zFactor =
            browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
          $wrapperEl.transform(
            `translate3d(0px,0,${zFactor}px) rotateX(${
              swiper.isHorizontal() ? 0 : wrapperRotate
            }deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`
          ),
            $wrapperEl[0].style.setProperty(
              "--swiper-cube-translate-z",
              `${zFactor}px`
            );
        },
        setTransition: (duration) => {
          const { $el: $el, slides: slides } = swiper;
          slides
            .transition(duration)
            .find(
              ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
            )
            .transition(duration),
            swiper.params.cubeEffect.shadow &&
              !swiper.isHorizontal() &&
              $el.find(".swiper-cube-shadow").transition(duration);
        },
        recreateShadows: () => {
          const isHorizontal = swiper.isHorizontal();
          swiper.slides.each((slideEl) => {
            const progress = Math.max(Math.min(slideEl.progress, 1), -1);
            createSlideShadows($(slideEl), progress, isHorizontal);
          });
        },
        getEffectParams: () => swiper.params.cubeEffect,
        perspective: () => !0,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: !0,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: !1,
          virtualTranslate: !0,
        }),
      });
    },
    function EffectFlip(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        flipEffect: { slideShadows: !0, limitRotation: !0, transformEl: null },
      });
      const createSlideShadows = ($slideEl, progress, params) => {
        let shadowBefore = swiper.isHorizontal()
            ? $slideEl.find(".swiper-slide-shadow-left")
            : $slideEl.find(".swiper-slide-shadow-top"),
          shadowAfter = swiper.isHorizontal()
            ? $slideEl.find(".swiper-slide-shadow-right")
            : $slideEl.find(".swiper-slide-shadow-bottom");
        0 === shadowBefore.length &&
          (shadowBefore = createShadow(
            params,
            $slideEl,
            swiper.isHorizontal() ? "left" : "top"
          )),
          0 === shadowAfter.length &&
            (shadowAfter = createShadow(
              params,
              $slideEl,
              swiper.isHorizontal() ? "right" : "bottom"
            )),
          shadowBefore.length &&
            (shadowBefore[0].style.opacity = Math.max(-progress, 0)),
          shadowAfter.length &&
            (shadowAfter[0].style.opacity = Math.max(progress, 0));
      };
      effectInit({
        effect: "flip",
        swiper: swiper,
        on: on,
        setTranslate: () => {
          const { slides: slides, rtlTranslate: rtl } = swiper,
            params = swiper.params.flipEffect;
          for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            let progress = $slideEl[0].progress;
            swiper.params.flipEffect.limitRotation &&
              (progress = Math.max(Math.min($slideEl[0].progress, 1), -1));
            const offset = $slideEl[0].swiperSlideOffset;
            let rotateY = -180 * progress,
              rotateX = 0,
              tx = swiper.params.cssMode ? -offset - swiper.translate : -offset,
              ty = 0;
            swiper.isHorizontal()
              ? rtl && (rotateY = -rotateY)
              : ((ty = tx), (tx = 0), (rotateX = -rotateY), (rotateY = 0)),
              ($slideEl[0].style.zIndex =
                -Math.abs(Math.round(progress)) + slides.length),
              params.slideShadows &&
                createSlideShadows($slideEl, progress, params);
            const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            effectTarget(params, $slideEl).transform(transform);
          }
        },
        setTransition: (duration) => {
          const { transformEl: transformEl } = swiper.params.flipEffect;
          (transformEl ? swiper.slides.find(transformEl) : swiper.slides)
            .transition(duration)
            .find(
              ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
            )
            .transition(duration),
            effectVirtualTransitionEnd({
              swiper: swiper,
              duration: duration,
              transformEl: transformEl,
            });
        },
        recreateShadows: () => {
          const params = swiper.params.flipEffect;
          swiper.slides.each((slideEl) => {
            const $slideEl = $(slideEl);
            let progress = $slideEl[0].progress;
            swiper.params.flipEffect.limitRotation &&
              (progress = Math.max(Math.min(slideEl.progress, 1), -1)),
              createSlideShadows($slideEl, progress, params);
          });
        },
        getEffectParams: () => swiper.params.flipEffect,
        perspective: () => !0,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: !0,
          spaceBetween: 0,
          virtualTranslate: !swiper.params.cssMode,
        }),
      });
    },
    function EffectCoverflow(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          scale: 1,
          modifier: 1,
          slideShadows: !0,
          transformEl: null,
        },
      }),
        effectInit({
          effect: "coverflow",
          swiper: swiper,
          on: on,
          setTranslate: () => {
            const {
                width: swiperWidth,
                height: swiperHeight,
                slides: slides,
                slidesSizesGrid: slidesSizesGrid,
              } = swiper,
              params = swiper.params.coverflowEffect,
              isHorizontal = swiper.isHorizontal(),
              transform = swiper.translate,
              center = isHorizontal
                ? swiperWidth / 2 - transform
                : swiperHeight / 2 - transform,
              rotate = isHorizontal ? params.rotate : -params.rotate,
              translate = params.depth;
            for (let i = 0, length = slides.length; i < length; i += 1) {
              const $slideEl = slides.eq(i),
                slideSize = slidesSizesGrid[i],
                centerOffset =
                  (center - $slideEl[0].swiperSlideOffset - slideSize / 2) /
                  slideSize,
                offsetMultiplier =
                  "function" == typeof params.modifier
                    ? params.modifier(centerOffset)
                    : centerOffset * params.modifier;
              let rotateY = isHorizontal ? rotate * offsetMultiplier : 0,
                rotateX = isHorizontal ? 0 : rotate * offsetMultiplier,
                translateZ = -translate * Math.abs(offsetMultiplier),
                stretch = params.stretch;
              "string" == typeof stretch &&
                -1 !== stretch.indexOf("%") &&
                (stretch = (parseFloat(params.stretch) / 100) * slideSize);
              let translateY = isHorizontal ? 0 : stretch * offsetMultiplier,
                translateX = isHorizontal ? stretch * offsetMultiplier : 0,
                scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);
              Math.abs(translateX) < 0.001 && (translateX = 0),
                Math.abs(translateY) < 0.001 && (translateY = 0),
                Math.abs(translateZ) < 0.001 && (translateZ = 0),
                Math.abs(rotateY) < 0.001 && (rotateY = 0),
                Math.abs(rotateX) < 0.001 && (rotateX = 0),
                Math.abs(scale) < 0.001 && (scale = 0);
              const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
              if (
                (effectTarget(params, $slideEl).transform(slideTransform),
                ($slideEl[0].style.zIndex =
                  1 - Math.abs(Math.round(offsetMultiplier))),
                params.slideShadows)
              ) {
                let $shadowBeforeEl = isHorizontal
                    ? $slideEl.find(".swiper-slide-shadow-left")
                    : $slideEl.find(".swiper-slide-shadow-top"),
                  $shadowAfterEl = isHorizontal
                    ? $slideEl.find(".swiper-slide-shadow-right")
                    : $slideEl.find(".swiper-slide-shadow-bottom");
                0 === $shadowBeforeEl.length &&
                  ($shadowBeforeEl = createShadow(
                    params,
                    $slideEl,
                    isHorizontal ? "left" : "top"
                  )),
                  0 === $shadowAfterEl.length &&
                    ($shadowAfterEl = createShadow(
                      params,
                      $slideEl,
                      isHorizontal ? "right" : "bottom"
                    )),
                  $shadowBeforeEl.length &&
                    ($shadowBeforeEl[0].style.opacity =
                      offsetMultiplier > 0 ? offsetMultiplier : 0),
                  $shadowAfterEl.length &&
                    ($shadowAfterEl[0].style.opacity =
                      -offsetMultiplier > 0 ? -offsetMultiplier : 0);
              }
            }
          },
          setTransition: (duration) => {
            const { transformEl: transformEl } = swiper.params.coverflowEffect;
            (transformEl ? swiper.slides.find(transformEl) : swiper.slides)
              .transition(duration)
              .find(
                ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
              )
              .transition(duration);
          },
          perspective: () => !0,
          overwriteParams: () => ({ watchSlidesProgress: !0 }),
        });
    },
    function EffectCreative(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        creativeEffect: {
          transformEl: null,
          limitProgress: 1,
          shadowPerProgress: !1,
          progressMultiplier: 1,
          perspective: !0,
          prev: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1,
          },
          next: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1,
          },
        },
      });
      const getTranslateValue = (value) =>
        "string" == typeof value ? value : `${value}px`;
      effectInit({
        effect: "creative",
        swiper: swiper,
        on: on,
        setTranslate: () => {
          const {
              slides: slides,
              $wrapperEl: $wrapperEl,
              slidesSizesGrid: slidesSizesGrid,
            } = swiper,
            params = swiper.params.creativeEffect,
            { progressMultiplier: multiplier } = params,
            isCenteredSlides = swiper.params.centeredSlides;
          if (isCenteredSlides) {
            const margin =
              slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
            $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
          }
          for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i),
              slideProgress = $slideEl[0].progress,
              progress = Math.min(
                Math.max($slideEl[0].progress, -params.limitProgress),
                params.limitProgress
              );
            let originalProgress = progress;
            isCenteredSlides ||
              (originalProgress = Math.min(
                Math.max($slideEl[0].originalProgress, -params.limitProgress),
                params.limitProgress
              ));
            const offset = $slideEl[0].swiperSlideOffset,
              t = [
                swiper.params.cssMode ? -offset - swiper.translate : -offset,
                0,
                0,
              ],
              r = [0, 0, 0];
            let custom = !1;
            swiper.isHorizontal() || ((t[1] = t[0]), (t[0] = 0));
            let data = {
              translate: [0, 0, 0],
              rotate: [0, 0, 0],
              scale: 1,
              opacity: 1,
            };
            progress < 0
              ? ((data = params.next), (custom = !0))
              : progress > 0 && ((data = params.prev), (custom = !0)),
              t.forEach((value, index) => {
                t[index] = `calc(${value}px + (${getTranslateValue(
                  data.translate[index]
                )} * ${Math.abs(progress * multiplier)}))`;
              }),
              r.forEach((value, index) => {
                r[index] = data.rotate[index] * Math.abs(progress * multiplier);
              }),
              ($slideEl[0].style.zIndex =
                -Math.abs(Math.round(slideProgress)) + slides.length);
            const translateString = t.join(", "),
              rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`,
              scaleString =
                originalProgress < 0
                  ? `scale(${
                      1 + (1 - data.scale) * originalProgress * multiplier
                    })`
                  : `scale(${
                      1 - (1 - data.scale) * originalProgress * multiplier
                    })`,
              opacityString =
                originalProgress < 0
                  ? 1 + (1 - data.opacity) * originalProgress * multiplier
                  : 1 - (1 - data.opacity) * originalProgress * multiplier,
              transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;
            if ((custom && data.shadow) || !custom) {
              let $shadowEl = $slideEl.children(".swiper-slide-shadow");
              if (
                (0 === $shadowEl.length &&
                  data.shadow &&
                  ($shadowEl = createShadow(params, $slideEl)),
                $shadowEl.length)
              ) {
                const shadowOpacity = params.shadowPerProgress
                  ? progress * (1 / params.limitProgress)
                  : progress;
                $shadowEl[0].style.opacity = Math.min(
                  Math.max(Math.abs(shadowOpacity), 0),
                  1
                );
              }
            }
            const $targetEl = effectTarget(params, $slideEl);
            $targetEl.transform(transform).css({ opacity: opacityString }),
              data.origin && $targetEl.css("transform-origin", data.origin);
          }
        },
        setTransition: (duration) => {
          const { transformEl: transformEl } = swiper.params.creativeEffect;
          (transformEl ? swiper.slides.find(transformEl) : swiper.slides)
            .transition(duration)
            .find(".swiper-slide-shadow")
            .transition(duration),
            effectVirtualTransitionEnd({
              swiper: swiper,
              duration: duration,
              transformEl: transformEl,
              allSlides: !0,
            });
        },
        perspective: () => swiper.params.creativeEffect.perspective,
        overwriteParams: () => ({
          watchSlidesProgress: !0,
          virtualTranslate: !swiper.params.cssMode,
        }),
      });
    },
    function EffectCards(_ref) {
      let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
      extendParams({
        cardsEffect: { slideShadows: !0, transformEl: null, rotate: !0 },
      }),
        effectInit({
          effect: "cards",
          swiper: swiper,
          on: on,
          setTranslate: () => {
            const { slides: slides, activeIndex: activeIndex } = swiper,
              params = swiper.params.cardsEffect,
              { startTranslate: startTranslate, isTouched: isTouched } =
                swiper.touchEventsData,
              currentTranslate = swiper.translate;
            for (let i = 0; i < slides.length; i += 1) {
              const $slideEl = slides.eq(i),
                slideProgress = $slideEl[0].progress,
                progress = Math.min(Math.max(slideProgress, -4), 4);
              let offset = $slideEl[0].swiperSlideOffset;
              swiper.params.centeredSlides &&
                !swiper.params.cssMode &&
                swiper.$wrapperEl.transform(
                  `translateX(${swiper.minTranslate()}px)`
                ),
                swiper.params.centeredSlides &&
                  swiper.params.cssMode &&
                  (offset -= slides[0].swiperSlideOffset);
              let tX = swiper.params.cssMode
                  ? -offset - swiper.translate
                  : -offset,
                tY = 0;
              const tZ = -100 * Math.abs(progress);
              let scale = 1,
                rotate = -2 * progress,
                tXAdd = 8 - 0.75 * Math.abs(progress);
              const slideIndex =
                  swiper.virtual && swiper.params.virtual.enabled
                    ? swiper.virtual.from + i
                    : i,
                isSwipeToNext =
                  (slideIndex === activeIndex ||
                    slideIndex === activeIndex - 1) &&
                  progress > 0 &&
                  progress < 1 &&
                  (isTouched || swiper.params.cssMode) &&
                  currentTranslate < startTranslate,
                isSwipeToPrev =
                  (slideIndex === activeIndex ||
                    slideIndex === activeIndex + 1) &&
                  progress < 0 &&
                  progress > -1 &&
                  (isTouched || swiper.params.cssMode) &&
                  currentTranslate > startTranslate;
              if (isSwipeToNext || isSwipeToPrev) {
                const subProgress =
                  (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
                (rotate += -28 * progress * subProgress),
                  (scale += -0.5 * subProgress),
                  (tXAdd += 96 * subProgress),
                  (tY = -25 * subProgress * Math.abs(progress) + "%");
              }
              if (
                ((tX =
                  progress < 0
                    ? `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`
                    : progress > 0
                    ? `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`
                    : `${tX}px`),
                !swiper.isHorizontal())
              ) {
                const prevY = tY;
                (tY = tX), (tX = prevY);
              }
              const scaleString =
                  progress < 0
                    ? "" + (1 + (1 - scale) * progress)
                    : "" + (1 - (1 - scale) * progress),
                transform = `\n        translate3d(${tX}, ${tY}, ${tZ}px)\n        rotateZ(${
                  params.rotate ? rotate : 0
                }deg)\n        scale(${scaleString})\n      `;
              if (params.slideShadows) {
                let $shadowEl = $slideEl.find(".swiper-slide-shadow");
                0 === $shadowEl.length &&
                  ($shadowEl = createShadow(params, $slideEl)),
                  $shadowEl.length &&
                    ($shadowEl[0].style.opacity = Math.min(
                      Math.max((Math.abs(progress) - 0.5) / 0.5, 0),
                      1
                    ));
              }
              $slideEl[0].style.zIndex =
                -Math.abs(Math.round(slideProgress)) + slides.length;
              effectTarget(params, $slideEl).transform(transform);
            }
          },
          setTransition: (duration) => {
            const { transformEl: transformEl } = swiper.params.cardsEffect;
            (transformEl ? swiper.slides.find(transformEl) : swiper.slides)
              .transition(duration)
              .find(".swiper-slide-shadow")
              .transition(duration),
              effectVirtualTransitionEnd({
                swiper: swiper,
                duration: duration,
                transformEl: transformEl,
              });
          },
          perspective: () => !0,
          overwriteParams: () => ({
            watchSlidesProgress: !0,
            virtualTranslate: !swiper.params.cssMode,
          }),
        });
    },
  ];
  return Swiper.use(modules), Swiper;
}),
  (function (window, factory) {
    var lazySizes = (function l(window, document, Date) {
      "use strict";
      var lazysizes, lazySizesCfg;
      if (
        ((function () {
          var prop,
            lazySizesDefaults = {
              lazyClass: "lazyload",
              loadedClass: "lazyloaded",
              loadingClass: "lazyloading",
              preloadClass: "lazypreload",
              errorClass: "lazyerror",
              autosizesClass: "lazyautosizes",
              fastLoadedClass: "ls-is-cached",
              iframeLoadMode: 0,
              srcAttr: "data-src",
              srcsetAttr: "data-srcset",
              sizesAttr: "data-sizes",
              minSize: 40,
              customMedia: {},
              init: !0,
              expFactor: 1.5,
              hFac: 0.8,
              loadMode: 2,
              loadHidden: !0,
              ricTimeout: 0,
              throttleDelay: 125,
            };
          for (prop in ((lazySizesCfg =
            window.lazySizesConfig || window.lazysizesConfig || {}),
          lazySizesDefaults))
            prop in lazySizesCfg ||
              (lazySizesCfg[prop] = lazySizesDefaults[prop]);
        })(),
        !document || !document.getElementsByClassName)
      )
        return { init: function () {}, cfg: lazySizesCfg, noSupport: !0 };
      var docElem = document.documentElement,
        supportPicture = window.HTMLPictureElement,
        _addEventListener = "addEventListener",
        _getAttribute = "getAttribute",
        addEventListener = window[_addEventListener].bind(window),
        setTimeout = window.setTimeout,
        requestAnimationFrame = window.requestAnimationFrame || setTimeout,
        requestIdleCallback = window.requestIdleCallback,
        regPicture = /^picture$/i,
        loadEvents = ["load", "error", "lazyincluded", "_lazyloaded"],
        regClassCache = {},
        forEach = Array.prototype.forEach,
        hasClass = function (ele, cls) {
          return (
            regClassCache[cls] ||
              (regClassCache[cls] = new RegExp("(\\s|^)" + cls + "(\\s|$)")),
            regClassCache[cls].test(ele[_getAttribute]("class") || "") &&
              regClassCache[cls]
          );
        },
        addClass = function (ele, cls) {
          hasClass(ele, cls) ||
            ele.setAttribute(
              "class",
              (ele[_getAttribute]("class") || "").trim() + " " + cls
            );
        },
        removeClass = function (ele, cls) {
          var reg;
          (reg = hasClass(ele, cls)) &&
            ele.setAttribute(
              "class",
              (ele[_getAttribute]("class") || "").replace(reg, " ")
            );
        },
        addRemoveLoadEvents = function (dom, fn, add) {
          var action = add ? _addEventListener : "removeEventListener";
          add && addRemoveLoadEvents(dom, fn),
            loadEvents.forEach(function (evt) {
              dom[action](evt, fn);
            });
        },
        triggerEvent = function (elem, name, detail, noBubbles, noCancelable) {
          var event = document.createEvent("Event");
          return (
            detail || (detail = {}),
            (detail.instance = lazysizes),
            event.initEvent(name, !noBubbles, !noCancelable),
            (event.detail = detail),
            elem.dispatchEvent(event),
            event
          );
        },
        updatePolyfill = function (el, full) {
          var polyfill;
          !supportPicture && (polyfill = window.picturefill || lazySizesCfg.pf)
            ? (full &&
                full.src &&
                !el[_getAttribute]("srcset") &&
                el.setAttribute("srcset", full.src),
              polyfill({ reevaluate: !0, elements: [el] }))
            : full && full.src && (el.src = full.src);
        },
        getCSS = function (elem, style) {
          return (getComputedStyle(elem, null) || {})[style];
        },
        getWidth = function (elem, parent, width) {
          for (
            width = width || elem.offsetWidth;
            width < lazySizesCfg.minSize && parent && !elem._lazysizesWidth;

          )
            (width = parent.offsetWidth), (parent = parent.parentNode);
          return width;
        },
        rAF =
          ((firstFns = []),
          (secondFns = []),
          (fns = firstFns),
          (run = function () {
            var runFns = fns;
            for (
              fns = firstFns.length ? secondFns : firstFns,
                running = !0,
                waiting = !1;
              runFns.length;

            )
              runFns.shift()();
            running = !1;
          }),
          (rafBatch = function (fn, queue) {
            running && !queue
              ? fn.apply(this, arguments)
              : (fns.push(fn),
                waiting ||
                  ((waiting = !0),
                  (document.hidden ? setTimeout : requestAnimationFrame)(run)));
          }),
          (rafBatch._lsFlush = run),
          rafBatch),
        rAFIt = function (fn, simple) {
          return simple
            ? function () {
                rAF(fn);
              }
            : function () {
                var that = this,
                  args = arguments;
                rAF(function () {
                  fn.apply(that, args);
                });
              };
        },
        throttle = function (fn) {
          var running,
            lastTime = 0,
            gDelay = lazySizesCfg.throttleDelay,
            rICTimeout = lazySizesCfg.ricTimeout,
            run = function () {
              (running = !1), (lastTime = Date.now()), fn();
            },
            idleCallback =
              requestIdleCallback && rICTimeout > 49
                ? function () {
                    requestIdleCallback(run, { timeout: rICTimeout }),
                      rICTimeout !== lazySizesCfg.ricTimeout &&
                        (rICTimeout = lazySizesCfg.ricTimeout);
                  }
                : rAFIt(function () {
                    setTimeout(run);
                  }, !0);
          return function (isPriority) {
            var delay;
            (isPriority = !0 === isPriority) && (rICTimeout = 33),
              running ||
                ((running = !0),
                (delay = gDelay - (Date.now() - lastTime)) < 0 && (delay = 0),
                isPriority || delay < 9
                  ? idleCallback()
                  : setTimeout(idleCallback, delay));
          };
        },
        debounce = function (func) {
          var timeout,
            timestamp,
            wait = 99,
            run = function () {
              (timeout = null), func();
            },
            later = function () {
              var last = Date.now() - timestamp;
              last < wait
                ? setTimeout(later, wait - last)
                : (requestIdleCallback || run)(run);
            };
          return function () {
            (timestamp = Date.now()),
              timeout || (timeout = setTimeout(later, wait));
          };
        },
        loader =
          ((regImg = /^img$/i),
          (regIframe = /^iframe$/i),
          (supportScroll =
            "onscroll" in window && !/(gle|ing)bot/.test(navigator.userAgent)),
          (shrinkExpand = 0),
          (currentExpand = 0),
          (isLoading = 0),
          (lowRuns = -1),
          (resetPreloading = function (e) {
            isLoading--, (!e || isLoading < 0 || !e.target) && (isLoading = 0);
          }),
          (isVisible = function (elem) {
            return (
              null == isBodyHidden &&
                (isBodyHidden =
                  "hidden" == getCSS(document.body, "visibility")),
              isBodyHidden ||
                !(
                  "hidden" == getCSS(elem.parentNode, "visibility") &&
                  "hidden" == getCSS(elem, "visibility")
                )
            );
          }),
          (isNestedVisible = function (elem, elemExpand) {
            var outerRect,
              parent = elem,
              visible = isVisible(elem);
            for (
              eLtop -= elemExpand,
                eLbottom += elemExpand,
                eLleft -= elemExpand,
                eLright += elemExpand;
              visible &&
              (parent = parent.offsetParent) &&
              parent != document.body &&
              parent != docElem;

            )
              (visible = (getCSS(parent, "opacity") || 1) > 0) &&
                "visible" != getCSS(parent, "overflow") &&
                ((outerRect = parent.getBoundingClientRect()),
                (visible =
                  eLright > outerRect.left &&
                  eLleft < outerRect.right &&
                  eLbottom > outerRect.top - 1 &&
                  eLtop < outerRect.bottom + 1));
            return visible;
          }),
          (checkElements = function () {
            var eLlen,
              i,
              rect,
              autoLoadElem,
              loadedSomething,
              elemExpand,
              elemNegativeExpand,
              elemExpandVal,
              beforeExpandVal,
              defaultExpand,
              preloadExpand,
              hFac,
              lazyloadElems = lazysizes.elements;
            if (
              (loadMode = lazySizesCfg.loadMode) &&
              isLoading < 8 &&
              (eLlen = lazyloadElems.length)
            ) {
              for (i = 0, lowRuns++; i < eLlen; i++)
                if (lazyloadElems[i] && !lazyloadElems[i]._lazyRace)
                  if (
                    !supportScroll ||
                    (lazysizes.prematureUnveil &&
                      lazysizes.prematureUnveil(lazyloadElems[i]))
                  )
                    unveilElement(lazyloadElems[i]);
                  else if (
                    (((elemExpandVal =
                      lazyloadElems[i][_getAttribute]("data-expand")) &&
                      (elemExpand = 1 * elemExpandVal)) ||
                      (elemExpand = currentExpand),
                    defaultExpand ||
                      ((defaultExpand =
                        !lazySizesCfg.expand || lazySizesCfg.expand < 1
                          ? docElem.clientHeight > 500 &&
                            docElem.clientWidth > 500
                            ? 500
                            : 370
                          : lazySizesCfg.expand),
                      (lazysizes._defEx = defaultExpand),
                      (preloadExpand = defaultExpand * lazySizesCfg.expFactor),
                      (hFac = lazySizesCfg.hFac),
                      (isBodyHidden = null),
                      currentExpand < preloadExpand &&
                      isLoading < 1 &&
                      lowRuns > 2 &&
                      loadMode > 2 &&
                      !document.hidden
                        ? ((currentExpand = preloadExpand), (lowRuns = 0))
                        : (currentExpand =
                            loadMode > 1 && lowRuns > 1 && isLoading < 6
                              ? defaultExpand
                              : shrinkExpand)),
                    beforeExpandVal !== elemExpand &&
                      ((eLvW = innerWidth + elemExpand * hFac),
                      (elvH = innerHeight + elemExpand),
                      (elemNegativeExpand = -1 * elemExpand),
                      (beforeExpandVal = elemExpand)),
                    (rect = lazyloadElems[i].getBoundingClientRect()),
                    (eLbottom = rect.bottom) >= elemNegativeExpand &&
                      (eLtop = rect.top) <= elvH &&
                      (eLright = rect.right) >= elemNegativeExpand * hFac &&
                      (eLleft = rect.left) <= eLvW &&
                      (eLbottom || eLright || eLleft || eLtop) &&
                      (lazySizesCfg.loadHidden ||
                        isVisible(lazyloadElems[i])) &&
                      ((isCompleted &&
                        isLoading < 3 &&
                        !elemExpandVal &&
                        (loadMode < 3 || lowRuns < 4)) ||
                        isNestedVisible(lazyloadElems[i], elemExpand)))
                  ) {
                    if (
                      (unveilElement(lazyloadElems[i]),
                      (loadedSomething = !0),
                      isLoading > 9)
                    )
                      break;
                  } else
                    !loadedSomething &&
                      isCompleted &&
                      !autoLoadElem &&
                      isLoading < 4 &&
                      lowRuns < 4 &&
                      loadMode > 2 &&
                      (preloadElems[0] || lazySizesCfg.preloadAfterLoad) &&
                      (preloadElems[0] ||
                        (!elemExpandVal &&
                          (eLbottom ||
                            eLright ||
                            eLleft ||
                            eLtop ||
                            "auto" !=
                              lazyloadElems[i][_getAttribute](
                                lazySizesCfg.sizesAttr
                              )))) &&
                      (autoLoadElem = preloadElems[0] || lazyloadElems[i]);
              autoLoadElem && !loadedSomething && unveilElement(autoLoadElem);
            }
          }),
          (throttledCheckElements = throttle(checkElements)),
          (switchLoadingClass = function (e) {
            var elem = e.target;
            elem._lazyCache
              ? delete elem._lazyCache
              : (resetPreloading(e),
                addClass(elem, lazySizesCfg.loadedClass),
                removeClass(elem, lazySizesCfg.loadingClass),
                addRemoveLoadEvents(elem, rafSwitchLoadingClass),
                triggerEvent(elem, "lazyloaded"));
          }),
          (rafedSwitchLoadingClass = rAFIt(switchLoadingClass)),
          (rafSwitchLoadingClass = function (e) {
            rafedSwitchLoadingClass({ target: e.target });
          }),
          (changeIframeSrc = function (elem, src) {
            var loadMode =
              elem.getAttribute("data-load-mode") ||
              lazySizesCfg.iframeLoadMode;
            0 == loadMode
              ? elem.contentWindow.location.replace(src)
              : 1 == loadMode && (elem.src = src);
          }),
          (handleSources = function (source) {
            var customMedia,
              sourceSrcset = source[_getAttribute](lazySizesCfg.srcsetAttr);
            (customMedia =
              lazySizesCfg.customMedia[
                source[_getAttribute]("data-media") ||
                  source[_getAttribute]("media")
              ]) && source.setAttribute("media", customMedia),
              sourceSrcset && source.setAttribute("srcset", sourceSrcset);
          }),
          (lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg) {
            var src, srcset, parent, isPicture, event, firesLoad;
            (event = triggerEvent(elem, "lazybeforeunveil", detail))
              .defaultPrevented ||
              (sizes &&
                (isAuto
                  ? addClass(elem, lazySizesCfg.autosizesClass)
                  : elem.setAttribute("sizes", sizes)),
              (srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr)),
              (src = elem[_getAttribute](lazySizesCfg.srcAttr)),
              isImg &&
                (isPicture =
                  (parent = elem.parentNode) &&
                  regPicture.test(parent.nodeName || "")),
              (firesLoad =
                detail.firesLoad ||
                ("src" in elem && (srcset || src || isPicture))),
              (event = { target: elem }),
              addClass(elem, lazySizesCfg.loadingClass),
              firesLoad &&
                (clearTimeout(resetPreloadingTimer),
                (resetPreloadingTimer = setTimeout(resetPreloading, 2500)),
                addRemoveLoadEvents(elem, rafSwitchLoadingClass, !0)),
              isPicture &&
                forEach.call(
                  parent.getElementsByTagName("source"),
                  handleSources
                ),
              srcset
                ? elem.setAttribute("srcset", srcset)
                : src &&
                  !isPicture &&
                  (regIframe.test(elem.nodeName)
                    ? changeIframeSrc(elem, src)
                    : (elem.src = src)),
              isImg &&
                (srcset || isPicture) &&
                updatePolyfill(elem, { src: src })),
              elem._lazyRace && delete elem._lazyRace,
              removeClass(elem, lazySizesCfg.lazyClass),
              rAF(function () {
                var isLoaded = elem.complete && elem.naturalWidth > 1;
                (firesLoad && !isLoaded) ||
                  (isLoaded && addClass(elem, lazySizesCfg.fastLoadedClass),
                  switchLoadingClass(event),
                  (elem._lazyCache = !0),
                  setTimeout(function () {
                    "_lazyCache" in elem && delete elem._lazyCache;
                  }, 9)),
                  "lazy" == elem.loading && isLoading--;
              }, !0);
          })),
          (unveilElement = function (elem) {
            if (!elem._lazyRace) {
              var detail,
                isImg = regImg.test(elem.nodeName),
                sizes =
                  isImg &&
                  (elem[_getAttribute](lazySizesCfg.sizesAttr) ||
                    elem[_getAttribute]("sizes")),
                isAuto = "auto" == sizes;
              ((!isAuto && isCompleted) ||
                !isImg ||
                (!elem[_getAttribute]("src") && !elem.srcset) ||
                elem.complete ||
                hasClass(elem, lazySizesCfg.errorClass) ||
                !hasClass(elem, lazySizesCfg.lazyClass)) &&
                ((detail = triggerEvent(elem, "lazyunveilread").detail),
                isAuto && autoSizer.updateElem(elem, !0, elem.offsetWidth),
                (elem._lazyRace = !0),
                isLoading++,
                lazyUnveil(elem, detail, isAuto, sizes, isImg));
            }
          }),
          (afterScroll = debounce(function () {
            (lazySizesCfg.loadMode = 3), throttledCheckElements();
          })),
          (altLoadmodeScrollListner = function () {
            3 == lazySizesCfg.loadMode && (lazySizesCfg.loadMode = 2),
              afterScroll();
          }),
          (onload = function () {
            isCompleted ||
              (Date.now() - started < 999
                ? setTimeout(onload, 999)
                : ((isCompleted = !0),
                  (lazySizesCfg.loadMode = 3),
                  throttledCheckElements(),
                  addEventListener("scroll", altLoadmodeScrollListner, !0)));
          }),
          {
            _: function () {
              (started = Date.now()),
                (lazysizes.elements = document.getElementsByClassName(
                  lazySizesCfg.lazyClass
                )),
                (preloadElems = document.getElementsByClassName(
                  lazySizesCfg.lazyClass + " " + lazySizesCfg.preloadClass
                )),
                addEventListener("scroll", throttledCheckElements, !0),
                addEventListener("resize", throttledCheckElements, !0),
                addEventListener("pageshow", function (e) {
                  if (e.persisted) {
                    var loadingElements = document.querySelectorAll(
                      "." + lazySizesCfg.loadingClass
                    );
                    loadingElements.length &&
                      loadingElements.forEach &&
                      requestAnimationFrame(function () {
                        loadingElements.forEach(function (img) {
                          img.complete && unveilElement(img);
                        });
                      });
                  }
                }),
                window.MutationObserver
                  ? new MutationObserver(throttledCheckElements).observe(
                      docElem,
                      { childList: !0, subtree: !0, attributes: !0 }
                    )
                  : (docElem[_addEventListener](
                      "DOMNodeInserted",
                      throttledCheckElements,
                      !0
                    ),
                    docElem[_addEventListener](
                      "DOMAttrModified",
                      throttledCheckElements,
                      !0
                    ),
                    setInterval(throttledCheckElements, 999)),
                addEventListener("hashchange", throttledCheckElements, !0),
                [
                  "focus",
                  "mouseover",
                  "click",
                  "load",
                  "transitionend",
                  "animationend",
                ].forEach(function (name) {
                  document[_addEventListener](name, throttledCheckElements, !0);
                }),
                /d$|^c/.test(document.readyState)
                  ? onload()
                  : (addEventListener("load", onload),
                    document[_addEventListener](
                      "DOMContentLoaded",
                      throttledCheckElements
                    ),
                    setTimeout(onload, 2e4)),
                lazysizes.elements.length
                  ? (checkElements(), rAF._lsFlush())
                  : throttledCheckElements();
            },
            checkElems: throttledCheckElements,
            unveil: unveilElement,
            _aLSL: altLoadmodeScrollListner,
          }),
        autoSizer =
          ((sizeElement = rAFIt(function (elem, parent, event, width) {
            var sources, i, len;
            if (
              ((elem._lazysizesWidth = width),
              (width += "px"),
              elem.setAttribute("sizes", width),
              regPicture.test(parent.nodeName || ""))
            )
              for (
                i = 0,
                  len = (sources = parent.getElementsByTagName("source"))
                    .length;
                i < len;
                i++
              )
                sources[i].setAttribute("sizes", width);
            event.detail.dataAttr || updatePolyfill(elem, event.detail);
          })),
          (getSizeElement = function (elem, dataAttr, width) {
            var event,
              parent = elem.parentNode;
            parent &&
              ((width = getWidth(elem, parent, width)),
              (event = triggerEvent(elem, "lazybeforesizes", {
                width: width,
                dataAttr: !!dataAttr,
              })).defaultPrevented ||
                ((width = event.detail.width) &&
                  width !== elem._lazysizesWidth &&
                  sizeElement(elem, parent, event, width)));
          }),
          (debouncedUpdateElementsSizes = debounce(function () {
            var i,
              len = autosizesElems.length;
            if (len)
              for (i = 0; i < len; i++) getSizeElement(autosizesElems[i]);
          })),
          {
            _: function () {
              (autosizesElems = document.getElementsByClassName(
                lazySizesCfg.autosizesClass
              )),
                addEventListener("resize", debouncedUpdateElementsSizes);
            },
            checkElems: debouncedUpdateElementsSizes,
            updateElem: getSizeElement,
          }),
        init = function () {
          !init.i &&
            document.getElementsByClassName &&
            ((init.i = !0), autoSizer._(), loader._());
        };
      var autosizesElems,
        sizeElement,
        getSizeElement,
        debouncedUpdateElementsSizes;
      var preloadElems,
        isCompleted,
        resetPreloadingTimer,
        loadMode,
        started,
        eLvW,
        elvH,
        eLtop,
        eLleft,
        eLright,
        eLbottom,
        isBodyHidden,
        regImg,
        regIframe,
        supportScroll,
        shrinkExpand,
        currentExpand,
        isLoading,
        lowRuns,
        resetPreloading,
        isVisible,
        isNestedVisible,
        checkElements,
        throttledCheckElements,
        switchLoadingClass,
        rafedSwitchLoadingClass,
        rafSwitchLoadingClass,
        changeIframeSrc,
        handleSources,
        lazyUnveil,
        unveilElement,
        afterScroll,
        altLoadmodeScrollListner,
        onload;
      var running, waiting, firstFns, secondFns, fns, run, rafBatch;
      return (
        setTimeout(function () {
          lazySizesCfg.init && init();
        }),
        (lazysizes = {
          cfg: lazySizesCfg,
          autoSizer: autoSizer,
          loader: loader,
          init: init,
          uP: updatePolyfill,
          aC: addClass,
          rC: removeClass,
          hC: hasClass,
          fire: triggerEvent,
          gW: getWidth,
          rAF: rAF,
        })
      );
    })(window, window.document, Date);
    "object" == typeof module && module.exports
      ? (module.exports = lazySizes)
      : "function" == typeof define && define.amd
      ? define(lazySizes)
      : (window.lazySizes = lazySizes);
  })(window),
  (function (window, factory) {
    var globalInstall = function () {
      factory(window.lazySizes),
        window.removeEventListener("lazyunveilread", globalInstall, !0);
    };
    (factory = factory.bind(null, window, window.document)),
      "object" == typeof module && module.exports
        ? factory(require("lazysizes"))
        : "function" == typeof define && define.amd
        ? define(["lazysizes"], factory)
        : window.lazySizes
        ? globalInstall()
        : window.addEventListener("lazyunveilread", globalInstall, !0);
  })(window, function (window, document, lazySizes) {
    "use strict";
    if (window.addEventListener) {
      var lazySizesCfg = lazySizes.cfg,
        regWhite = /\s+/g,
        regSplitSet = /\s*\|\s+|\s+\|\s*/g,
        regSource = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/,
        regType = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/,
        regBgUrlEscape = /\(|\)|'/,
        allowedBackgroundSize = { contain: 1, cover: 1 },
        setTypeOrMedia = function (source, match) {
          if (match) {
            var typeMatch = match.match(regType);
            typeMatch && typeMatch[1]
              ? source.setAttribute("type", typeMatch[1])
              : source.setAttribute(
                  "media",
                  lazySizesCfg.customMedia[match] || match
                );
          }
        },
        proxyLoad = function (e) {
          if (e.target._lazybgset) {
            var image = e.target,
              elem = image._lazybgset,
              bg = image.currentSrc || image.src;
            if (bg) {
              var useSrc = regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg,
                event = lazySizes.fire(elem, "bgsetproxy", {
                  src: bg,
                  useSrc: useSrc,
                  fullSrc: null,
                });
              event.defaultPrevented ||
                (elem.style.backgroundImage =
                  event.detail.fullSrc || "url(" + event.detail.useSrc + ")");
            }
            image._lazybgsetLoading &&
              (lazySizes.fire(elem, "_lazyloaded", {}, !1, !0),
              delete image._lazybgsetLoading);
          }
        };
      addEventListener("lazybeforeunveil", function (e) {
        var set, image, elem;
        !e.defaultPrevented &&
          (set = e.target.getAttribute("data-bgset")) &&
          ((elem = e.target),
          ((image = document.createElement("img")).alt = ""),
          (image._lazybgsetLoading = !0),
          (e.detail.firesLoad = !0),
          (function (sets, elem, img) {
            var picture = document.createElement("picture"),
              sizes = elem.getAttribute(lazySizesCfg.sizesAttr),
              ratio = elem.getAttribute("data-ratio"),
              optimumx = elem.getAttribute("data-optimumx");
            elem._lazybgset &&
              elem._lazybgset.parentNode == elem &&
              elem.removeChild(elem._lazybgset),
              Object.defineProperty(img, "_lazybgset", {
                value: elem,
                writable: !0,
              }),
              Object.defineProperty(elem, "_lazybgset", {
                value: picture,
                writable: !0,
              }),
              (sets = sets.replace(regWhite, " ").split(regSplitSet)),
              (picture.style.display = "none"),
              (img.className = lazySizesCfg.lazyClass),
              1 != sets.length || sizes || (sizes = "auto"),
              sets.forEach(function (set) {
                var match,
                  source = document.createElement("source");
                sizes && "auto" != sizes && source.setAttribute("sizes", sizes),
                  (match = set.match(regSource))
                    ? (source.setAttribute(lazySizesCfg.srcsetAttr, match[1]),
                      setTypeOrMedia(source, match[2]),
                      setTypeOrMedia(source, match[3]))
                    : source.setAttribute(lazySizesCfg.srcsetAttr, set),
                  picture.appendChild(source);
              }),
              sizes &&
                (img.setAttribute(lazySizesCfg.sizesAttr, sizes),
                elem.removeAttribute(lazySizesCfg.sizesAttr),
                elem.removeAttribute("sizes")),
              optimumx && img.setAttribute("data-optimumx", optimumx),
              ratio && img.setAttribute("data-ratio", ratio),
              picture.appendChild(img),
              elem.appendChild(picture);
          })(set, elem, image),
          setTimeout(function () {
            lazySizes.loader.unveil(image),
              lazySizes.rAF(function () {
                lazySizes.fire(image, "_lazyloaded", {}, !0, !0),
                  image.complete && proxyLoad({ target: image });
              });
          }));
      }),
        document.addEventListener("load", proxyLoad, !0),
        window.addEventListener(
          "lazybeforesizes",
          function (e) {
            if (
              e.detail.instance == lazySizes &&
              e.target._lazybgset &&
              e.detail.dataAttr
            ) {
              var bgSize = (function (elem) {
                var bgSize;
                return (
                  (bgSize = (
                    getComputedStyle(elem) || {
                      getPropertyValue: function () {},
                    }
                  ).getPropertyValue("background-size")),
                  !allowedBackgroundSize[bgSize] &&
                    allowedBackgroundSize[elem.style.backgroundSize] &&
                    (bgSize = elem.style.backgroundSize),
                  bgSize
                );
              })(e.target._lazybgset);
              allowedBackgroundSize[bgSize] &&
                ((e.target._lazysizesParentFit = bgSize),
                lazySizes.rAF(function () {
                  e.target.setAttribute("data-parent-fit", bgSize),
                    e.target._lazysizesParentFit &&
                      delete e.target._lazysizesParentFit;
                }));
            }
          },
          !0
        ),
        document.documentElement.addEventListener(
          "lazybeforesizes",
          function (e) {
            var elem, width;
            !e.defaultPrevented &&
              e.target._lazybgset &&
              e.detail.instance == lazySizes &&
              (e.detail.width =
                ((elem = e.target._lazybgset),
                (width = lazySizes.gW(elem, elem.parentNode)),
                (!elem._lazysizesWidth || width > elem._lazysizesWidth) &&
                  (elem._lazysizesWidth = width),
                elem._lazysizesWidth));
          }
        );
    }
  }),
  /* flatpickr v4.6.9, @license MIT */
  (function (global, factory) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = factory())
      : "function" == typeof define && define.amd
      ? define(factory)
      : ((global =
          "undefined" != typeof globalThis
            ? globalThis
            : global || self).flatpickr = factory());
  })(this, function () {
    "use strict";
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */ var __assign =
      function () {
        return (
          (__assign =
            Object.assign ||
            function __assign(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++)
                for (var p in (s = arguments[i]))
                  Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
              return t;
            }),
          __assign.apply(this, arguments)
        );
      };
    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      var r = Array(s),
        k = 0;
      for (i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    }
    var HOOKS = [
        "onChange",
        "onClose",
        "onDayCreate",
        "onDestroy",
        "onKeyDown",
        "onMonthChange",
        "onOpen",
        "onParseConfig",
        "onReady",
        "onValueUpdate",
        "onYearChange",
        "onPreCalendarPosition",
      ],
      defaults = {
        _disable: [],
        allowInput: !1,
        allowInvalidPreload: !1,
        altFormat: "F j, Y",
        altInput: !1,
        altInputClass: "form-control input",
        animate:
          "object" == typeof window &&
          -1 === window.navigator.userAgent.indexOf("MSIE"),
        ariaDateFormat: "F j, Y",
        autoFillDefaultTime: !0,
        clickOpens: !0,
        closeOnSelect: !0,
        conjunction: ", ",
        dateFormat: "Y-m-d",
        defaultHour: 12,
        defaultMinute: 0,
        defaultSeconds: 0,
        disable: [],
        disableMobile: !1,
        enableSeconds: !1,
        enableTime: !1,
        errorHandler: function (err) {
          return "undefined" != typeof console && console.warn(err);
        },
        getWeek: function (givenDate) {
          var date = new Date(givenDate.getTime());
          date.setHours(0, 0, 0, 0),
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
          var week1 = new Date(date.getFullYear(), 0, 4);
          return (
            1 +
            Math.round(
              ((date.getTime() - week1.getTime()) / 864e5 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7
            )
          );
        },
        hourIncrement: 1,
        ignoredFocusElements: [],
        inline: !1,
        locale: "default",
        minuteIncrement: 5,
        mode: "single",
        monthSelectorType: "dropdown",
        nextArrow:
          "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>>",
        noCalendar: !1,
        now: new Date(),
        onChange: [],
        onClose: [],
        onDayCreate: [],
        onDestroy: [],
        onKeyDown: [],
        onMonthChange: [],
        onOpen: [],
        onParseConfig: [],
        onReady: [],
        onValueUpdate: [],
        onYearChange: [],
        onPreCalendarPosition: [],
        plugins: [],
        position: "auto",
        positionElement: void 0,
        prevArrow:
          "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>>",
        shorthandCurrentMonth: !1,
        showMonths: 1,
        static: !1,
        time_24hr: !1,
        weekNumbers: !1,
        wrap: !1,
      },
      english = {
        weekdays: {
          shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          longhand: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        months: {
          shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          longhand: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: function (nth) {
          var s = nth % 100;
          if (s > 3 && s < 21) return "th";
          switch (s % 10) {
            case 1:
              return "st";
            case 2:
              return "nd";
            case 3:
              return "rd";
            default:
              return "th";
          }
        },
        rangeSeparator: " to ",
        weekAbbreviation: "Wk",
        scrollTitle: "Scroll to increment",
        toggleTitle: "Click to toggle",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Year",
        monthAriaLabel: "Month",
        hourAriaLabel: "Hour",
        minuteAriaLabel: "Minute",
        time_24hr: !1,
      },
      pad = function (number, length) {
        return (
          void 0 === length && (length = 2), ("000" + number).slice(-1 * length)
        );
      },
      int = function (bool) {
        return !0 === bool ? 1 : 0;
      };
    function debounce(fn, wait) {
      var t;
      return function () {
        var _this = this;
        clearTimeout(t),
          (t = setTimeout(function () {
            return fn.apply(_this, arguments);
          }, wait));
      };
    }
    var arrayify = function (obj) {
      return obj instanceof Array ? obj : [obj];
    };
    function toggleClass(elem, className, bool) {
      if (!0 === bool) return elem.classList.add(className);
      elem.classList.remove(className);
    }
    function createElement(tag, className, content) {
      var e = window.document.createElement(tag);
      return (
        (className = className || ""),
        (content = content || ""),
        (e.className = className),
        void 0 !== content && (e.textContent = content),
        e
      );
    }
    function clearNode(node) {
      for (; node.firstChild; ) node.removeChild(node.firstChild);
    }
    function findParent(node, condition) {
      return condition(node)
        ? node
        : node.parentNode
        ? findParent(node.parentNode, condition)
        : void 0;
    }
    function createNumberInput(inputClassName, opts) {
      var wrapper = createElement("div", "numInputWrapper"),
        numInput = createElement("input", "numInput " + inputClassName),
        arrowUp = createElement("span", "arrowUp"),
        arrowDown = createElement("span", "arrowDown");
      if (
        (-1 === navigator.userAgent.indexOf("MSIE 9.0")
          ? (numInput.type = "number")
          : ((numInput.type = "text"), (numInput.pattern = "\\d*")),
        void 0 !== opts)
      )
        for (var key in opts) numInput.setAttribute(key, opts[key]);
      return (
        wrapper.appendChild(numInput),
        wrapper.appendChild(arrowUp),
        wrapper.appendChild(arrowDown),
        wrapper
      );
    }
    function getEventTarget(event) {
      try {
        return "function" == typeof event.composedPath
          ? event.composedPath()[0]
          : event.target;
      } catch (error) {
        return event.target;
      }
    }
    var doNothing = function () {},
      monthToStr = function (monthNumber, shorthand, locale) {
        return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
      },
      revFormat = {
        D: doNothing,
        F: function (dateObj, monthName, locale) {
          dateObj.setMonth(locale.months.longhand.indexOf(monthName));
        },
        G: function (dateObj, hour) {
          dateObj.setHours(parseFloat(hour));
        },
        H: function (dateObj, hour) {
          dateObj.setHours(parseFloat(hour));
        },
        J: function (dateObj, day) {
          dateObj.setDate(parseFloat(day));
        },
        K: function (dateObj, amPM, locale) {
          dateObj.setHours(
            (dateObj.getHours() % 12) +
              12 * int(new RegExp(locale.amPM[1], "i").test(amPM))
          );
        },
        M: function (dateObj, shortMonth, locale) {
          dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
        },
        S: function (dateObj, seconds) {
          dateObj.setSeconds(parseFloat(seconds));
        },
        U: function (_, unixSeconds) {
          return new Date(1e3 * parseFloat(unixSeconds));
        },
        W: function (dateObj, weekNum, locale) {
          var weekNumber = parseInt(weekNum),
            date = new Date(
              dateObj.getFullYear(),
              0,
              2 + 7 * (weekNumber - 1),
              0,
              0,
              0,
              0
            );
          return (
            date.setDate(
              date.getDate() - date.getDay() + locale.firstDayOfWeek
            ),
            date
          );
        },
        Y: function (dateObj, year) {
          dateObj.setFullYear(parseFloat(year));
        },
        Z: function (_, ISODate) {
          return new Date(ISODate);
        },
        d: function (dateObj, day) {
          dateObj.setDate(parseFloat(day));
        },
        h: function (dateObj, hour) {
          dateObj.setHours(parseFloat(hour));
        },
        i: function (dateObj, minutes) {
          dateObj.setMinutes(parseFloat(minutes));
        },
        j: function (dateObj, day) {
          dateObj.setDate(parseFloat(day));
        },
        l: doNothing,
        m: function (dateObj, month) {
          dateObj.setMonth(parseFloat(month) - 1);
        },
        n: function (dateObj, month) {
          dateObj.setMonth(parseFloat(month) - 1);
        },
        s: function (dateObj, seconds) {
          dateObj.setSeconds(parseFloat(seconds));
        },
        u: function (_, unixMillSeconds) {
          return new Date(parseFloat(unixMillSeconds));
        },
        w: doNothing,
        y: function (dateObj, year) {
          dateObj.setFullYear(2e3 + parseFloat(year));
        },
      },
      tokenRegex = {
        D: "(\\w+)",
        F: "(\\w+)",
        G: "(\\d\\d|\\d)",
        H: "(\\d\\d|\\d)",
        J: "(\\d\\d|\\d)\\w+",
        K: "",
        M: "(\\w+)",
        S: "(\\d\\d|\\d)",
        U: "(.+)",
        W: "(\\d\\d|\\d)",
        Y: "(\\d{4})",
        Z: "(.+)",
        d: "(\\d\\d|\\d)",
        h: "(\\d\\d|\\d)",
        i: "(\\d\\d|\\d)",
        j: "(\\d\\d|\\d)",
        l: "(\\w+)",
        m: "(\\d\\d|\\d)",
        n: "(\\d\\d|\\d)",
        s: "(\\d\\d|\\d)",
        u: "(.+)",
        w: "(\\d\\d|\\d)",
        y: "(\\d{2})",
      },
      formats = {
        Z: function (date) {
          return date.toISOString();
        },
        D: function (date, locale, options) {
          return locale.weekdays.shorthand[formats.w(date, locale, options)];
        },
        F: function (date, locale, options) {
          return monthToStr(formats.n(date, locale, options) - 1, !1, locale);
        },
        G: function (date, locale, options) {
          return pad(formats.h(date, locale, options));
        },
        H: function (date) {
          return pad(date.getHours());
        },
        J: function (date, locale) {
          return void 0 !== locale.ordinal
            ? date.getDate() + locale.ordinal(date.getDate())
            : date.getDate();
        },
        K: function (date, locale) {
          return locale.amPM[int(date.getHours() > 11)];
        },
        M: function (date, locale) {
          return monthToStr(date.getMonth(), !0, locale);
        },
        S: function (date) {
          return pad(date.getSeconds());
        },
        U: function (date) {
          return date.getTime() / 1e3;
        },
        W: function (date, _, options) {
          return options.getWeek(date);
        },
        Y: function (date) {
          return pad(date.getFullYear(), 4);
        },
        d: function (date) {
          return pad(date.getDate());
        },
        h: function (date) {
          return date.getHours() % 12 ? date.getHours() % 12 : 12;
        },
        i: function (date) {
          return pad(date.getMinutes());
        },
        j: function (date) {
          return date.getDate();
        },
        l: function (date, locale) {
          return locale.weekdays.longhand[date.getDay()];
        },
        m: function (date) {
          return pad(date.getMonth() + 1);
        },
        n: function (date) {
          return date.getMonth() + 1;
        },
        s: function (date) {
          return date.getSeconds();
        },
        u: function (date) {
          return date.getTime();
        },
        w: function (date) {
          return date.getDay();
        },
        y: function (date) {
          return String(date.getFullYear()).substring(2);
        },
      },
      createDateFormatter = function (_a) {
        var _b = _a.config,
          config = void 0 === _b ? defaults : _b,
          _c = _a.l10n,
          l10n = void 0 === _c ? english : _c,
          _d = _a.isMobile,
          isMobile = void 0 !== _d && _d;
        return function (dateObj, frmt, overrideLocale) {
          var locale = overrideLocale || l10n;
          return void 0 === config.formatDate || isMobile
            ? frmt
                .split("")
                .map(function (c, i, arr) {
                  return formats[c] && "\\" !== arr[i - 1]
                    ? formats[c](dateObj, locale, config)
                    : "\\" !== c
                    ? c
                    : "";
                })
                .join("")
            : config.formatDate(dateObj, frmt, locale);
        };
      },
      createDateParser = function (_a) {
        var _b = _a.config,
          config = void 0 === _b ? defaults : _b,
          _c = _a.l10n,
          l10n = void 0 === _c ? english : _c;
        return function (date, givenFormat, timeless, customLocale) {
          if (0 === date || date) {
            var parsedDate,
              locale = customLocale || l10n,
              dateOrig = date;
            if (date instanceof Date) parsedDate = new Date(date.getTime());
            else if ("string" != typeof date && void 0 !== date.toFixed)
              parsedDate = new Date(date);
            else if ("string" == typeof date) {
              var format = givenFormat || (config || defaults).dateFormat,
                datestr = String(date).trim();
              if ("today" === datestr)
                (parsedDate = new Date()), (timeless = !0);
              else if (/Z$/.test(datestr) || /GMT$/.test(datestr))
                parsedDate = new Date(date);
              else if (config && config.parseDate)
                parsedDate = config.parseDate(date, format);
              else {
                parsedDate =
                  config && config.noCalendar
                    ? new Date(new Date().setHours(0, 0, 0, 0))
                    : new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0);
                for (
                  var matched = void 0,
                    ops = [],
                    i = 0,
                    matchIndex = 0,
                    regexStr = "";
                  i < format.length;
                  i++
                ) {
                  var token_1 = format[i],
                    isBackSlash = "\\" === token_1,
                    escaped = "\\" === format[i - 1] || isBackSlash;
                  if (tokenRegex[token_1] && !escaped) {
                    regexStr += tokenRegex[token_1];
                    var match = new RegExp(regexStr).exec(date);
                    match &&
                      (matched = !0) &&
                      ops["Y" !== token_1 ? "push" : "unshift"]({
                        fn: revFormat[token_1],
                        val: match[++matchIndex],
                      });
                  } else isBackSlash || (regexStr += ".");
                  ops.forEach(function (_a) {
                    var fn = _a.fn,
                      val = _a.val;
                    return (parsedDate =
                      fn(parsedDate, val, locale) || parsedDate);
                  });
                }
                parsedDate = matched ? parsedDate : void 0;
              }
            }
            if (parsedDate instanceof Date && !isNaN(parsedDate.getTime()))
              return (
                !0 === timeless && parsedDate.setHours(0, 0, 0, 0), parsedDate
              );
            config.errorHandler(
              new Error("Invalid date provided: " + dateOrig)
            );
          }
        };
      };
    function compareDates(date1, date2, timeless) {
      return (
        void 0 === timeless && (timeless = !0),
        !1 !== timeless
          ? new Date(date1.getTime()).setHours(0, 0, 0, 0) -
            new Date(date2.getTime()).setHours(0, 0, 0, 0)
          : date1.getTime() - date2.getTime()
      );
    }
    var duration_DAY = 864e5;
    function getDefaultHours(config) {
      var hours = config.defaultHour,
        minutes = config.defaultMinute,
        seconds = config.defaultSeconds;
      if (void 0 !== config.minDate) {
        var minHour = config.minDate.getHours(),
          minMinutes = config.minDate.getMinutes(),
          minSeconds = config.minDate.getSeconds();
        hours < minHour && (hours = minHour),
          hours === minHour && minutes < minMinutes && (minutes = minMinutes),
          hours === minHour &&
            minutes === minMinutes &&
            seconds < minSeconds &&
            (seconds = config.minDate.getSeconds());
      }
      if (void 0 !== config.maxDate) {
        var maxHr = config.maxDate.getHours(),
          maxMinutes = config.maxDate.getMinutes();
        (hours = Math.min(hours, maxHr)) === maxHr &&
          (minutes = Math.min(maxMinutes, minutes)),
          hours === maxHr &&
            minutes === maxMinutes &&
            (seconds = config.maxDate.getSeconds());
      }
      return { hours: hours, minutes: minutes, seconds: seconds };
    }
    "function" != typeof Object.assign &&
      (Object.assign = function (target) {
        for (var args = [], _i = 1; _i < arguments.length; _i++)
          args[_i - 1] = arguments[_i];
        if (!target)
          throw TypeError("Cannot convert undefined or null to object");
        for (
          var _loop_1 = function (source) {
              source &&
                Object.keys(source).forEach(function (key) {
                  return (target[key] = source[key]);
                });
            },
            _a = 0,
            args_1 = args;
          _a < args_1.length;
          _a++
        ) {
          var source = args_1[_a];
          _loop_1(source);
        }
        return target;
      });
    function FlatpickrInstance(element, instanceConfig) {
      var self = {
        config: __assign(__assign({}, defaults), flatpickr.defaultConfig),
        l10n: english,
      };
      function bindToInstance(fn) {
        return fn.bind(self);
      }
      function setCalendarWidth() {
        var config = self.config;
        (!1 === config.weekNumbers && 1 === config.showMonths) ||
          (!0 !== config.noCalendar &&
            window.requestAnimationFrame(function () {
              if (
                (void 0 !== self.calendarContainer &&
                  ((self.calendarContainer.style.visibility = "hidden"),
                  (self.calendarContainer.style.display = "block")),
                void 0 !== self.daysContainer)
              ) {
                var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                (self.daysContainer.style.width = daysWidth + "px"),
                  (self.calendarContainer.style.width =
                    daysWidth +
                    (void 0 !== self.weekWrapper
                      ? self.weekWrapper.offsetWidth
                      : 0) +
                    "px"),
                  self.calendarContainer.style.removeProperty("visibility"),
                  self.calendarContainer.style.removeProperty("display");
              }
            }));
      }
      function updateTime(e) {
        if (0 === self.selectedDates.length) {
          var defaultDate =
              void 0 === self.config.minDate ||
              compareDates(new Date(), self.config.minDate) >= 0
                ? new Date()
                : new Date(self.config.minDate.getTime()),
            defaults = getDefaultHours(self.config);
          defaultDate.setHours(
            defaults.hours,
            defaults.minutes,
            defaults.seconds,
            defaultDate.getMilliseconds()
          ),
            (self.selectedDates = [defaultDate]),
            (self.latestSelectedDateObj = defaultDate);
        }
        void 0 !== e &&
          "blur" !== e.type &&
          (function timeWrapper(e) {
            e.preventDefault();
            var isKeyDown = "keydown" === e.type,
              eventTarget = getEventTarget(e),
              input = eventTarget;
            void 0 !== self.amPM &&
              eventTarget === self.amPM &&
              (self.amPM.textContent =
                self.l10n.amPM[
                  int(self.amPM.textContent === self.l10n.amPM[0])
                ]);
            var min = parseFloat(input.getAttribute("min")),
              max = parseFloat(input.getAttribute("max")),
              step = parseFloat(input.getAttribute("step")),
              curValue = parseInt(input.value, 10),
              delta = e.delta || (isKeyDown ? (38 === e.which ? 1 : -1) : 0),
              newValue = curValue + step * delta;
            if (void 0 !== input.value && 2 === input.value.length) {
              var isHourElem = input === self.hourElement,
                isMinuteElem = input === self.minuteElement;
              newValue < min
                ? ((newValue =
                    max +
                    newValue +
                    int(!isHourElem) +
                    (int(isHourElem) && int(!self.amPM))),
                  isMinuteElem &&
                    incrementNumInput(void 0, -1, self.hourElement))
                : newValue > max &&
                  ((newValue =
                    input === self.hourElement
                      ? newValue - max - int(!self.amPM)
                      : min),
                  isMinuteElem &&
                    incrementNumInput(void 0, 1, self.hourElement)),
                self.amPM &&
                  isHourElem &&
                  (1 === step
                    ? newValue + curValue === 23
                    : Math.abs(newValue - curValue) > step) &&
                  (self.amPM.textContent =
                    self.l10n.amPM[
                      int(self.amPM.textContent === self.l10n.amPM[0])
                    ]),
                (input.value = pad(newValue));
            }
          })(e);
        var prevValue = self._input.value;
        setHoursFromInputs(),
          updateValue(),
          self._input.value !== prevValue && self._debouncedChange();
      }
      function setHoursFromInputs() {
        if (void 0 !== self.hourElement && void 0 !== self.minuteElement) {
          var hours =
              (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24,
            minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60,
            seconds =
              void 0 !== self.secondElement
                ? (parseInt(self.secondElement.value, 10) || 0) % 60
                : 0;
          void 0 !== self.amPM &&
            (hours = (function ampm2military(hour, amPM) {
              return (hour % 12) + 12 * int(amPM === self.l10n.amPM[1]);
            })(hours, self.amPM.textContent));
          var limitMinHours =
            void 0 !== self.config.minTime ||
            (self.config.minDate &&
              self.minDateHasTime &&
              self.latestSelectedDateObj &&
              0 ===
                compareDates(
                  self.latestSelectedDateObj,
                  self.config.minDate,
                  !0
                ));
          if (
            void 0 !== self.config.maxTime ||
            (self.config.maxDate &&
              self.maxDateHasTime &&
              self.latestSelectedDateObj &&
              0 ===
                compareDates(
                  self.latestSelectedDateObj,
                  self.config.maxDate,
                  !0
                ))
          ) {
            var maxTime =
              void 0 !== self.config.maxTime
                ? self.config.maxTime
                : self.config.maxDate;
            (hours = Math.min(hours, maxTime.getHours())) ===
              maxTime.getHours() &&
              (minutes = Math.min(minutes, maxTime.getMinutes())),
              minutes === maxTime.getMinutes() &&
                (seconds = Math.min(seconds, maxTime.getSeconds()));
          }
          if (limitMinHours) {
            var minTime =
              void 0 !== self.config.minTime
                ? self.config.minTime
                : self.config.minDate;
            (hours = Math.max(hours, minTime.getHours())) ===
              minTime.getHours() &&
              minutes < minTime.getMinutes() &&
              (minutes = minTime.getMinutes()),
              minutes === minTime.getMinutes() &&
                (seconds = Math.max(seconds, minTime.getSeconds()));
          }
          setHours(hours, minutes, seconds);
        }
      }
      function setHoursFromDate(dateObj) {
        var date = dateObj || self.latestSelectedDateObj;
        date && setHours(date.getHours(), date.getMinutes(), date.getSeconds());
      }
      function setHours(hours, minutes, seconds) {
        void 0 !== self.latestSelectedDateObj &&
          self.latestSelectedDateObj.setHours(
            hours % 24,
            minutes,
            seconds || 0,
            0
          ),
          self.hourElement &&
            self.minuteElement &&
            !self.isMobile &&
            ((self.hourElement.value = pad(
              self.config.time_24hr
                ? hours
                : ((12 + hours) % 12) + 12 * int(hours % 12 == 0)
            )),
            (self.minuteElement.value = pad(minutes)),
            void 0 !== self.amPM &&
              (self.amPM.textContent = self.l10n.amPM[int(hours >= 12)]),
            void 0 !== self.secondElement &&
              (self.secondElement.value = pad(seconds)));
      }
      function onYearInput(event) {
        var eventTarget = getEventTarget(event),
          year = parseInt(eventTarget.value) + (event.delta || 0);
        (year / 1e3 > 1 ||
          ("Enter" === event.key && !/[^\d]/.test(year.toString()))) &&
          changeYear(year);
      }
      function bind(element, event, handler, options) {
        return event instanceof Array
          ? event.forEach(function (ev) {
              return bind(element, ev, handler, options);
            })
          : element instanceof Array
          ? element.forEach(function (el) {
              return bind(el, event, handler, options);
            })
          : (element.addEventListener(event, handler, options),
            void self._handlers.push({
              remove: function () {
                return element.removeEventListener(event, handler);
              },
            }));
      }
      function triggerChange() {
        triggerEvent("onChange");
      }
      function jumpToDate(jumpDate, triggerChange) {
        var jumpTo =
            void 0 !== jumpDate
              ? self.parseDate(jumpDate)
              : self.latestSelectedDateObj ||
                (self.config.minDate && self.config.minDate > self.now
                  ? self.config.minDate
                  : self.config.maxDate && self.config.maxDate < self.now
                  ? self.config.maxDate
                  : self.now),
          oldYear = self.currentYear,
          oldMonth = self.currentMonth;
        try {
          void 0 !== jumpTo &&
            ((self.currentYear = jumpTo.getFullYear()),
            (self.currentMonth = jumpTo.getMonth()));
        } catch (e) {
          (e.message = "Invalid date supplied: " + jumpTo),
            self.config.errorHandler(e);
        }
        triggerChange &&
          self.currentYear !== oldYear &&
          (triggerEvent("onYearChange"), buildMonthSwitch()),
          !triggerChange ||
            (self.currentYear === oldYear && self.currentMonth === oldMonth) ||
            triggerEvent("onMonthChange"),
          self.redraw();
      }
      function timeIncrement(e) {
        var eventTarget = getEventTarget(e);
        ~eventTarget.className.indexOf("arrow") &&
          incrementNumInput(
            e,
            eventTarget.classList.contains("arrowUp") ? 1 : -1
          );
      }
      function incrementNumInput(e, delta, inputElem) {
        var target = e && getEventTarget(e),
          input =
            inputElem ||
            (target && target.parentNode && target.parentNode.firstChild),
          event = createEvent("increment");
        (event.delta = delta), input && input.dispatchEvent(event);
      }
      function createDay(className, date, dayNumber, i) {
        var dateIsEnabled = isEnabled(date, !0),
          dayElement = createElement(
            "span",
            "flatpickr-day " + className,
            date.getDate().toString()
          );
        return (
          (dayElement.dateObj = date),
          (dayElement.$i = i),
          dayElement.setAttribute(
            "aria-label",
            self.formatDate(date, self.config.ariaDateFormat)
          ),
          -1 === className.indexOf("hidden") &&
            0 === compareDates(date, self.now) &&
            ((self.todayDateElem = dayElement),
            dayElement.classList.add("today"),
            dayElement.setAttribute("aria-current", "date")),
          dateIsEnabled
            ? ((dayElement.tabIndex = -1),
              isDateSelected(date) &&
                (dayElement.classList.add("selected"),
                (self.selectedDateElem = dayElement),
                "range" === self.config.mode &&
                  (toggleClass(
                    dayElement,
                    "startRange",
                    self.selectedDates[0] &&
                      0 === compareDates(date, self.selectedDates[0], !0)
                  ),
                  toggleClass(
                    dayElement,
                    "endRange",
                    self.selectedDates[1] &&
                      0 === compareDates(date, self.selectedDates[1], !0)
                  ),
                  "nextMonthDay" === className &&
                    dayElement.classList.add("inRange"))))
            : dayElement.classList.add("flatpickr-disabled"),
          "range" === self.config.mode &&
            (function isDateInRange(date) {
              return (
                !(
                  "range" !== self.config.mode || self.selectedDates.length < 2
                ) &&
                compareDates(date, self.selectedDates[0]) >= 0 &&
                compareDates(date, self.selectedDates[1]) <= 0
              );
            })(date) &&
            !isDateSelected(date) &&
            dayElement.classList.add("inRange"),
          self.weekNumbers &&
            1 === self.config.showMonths &&
            "prevMonthDay" !== className &&
            dayNumber % 7 == 1 &&
            self.weekNumbers.insertAdjacentHTML(
              "beforeend",
              "<span class='flatpickr-day'>" +
                self.config.getWeek(date) +
                "</span>"
            ),
          triggerEvent("onDayCreate", dayElement),
          dayElement
        );
      }
      function focusOnDayElem(targetNode) {
        targetNode.focus(),
          "range" === self.config.mode && onMouseOver(targetNode);
      }
      function getFirstAvailableDay(delta) {
        for (
          var startMonth = delta > 0 ? 0 : self.config.showMonths - 1,
            endMonth = delta > 0 ? self.config.showMonths : -1,
            m = startMonth;
          m != endMonth;
          m += delta
        )
          for (
            var month = self.daysContainer.children[m],
              startIndex = delta > 0 ? 0 : month.children.length - 1,
              endIndex = delta > 0 ? month.children.length : -1,
              i = startIndex;
            i != endIndex;
            i += delta
          ) {
            var c = month.children[i];
            if (-1 === c.className.indexOf("hidden") && isEnabled(c.dateObj))
              return c;
          }
      }
      function focusOnDay(current, offset) {
        var dayFocused = isInView(document.activeElement || document.body),
          startElem =
            void 0 !== current
              ? current
              : dayFocused
              ? document.activeElement
              : void 0 !== self.selectedDateElem &&
                isInView(self.selectedDateElem)
              ? self.selectedDateElem
              : void 0 !== self.todayDateElem && isInView(self.todayDateElem)
              ? self.todayDateElem
              : getFirstAvailableDay(offset > 0 ? 1 : -1);
        void 0 === startElem
          ? self._input.focus()
          : dayFocused
          ? (function getNextAvailableDay(current, delta) {
              for (
                var givenMonth =
                    -1 === current.className.indexOf("Month")
                      ? current.dateObj.getMonth()
                      : self.currentMonth,
                  endMonth = delta > 0 ? self.config.showMonths : -1,
                  loopDelta = delta > 0 ? 1 : -1,
                  m = givenMonth - self.currentMonth;
                m != endMonth;
                m += loopDelta
              )
                for (
                  var month = self.daysContainer.children[m],
                    startIndex =
                      givenMonth - self.currentMonth === m
                        ? current.$i + delta
                        : delta < 0
                        ? month.children.length - 1
                        : 0,
                    numMonthDays = month.children.length,
                    i = startIndex;
                  i >= 0 &&
                  i < numMonthDays &&
                  i != (delta > 0 ? numMonthDays : -1);
                  i += loopDelta
                ) {
                  var c = month.children[i];
                  if (
                    -1 === c.className.indexOf("hidden") &&
                    isEnabled(c.dateObj) &&
                    Math.abs(current.$i - i) >= Math.abs(delta)
                  )
                    return focusOnDayElem(c);
                }
              self.changeMonth(loopDelta),
                focusOnDay(getFirstAvailableDay(loopDelta), 0);
            })(startElem, offset)
          : focusOnDayElem(startElem);
      }
      function buildMonthDays(year, month) {
        for (
          var firstOfMonth =
              (new Date(year, month, 1).getDay() -
                self.l10n.firstDayOfWeek +
                7) %
              7,
            prevMonthDays = self.utils.getDaysInMonth(
              (month - 1 + 12) % 12,
              year
            ),
            daysInMonth = self.utils.getDaysInMonth(month, year),
            days = window.document.createDocumentFragment(),
            isMultiMonth = self.config.showMonths > 1,
            prevMonthDayClass = isMultiMonth
              ? "prevMonthDay hidden"
              : "prevMonthDay",
            nextMonthDayClass = isMultiMonth
              ? "nextMonthDay hidden"
              : "nextMonthDay",
            dayNumber = prevMonthDays + 1 - firstOfMonth,
            dayIndex = 0;
          dayNumber <= prevMonthDays;
          dayNumber++, dayIndex++
        )
          days.appendChild(
            createDay(
              prevMonthDayClass,
              new Date(year, month - 1, dayNumber),
              dayNumber,
              dayIndex
            )
          );
        for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++)
          days.appendChild(
            createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex)
          );
        for (
          var dayNum = daysInMonth + 1;
          dayNum <= 42 - firstOfMonth &&
          (1 === self.config.showMonths || dayIndex % 7 != 0);
          dayNum++, dayIndex++
        )
          days.appendChild(
            createDay(
              nextMonthDayClass,
              new Date(year, month + 1, dayNum % daysInMonth),
              dayNum,
              dayIndex
            )
          );
        var dayContainer = createElement("div", "dayContainer");
        return dayContainer.appendChild(days), dayContainer;
      }
      function buildDays() {
        if (void 0 !== self.daysContainer) {
          clearNode(self.daysContainer),
            self.weekNumbers && clearNode(self.weekNumbers);
          for (
            var frag = document.createDocumentFragment(), i = 0;
            i < self.config.showMonths;
            i++
          ) {
            var d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i),
              frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
          }
          self.daysContainer.appendChild(frag),
            (self.days = self.daysContainer.firstChild),
            "range" === self.config.mode &&
              1 === self.selectedDates.length &&
              onMouseOver();
        }
      }
      function buildMonthSwitch() {
        if (
          !(
            self.config.showMonths > 1 ||
            "dropdown" !== self.config.monthSelectorType
          )
        ) {
          var shouldBuildMonth = function (month) {
            return (
              !(
                void 0 !== self.config.minDate &&
                self.currentYear === self.config.minDate.getFullYear() &&
                month < self.config.minDate.getMonth()
              ) &&
              !(
                void 0 !== self.config.maxDate &&
                self.currentYear === self.config.maxDate.getFullYear() &&
                month > self.config.maxDate.getMonth()
              )
            );
          };
          (self.monthsDropdownContainer.tabIndex = -1),
            (self.monthsDropdownContainer.innerHTML = "");
          for (var i = 0; i < 12; i++)
            if (shouldBuildMonth(i)) {
              var month = createElement(
                "option",
                "flatpickr-monthDropdown-month"
              );
              (month.value = new Date(self.currentYear, i)
                .getMonth()
                .toString()),
                (month.textContent = monthToStr(
                  i,
                  self.config.shorthandCurrentMonth,
                  self.l10n
                )),
                (month.tabIndex = -1),
                self.currentMonth === i && (month.selected = !0),
                self.monthsDropdownContainer.appendChild(month);
            }
        }
      }
      function buildMonth() {
        var monthElement,
          container = createElement("div", "flatpickr-month"),
          monthNavFragment = window.document.createDocumentFragment();
        self.config.showMonths > 1 || "static" === self.config.monthSelectorType
          ? (monthElement = createElement("span", "cur-month"))
          : ((self.monthsDropdownContainer = createElement(
              "select",
              "flatpickr-monthDropdown-months"
            )),
            self.monthsDropdownContainer.setAttribute(
              "aria-label",
              self.l10n.monthAriaLabel
            ),
            bind(self.monthsDropdownContainer, "change", function (e) {
              var target = getEventTarget(e),
                selectedMonth = parseInt(target.value, 10);
              self.changeMonth(selectedMonth - self.currentMonth),
                triggerEvent("onMonthChange");
            }),
            buildMonthSwitch(),
            (monthElement = self.monthsDropdownContainer));
        var yearInput = createNumberInput("cur-year", { tabindex: "-1" }),
          yearElement = yearInput.getElementsByTagName("input")[0];
        yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel),
          self.config.minDate &&
            yearElement.setAttribute(
              "min",
              self.config.minDate.getFullYear().toString()
            ),
          self.config.maxDate &&
            (yearElement.setAttribute(
              "max",
              self.config.maxDate.getFullYear().toString()
            ),
            (yearElement.disabled =
              !!self.config.minDate &&
              self.config.minDate.getFullYear() ===
                self.config.maxDate.getFullYear()));
        var currentMonth = createElement("div", "flatpickr-current-month");
        return (
          currentMonth.appendChild(monthElement),
          currentMonth.appendChild(yearInput),
          monthNavFragment.appendChild(currentMonth),
          container.appendChild(monthNavFragment),
          {
            container: container,
            yearElement: yearElement,
            monthElement: monthElement,
          }
        );
      }
      function buildMonths() {
        clearNode(self.monthNav),
          self.monthNav.appendChild(self.prevMonthNav),
          self.config.showMonths &&
            ((self.yearElements = []), (self.monthElements = []));
        for (var m = self.config.showMonths; m--; ) {
          var month = buildMonth();
          self.yearElements.push(month.yearElement),
            self.monthElements.push(month.monthElement),
            self.monthNav.appendChild(month.container);
        }
        self.monthNav.appendChild(self.nextMonthNav);
      }
      function buildWeekdays() {
        self.weekdayContainer
          ? clearNode(self.weekdayContainer)
          : (self.weekdayContainer = createElement(
              "div",
              "flatpickr-weekdays"
            ));
        for (var i = self.config.showMonths; i--; ) {
          var container = createElement("div", "flatpickr-weekdaycontainer");
          self.weekdayContainer.appendChild(container);
        }
        return updateWeekdays(), self.weekdayContainer;
      }
      function updateWeekdays() {
        if (self.weekdayContainer) {
          var firstDayOfWeek = self.l10n.firstDayOfWeek,
            weekdays = __spreadArrays(self.l10n.weekdays.shorthand);
          firstDayOfWeek > 0 &&
            firstDayOfWeek < weekdays.length &&
            (weekdays = __spreadArrays(
              weekdays.splice(firstDayOfWeek, weekdays.length),
              weekdays.splice(0, firstDayOfWeek)
            ));
          for (var i = self.config.showMonths; i--; )
            self.weekdayContainer.children[i].innerHTML =
              "\n      <span class='flatpickr-weekday'>\n        " +
              weekdays.join("</span><span class='flatpickr-weekday'>") +
              "\n      </span>\n      ";
        }
      }
      function changeMonth(value, isOffset) {
        void 0 === isOffset && (isOffset = !0);
        var delta = isOffset ? value : value - self.currentMonth;
        (delta < 0 && !0 === self._hidePrevMonthArrow) ||
          (delta > 0 && !0 === self._hideNextMonthArrow) ||
          ((self.currentMonth += delta),
          (self.currentMonth < 0 || self.currentMonth > 11) &&
            ((self.currentYear += self.currentMonth > 11 ? 1 : -1),
            (self.currentMonth = (self.currentMonth + 12) % 12),
            triggerEvent("onYearChange"),
            buildMonthSwitch()),
          buildDays(),
          triggerEvent("onMonthChange"),
          updateNavigationCurrentMonth());
      }
      function isCalendarElem(elem) {
        return (
          !(!self.config.appendTo || !self.config.appendTo.contains(elem)) ||
          self.calendarContainer.contains(elem)
        );
      }
      function documentClick(e) {
        if (self.isOpen && !self.config.inline) {
          var eventTarget_1 = getEventTarget(e),
            isCalendarElement = isCalendarElem(eventTarget_1),
            isInput =
              eventTarget_1 === self.input ||
              eventTarget_1 === self.altInput ||
              self.element.contains(eventTarget_1) ||
              (e.path &&
                e.path.indexOf &&
                (~e.path.indexOf(self.input) ||
                  ~e.path.indexOf(self.altInput))),
            lostFocus =
              "blur" === e.type
                ? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget)
                : !isInput &&
                  !isCalendarElement &&
                  !isCalendarElem(e.relatedTarget),
            isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
              return elem.contains(eventTarget_1);
            });
          lostFocus &&
            isIgnored &&
            (void 0 !== self.timeContainer &&
              void 0 !== self.minuteElement &&
              void 0 !== self.hourElement &&
              "" !== self.input.value &&
              void 0 !== self.input.value &&
              updateTime(),
            self.close(),
            self.config &&
              "range" === self.config.mode &&
              1 === self.selectedDates.length &&
              (self.clear(!1), self.redraw()));
        }
      }
      function changeYear(newYear) {
        if (
          !(
            !newYear ||
            (self.config.minDate &&
              newYear < self.config.minDate.getFullYear()) ||
            (self.config.maxDate && newYear > self.config.maxDate.getFullYear())
          )
        ) {
          var newYearNum = newYear,
            isNewYear = self.currentYear !== newYearNum;
          (self.currentYear = newYearNum || self.currentYear),
            self.config.maxDate &&
            self.currentYear === self.config.maxDate.getFullYear()
              ? (self.currentMonth = Math.min(
                  self.config.maxDate.getMonth(),
                  self.currentMonth
                ))
              : self.config.minDate &&
                self.currentYear === self.config.minDate.getFullYear() &&
                (self.currentMonth = Math.max(
                  self.config.minDate.getMonth(),
                  self.currentMonth
                )),
            isNewYear &&
              (self.redraw(), triggerEvent("onYearChange"), buildMonthSwitch());
        }
      }
      function isEnabled(date, timeless) {
        var _a;
        void 0 === timeless && (timeless = !0);
        var dateToCheck = self.parseDate(date, void 0, timeless);
        if (
          (self.config.minDate &&
            dateToCheck &&
            compareDates(
              dateToCheck,
              self.config.minDate,
              void 0 !== timeless ? timeless : !self.minDateHasTime
            ) < 0) ||
          (self.config.maxDate &&
            dateToCheck &&
            compareDates(
              dateToCheck,
              self.config.maxDate,
              void 0 !== timeless ? timeless : !self.maxDateHasTime
            ) > 0)
        )
          return !1;
        if (!self.config.enable && 0 === self.config.disable.length) return !0;
        if (void 0 === dateToCheck) return !1;
        for (
          var bool = !!self.config.enable,
            array =
              null !== (_a = self.config.enable) && void 0 !== _a
                ? _a
                : self.config.disable,
            i = 0,
            d = void 0;
          i < array.length;
          i++
        ) {
          if ("function" == typeof (d = array[i]) && d(dateToCheck))
            return bool;
          if (
            d instanceof Date &&
            void 0 !== dateToCheck &&
            d.getTime() === dateToCheck.getTime()
          )
            return bool;
          if ("string" == typeof d) {
            var parsed = self.parseDate(d, void 0, !0);
            return parsed && parsed.getTime() === dateToCheck.getTime()
              ? bool
              : !bool;
          }
          if (
            "object" == typeof d &&
            void 0 !== dateToCheck &&
            d.from &&
            d.to &&
            dateToCheck.getTime() >= d.from.getTime() &&
            dateToCheck.getTime() <= d.to.getTime()
          )
            return bool;
        }
        return !bool;
      }
      function isInView(elem) {
        return (
          void 0 !== self.daysContainer &&
          -1 === elem.className.indexOf("hidden") &&
          -1 === elem.className.indexOf("flatpickr-disabled") &&
          self.daysContainer.contains(elem)
        );
      }
      function onBlur(e) {
        !(e.target === self._input) ||
          !(self.selectedDates.length > 0 || self._input.value.length > 0) ||
          (e.relatedTarget && isCalendarElem(e.relatedTarget)) ||
          self.setDate(
            self._input.value,
            !0,
            e.target === self.altInput
              ? self.config.altFormat
              : self.config.dateFormat
          );
      }
      function onKeyDown(e) {
        var eventTarget = getEventTarget(e),
          isInput = self.config.wrap
            ? element.contains(eventTarget)
            : eventTarget === self._input,
          allowInput = self.config.allowInput,
          allowKeydown = self.isOpen && (!allowInput || !isInput),
          allowInlineKeydown = self.config.inline && isInput && !allowInput;
        if (13 === e.keyCode && isInput) {
          if (allowInput)
            return (
              self.setDate(
                self._input.value,
                !0,
                eventTarget === self.altInput
                  ? self.config.altFormat
                  : self.config.dateFormat
              ),
              eventTarget.blur()
            );
          self.open();
        } else if (
          isCalendarElem(eventTarget) ||
          allowKeydown ||
          allowInlineKeydown
        ) {
          var isTimeObj =
            !!self.timeContainer && self.timeContainer.contains(eventTarget);
          switch (e.keyCode) {
            case 13:
              isTimeObj
                ? (e.preventDefault(), updateTime(), focusAndClose())
                : selectDate(e);
              break;
            case 27:
              e.preventDefault(), focusAndClose();
              break;
            case 8:
            case 46:
              isInput &&
                !self.config.allowInput &&
                (e.preventDefault(), self.clear());
              break;
            case 37:
            case 39:
              if (isTimeObj || isInput)
                self.hourElement && self.hourElement.focus();
              else if (
                (e.preventDefault(),
                void 0 !== self.daysContainer &&
                  (!1 === allowInput ||
                    (document.activeElement &&
                      isInView(document.activeElement))))
              ) {
                var delta_1 = 39 === e.keyCode ? 1 : -1;
                e.ctrlKey
                  ? (e.stopPropagation(),
                    changeMonth(delta_1),
                    focusOnDay(getFirstAvailableDay(1), 0))
                  : focusOnDay(void 0, delta_1);
              }
              break;
            case 38:
            case 40:
              e.preventDefault();
              var delta = 40 === e.keyCode ? 1 : -1;
              (self.daysContainer && void 0 !== eventTarget.$i) ||
              eventTarget === self.input ||
              eventTarget === self.altInput
                ? e.ctrlKey
                  ? (e.stopPropagation(),
                    changeYear(self.currentYear - delta),
                    focusOnDay(getFirstAvailableDay(1), 0))
                  : isTimeObj || focusOnDay(void 0, 7 * delta)
                : eventTarget === self.currentYearElement
                ? changeYear(self.currentYear - delta)
                : self.config.enableTime &&
                  (!isTimeObj && self.hourElement && self.hourElement.focus(),
                  updateTime(e),
                  self._debouncedChange());
              break;
            case 9:
              if (isTimeObj) {
                var elems = [
                    self.hourElement,
                    self.minuteElement,
                    self.secondElement,
                    self.amPM,
                  ]
                    .concat(self.pluginElements)
                    .filter(function (x) {
                      return x;
                    }),
                  i = elems.indexOf(eventTarget);
                if (-1 !== i) {
                  var target = elems[i + (e.shiftKey ? -1 : 1)];
                  e.preventDefault(), (target || self._input).focus();
                }
              } else
                !self.config.noCalendar &&
                  self.daysContainer &&
                  self.daysContainer.contains(eventTarget) &&
                  e.shiftKey &&
                  (e.preventDefault(), self._input.focus());
          }
        }
        if (void 0 !== self.amPM && eventTarget === self.amPM)
          switch (e.key) {
            case self.l10n.amPM[0].charAt(0):
            case self.l10n.amPM[0].charAt(0).toLowerCase():
              (self.amPM.textContent = self.l10n.amPM[0]),
                setHoursFromInputs(),
                updateValue();
              break;
            case self.l10n.amPM[1].charAt(0):
            case self.l10n.amPM[1].charAt(0).toLowerCase():
              (self.amPM.textContent = self.l10n.amPM[1]),
                setHoursFromInputs(),
                updateValue();
          }
        (isInput || isCalendarElem(eventTarget)) &&
          triggerEvent("onKeyDown", e);
      }
      function onMouseOver(elem) {
        if (
          1 === self.selectedDates.length &&
          (!elem ||
            (elem.classList.contains("flatpickr-day") &&
              !elem.classList.contains("flatpickr-disabled")))
        ) {
          for (
            var hoverDate = elem
                ? elem.dateObj.getTime()
                : self.days.firstElementChild.dateObj.getTime(),
              initialDate = self
                .parseDate(self.selectedDates[0], void 0, !0)
                .getTime(),
              rangeStartDate = Math.min(
                hoverDate,
                self.selectedDates[0].getTime()
              ),
              rangeEndDate = Math.max(
                hoverDate,
                self.selectedDates[0].getTime()
              ),
              containsDisabled = !1,
              minRange = 0,
              maxRange = 0,
              t = rangeStartDate;
            t < rangeEndDate;
            t += duration_DAY
          )
            isEnabled(new Date(t), !0) ||
              ((containsDisabled =
                containsDisabled || (t > rangeStartDate && t < rangeEndDate)),
              t < initialDate && (!minRange || t > minRange)
                ? (minRange = t)
                : t > initialDate &&
                  (!maxRange || t < maxRange) &&
                  (maxRange = t));
          for (var m = 0; m < self.config.showMonths; m++)
            for (
              var month = self.daysContainer.children[m],
                _loop_1 = function (i, l) {
                  var ts,
                    ts1,
                    ts2,
                    dayElem = month.children[i],
                    timestamp = dayElem.dateObj.getTime(),
                    outOfRange =
                      (minRange > 0 && timestamp < minRange) ||
                      (maxRange > 0 && timestamp > maxRange);
                  return outOfRange
                    ? (dayElem.classList.add("notAllowed"),
                      ["inRange", "startRange", "endRange"].forEach(function (
                        c
                      ) {
                        dayElem.classList.remove(c);
                      }),
                      "continue")
                    : containsDisabled && !outOfRange
                    ? "continue"
                    : ([
                        "startRange",
                        "inRange",
                        "endRange",
                        "notAllowed",
                      ].forEach(function (c) {
                        dayElem.classList.remove(c);
                      }),
                      void (
                        void 0 !== elem &&
                        (elem.classList.add(
                          hoverDate <= self.selectedDates[0].getTime()
                            ? "startRange"
                            : "endRange"
                        ),
                        initialDate < hoverDate && timestamp === initialDate
                          ? dayElem.classList.add("startRange")
                          : initialDate > hoverDate &&
                            timestamp === initialDate &&
                            dayElem.classList.add("endRange"),
                        timestamp >= minRange &&
                          (0 === maxRange || timestamp <= maxRange) &&
                          ((ts1 = initialDate),
                          (ts2 = hoverDate),
                          (ts = timestamp) > Math.min(ts1, ts2) &&
                            ts < Math.max(ts1, ts2)) &&
                          dayElem.classList.add("inRange"))
                      ));
                },
                i = 0,
                l = month.children.length;
              i < l;
              i++
            )
              _loop_1(i);
        }
      }
      function onResize() {
        !self.isOpen ||
          self.config.static ||
          self.config.inline ||
          positionCalendar();
      }
      function minMaxDateSetter(type) {
        return function (date) {
          var dateObj = (self.config["_" + type + "Date"] = self.parseDate(
              date,
              self.config.dateFormat
            )),
            inverseDateObj =
              self.config["_" + ("min" === type ? "max" : "min") + "Date"];
          void 0 !== dateObj &&
            (self["min" === type ? "minDateHasTime" : "maxDateHasTime"] =
              dateObj.getHours() > 0 ||
              dateObj.getMinutes() > 0 ||
              dateObj.getSeconds() > 0),
            self.selectedDates &&
              ((self.selectedDates = self.selectedDates.filter(function (d) {
                return isEnabled(d);
              })),
              self.selectedDates.length ||
                "min" !== type ||
                setHoursFromDate(dateObj),
              updateValue()),
            self.daysContainer &&
              (redraw(),
              void 0 !== dateObj
                ? (self.currentYearElement[type] = dateObj
                    .getFullYear()
                    .toString())
                : self.currentYearElement.removeAttribute(type),
              (self.currentYearElement.disabled =
                !!inverseDateObj &&
                void 0 !== dateObj &&
                inverseDateObj.getFullYear() === dateObj.getFullYear()));
        };
      }
      function getInputElem() {
        return self.config.wrap
          ? element.querySelector("[data-input]")
          : element;
      }
      function setupLocale() {
        "object" != typeof self.config.locale &&
          void 0 === flatpickr.l10ns[self.config.locale] &&
          self.config.errorHandler(
            new Error("flatpickr: invalid locale " + self.config.locale)
          ),
          (self.l10n = __assign(
            __assign({}, flatpickr.l10ns.default),
            "object" == typeof self.config.locale
              ? self.config.locale
              : "default" !== self.config.locale
              ? flatpickr.l10ns[self.config.locale]
              : void 0
          )),
          (tokenRegex.K =
            "(" +
            self.l10n.amPM[0] +
            "|" +
            self.l10n.amPM[1] +
            "|" +
            self.l10n.amPM[0].toLowerCase() +
            "|" +
            self.l10n.amPM[1].toLowerCase() +
            ")"),
          void 0 ===
            __assign(
              __assign({}, instanceConfig),
              JSON.parse(JSON.stringify(element.dataset || {}))
            ).time_24hr &&
            void 0 === flatpickr.defaultConfig.time_24hr &&
            (self.config.time_24hr = self.l10n.time_24hr),
          (self.formatDate = createDateFormatter(self)),
          (self.parseDate = createDateParser({
            config: self.config,
            l10n: self.l10n,
          }));
      }
      function positionCalendar(customPositionElement) {
        if ("function" != typeof self.config.position) {
          if (void 0 !== self.calendarContainer) {
            triggerEvent("onPreCalendarPosition");
            var positionElement =
                customPositionElement || self._positionElement,
              calendarHeight = Array.prototype.reduce.call(
                self.calendarContainer.children,
                function (acc, child) {
                  return acc + child.offsetHeight;
                },
                0
              ),
              calendarWidth = self.calendarContainer.offsetWidth,
              configPos = self.config.position.split(" "),
              configPosVertical = configPos[0],
              configPosHorizontal = configPos.length > 1 ? configPos[1] : null,
              inputBounds = positionElement.getBoundingClientRect(),
              distanceFromBottom = window.innerHeight - inputBounds.bottom,
              showOnTop =
                "above" === configPosVertical ||
                ("below" !== configPosVertical &&
                  distanceFromBottom < calendarHeight &&
                  inputBounds.top > calendarHeight),
              top =
                window.pageYOffset +
                inputBounds.top +
                (showOnTop
                  ? -calendarHeight - 2
                  : positionElement.offsetHeight + 2);
            if (
              (toggleClass(self.calendarContainer, "arrowTop", !showOnTop),
              toggleClass(self.calendarContainer, "arrowBottom", showOnTop),
              !self.config.inline)
            ) {
              var left = window.pageXOffset + inputBounds.left,
                isCenter = !1,
                isRight = !1;
              "center" === configPosHorizontal
                ? ((left -= (calendarWidth - inputBounds.width) / 2),
                  (isCenter = !0))
                : "right" === configPosHorizontal &&
                  ((left -= calendarWidth - inputBounds.width), (isRight = !0)),
                toggleClass(
                  self.calendarContainer,
                  "arrowLeft",
                  !isCenter && !isRight
                ),
                toggleClass(self.calendarContainer, "arrowCenter", isCenter),
                toggleClass(self.calendarContainer, "arrowRight", isRight);
              var right =
                  window.document.body.offsetWidth -
                  (window.pageXOffset + inputBounds.right),
                rightMost =
                  left + calendarWidth > window.document.body.offsetWidth,
                centerMost =
                  right + calendarWidth > window.document.body.offsetWidth;
              if (
                (toggleClass(self.calendarContainer, "rightMost", rightMost),
                !self.config.static)
              )
                if (
                  ((self.calendarContainer.style.top = top + "px"), rightMost)
                )
                  if (centerMost) {
                    var doc = (function getDocumentStyleSheet() {
                      for (
                        var editableSheet = null, i = 0;
                        i < document.styleSheets.length;
                        i++
                      ) {
                        var sheet = document.styleSheets[i];
                        try {
                          sheet.cssRules;
                        } catch (err) {
                          continue;
                        }
                        editableSheet = sheet;
                        break;
                      }
                      return null != editableSheet
                        ? editableSheet
                        : (function createStyleSheet() {
                            var style = document.createElement("style");
                            return (
                              document.head.appendChild(style), style.sheet
                            );
                          })();
                    })();
                    if (void 0 === doc) return;
                    var bodyWidth = window.document.body.offsetWidth,
                      centerLeft = Math.max(
                        0,
                        bodyWidth / 2 - calendarWidth / 2
                      ),
                      centerIndex = doc.cssRules.length,
                      centerStyle =
                        "{left:" + inputBounds.left + "px;right:auto;}";
                    toggleClass(self.calendarContainer, "rightMost", !1),
                      toggleClass(self.calendarContainer, "centerMost", !0),
                      doc.insertRule(
                        ".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after" +
                          centerStyle,
                        centerIndex
                      ),
                      (self.calendarContainer.style.left = centerLeft + "px"),
                      (self.calendarContainer.style.right = "auto");
                  } else
                    (self.calendarContainer.style.left = "auto"),
                      (self.calendarContainer.style.right = right + "px");
                else
                  (self.calendarContainer.style.left = left + "px"),
                    (self.calendarContainer.style.right = "auto");
            }
          }
        } else self.config.position(self, customPositionElement);
      }
      function redraw() {
        self.config.noCalendar ||
          self.isMobile ||
          (buildMonthSwitch(), updateNavigationCurrentMonth(), buildDays());
      }
      function focusAndClose() {
        self._input.focus(),
          -1 !== window.navigator.userAgent.indexOf("MSIE") ||
          void 0 !== navigator.msMaxTouchPoints
            ? setTimeout(self.close, 0)
            : self.close();
      }
      function selectDate(e) {
        e.preventDefault(), e.stopPropagation();
        var t = findParent(getEventTarget(e), function (day) {
          return (
            day.classList &&
            day.classList.contains("flatpickr-day") &&
            !day.classList.contains("flatpickr-disabled") &&
            !day.classList.contains("notAllowed")
          );
        });
        if (void 0 !== t) {
          var target = t,
            selectedDate = (self.latestSelectedDateObj = new Date(
              target.dateObj.getTime()
            )),
            shouldChangeMonth =
              (selectedDate.getMonth() < self.currentMonth ||
                selectedDate.getMonth() >
                  self.currentMonth + self.config.showMonths - 1) &&
              "range" !== self.config.mode;
          if (((self.selectedDateElem = target), "single" === self.config.mode))
            self.selectedDates = [selectedDate];
          else if ("multiple" === self.config.mode) {
            var selectedIndex = isDateSelected(selectedDate);
            selectedIndex
              ? self.selectedDates.splice(parseInt(selectedIndex), 1)
              : self.selectedDates.push(selectedDate);
          } else
            "range" === self.config.mode &&
              (2 === self.selectedDates.length && self.clear(!1, !1),
              (self.latestSelectedDateObj = selectedDate),
              self.selectedDates.push(selectedDate),
              0 !== compareDates(selectedDate, self.selectedDates[0], !0) &&
                self.selectedDates.sort(function (a, b) {
                  return a.getTime() - b.getTime();
                }));
          if ((setHoursFromInputs(), shouldChangeMonth)) {
            var isNewYear = self.currentYear !== selectedDate.getFullYear();
            (self.currentYear = selectedDate.getFullYear()),
              (self.currentMonth = selectedDate.getMonth()),
              isNewYear && (triggerEvent("onYearChange"), buildMonthSwitch()),
              triggerEvent("onMonthChange");
          }
          if (
            (updateNavigationCurrentMonth(),
            buildDays(),
            updateValue(),
            shouldChangeMonth ||
            "range" === self.config.mode ||
            1 !== self.config.showMonths
              ? void 0 !== self.selectedDateElem &&
                void 0 === self.hourElement &&
                self.selectedDateElem &&
                self.selectedDateElem.focus()
              : focusOnDayElem(target),
            void 0 !== self.hourElement &&
              void 0 !== self.hourElement &&
              self.hourElement.focus(),
            self.config.closeOnSelect)
          ) {
            var single =
                "single" === self.config.mode && !self.config.enableTime,
              range =
                "range" === self.config.mode &&
                2 === self.selectedDates.length &&
                !self.config.enableTime;
            (single || range) && focusAndClose();
          }
          triggerChange();
        }
      }
      (self.parseDate = createDateParser({
        config: self.config,
        l10n: self.l10n,
      })),
        (self._handlers = []),
        (self.pluginElements = []),
        (self.loadedPlugins = []),
        (self._bind = bind),
        (self._setHoursFromDate = setHoursFromDate),
        (self._positionCalendar = positionCalendar),
        (self.changeMonth = changeMonth),
        (self.changeYear = changeYear),
        (self.clear = function clear(triggerChangeEvent, toInitial) {
          void 0 === triggerChangeEvent && (triggerChangeEvent = !0);
          void 0 === toInitial && (toInitial = !0);
          (self.input.value = ""),
            void 0 !== self.altInput && (self.altInput.value = "");
          void 0 !== self.mobileInput && (self.mobileInput.value = "");
          (self.selectedDates = []),
            (self.latestSelectedDateObj = void 0),
            !0 === toInitial &&
              ((self.currentYear = self._initialDate.getFullYear()),
              (self.currentMonth = self._initialDate.getMonth()));
          if (!0 === self.config.enableTime) {
            var _a = getDefaultHours(self.config),
              hours = _a.hours,
              minutes = _a.minutes,
              seconds = _a.seconds;
            setHours(hours, minutes, seconds);
          }
          self.redraw(), triggerChangeEvent && triggerEvent("onChange");
        }),
        (self.close = function close() {
          (self.isOpen = !1),
            self.isMobile ||
              (void 0 !== self.calendarContainer &&
                self.calendarContainer.classList.remove("open"),
              void 0 !== self._input && self._input.classList.remove("active"));
          triggerEvent("onClose");
        }),
        (self._createElement = createElement),
        (self.destroy = function destroy() {
          void 0 !== self.config && triggerEvent("onDestroy");
          for (var i = self._handlers.length; i--; ) self._handlers[i].remove();
          if (((self._handlers = []), self.mobileInput))
            self.mobileInput.parentNode &&
              self.mobileInput.parentNode.removeChild(self.mobileInput),
              (self.mobileInput = void 0);
          else if (self.calendarContainer && self.calendarContainer.parentNode)
            if (self.config.static && self.calendarContainer.parentNode) {
              var wrapper = self.calendarContainer.parentNode;
              if (
                (wrapper.lastChild && wrapper.removeChild(wrapper.lastChild),
                wrapper.parentNode)
              ) {
                for (; wrapper.firstChild; )
                  wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                wrapper.parentNode.removeChild(wrapper);
              }
            } else
              self.calendarContainer.parentNode.removeChild(
                self.calendarContainer
              );
          self.altInput &&
            ((self.input.type = "text"),
            self.altInput.parentNode &&
              self.altInput.parentNode.removeChild(self.altInput),
            delete self.altInput);
          self.input &&
            ((self.input.type = self.input._type),
            self.input.classList.remove("flatpickr-input"),
            self.input.removeAttribute("readonly"));
          [
            "_showTimeInput",
            "latestSelectedDateObj",
            "_hideNextMonthArrow",
            "_hidePrevMonthArrow",
            "__hideNextMonthArrow",
            "__hidePrevMonthArrow",
            "isMobile",
            "isOpen",
            "selectedDateElem",
            "minDateHasTime",
            "maxDateHasTime",
            "days",
            "daysContainer",
            "_input",
            "_positionElement",
            "innerContainer",
            "rContainer",
            "monthNav",
            "todayDateElem",
            "calendarContainer",
            "weekdayContainer",
            "prevMonthNav",
            "nextMonthNav",
            "monthsDropdownContainer",
            "currentMonthElement",
            "currentYearElement",
            "navigationCurrentMonth",
            "selectedDateElem",
            "config",
          ].forEach(function (k) {
            try {
              delete self[k];
            } catch (_) {}
          });
        }),
        (self.isEnabled = isEnabled),
        (self.jumpToDate = jumpToDate),
        (self.open = function open(e, positionElement) {
          void 0 === positionElement &&
            (positionElement = self._positionElement);
          if (!0 === self.isMobile) {
            if (e) {
              e.preventDefault();
              var eventTarget = getEventTarget(e);
              eventTarget && eventTarget.blur();
            }
            return (
              void 0 !== self.mobileInput &&
                (self.mobileInput.focus(), self.mobileInput.click()),
              void triggerEvent("onOpen")
            );
          }
          if (self._input.disabled || self.config.inline) return;
          var wasOpen = self.isOpen;
          (self.isOpen = !0),
            wasOpen ||
              (self.calendarContainer.classList.add("open"),
              self._input.classList.add("active"),
              triggerEvent("onOpen"),
              positionCalendar(positionElement));
          !0 === self.config.enableTime &&
            !0 === self.config.noCalendar &&
            (!1 !== self.config.allowInput ||
              (void 0 !== e && self.timeContainer.contains(e.relatedTarget)) ||
              setTimeout(function () {
                return self.hourElement.select();
              }, 50));
        }),
        (self.redraw = redraw),
        (self.set = function set(option, value) {
          if (null !== option && "object" == typeof option)
            for (var key in (Object.assign(self.config, option), option))
              void 0 !== CALLBACKS[key] &&
                CALLBACKS[key].forEach(function (x) {
                  return x();
                });
          else
            (self.config[option] = value),
              void 0 !== CALLBACKS[option]
                ? CALLBACKS[option].forEach(function (x) {
                    return x();
                  })
                : HOOKS.indexOf(option) > -1 &&
                  (self.config[option] = arrayify(value));
          self.redraw(), updateValue(!0);
        }),
        (self.setDate = function setDate(date, triggerChange, format) {
          void 0 === triggerChange && (triggerChange = !1);
          void 0 === format && (format = self.config.dateFormat);
          if (
            (0 !== date && !date) ||
            (date instanceof Array && 0 === date.length)
          )
            return self.clear(triggerChange);
          setSelectedDate(date, format),
            (self.latestSelectedDateObj =
              self.selectedDates[self.selectedDates.length - 1]),
            self.redraw(),
            jumpToDate(void 0, triggerChange),
            setHoursFromDate(),
            0 === self.selectedDates.length && self.clear(!1);
          updateValue(triggerChange), triggerChange && triggerEvent("onChange");
        }),
        (self.toggle = function toggle(e) {
          if (!0 === self.isOpen) return self.close();
          self.open(e);
        });
      var CALLBACKS = {
        locale: [setupLocale, updateWeekdays],
        showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
        minDate: [jumpToDate],
        maxDate: [jumpToDate],
        clickOpens: [
          function () {
            !0 === self.config.clickOpens
              ? (bind(self._input, "focus", self.open),
                bind(self._input, "click", self.open))
              : (self._input.removeEventListener("focus", self.open),
                self._input.removeEventListener("click", self.open));
          },
        ],
      };
      function setSelectedDate(inputDate, format) {
        var dates = [];
        if (inputDate instanceof Array)
          dates = inputDate.map(function (d) {
            return self.parseDate(d, format);
          });
        else if (inputDate instanceof Date || "number" == typeof inputDate)
          dates = [self.parseDate(inputDate, format)];
        else if ("string" == typeof inputDate)
          switch (self.config.mode) {
            case "single":
            case "time":
              dates = [self.parseDate(inputDate, format)];
              break;
            case "multiple":
              dates = inputDate
                .split(self.config.conjunction)
                .map(function (date) {
                  return self.parseDate(date, format);
                });
              break;
            case "range":
              dates = inputDate
                .split(self.l10n.rangeSeparator)
                .map(function (date) {
                  return self.parseDate(date, format);
                });
          }
        else
          self.config.errorHandler(
            new Error("Invalid date supplied: " + JSON.stringify(inputDate))
          );
        (self.selectedDates = self.config.allowInvalidPreload
          ? dates
          : dates.filter(function (d) {
              return d instanceof Date && isEnabled(d, !1);
            })),
          "range" === self.config.mode &&
            self.selectedDates.sort(function (a, b) {
              return a.getTime() - b.getTime();
            });
      }
      function parseDateRules(arr) {
        return arr
          .slice()
          .map(function (rule) {
            return "string" == typeof rule ||
              "number" == typeof rule ||
              rule instanceof Date
              ? self.parseDate(rule, void 0, !0)
              : rule && "object" == typeof rule && rule.from && rule.to
              ? {
                  from: self.parseDate(rule.from, void 0),
                  to: self.parseDate(rule.to, void 0),
                }
              : rule;
          })
          .filter(function (x) {
            return x;
          });
      }
      function triggerEvent(event, data) {
        if (void 0 !== self.config) {
          var hooks = self.config[event];
          if (void 0 !== hooks && hooks.length > 0)
            for (var i = 0; hooks[i] && i < hooks.length; i++)
              hooks[i](self.selectedDates, self.input.value, self, data);
          "onChange" === event &&
            (self.input.dispatchEvent(createEvent("change")),
            self.input.dispatchEvent(createEvent("input")));
        }
      }
      function createEvent(name) {
        var e = document.createEvent("Event");
        return e.initEvent(name, !0, !0), e;
      }
      function isDateSelected(date) {
        for (var i = 0; i < self.selectedDates.length; i++)
          if (0 === compareDates(self.selectedDates[i], date)) return "" + i;
        return !1;
      }
      function updateNavigationCurrentMonth() {
        self.config.noCalendar ||
          self.isMobile ||
          !self.monthNav ||
          (self.yearElements.forEach(function (yearElement, i) {
            var d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i),
              self.config.showMonths > 1 ||
              "static" === self.config.monthSelectorType
                ? (self.monthElements[i].textContent =
                    monthToStr(
                      d.getMonth(),
                      self.config.shorthandCurrentMonth,
                      self.l10n
                    ) + " ")
                : (self.monthsDropdownContainer.value = d
                    .getMonth()
                    .toString()),
              (yearElement.value = d.getFullYear().toString());
          }),
          (self._hidePrevMonthArrow =
            void 0 !== self.config.minDate &&
            (self.currentYear === self.config.minDate.getFullYear()
              ? self.currentMonth <= self.config.minDate.getMonth()
              : self.currentYear < self.config.minDate.getFullYear())),
          (self._hideNextMonthArrow =
            void 0 !== self.config.maxDate &&
            (self.currentYear === self.config.maxDate.getFullYear()
              ? self.currentMonth + 1 > self.config.maxDate.getMonth()
              : self.currentYear > self.config.maxDate.getFullYear())));
      }
      function getDateStr(format) {
        return self.selectedDates
          .map(function (dObj) {
            return self.formatDate(dObj, format);
          })
          .filter(function (d, i, arr) {
            return (
              "range" !== self.config.mode ||
              self.config.enableTime ||
              arr.indexOf(d) === i
            );
          })
          .join(
            "range" !== self.config.mode
              ? self.config.conjunction
              : self.l10n.rangeSeparator
          );
      }
      function updateValue(triggerChange) {
        void 0 === triggerChange && (triggerChange = !0),
          void 0 !== self.mobileInput &&
            self.mobileFormatStr &&
            (self.mobileInput.value =
              void 0 !== self.latestSelectedDateObj
                ? self.formatDate(
                    self.latestSelectedDateObj,
                    self.mobileFormatStr
                  )
                : ""),
          (self.input.value = getDateStr(self.config.dateFormat)),
          void 0 !== self.altInput &&
            (self.altInput.value = getDateStr(self.config.altFormat)),
          !1 !== triggerChange && triggerEvent("onValueUpdate");
      }
      function onMonthNavClick(e) {
        var eventTarget = getEventTarget(e),
          isPrevMonth = self.prevMonthNav.contains(eventTarget),
          isNextMonth = self.nextMonthNav.contains(eventTarget);
        isPrevMonth || isNextMonth
          ? changeMonth(isPrevMonth ? -1 : 1)
          : self.yearElements.indexOf(eventTarget) >= 0
          ? eventTarget.select()
          : eventTarget.classList.contains("arrowUp")
          ? self.changeYear(self.currentYear + 1)
          : eventTarget.classList.contains("arrowDown") &&
            self.changeYear(self.currentYear - 1);
      }
      return (
        (function init() {
          (self.element = self.input = element),
            (self.isOpen = !1),
            (function parseConfig() {
              var boolOpts = [
                  "wrap",
                  "weekNumbers",
                  "allowInput",
                  "allowInvalidPreload",
                  "clickOpens",
                  "time_24hr",
                  "enableTime",
                  "noCalendar",
                  "altInput",
                  "shorthandCurrentMonth",
                  "inline",
                  "static",
                  "enableSeconds",
                  "disableMobile",
                ],
                userConfig = __assign(
                  __assign(
                    {},
                    JSON.parse(JSON.stringify(element.dataset || {}))
                  ),
                  instanceConfig
                ),
                formats = {};
              (self.config.parseDate = userConfig.parseDate),
                (self.config.formatDate = userConfig.formatDate),
                Object.defineProperty(self.config, "enable", {
                  get: function () {
                    return self.config._enable;
                  },
                  set: function (dates) {
                    self.config._enable = parseDateRules(dates);
                  },
                }),
                Object.defineProperty(self.config, "disable", {
                  get: function () {
                    return self.config._disable;
                  },
                  set: function (dates) {
                    self.config._disable = parseDateRules(dates);
                  },
                });
              var timeMode = "time" === userConfig.mode;
              if (
                !userConfig.dateFormat &&
                (userConfig.enableTime || timeMode)
              ) {
                var defaultDateFormat =
                  flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
                formats.dateFormat =
                  userConfig.noCalendar || timeMode
                    ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                    : defaultDateFormat +
                      " H:i" +
                      (userConfig.enableSeconds ? ":S" : "");
              }
              if (
                userConfig.altInput &&
                (userConfig.enableTime || timeMode) &&
                !userConfig.altFormat
              ) {
                var defaultAltFormat =
                  flatpickr.defaultConfig.altFormat || defaults.altFormat;
                formats.altFormat =
                  userConfig.noCalendar || timeMode
                    ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                    : defaultAltFormat +
                      " h:i" +
                      (userConfig.enableSeconds ? ":S" : "") +
                      " K";
              }
              Object.defineProperty(self.config, "minDate", {
                get: function () {
                  return self.config._minDate;
                },
                set: minMaxDateSetter("min"),
              }),
                Object.defineProperty(self.config, "maxDate", {
                  get: function () {
                    return self.config._maxDate;
                  },
                  set: minMaxDateSetter("max"),
                });
              var minMaxTimeSetter = function (type) {
                return function (val) {
                  self.config["min" === type ? "_minTime" : "_maxTime"] =
                    self.parseDate(val, "H:i:S");
                };
              };
              Object.defineProperty(self.config, "minTime", {
                get: function () {
                  return self.config._minTime;
                },
                set: minMaxTimeSetter("min"),
              }),
                Object.defineProperty(self.config, "maxTime", {
                  get: function () {
                    return self.config._maxTime;
                  },
                  set: minMaxTimeSetter("max"),
                }),
                "time" === userConfig.mode &&
                  ((self.config.noCalendar = !0),
                  (self.config.enableTime = !0));
              Object.assign(self.config, formats, userConfig);
              for (var i = 0; i < boolOpts.length; i++)
                self.config[boolOpts[i]] =
                  !0 === self.config[boolOpts[i]] ||
                  "true" === self.config[boolOpts[i]];
              HOOKS.filter(function (hook) {
                return void 0 !== self.config[hook];
              }).forEach(function (hook) {
                self.config[hook] = arrayify(self.config[hook] || []).map(
                  bindToInstance
                );
              }),
                (self.isMobile =
                  !self.config.disableMobile &&
                  !self.config.inline &&
                  "single" === self.config.mode &&
                  !self.config.disable.length &&
                  !self.config.enable &&
                  !self.config.weekNumbers &&
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                  ));
              for (i = 0; i < self.config.plugins.length; i++) {
                var pluginConf = self.config.plugins[i](self) || {};
                for (var key in pluginConf)
                  HOOKS.indexOf(key) > -1
                    ? (self.config[key] = arrayify(pluginConf[key])
                        .map(bindToInstance)
                        .concat(self.config[key]))
                    : void 0 === userConfig[key] &&
                      (self.config[key] = pluginConf[key]);
              }
              userConfig.altInputClass ||
                (self.config.altInputClass =
                  getInputElem().className + " " + self.config.altInputClass);
              triggerEvent("onParseConfig");
            })(),
            setupLocale(),
            (function setupInputs() {
              if (((self.input = getInputElem()), !self.input))
                return void self.config.errorHandler(
                  new Error("Invalid input element specified")
                );
              (self.input._type = self.input.type),
                (self.input.type = "text"),
                self.input.classList.add("flatpickr-input"),
                (self._input = self.input),
                self.config.altInput &&
                  ((self.altInput = createElement(
                    self.input.nodeName,
                    self.config.altInputClass
                  )),
                  (self._input = self.altInput),
                  (self.altInput.placeholder = self.input.placeholder),
                  (self.altInput.disabled = self.input.disabled),
                  (self.altInput.required = self.input.required),
                  (self.altInput.tabIndex = self.input.tabIndex),
                  (self.altInput.type = "text"),
                  self.input.setAttribute("type", "hidden"),
                  !self.config.static &&
                    self.input.parentNode &&
                    self.input.parentNode.insertBefore(
                      self.altInput,
                      self.input.nextSibling
                    ));
              self.config.allowInput ||
                self._input.setAttribute("readonly", "readonly");
              self._positionElement =
                self.config.positionElement || self._input;
            })(),
            (function setupDates() {
              (self.selectedDates = []),
                (self.now = self.parseDate(self.config.now) || new Date());
              var preloadedDate =
                self.config.defaultDate ||
                (("INPUT" !== self.input.nodeName &&
                  "TEXTAREA" !== self.input.nodeName) ||
                !self.input.placeholder ||
                self.input.value !== self.input.placeholder
                  ? self.input.value
                  : null);
              preloadedDate &&
                setSelectedDate(preloadedDate, self.config.dateFormat);
              (self._initialDate =
                self.selectedDates.length > 0
                  ? self.selectedDates[0]
                  : self.config.minDate &&
                    self.config.minDate.getTime() > self.now.getTime()
                  ? self.config.minDate
                  : self.config.maxDate &&
                    self.config.maxDate.getTime() < self.now.getTime()
                  ? self.config.maxDate
                  : self.now),
                (self.currentYear = self._initialDate.getFullYear()),
                (self.currentMonth = self._initialDate.getMonth()),
                self.selectedDates.length > 0 &&
                  (self.latestSelectedDateObj = self.selectedDates[0]);
              void 0 !== self.config.minTime &&
                (self.config.minTime = self.parseDate(
                  self.config.minTime,
                  "H:i"
                ));
              void 0 !== self.config.maxTime &&
                (self.config.maxTime = self.parseDate(
                  self.config.maxTime,
                  "H:i"
                ));
              (self.minDateHasTime =
                !!self.config.minDate &&
                (self.config.minDate.getHours() > 0 ||
                  self.config.minDate.getMinutes() > 0 ||
                  self.config.minDate.getSeconds() > 0)),
                (self.maxDateHasTime =
                  !!self.config.maxDate &&
                  (self.config.maxDate.getHours() > 0 ||
                    self.config.maxDate.getMinutes() > 0 ||
                    self.config.maxDate.getSeconds() > 0));
            })(),
            (function setupHelperFunctions() {
              self.utils = {
                getDaysInMonth: function (month, yr) {
                  return (
                    void 0 === month && (month = self.currentMonth),
                    void 0 === yr && (yr = self.currentYear),
                    1 === month &&
                    ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0)
                      ? 29
                      : self.l10n.daysInMonth[month]
                  );
                },
              };
            })(),
            self.isMobile ||
              (function build() {
                var fragment = window.document.createDocumentFragment();
                if (
                  ((self.calendarContainer = createElement(
                    "div",
                    "flatpickr-calendar"
                  )),
                  (self.calendarContainer.tabIndex = -1),
                  !self.config.noCalendar)
                ) {
                  if (
                    (fragment.appendChild(
                      (function buildMonthNav() {
                        return (
                          (self.monthNav = createElement(
                            "div",
                            "flatpickr-months"
                          )),
                          (self.yearElements = []),
                          (self.monthElements = []),
                          (self.prevMonthNav = createElement(
                            "span",
                            "flatpickr-prev-month"
                          )),
                          (self.prevMonthNav.innerHTML = self.config.prevArrow),
                          (self.nextMonthNav = createElement(
                            "span",
                            "flatpickr-next-month"
                          )),
                          (self.nextMonthNav.innerHTML = self.config.nextArrow),
                          buildMonths(),
                          Object.defineProperty(self, "_hidePrevMonthArrow", {
                            get: function () {
                              return self.__hidePrevMonthArrow;
                            },
                            set: function (bool) {
                              self.__hidePrevMonthArrow !== bool &&
                                (toggleClass(
                                  self.prevMonthNav,
                                  "flatpickr-disabled",
                                  bool
                                ),
                                (self.__hidePrevMonthArrow = bool));
                            },
                          }),
                          Object.defineProperty(self, "_hideNextMonthArrow", {
                            get: function () {
                              return self.__hideNextMonthArrow;
                            },
                            set: function (bool) {
                              self.__hideNextMonthArrow !== bool &&
                                (toggleClass(
                                  self.nextMonthNav,
                                  "flatpickr-disabled",
                                  bool
                                ),
                                (self.__hideNextMonthArrow = bool));
                            },
                          }),
                          (self.currentYearElement = self.yearElements[0]),
                          updateNavigationCurrentMonth(),
                          self.monthNav
                        );
                      })()
                    ),
                    (self.innerContainer = createElement(
                      "div",
                      "flatpickr-innerContainer"
                    )),
                    self.config.weekNumbers)
                  ) {
                    var _a = (function buildWeeks() {
                        self.calendarContainer.classList.add("hasWeeks");
                        var weekWrapper = createElement(
                          "div",
                          "flatpickr-weekwrapper"
                        );
                        weekWrapper.appendChild(
                          createElement(
                            "span",
                            "flatpickr-weekday",
                            self.l10n.weekAbbreviation
                          )
                        );
                        var weekNumbers = createElement(
                          "div",
                          "flatpickr-weeks"
                        );
                        return (
                          weekWrapper.appendChild(weekNumbers),
                          { weekWrapper: weekWrapper, weekNumbers: weekNumbers }
                        );
                      })(),
                      weekWrapper = _a.weekWrapper,
                      weekNumbers = _a.weekNumbers;
                    self.innerContainer.appendChild(weekWrapper),
                      (self.weekNumbers = weekNumbers),
                      (self.weekWrapper = weekWrapper);
                  }
                  (self.rContainer = createElement(
                    "div",
                    "flatpickr-rContainer"
                  )),
                    self.rContainer.appendChild(buildWeekdays()),
                    self.daysContainer ||
                      ((self.daysContainer = createElement(
                        "div",
                        "flatpickr-days"
                      )),
                      (self.daysContainer.tabIndex = -1)),
                    buildDays(),
                    self.rContainer.appendChild(self.daysContainer),
                    self.innerContainer.appendChild(self.rContainer),
                    fragment.appendChild(self.innerContainer);
                }
                self.config.enableTime &&
                  fragment.appendChild(
                    (function buildTime() {
                      self.calendarContainer.classList.add("hasTime"),
                        self.config.noCalendar &&
                          self.calendarContainer.classList.add("noCalendar");
                      var defaults = getDefaultHours(self.config);
                      (self.timeContainer = createElement(
                        "div",
                        "flatpickr-time"
                      )),
                        (self.timeContainer.tabIndex = -1);
                      var separator = createElement(
                          "span",
                          "flatpickr-time-separator",
                          ":"
                        ),
                        hourInput = createNumberInput("flatpickr-hour", {
                          "aria-label": self.l10n.hourAriaLabel,
                        });
                      self.hourElement =
                        hourInput.getElementsByTagName("input")[0];
                      var minuteInput = createNumberInput("flatpickr-minute", {
                        "aria-label": self.l10n.minuteAriaLabel,
                      });
                      (self.minuteElement =
                        minuteInput.getElementsByTagName("input")[0]),
                        (self.hourElement.tabIndex =
                          self.minuteElement.tabIndex =
                            -1),
                        (self.hourElement.value = pad(
                          self.latestSelectedDateObj
                            ? self.latestSelectedDateObj.getHours()
                            : self.config.time_24hr
                            ? defaults.hours
                            : (function military2ampm(hour) {
                                switch (hour % 24) {
                                  case 0:
                                  case 12:
                                    return 12;
                                  default:
                                    return hour % 12;
                                }
                              })(defaults.hours)
                        )),
                        (self.minuteElement.value = pad(
                          self.latestSelectedDateObj
                            ? self.latestSelectedDateObj.getMinutes()
                            : defaults.minutes
                        )),
                        self.hourElement.setAttribute(
                          "step",
                          self.config.hourIncrement.toString()
                        ),
                        self.minuteElement.setAttribute(
                          "step",
                          self.config.minuteIncrement.toString()
                        ),
                        self.hourElement.setAttribute(
                          "min",
                          self.config.time_24hr ? "0" : "1"
                        ),
                        self.hourElement.setAttribute(
                          "max",
                          self.config.time_24hr ? "23" : "12"
                        ),
                        self.hourElement.setAttribute("maxlength", "2"),
                        self.minuteElement.setAttribute("min", "0"),
                        self.minuteElement.setAttribute("max", "59"),
                        self.minuteElement.setAttribute("maxlength", "2"),
                        self.timeContainer.appendChild(hourInput),
                        self.timeContainer.appendChild(separator),
                        self.timeContainer.appendChild(minuteInput),
                        self.config.time_24hr &&
                          self.timeContainer.classList.add("time24hr");
                      if (self.config.enableSeconds) {
                        self.timeContainer.classList.add("hasSeconds");
                        var secondInput = createNumberInput("flatpickr-second");
                        (self.secondElement =
                          secondInput.getElementsByTagName("input")[0]),
                          (self.secondElement.value = pad(
                            self.latestSelectedDateObj
                              ? self.latestSelectedDateObj.getSeconds()
                              : defaults.seconds
                          )),
                          self.secondElement.setAttribute(
                            "step",
                            self.minuteElement.getAttribute("step")
                          ),
                          self.secondElement.setAttribute("min", "0"),
                          self.secondElement.setAttribute("max", "59"),
                          self.secondElement.setAttribute("maxlength", "2"),
                          self.timeContainer.appendChild(
                            createElement(
                              "span",
                              "flatpickr-time-separator",
                              ":"
                            )
                          ),
                          self.timeContainer.appendChild(secondInput);
                      }
                      self.config.time_24hr ||
                        ((self.amPM = createElement(
                          "span",
                          "flatpickr-am-pm",
                          self.l10n.amPM[
                            int(
                              (self.latestSelectedDateObj
                                ? self.hourElement.value
                                : self.config.defaultHour) > 11
                            )
                          ]
                        )),
                        (self.amPM.title = self.l10n.toggleTitle),
                        (self.amPM.tabIndex = -1),
                        self.timeContainer.appendChild(self.amPM));
                      return self.timeContainer;
                    })()
                  );
                toggleClass(
                  self.calendarContainer,
                  "rangeMode",
                  "range" === self.config.mode
                ),
                  toggleClass(
                    self.calendarContainer,
                    "animate",
                    !0 === self.config.animate
                  ),
                  toggleClass(
                    self.calendarContainer,
                    "multiMonth",
                    self.config.showMonths > 1
                  ),
                  self.calendarContainer.appendChild(fragment);
                var customAppend =
                  void 0 !== self.config.appendTo &&
                  void 0 !== self.config.appendTo.nodeType;
                if (
                  (self.config.inline || self.config.static) &&
                  (self.calendarContainer.classList.add(
                    self.config.inline ? "inline" : "static"
                  ),
                  self.config.inline &&
                    (!customAppend && self.element.parentNode
                      ? self.element.parentNode.insertBefore(
                          self.calendarContainer,
                          self._input.nextSibling
                        )
                      : void 0 !== self.config.appendTo &&
                        self.config.appendTo.appendChild(
                          self.calendarContainer
                        )),
                  self.config.static)
                ) {
                  var wrapper = createElement("div", "flatpickr-wrapper");
                  self.element.parentNode &&
                    self.element.parentNode.insertBefore(wrapper, self.element),
                    wrapper.appendChild(self.element),
                    self.altInput && wrapper.appendChild(self.altInput),
                    wrapper.appendChild(self.calendarContainer);
                }
                self.config.static ||
                  self.config.inline ||
                  (void 0 !== self.config.appendTo
                    ? self.config.appendTo
                    : window.document.body
                  ).appendChild(self.calendarContainer);
              })(),
            (function bindEvents() {
              self.config.wrap &&
                ["open", "close", "toggle", "clear"].forEach(function (evt) {
                  Array.prototype.forEach.call(
                    self.element.querySelectorAll("[data-" + evt + "]"),
                    function (el) {
                      return bind(el, "click", self[evt]);
                    }
                  );
                });
              if (self.isMobile)
                return void (function setupMobile() {
                  var inputType = self.config.enableTime
                    ? self.config.noCalendar
                      ? "time"
                      : "datetime-local"
                    : "date";
                  (self.mobileInput = createElement(
                    "input",
                    self.input.className + " flatpickr-mobile"
                  )),
                    (self.mobileInput.tabIndex = 1),
                    (self.mobileInput.type = inputType),
                    (self.mobileInput.disabled = self.input.disabled),
                    (self.mobileInput.required = self.input.required),
                    (self.mobileInput.placeholder = self.input.placeholder),
                    (self.mobileFormatStr =
                      "datetime-local" === inputType
                        ? "Y-m-d\\TH:i:S"
                        : "date" === inputType
                        ? "Y-m-d"
                        : "H:i:S"),
                    self.selectedDates.length > 0 &&
                      (self.mobileInput.defaultValue = self.mobileInput.value =
                        self.formatDate(
                          self.selectedDates[0],
                          self.mobileFormatStr
                        ));
                  self.config.minDate &&
                    (self.mobileInput.min = self.formatDate(
                      self.config.minDate,
                      "Y-m-d"
                    ));
                  self.config.maxDate &&
                    (self.mobileInput.max = self.formatDate(
                      self.config.maxDate,
                      "Y-m-d"
                    ));
                  self.input.getAttribute("step") &&
                    (self.mobileInput.step = String(
                      self.input.getAttribute("step")
                    ));
                  (self.input.type = "hidden"),
                    void 0 !== self.altInput && (self.altInput.type = "hidden");
                  try {
                    self.input.parentNode &&
                      self.input.parentNode.insertBefore(
                        self.mobileInput,
                        self.input.nextSibling
                      );
                  } catch (_a) {}
                  bind(self.mobileInput, "change", function (e) {
                    self.setDate(
                      getEventTarget(e).value,
                      !1,
                      self.mobileFormatStr
                    ),
                      triggerEvent("onChange"),
                      triggerEvent("onClose");
                  });
                })();
              var debouncedResize = debounce(onResize, 50);
              (self._debouncedChange = debounce(triggerChange, 300)),
                self.daysContainer &&
                  !/iPhone|iPad|iPod/i.test(navigator.userAgent) &&
                  bind(self.daysContainer, "mouseover", function (e) {
                    "range" === self.config.mode &&
                      onMouseOver(getEventTarget(e));
                  });
              bind(window.document.body, "keydown", onKeyDown),
                self.config.inline ||
                  self.config.static ||
                  bind(window, "resize", debouncedResize);
              void 0 !== window.ontouchstart
                ? bind(window.document, "touchstart", documentClick)
                : bind(window.document, "mousedown", documentClick);
              bind(window.document, "focus", documentClick, { capture: !0 }),
                !0 === self.config.clickOpens &&
                  (bind(self._input, "focus", self.open),
                  bind(self._input, "click", self.open));
              void 0 !== self.daysContainer &&
                (bind(self.monthNav, "click", onMonthNavClick),
                bind(self.monthNav, ["keyup", "increment"], onYearInput),
                bind(self.daysContainer, "click", selectDate));
              if (
                void 0 !== self.timeContainer &&
                void 0 !== self.minuteElement &&
                void 0 !== self.hourElement
              ) {
                var selText = function (e) {
                  return getEventTarget(e).select();
                };
                bind(self.timeContainer, ["increment"], updateTime),
                  bind(self.timeContainer, "blur", updateTime, { capture: !0 }),
                  bind(self.timeContainer, "click", timeIncrement),
                  bind(
                    [self.hourElement, self.minuteElement],
                    ["focus", "click"],
                    selText
                  ),
                  void 0 !== self.secondElement &&
                    bind(self.secondElement, "focus", function () {
                      return self.secondElement && self.secondElement.select();
                    }),
                  void 0 !== self.amPM &&
                    bind(self.amPM, "click", function (e) {
                      updateTime(e), triggerChange();
                    });
              }
              self.config.allowInput && bind(self._input, "blur", onBlur);
            })(),
            (self.selectedDates.length || self.config.noCalendar) &&
              (self.config.enableTime &&
                setHoursFromDate(
                  self.config.noCalendar ? self.latestSelectedDateObj : void 0
                ),
              updateValue(!1)),
            setCalendarWidth();
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          !self.isMobile && isSafari && positionCalendar(),
            triggerEvent("onReady");
        })(),
        self
      );
    }
    function _flatpickr(nodeList, config) {
      for (
        var nodes = Array.prototype.slice.call(nodeList).filter(function (x) {
            return x instanceof HTMLElement;
          }),
          instances = [],
          i = 0;
        i < nodes.length;
        i++
      ) {
        var node = nodes[i];
        try {
          if (null !== node.getAttribute("data-fp-omit")) continue;
          void 0 !== node._flatpickr &&
            (node._flatpickr.destroy(), (node._flatpickr = void 0)),
            (node._flatpickr = FlatpickrInstance(node, config || {})),
            instances.push(node._flatpickr);
        } catch (e) {
          console.error(e);
        }
      }
      return 1 === instances.length ? instances[0] : instances;
    }
    "undefined" != typeof HTMLElement &&
      "undefined" != typeof HTMLCollection &&
      "undefined" != typeof NodeList &&
      ((HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr =
        function (config) {
          return _flatpickr(this, config);
        }),
      (HTMLElement.prototype.flatpickr = function (config) {
        return _flatpickr([this], config);
      }));
    var flatpickr = function (selector, config) {
      return "string" == typeof selector
        ? _flatpickr(window.document.querySelectorAll(selector), config)
        : selector instanceof Node
        ? _flatpickr([selector], config)
        : _flatpickr(selector, config);
    };
    return (
      (flatpickr.defaultConfig = {}),
      (flatpickr.l10ns = {
        en: __assign({}, english),
        default: __assign({}, english),
      }),
      (flatpickr.localize = function (l10n) {
        flatpickr.l10ns.default = __assign(
          __assign({}, flatpickr.l10ns.default),
          l10n
        );
      }),
      (flatpickr.setDefaults = function (config) {
        flatpickr.defaultConfig = __assign(
          __assign({}, flatpickr.defaultConfig),
          config
        );
      }),
      (flatpickr.parseDate = createDateParser({})),
      (flatpickr.formatDate = createDateFormatter({})),
      (flatpickr.compareDates = compareDates),
      "undefined" != typeof jQuery &&
        void 0 !== jQuery.fn &&
        (jQuery.fn.flatpickr = function (config) {
          return _flatpickr(this, config);
        }),
      (Date.prototype.fp_incr = function (days) {
        return new Date(
          this.getFullYear(),
          this.getMonth(),
          this.getDate() + ("string" == typeof days ? parseInt(days, 10) : days)
        );
      }),
      "undefined" != typeof window && (window.flatpickr = flatpickr),
      flatpickr
    );
  });
var accordion = (function () {
  var objAccordeon = document.querySelectorAll("#tt-pageContent .js-accordeon"),
    objAccordeonArray = Array.prototype.slice.call(objAccordeon);
  objAccordeon &&
    objAccordeonArray.forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (
          e.target.classList.contains("tt-collapse__title") &&
          e.target.parentNode.classList.contains("tt-show")
        )
          e.target.parentNode.classList.remove("tt-show");
        else if (
          e.target.classList.contains("tt-collapse__title") &&
          !e.target.parentNode.classList.contains("tt-show")
        ) {
          e.target
            .closest(".js-accordeon")
            .querySelectorAll(".tt-collapse__item")
            .forEach(function (el) {
              el.classList.contains("tt-show") &&
                el.classList.remove("tt-show");
            }),
            e.target.parentNode.classList.add("tt-show");
        }
      });
    });
})();
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments,
      later = function () {
        (timeout = null), immediate || func.apply(context, args);
      },
      callNow = immediate && !timeout;
    clearTimeout(timeout),
      (timeout = setTimeout(later, wait)),
      callNow && func.apply(context, args);
  };
}
function validationInit() {
  var formObj = document.querySelectorAll("[data-form='validation']"),
    formObjArray = Array.prototype.slice.call(formObj),
    isSubmit = !1;
  const regExpName = /^[a-z0-9_-]{3,16}$/,
    regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
    regExpNumber = /[0-9]+/;
  function validateItem($this) {
    var value = $this.dataset.validateField,
      wrapperField = $this.parentElement;
    function showError(message) {
      wrapperField.classList.add("error-field"),
        wrapperField.insertAdjacentHTML(
          "beforeend",
          `<div class="error-field__text">${message}</div>`
        ),
        (isSubmit = !1);
    }
    function hideError() {
      ($this.dataset.validateIf = "true"),
        wrapperField.classList.remove("error-field");
      var blockHtml = wrapperField.querySelector(".error-field__text");
      blockHtml && blockHtml.remove(), (isSubmit = !0);
    }
    "name" === value &&
      (regExpName.test($this.value) || "" === $this.value
        ? hideError()
        : showError("Please enter a valid name")),
      "email" === value &&
        (regExpEmail.test($this.value) || "" === $this.value
          ? hideError()
          : showError("Please enter a valid Email")),
      "number" === value &&
        (regExpNumber.test($this.value) || "" === $this.value
          ? hideError()
          : showError("Please enter a valid Telephone")),
      "empty" === value &&
        ("" == $this.value
          ? showError("Please fill in the field")
          : hideError());
  }
  formObjArray &&
    formObjArray.forEach(function (wrapperForm) {
      wrapperForm.addEventListener("submit", function (event) {
        event.preventDefault(),
          (function checkAllFields($target) {
            var formElement = $target
              .closest("form")
              .querySelectorAll("[data-validate-if]");
            Array.prototype.slice.call(formElement).forEach(function (el) {
              "false" === el.dataset.validateIf &&
                (el.parentElement.classList.add("error-field"),
                (isSubmit = !1));
            }),
              (function sendForm($target, wrapperForm) {
                if (isSubmit) {
                  var formData = new FormData(wrapperForm),
                    request = new XMLHttpRequest(),
                    srcHandler = wrapperForm.dataset.srcHandler;
                  request.open("POST", srcHandler),
                    console.dir("formData = " + formData),
                    request.send(formData),
                    wrapperForm.reset(),
                    document.body.classList.contains("show-modal")
                      ? (function closeModal() {
                          document.body;
                          var objModal =
                              document.querySelector(".tt-modal__open"),
                            objModalMessage =
                              objModal.querySelector(".tt-modal-message"),
                            objModalClose =
                              objModal.querySelector(".tt-modal__close");
                          objModalMessage &&
                            objModalMessage.classList.add("tt-active");
                          setTimeout(function () {
                            objModalMessage &&
                              objModalMessage.classList.remove("tt-active"),
                              objModalClose && objModalClose.click();
                          }, 1600);
                        })()
                      : (function showMessageSuccessful(wrapperForm) {
                          (objModalMessage =
                            wrapperForm.querySelector(".tt-modal-message")),
                            objModalMessage.classList.add("tt-active"),
                            setTimeout(function () {
                              objModalMessage.classList.remove("tt-active");
                            }, 1600);
                        })(wrapperForm);
                }
              })(0, wrapperForm);
          })(event.target);
      }),
        /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
          (function checkingEnteredValues(wrapperForm) {
            for (var item of wrapperForm)
              item.dataset.validateField &&
                ((item.dataset.validateIf = !1),
                item.addEventListener("blur", function () {
                  validateItem(this);
                }));
          })(wrapperForm);
    });
}
!(function () {
  function alignLayout() {
    var objWraper = document.querySelectorAll(
        "#tt-pageContent .js-align-layout"
      ),
      objWraperArray = Array.prototype.slice.call(objWraper);
    objWraper &&
      objWraperArray.forEach(function (item) {
        item
          .querySelectorAll(".js-align-layout__item")
          .forEach(function (element) {
            element.removeAttribute("style");
          });
        var heightOffset = 0;
        item
          .querySelectorAll(".js-align-layout__item")
          .forEach(function (element) {
            (height = (function getAbsoluteHeight(el) {
              el = "string" == typeof el ? document.querySelector(el) : el;
              window.getComputedStyle(el);
              return el.offsetHeight;
            })(element)),
              height > heightOffset && (heightOffset = height);
          }),
          item
            .querySelectorAll(".js-align-layout__item")
            .forEach(function (element) {
              element.style.minHeight = heightOffset + "px";
            });
      });
  }
  var timer01;
  timer01 && clearTimeout(timer01),
    (timer01 = setTimeout(function () {
      alignLayout();
    }, 300)),
    window.addEventListener("resize", function () {
      var timer02;
      timer02 && clearTimeout(timer02),
        (timer02 = setTimeout(function () {
          alignLayout();
        }, 300));
    });
})(),
  (function () {
    var btnTop = document.getElementById("js-backtotop");
    btnTop &&
      (window.addEventListener("scroll", function showBtn() {
        (document.documentElement.scrollTop || document.body.scrollTop) > 1e3
          ? btnTop.classList.add("tt-show")
          : btnTop.classList.remove("tt-show");
      }),
      btnTop.addEventListener("click", function scrollTop() {
        if (!window.pageYOffset > 0) return;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }));
  })(),
  validationInit(),
  flatpickr(".tt-flatpickr", { wrap: !0 }),
  flatpickr(".tt-flatpickr-time", {
    enableTime: !0,
    noCalendar: !0,
    dateFormat: "H:i",
  }),
  flatpickr("#init-calendar", { inline: !0 });
var $body = document.body,
  supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;
!0 === supportsTouch && $body.classList.add("touch-device"),
  /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
    $body.classList.add("is-ios"),
  (function () {
    var giftofspeed = document.createElement("link");
    (giftofspeed.rel = "stylesheet"),
      (giftofspeed.href = "font/style.min.css"),
      (giftofspeed.type = "text/css");
    var godefer = document.getElementsByTagName("link")[0];
    godefer.parentNode.insertBefore(giftofspeed, godefer);
  })(),
  document.addEventListener("lazybeforeunveil", function (e) {
    var bg = e.target.getAttribute("data-bg");
    bg && (e.target.style.backgroundImage = "url(" + bg + ")");
  }),
  (window.lazySizesConfig = window.lazySizesConfig || {}),
  (function (global, factory) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = factory())
      : "function" == typeof define && define.amd
      ? define(factory)
      : ((global = global || self).GLightbox = factory());
  })(this, function () {
    "use strict";
    function _typeof(obj) {
      return (
        (_typeof =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (obj) {
                return typeof obj;
              }
            : function (obj) {
                return obj &&
                  "function" == typeof Symbol &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? "symbol"
                  : typeof obj;
              }),
        _typeof(obj)
      );
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        (descriptor.enumerable = descriptor.enumerable || !1),
          (descriptor.configurable = !0),
          "value" in descriptor && (descriptor.writable = !0),
          Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      return (
        protoProps && _defineProperties(Constructor.prototype, protoProps),
        staticProps && _defineProperties(Constructor, staticProps),
        Constructor
      );
    }
    function _toConsumableArray(arr) {
      return (
        (function _arrayWithoutHoles(arr) {
          if (Array.isArray(arr)) return _arrayLikeToArray(arr);
        })(arr) ||
        (function _iterableToArray(iter) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(iter))
            return Array.from(iter);
        })(arr) ||
        (function _unsupportedIterableToArray(o, minLen) {
          if (!o) return;
          if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          "Object" === n && o.constructor && (n = o.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(o);
          if (
            "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return _arrayLikeToArray(o, minLen);
        })(arr) ||
        (function _nonIterableSpread() {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        })()
      );
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    var uid = Date.now();
    function extend() {
      var extended = {},
        deep = !0,
        i = 0,
        length = arguments.length;
      "[object Boolean]" === Object.prototype.toString.call(arguments[0]) &&
        ((deep = arguments[0]), i++);
      for (
        var merge = function merge(obj) {
          for (var prop in obj)
            Object.prototype.hasOwnProperty.call(obj, prop) &&
              (deep &&
              "[object Object]" === Object.prototype.toString.call(obj[prop])
                ? (extended[prop] = extend(!0, extended[prop], obj[prop]))
                : (extended[prop] = obj[prop]));
        };
        i < length;
        i++
      ) {
        var obj = arguments[i];
        merge(obj);
      }
      return extended;
    }
    function each(collection, callback) {
      if (
        ((isNode(collection) ||
          collection === window ||
          collection === document) &&
          (collection = [collection]),
        isArrayLike(collection) ||
          isObject(collection) ||
          (collection = [collection]),
        0 != size(collection))
      )
        if (isArrayLike(collection) && !isObject(collection))
          for (
            var l = collection.length, i = 0;
            i < l &&
            !1 !== callback.call(collection[i], collection[i], i, collection);
            i++
          );
        else if (isObject(collection))
          for (var key in collection)
            if (
              has(collection, key) &&
              !1 ===
                callback.call(collection[key], collection[key], key, collection)
            )
              break;
    }
    function getNodeEvents(node) {
      var name =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
        fn =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
        cache = (node[uid] = node[uid] || []),
        data = { all: cache, evt: null, found: null };
      return (
        name &&
          fn &&
          size(cache) > 0 &&
          each(cache, function (cl, i) {
            if (cl.eventName == name && cl.fn.toString() == fn.toString())
              return (data.found = !0), (data.evt = i), !1;
          }),
        data
      );
    }
    function addEvent(eventName) {
      var _ref =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        onElement = _ref.onElement,
        withCallback = _ref.withCallback,
        _ref$avoidDuplicate = _ref.avoidDuplicate,
        avoidDuplicate = void 0 === _ref$avoidDuplicate || _ref$avoidDuplicate,
        _ref$once = _ref.once,
        once = void 0 !== _ref$once && _ref$once,
        _ref$useCapture = _ref.useCapture,
        useCapture = void 0 !== _ref$useCapture && _ref$useCapture,
        thisArg = arguments.length > 2 ? arguments[2] : void 0,
        element = onElement || [];
      function handler(event) {
        isFunction(withCallback) && withCallback.call(thisArg, event, this),
          once && handler.destroy();
      }
      return (
        isString(element) && (element = document.querySelectorAll(element)),
        (handler.destroy = function () {
          each(element, function (el) {
            var events = getNodeEvents(el, eventName, handler);
            events.found && events.all.splice(events.evt, 1),
              el.removeEventListener &&
                el.removeEventListener(eventName, handler, useCapture);
          });
        }),
        each(element, function (el) {
          var events = getNodeEvents(el, eventName, handler);
          ((el.addEventListener && avoidDuplicate && !events.found) ||
            !avoidDuplicate) &&
            (el.addEventListener(eventName, handler, useCapture),
            events.all.push({ eventName: eventName, fn: handler }));
        }),
        handler
      );
    }
    function addClass(node, name) {
      each(name.split(" "), function (cl) {
        return node.classList.add(cl);
      });
    }
    function removeClass(node, name) {
      each(name.split(" "), function (cl) {
        return node.classList.remove(cl);
      });
    }
    function hasClass(node, name) {
      return node.classList.contains(name);
    }
    function closest(elem, selector) {
      for (; elem !== document.body; ) {
        if (!(elem = elem.parentElement)) return !1;
        if (
          "function" == typeof elem.matches
            ? elem.matches(selector)
            : elem.msMatchesSelector(selector)
        )
          return elem;
      }
    }
    function animateElement(element) {
      var animation =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        callback =
          arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (!element || "" === animation) return !1;
      if ("none" == animation) return isFunction(callback) && callback(), !1;
      var animationEnd = whichAnimationEvent(),
        animationNames = animation.split(" ");
      each(animationNames, function (name) {
        addClass(element, "g" + name);
      }),
        addEvent(animationEnd, {
          onElement: element,
          avoidDuplicate: !1,
          once: !0,
          withCallback: function withCallback(event, target) {
            each(animationNames, function (name) {
              removeClass(target, "g" + name);
            }),
              isFunction(callback) && callback();
          },
        });
    }
    function cssTransform(node) {
      var translate =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
      if ("" == translate)
        return (
          (node.style.webkitTransform = ""),
          (node.style.MozTransform = ""),
          (node.style.msTransform = ""),
          (node.style.OTransform = ""),
          (node.style.transform = ""),
          !1
        );
      (node.style.webkitTransform = translate),
        (node.style.MozTransform = translate),
        (node.style.msTransform = translate),
        (node.style.OTransform = translate),
        (node.style.transform = translate);
    }
    function show(element) {
      element.style.display = "block";
    }
    function hide(element) {
      element.style.display = "none";
    }
    function createHTML(htmlStr) {
      var frag = document.createDocumentFragment(),
        temp = document.createElement("div");
      for (temp.innerHTML = htmlStr; temp.firstChild; )
        frag.appendChild(temp.firstChild);
      return frag;
    }
    function windowSize() {
      return {
        width:
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        height:
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight,
      };
    }
    function whichAnimationEvent() {
      var t,
        el = document.createElement("fakeelement"),
        animations = {
          animation: "animationend",
          OAnimation: "oAnimationEnd",
          MozAnimation: "animationend",
          WebkitAnimation: "webkitAnimationEnd",
        };
      for (t in animations) if (void 0 !== el.style[t]) return animations[t];
    }
    function waitUntil(check, onComplete, delay, timeout) {
      if (check()) onComplete();
      else {
        var timeoutPointer;
        delay || (delay = 100);
        var intervalPointer = setInterval(function () {
          check() &&
            (clearInterval(intervalPointer),
            timeoutPointer && clearTimeout(timeoutPointer),
            onComplete());
        }, delay);
        timeout &&
          (timeoutPointer = setTimeout(function () {
            clearInterval(intervalPointer);
          }, timeout));
      }
    }
    function injectAssets(url, waitFor, callback) {
      if (isNil(url)) console.error("Inject assets error");
      else if (
        (isFunction(waitFor) && ((callback = waitFor), (waitFor = !1)),
        isString(waitFor) && waitFor in window)
      )
        isFunction(callback) && callback();
      else {
        var found;
        if (-1 !== url.indexOf(".css")) {
          if (
            (found = document.querySelectorAll('link[href="' + url + '"]')) &&
            found.length > 0
          )
            return void (isFunction(callback) && callback());
          var head = document.getElementsByTagName("head")[0],
            headStyles = head.querySelectorAll('link[rel="stylesheet"]'),
            link = document.createElement("link");
          return (
            (link.rel = "stylesheet"),
            (link.type = "text/css"),
            (link.href = url),
            (link.media = "all"),
            headStyles
              ? head.insertBefore(link, headStyles[0])
              : head.appendChild(link),
            void (isFunction(callback) && callback())
          );
        }
        if (
          (found = document.querySelectorAll('script[src="' + url + '"]')) &&
          found.length > 0
        ) {
          if (isFunction(callback)) {
            if (isString(waitFor))
              return (
                waitUntil(
                  function () {
                    return void 0 !== window[waitFor];
                  },
                  function () {
                    callback();
                  }
                ),
                !1
              );
            callback();
          }
        } else {
          var script = document.createElement("script");
          (script.type = "text/javascript"),
            (script.src = url),
            (script.onload = function () {
              if (isFunction(callback)) {
                if (isString(waitFor))
                  return (
                    waitUntil(
                      function () {
                        return void 0 !== window[waitFor];
                      },
                      function () {
                        callback();
                      }
                    ),
                    !1
                  );
                callback();
              }
            }),
            document.body.appendChild(script);
        }
      }
    }
    function isMobile() {
      return (
        "navigator" in window &&
        window.navigator.userAgent.match(
          /(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
        )
      );
    }
    function isFunction(f) {
      return "function" == typeof f;
    }
    function isString(s) {
      return "string" == typeof s;
    }
    function isNode(el) {
      return !(!el || !el.nodeType || 1 != el.nodeType);
    }
    function isArray(ar) {
      return Array.isArray(ar);
    }
    function isArrayLike(ar) {
      return ar && ar.length && isFinite(ar.length);
    }
    function isObject(o) {
      return (
        "object" === _typeof(o) && null != o && !isFunction(o) && !isArray(o)
      );
    }
    function isNil(o) {
      return null == o;
    }
    function has(obj, key) {
      return null !== obj && hasOwnProperty.call(obj, key);
    }
    function size(o) {
      if (isObject(o)) {
        if (o.keys) return o.keys().length;
        var l = 0;
        for (var k in o) has(o, k) && l++;
        return l;
      }
      return o.length;
    }
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function keyboardNavigation(instance) {
      if (instance.events.hasOwnProperty("keyboard")) return !1;
      instance.events.keyboard = addEvent("keydown", {
        onElement: window,
        withCallback: function withCallback(event, target) {
          var key = (event = event || window.event).keyCode;
          if (9 == key) {
            var activeElement =
              !(!document.activeElement || !document.activeElement.nodeName) &&
              document.activeElement.nodeName.toLocaleLowerCase();
            if (
              "input" == activeElement ||
              "textarea" == activeElement ||
              "button" == activeElement
            )
              return;
            event.preventDefault();
            var btns = document.querySelectorAll(".gbtn");
            if (!btns || btns.length <= 0) return;
            var focused = _toConsumableArray(btns).filter(function (item) {
              return hasClass(item, "focused");
            });
            if (!focused.length) {
              var first = document.querySelector('.gbtn[tabindex="0"]');
              return void (
                first && (first.focus(), addClass(first, "focused"))
              );
            }
            btns.forEach(function (element) {
              return removeClass(element, "focused");
            });
            var tabindex = focused[0].getAttribute("tabindex");
            tabindex = tabindex || "0";
            var newIndex = parseInt(tabindex) + 1;
            newIndex > btns.length - 1 && (newIndex = "0");
            var next = document.querySelector(
              '.gbtn[tabindex="'.concat(newIndex, '"]')
            );
            next && (next.focus(), addClass(next, "focused"));
          }
          39 == key && instance.nextSlide(),
            37 == key && instance.prevSlide(),
            27 == key && instance.close();
        },
      });
    }
    function getLen(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    function getRotateAngle(v1, v2) {
      var angle = (function getAngle(v1, v2) {
        var mr = getLen(v1) * getLen(v2);
        if (0 === mr) return 0;
        var r =
          (function dot(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
          })(v1, v2) / mr;
        return r > 1 && (r = 1), Math.acos(r);
      })(v1, v2);
      return (
        (function cross(v1, v2) {
          return v1.x * v2.y - v2.x * v1.y;
        })(v1, v2) > 0 && (angle *= -1),
        (180 * angle) / Math.PI
      );
    }
    var EventsHandlerAdmin = (function () {
      function EventsHandlerAdmin(el) {
        _classCallCheck(this, EventsHandlerAdmin),
          (this.handlers = []),
          (this.el = el);
      }
      return (
        _createClass(EventsHandlerAdmin, [
          {
            key: "add",
            value: function add(handler) {
              this.handlers.push(handler);
            },
          },
          {
            key: "del",
            value: function del(handler) {
              handler || (this.handlers = []);
              for (var i = this.handlers.length; i >= 0; i--)
                this.handlers[i] === handler && this.handlers.splice(i, 1);
            },
          },
          {
            key: "dispatch",
            value: function dispatch() {
              for (var i = 0, len = this.handlers.length; i < len; i++) {
                var handler = this.handlers[i];
                "function" == typeof handler &&
                  handler.apply(this.el, arguments);
              }
            },
          },
        ]),
        EventsHandlerAdmin
      );
    })();
    function wrapFunc(el, handler) {
      var EventshandlerAdmin = new EventsHandlerAdmin(el);
      return EventshandlerAdmin.add(handler), EventshandlerAdmin;
    }
    var TouchEvents = (function () {
      function TouchEvents(el, option) {
        _classCallCheck(this, TouchEvents),
          (this.element =
            "string" == typeof el ? document.querySelector(el) : el),
          (this.start = this.start.bind(this)),
          (this.move = this.move.bind(this)),
          (this.end = this.end.bind(this)),
          (this.cancel = this.cancel.bind(this)),
          this.element.addEventListener("touchstart", this.start, !1),
          this.element.addEventListener("touchmove", this.move, !1),
          this.element.addEventListener("touchend", this.end, !1),
          this.element.addEventListener("touchcancel", this.cancel, !1),
          (this.preV = { x: null, y: null }),
          (this.pinchStartLen = null),
          (this.zoom = 1),
          (this.isDoubleTap = !1);
        var noop = function noop() {};
        (this.rotate = wrapFunc(this.element, option.rotate || noop)),
          (this.touchStart = wrapFunc(this.element, option.touchStart || noop)),
          (this.multipointStart = wrapFunc(
            this.element,
            option.multipointStart || noop
          )),
          (this.multipointEnd = wrapFunc(
            this.element,
            option.multipointEnd || noop
          )),
          (this.pinch = wrapFunc(this.element, option.pinch || noop)),
          (this.swipe = wrapFunc(this.element, option.swipe || noop)),
          (this.tap = wrapFunc(this.element, option.tap || noop)),
          (this.doubleTap = wrapFunc(this.element, option.doubleTap || noop)),
          (this.longTap = wrapFunc(this.element, option.longTap || noop)),
          (this.singleTap = wrapFunc(this.element, option.singleTap || noop)),
          (this.pressMove = wrapFunc(this.element, option.pressMove || noop)),
          (this.twoFingerPressMove = wrapFunc(
            this.element,
            option.twoFingerPressMove || noop
          )),
          (this.touchMove = wrapFunc(this.element, option.touchMove || noop)),
          (this.touchEnd = wrapFunc(this.element, option.touchEnd || noop)),
          (this.touchCancel = wrapFunc(
            this.element,
            option.touchCancel || noop
          )),
          (this._cancelAllHandler = this.cancelAll.bind(this)),
          window.addEventListener("scroll", this._cancelAllHandler),
          (this.delta = null),
          (this.last = null),
          (this.now = null),
          (this.tapTimeout = null),
          (this.singleTapTimeout = null),
          (this.longTapTimeout = null),
          (this.swipeTimeout = null),
          (this.x1 = this.x2 = this.y1 = this.y2 = null),
          (this.preTapPosition = { x: null, y: null });
      }
      return (
        _createClass(TouchEvents, [
          {
            key: "start",
            value: function start(evt) {
              if (evt.touches) {
                (this.now = Date.now()),
                  (this.x1 = evt.touches[0].pageX),
                  (this.y1 = evt.touches[0].pageY),
                  (this.delta = this.now - (this.last || this.now)),
                  this.touchStart.dispatch(evt, this.element),
                  null !== this.preTapPosition.x &&
                    ((this.isDoubleTap =
                      this.delta > 0 &&
                      this.delta <= 250 &&
                      Math.abs(this.preTapPosition.x - this.x1) < 30 &&
                      Math.abs(this.preTapPosition.y - this.y1) < 30),
                    this.isDoubleTap && clearTimeout(this.singleTapTimeout)),
                  (this.preTapPosition.x = this.x1),
                  (this.preTapPosition.y = this.y1),
                  (this.last = this.now);
                var preV = this.preV;
                if (evt.touches.length > 1) {
                  this._cancelLongTap(), this._cancelSingleTap();
                  var v = {
                    x: evt.touches[1].pageX - this.x1,
                    y: evt.touches[1].pageY - this.y1,
                  };
                  (preV.x = v.x),
                    (preV.y = v.y),
                    (this.pinchStartLen = getLen(preV)),
                    this.multipointStart.dispatch(evt, this.element);
                }
                (this._preventTap = !1),
                  (this.longTapTimeout = setTimeout(
                    function () {
                      this.longTap.dispatch(evt, this.element),
                        (this._preventTap = !0);
                    }.bind(this),
                    750
                  ));
              }
            },
          },
          {
            key: "move",
            value: function move(evt) {
              if (evt.touches) {
                var preV = this.preV,
                  len = evt.touches.length,
                  currentX = evt.touches[0].pageX,
                  currentY = evt.touches[0].pageY;
                if (((this.isDoubleTap = !1), len > 1)) {
                  var sCurrentX = evt.touches[1].pageX,
                    sCurrentY = evt.touches[1].pageY,
                    v = {
                      x: evt.touches[1].pageX - currentX,
                      y: evt.touches[1].pageY - currentY,
                    };
                  null !== preV.x &&
                    (this.pinchStartLen > 0 &&
                      ((evt.zoom = getLen(v) / this.pinchStartLen),
                      this.pinch.dispatch(evt, this.element)),
                    (evt.angle = getRotateAngle(v, preV)),
                    this.rotate.dispatch(evt, this.element)),
                    (preV.x = v.x),
                    (preV.y = v.y),
                    null !== this.x2 && null !== this.sx2
                      ? ((evt.deltaX =
                          (currentX - this.x2 + sCurrentX - this.sx2) / 2),
                        (evt.deltaY =
                          (currentY - this.y2 + sCurrentY - this.sy2) / 2))
                      : ((evt.deltaX = 0), (evt.deltaY = 0)),
                    this.twoFingerPressMove.dispatch(evt, this.element),
                    (this.sx2 = sCurrentX),
                    (this.sy2 = sCurrentY);
                } else {
                  if (null !== this.x2) {
                    (evt.deltaX = currentX - this.x2),
                      (evt.deltaY = currentY - this.y2);
                    var movedX = Math.abs(this.x1 - this.x2),
                      movedY = Math.abs(this.y1 - this.y2);
                    (movedX > 10 || movedY > 10) && (this._preventTap = !0);
                  } else (evt.deltaX = 0), (evt.deltaY = 0);
                  this.pressMove.dispatch(evt, this.element);
                }
                this.touchMove.dispatch(evt, this.element),
                  this._cancelLongTap(),
                  (this.x2 = currentX),
                  (this.y2 = currentY),
                  len > 1 && evt.preventDefault();
              }
            },
          },
          {
            key: "end",
            value: function end(evt) {
              if (evt.changedTouches) {
                this._cancelLongTap();
                var self = this;
                evt.touches.length < 2 &&
                  (this.multipointEnd.dispatch(evt, this.element),
                  (this.sx2 = this.sy2 = null)),
                  (this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
                  (this.y2 && Math.abs(this.y1 - this.y2) > 30)
                    ? ((evt.direction = this._swipeDirection(
                        this.x1,
                        this.x2,
                        this.y1,
                        this.y2
                      )),
                      (this.swipeTimeout = setTimeout(function () {
                        self.swipe.dispatch(evt, self.element);
                      }, 0)))
                    : ((this.tapTimeout = setTimeout(function () {
                        self._preventTap ||
                          self.tap.dispatch(evt, self.element),
                          self.isDoubleTap &&
                            (self.doubleTap.dispatch(evt, self.element),
                            (self.isDoubleTap = !1));
                      }, 0)),
                      self.isDoubleTap ||
                        (self.singleTapTimeout = setTimeout(function () {
                          self.singleTap.dispatch(evt, self.element);
                        }, 250))),
                  this.touchEnd.dispatch(evt, this.element),
                  (this.preV.x = 0),
                  (this.preV.y = 0),
                  (this.zoom = 1),
                  (this.pinchStartLen = null),
                  (this.x1 = this.x2 = this.y1 = this.y2 = null);
              }
            },
          },
          {
            key: "cancelAll",
            value: function cancelAll() {
              (this._preventTap = !0),
                clearTimeout(this.singleTapTimeout),
                clearTimeout(this.tapTimeout),
                clearTimeout(this.longTapTimeout),
                clearTimeout(this.swipeTimeout);
            },
          },
          {
            key: "cancel",
            value: function cancel(evt) {
              this.cancelAll(), this.touchCancel.dispatch(evt, this.element);
            },
          },
          {
            key: "_cancelLongTap",
            value: function _cancelLongTap() {
              clearTimeout(this.longTapTimeout);
            },
          },
          {
            key: "_cancelSingleTap",
            value: function _cancelSingleTap() {
              clearTimeout(this.singleTapTimeout);
            },
          },
          {
            key: "_swipeDirection",
            value: function _swipeDirection(x1, x2, y1, y2) {
              return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
                ? x1 - x2 > 0
                  ? "Left"
                  : "Right"
                : y1 - y2 > 0
                ? "Up"
                : "Down";
            },
          },
          {
            key: "on",
            value: function on(evt, handler) {
              this[evt] && this[evt].add(handler);
            },
          },
          {
            key: "off",
            value: function off(evt, handler) {
              this[evt] && this[evt].del(handler);
            },
          },
          {
            key: "destroy",
            value: function destroy() {
              return (
                this.singleTapTimeout && clearTimeout(this.singleTapTimeout),
                this.tapTimeout && clearTimeout(this.tapTimeout),
                this.longTapTimeout && clearTimeout(this.longTapTimeout),
                this.swipeTimeout && clearTimeout(this.swipeTimeout),
                this.element.removeEventListener("touchstart", this.start),
                this.element.removeEventListener("touchmove", this.move),
                this.element.removeEventListener("touchend", this.end),
                this.element.removeEventListener("touchcancel", this.cancel),
                this.rotate.del(),
                this.touchStart.del(),
                this.multipointStart.del(),
                this.multipointEnd.del(),
                this.pinch.del(),
                this.swipe.del(),
                this.tap.del(),
                this.doubleTap.del(),
                this.longTap.del(),
                this.singleTap.del(),
                this.pressMove.del(),
                this.twoFingerPressMove.del(),
                this.touchMove.del(),
                this.touchEnd.del(),
                this.touchCancel.del(),
                (this.preV =
                  this.pinchStartLen =
                  this.zoom =
                  this.isDoubleTap =
                  this.delta =
                  this.last =
                  this.now =
                  this.tapTimeout =
                  this.singleTapTimeout =
                  this.longTapTimeout =
                  this.swipeTimeout =
                  this.x1 =
                  this.x2 =
                  this.y1 =
                  this.y2 =
                  this.preTapPosition =
                  this.rotate =
                  this.touchStart =
                  this.multipointStart =
                  this.multipointEnd =
                  this.pinch =
                  this.swipe =
                  this.tap =
                  this.doubleTap =
                  this.longTap =
                  this.singleTap =
                  this.pressMove =
                  this.touchMove =
                  this.touchEnd =
                  this.touchCancel =
                  this.twoFingerPressMove =
                    null),
                window.removeEventListener("scroll", this._cancelAllHandler),
                null
              );
            },
          },
        ]),
        TouchEvents
      );
    })();
    function resetSlideMove(slide) {
      var transitionEnd = (function whichTransitionEvent() {
          var t,
            el = document.createElement("fakeelement"),
            transitions = {
              transition: "transitionend",
              OTransition: "oTransitionEnd",
              MozTransition: "transitionend",
              WebkitTransition: "webkitTransitionEnd",
            };
          for (t in transitions)
            if (void 0 !== el.style[t]) return transitions[t];
        })(),
        media = hasClass(slide, "gslide-media")
          ? slide
          : slide.querySelector(".gslide-media"),
        desc = slide.querySelector(".gslide-description");
      addClass(media, "greset"),
        cssTransform(media, "translate3d(0, 0, 0)"),
        addEvent(transitionEnd, {
          onElement: media,
          once: !0,
          withCallback: function withCallback(event, target) {
            removeClass(media, "greset");
          },
        }),
        (media.style.opacity = ""),
        desc && (desc.style.opacity = "");
    }
    function touchNavigation(instance) {
      if (instance.events.hasOwnProperty("touch")) return !1;
      var hDistance,
        vDistance,
        isInlined,
        winSize = windowSize(),
        winWidth = winSize.width,
        winHeight = winSize.height,
        process = !1,
        currentSlide = null,
        media = null,
        mediaImage = null,
        doingMove = !1,
        initScale = 1,
        currentScale = 1,
        doingZoom = !1,
        imageZoomed = !1,
        zoomedPosX = null,
        zoomedPosY = null,
        lastZoomedPosX = null,
        lastZoomedPosY = null,
        hDistancePercent = 0,
        vDistancePercent = 0,
        vSwipe = !1,
        hSwipe = !1,
        startCoords = {},
        endCoords = {},
        xDown = 0,
        yDown = 0,
        sliderWrapper = document.getElementById("glightbox-slider"),
        overlay = document.querySelector(".goverlay"),
        touchInstance = new TouchEvents(sliderWrapper, {
          touchStart: function touchStart(e) {
            if (
              ((process = !0),
              (hasClass(e.targetTouches[0].target, "ginner-container") ||
                closest(e.targetTouches[0].target, ".gslide-desc") ||
                "a" == e.targetTouches[0].target.nodeName.toLowerCase()) &&
                (process = !1),
              closest(e.targetTouches[0].target, ".gslide-inline") &&
                !hasClass(
                  e.targetTouches[0].target.parentNode,
                  "gslide-inline"
                ) &&
                (process = !1),
              process)
            ) {
              if (
                ((endCoords = e.targetTouches[0]),
                (startCoords.pageX = e.targetTouches[0].pageX),
                (startCoords.pageY = e.targetTouches[0].pageY),
                (xDown = e.targetTouches[0].clientX),
                (yDown = e.targetTouches[0].clientY),
                (currentSlide = instance.activeSlide),
                (media = currentSlide.querySelector(".gslide-media")),
                (isInlined = currentSlide.querySelector(".gslide-inline")),
                (mediaImage = null),
                hasClass(media, "gslide-image") &&
                  (mediaImage = media.querySelector("img")),
                removeClass(overlay, "greset"),
                e.pageX > 20 && e.pageX < window.innerWidth - 20)
              )
                return;
              e.preventDefault();
            }
          },
          touchMove: function touchMove(e) {
            if (
              process &&
              ((endCoords = e.targetTouches[0]), !doingZoom && !imageZoomed)
            ) {
              if (isInlined && isInlined.offsetHeight > winHeight) {
                var moved = startCoords.pageX - endCoords.pageX;
                if (Math.abs(moved) <= 13) return !1;
              }
              doingMove = !0;
              var opacity,
                xUp = e.targetTouches[0].clientX,
                yUp = e.targetTouches[0].clientY,
                xDiff = xDown - xUp,
                yDiff = yDown - yUp;
              if (
                (Math.abs(xDiff) > Math.abs(yDiff)
                  ? ((vSwipe = !1), (hSwipe = !0))
                  : ((hSwipe = !1), (vSwipe = !0)),
                (hDistance = endCoords.pageX - startCoords.pageX),
                (hDistancePercent = (100 * hDistance) / winWidth),
                (vDistance = endCoords.pageY - startCoords.pageY),
                (vDistancePercent = (100 * vDistance) / winHeight),
                vSwipe &&
                  mediaImage &&
                  ((opacity = 1 - Math.abs(vDistance) / winHeight),
                  (overlay.style.opacity = opacity),
                  instance.settings.touchFollowAxis && (hDistancePercent = 0)),
                hSwipe &&
                  ((opacity = 1 - Math.abs(hDistance) / winWidth),
                  (media.style.opacity = opacity),
                  instance.settings.touchFollowAxis && (vDistancePercent = 0)),
                !mediaImage)
              )
                return cssTransform(
                  media,
                  "translate3d(".concat(hDistancePercent, "%, 0, 0)")
                );
              cssTransform(
                media,
                "translate3d("
                  .concat(hDistancePercent, "%, ")
                  .concat(vDistancePercent, "%, 0)")
              );
            }
          },
          touchEnd: function touchEnd() {
            if (process) {
              if (((doingMove = !1), imageZoomed || doingZoom))
                return (
                  (lastZoomedPosX = zoomedPosX),
                  void (lastZoomedPosY = zoomedPosY)
                );
              var v = Math.abs(parseInt(vDistancePercent)),
                h = Math.abs(parseInt(hDistancePercent));
              if (!(v > 29 && mediaImage))
                return v < 29 && h < 25
                  ? (addClass(overlay, "greset"),
                    (overlay.style.opacity = 1),
                    resetSlideMove(media))
                  : void 0;
              instance.close();
            }
          },
          multipointEnd: function multipointEnd() {
            setTimeout(function () {
              doingZoom = !1;
            }, 50);
          },
          multipointStart: function multipointStart() {
            (doingZoom = !0), (initScale = currentScale || 1);
          },
          pinch: function pinch(evt) {
            if (!mediaImage || doingMove) return !1;
            (doingZoom = !0),
              (mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom);
            var scale = initScale * evt.zoom;
            if (((imageZoomed = !0), scale <= 1))
              return (
                (imageZoomed = !1),
                (scale = 1),
                (lastZoomedPosY = null),
                (lastZoomedPosX = null),
                (zoomedPosX = null),
                (zoomedPosY = null),
                void mediaImage.setAttribute("style", "")
              );
            scale > 4.5 && (scale = 4.5),
              (mediaImage.style.transform = "scale3d("
                .concat(scale, ", ")
                .concat(scale, ", 1)")),
              (currentScale = scale);
          },
          pressMove: function pressMove(e) {
            if (imageZoomed && !doingZoom) {
              var mhDistance = endCoords.pageX - startCoords.pageX,
                mvDistance = endCoords.pageY - startCoords.pageY;
              lastZoomedPosX && (mhDistance += lastZoomedPosX),
                lastZoomedPosY && (mvDistance += lastZoomedPosY),
                (zoomedPosX = mhDistance),
                (zoomedPosY = mvDistance);
              var style = "translate3d("
                .concat(mhDistance, "px, ")
                .concat(mvDistance, "px, 0)");
              currentScale &&
                (style += " scale3d("
                  .concat(currentScale, ", ")
                  .concat(currentScale, ", 1)")),
                cssTransform(mediaImage, style);
            }
          },
          swipe: function swipe(evt) {
            if (!imageZoomed)
              if (doingZoom) doingZoom = !1;
              else {
                if ("Left" == evt.direction) {
                  if (instance.index == instance.elements.length - 1)
                    return resetSlideMove(media);
                  instance.nextSlide();
                }
                if ("Right" == evt.direction) {
                  if (0 == instance.index) return resetSlideMove(media);
                  instance.prevSlide();
                }
              }
          },
        });
      instance.events.touch = touchInstance;
    }
    var ZoomImages = (function () {
        function ZoomImages(el, slide) {
          var _this = this,
            onclose =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : null;
          if (
            (_classCallCheck(this, ZoomImages),
            (this.img = el),
            (this.slide = slide),
            (this.onclose = onclose),
            this.img.setZoomEvents)
          )
            return !1;
          (this.active = !1),
            (this.zoomedIn = !1),
            (this.dragging = !1),
            (this.currentX = null),
            (this.currentY = null),
            (this.initialX = null),
            (this.initialY = null),
            (this.xOffset = 0),
            (this.yOffset = 0),
            this.img.addEventListener(
              "mousedown",
              function (e) {
                return _this.dragStart(e);
              },
              !1
            ),
            this.img.addEventListener(
              "mouseup",
              function (e) {
                return _this.dragEnd(e);
              },
              !1
            ),
            this.img.addEventListener(
              "mousemove",
              function (e) {
                return _this.drag(e);
              },
              !1
            ),
            this.img.addEventListener(
              "click",
              function (e) {
                return _this.slide.classList.contains("dragging-nav")
                  ? (_this.zoomOut(), !1)
                  : _this.zoomedIn
                  ? void (_this.zoomedIn && !_this.dragging && _this.zoomOut())
                  : _this.zoomIn();
              },
              !1
            ),
            (this.img.setZoomEvents = !0);
        }
        return (
          _createClass(ZoomImages, [
            {
              key: "zoomIn",
              value: function zoomIn() {
                var winWidth = this.widowWidth();
                if (!(this.zoomedIn || winWidth <= 768)) {
                  var img = this.img;
                  if (
                    (img.setAttribute("data-style", img.getAttribute("style")),
                    (img.style.maxWidth = img.naturalWidth + "px"),
                    (img.style.maxHeight = img.naturalHeight + "px"),
                    img.naturalWidth > winWidth)
                  ) {
                    var centerX = winWidth / 2 - img.naturalWidth / 2;
                    this.setTranslate(this.img.parentNode, centerX, 0);
                  }
                  this.slide.classList.add("zoomed"), (this.zoomedIn = !0);
                }
              },
            },
            {
              key: "zoomOut",
              value: function zoomOut() {
                this.img.parentNode.setAttribute("style", ""),
                  this.img.setAttribute(
                    "style",
                    this.img.getAttribute("data-style")
                  ),
                  this.slide.classList.remove("zoomed"),
                  (this.zoomedIn = !1),
                  (this.currentX = null),
                  (this.currentY = null),
                  (this.initialX = null),
                  (this.initialY = null),
                  (this.xOffset = 0),
                  (this.yOffset = 0),
                  this.onclose &&
                    "function" == typeof this.onclose &&
                    this.onclose();
              },
            },
            {
              key: "dragStart",
              value: function dragStart(e) {
                e.preventDefault(),
                  this.zoomedIn
                    ? ("touchstart" === e.type
                        ? ((this.initialX =
                            e.touches[0].clientX - this.xOffset),
                          (this.initialY = e.touches[0].clientY - this.yOffset))
                        : ((this.initialX = e.clientX - this.xOffset),
                          (this.initialY = e.clientY - this.yOffset)),
                      e.target === this.img &&
                        ((this.active = !0),
                        this.img.classList.add("dragging")))
                    : (this.active = !1);
              },
            },
            {
              key: "dragEnd",
              value: function dragEnd(e) {
                var _this2 = this;
                e.preventDefault(),
                  (this.initialX = this.currentX),
                  (this.initialY = this.currentY),
                  (this.active = !1),
                  setTimeout(function () {
                    (_this2.dragging = !1),
                      (_this2.img.isDragging = !1),
                      _this2.img.classList.remove("dragging");
                  }, 100);
              },
            },
            {
              key: "drag",
              value: function drag(e) {
                this.active &&
                  (e.preventDefault(),
                  "touchmove" === e.type
                    ? ((this.currentX = e.touches[0].clientX - this.initialX),
                      (this.currentY = e.touches[0].clientY - this.initialY))
                    : ((this.currentX = e.clientX - this.initialX),
                      (this.currentY = e.clientY - this.initialY)),
                  (this.xOffset = this.currentX),
                  (this.yOffset = this.currentY),
                  (this.img.isDragging = !0),
                  (this.dragging = !0),
                  this.setTranslate(this.img, this.currentX, this.currentY));
              },
            },
            {
              key: "onMove",
              value: function onMove(e) {
                if (this.zoomedIn) {
                  var xOffset = e.clientX - this.img.naturalWidth / 2,
                    yOffset = e.clientY - this.img.naturalHeight / 2;
                  this.setTranslate(this.img, xOffset, yOffset);
                }
              },
            },
            {
              key: "setTranslate",
              value: function setTranslate(node, xPos, yPos) {
                node.style.transform =
                  "translate3d(" + xPos + "px, " + yPos + "px, 0)";
              },
            },
            {
              key: "widowWidth",
              value: function widowWidth() {
                return (
                  window.innerWidth ||
                  document.documentElement.clientWidth ||
                  document.body.clientWidth
                );
              },
            },
          ]),
          ZoomImages
        );
      })(),
      DragSlides = (function () {
        function DragSlides() {
          var _this = this,
            config =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
          _classCallCheck(this, DragSlides);
          var dragEl = config.dragEl,
            _config$toleranceX = config.toleranceX,
            toleranceX =
              void 0 === _config$toleranceX ? 40 : _config$toleranceX,
            _config$toleranceY = config.toleranceY,
            toleranceY =
              void 0 === _config$toleranceY ? 65 : _config$toleranceY,
            _config$slide = config.slide,
            slide = void 0 === _config$slide ? null : _config$slide,
            _config$instance = config.instance,
            instance = void 0 === _config$instance ? null : _config$instance;
          (this.el = dragEl),
            (this.active = !1),
            (this.dragging = !1),
            (this.currentX = null),
            (this.currentY = null),
            (this.initialX = null),
            (this.initialY = null),
            (this.xOffset = 0),
            (this.yOffset = 0),
            (this.direction = null),
            (this.lastDirection = null),
            (this.toleranceX = toleranceX),
            (this.toleranceY = toleranceY),
            (this.toleranceReached = !1),
            (this.dragContainer = this.el),
            (this.slide = slide),
            (this.instance = instance),
            this.el.addEventListener(
              "mousedown",
              function (e) {
                return _this.dragStart(e);
              },
              !1
            ),
            this.el.addEventListener(
              "mouseup",
              function (e) {
                return _this.dragEnd(e);
              },
              !1
            ),
            this.el.addEventListener(
              "mousemove",
              function (e) {
                return _this.drag(e);
              },
              !1
            );
        }
        return (
          _createClass(DragSlides, [
            {
              key: "dragStart",
              value: function dragStart(e) {
                if (this.slide.classList.contains("zoomed")) this.active = !1;
                else {
                  "touchstart" === e.type
                    ? ((this.initialX = e.touches[0].clientX - this.xOffset),
                      (this.initialY = e.touches[0].clientY - this.yOffset))
                    : ((this.initialX = e.clientX - this.xOffset),
                      (this.initialY = e.clientY - this.yOffset));
                  var clicked = e.target.nodeName.toLowerCase();
                  e.target.classList.contains("nodrag") ||
                  closest(e.target, ".nodrag") ||
                  -1 !==
                    ["input", "select", "textarea", "button", "a"].indexOf(
                      clicked
                    )
                    ? (this.active = !1)
                    : (e.preventDefault(),
                      (e.target === this.el ||
                        ("img" !== clicked &&
                          closest(e.target, ".gslide-inline"))) &&
                        ((this.active = !0),
                        this.el.classList.add("dragging"),
                        (this.dragContainer = closest(
                          e.target,
                          ".ginner-container"
                        ))));
                }
              },
            },
            {
              key: "dragEnd",
              value: function dragEnd(e) {
                var _this2 = this;
                e && e.preventDefault(),
                  (this.initialX = 0),
                  (this.initialY = 0),
                  (this.currentX = null),
                  (this.currentY = null),
                  (this.initialX = null),
                  (this.initialY = null),
                  (this.xOffset = 0),
                  (this.yOffset = 0),
                  (this.active = !1),
                  this.doSlideChange &&
                    ((this.instance.preventOutsideClick = !0),
                    "right" == this.doSlideChange && this.instance.prevSlide(),
                    "left" == this.doSlideChange && this.instance.nextSlide()),
                  this.doSlideClose && this.instance.close(),
                  this.toleranceReached ||
                    this.setTranslate(this.dragContainer, 0, 0, !0),
                  setTimeout(function () {
                    (_this2.instance.preventOutsideClick = !1),
                      (_this2.toleranceReached = !1),
                      (_this2.lastDirection = null),
                      (_this2.dragging = !1),
                      (_this2.el.isDragging = !1),
                      _this2.el.classList.remove("dragging"),
                      _this2.slide.classList.remove("dragging-nav"),
                      (_this2.dragContainer.style.transform = ""),
                      (_this2.dragContainer.style.transition = "");
                  }, 100);
              },
            },
            {
              key: "drag",
              value: function drag(e) {
                if (this.active) {
                  e.preventDefault(),
                    this.slide.classList.add("dragging-nav"),
                    "touchmove" === e.type
                      ? ((this.currentX = e.touches[0].clientX - this.initialX),
                        (this.currentY = e.touches[0].clientY - this.initialY))
                      : ((this.currentX = e.clientX - this.initialX),
                        (this.currentY = e.clientY - this.initialY)),
                    (this.xOffset = this.currentX),
                    (this.yOffset = this.currentY),
                    (this.el.isDragging = !0),
                    (this.dragging = !0),
                    (this.doSlideChange = !1),
                    (this.doSlideClose = !1);
                  var currentXInt = Math.abs(this.currentX),
                    currentYInt = Math.abs(this.currentY);
                  if (
                    currentXInt > 0 &&
                    currentXInt >= Math.abs(this.currentY) &&
                    (!this.lastDirection || "x" == this.lastDirection)
                  ) {
                    (this.yOffset = 0),
                      (this.lastDirection = "x"),
                      this.setTranslate(this.dragContainer, this.currentX, 0);
                    var doChange = this.shouldChange();
                    if (
                      (!this.instance.settings.dragAutoSnap &&
                        doChange &&
                        (this.doSlideChange = doChange),
                      this.instance.settings.dragAutoSnap && doChange)
                    )
                      return (
                        (this.instance.preventOutsideClick = !0),
                        (this.toleranceReached = !0),
                        (this.active = !1),
                        (this.instance.preventOutsideClick = !0),
                        this.dragEnd(null),
                        "right" == doChange && this.instance.prevSlide(),
                        void ("left" == doChange && this.instance.nextSlide())
                      );
                  }
                  if (
                    this.toleranceY > 0 &&
                    currentYInt > 0 &&
                    currentYInt >= currentXInt &&
                    (!this.lastDirection || "y" == this.lastDirection)
                  ) {
                    (this.xOffset = 0),
                      (this.lastDirection = "y"),
                      this.setTranslate(this.dragContainer, 0, this.currentY);
                    var doClose = this.shouldClose();
                    return (
                      !this.instance.settings.dragAutoSnap &&
                        doClose &&
                        (this.doSlideClose = !0),
                      void (
                        this.instance.settings.dragAutoSnap &&
                        doClose &&
                        this.instance.close()
                      )
                    );
                  }
                }
              },
            },
            {
              key: "shouldChange",
              value: function shouldChange() {
                var doChange = !1;
                if (Math.abs(this.currentX) >= this.toleranceX) {
                  var dragDir = this.currentX > 0 ? "right" : "left";
                  (("left" == dragDir &&
                    this.slide !== this.slide.parentNode.lastChild) ||
                    ("right" == dragDir &&
                      this.slide !== this.slide.parentNode.firstChild)) &&
                    (doChange = dragDir);
                }
                return doChange;
              },
            },
            {
              key: "shouldClose",
              value: function shouldClose() {
                var doClose = !1;
                return (
                  Math.abs(this.currentY) >= this.toleranceY && (doClose = !0),
                  doClose
                );
              },
            },
            {
              key: "setTranslate",
              value: function setTranslate(node, xPos, yPos) {
                var animated =
                  arguments.length > 3 &&
                  void 0 !== arguments[3] &&
                  arguments[3];
                (node.style.transition = animated ? "all .2s ease" : ""),
                  (node.style.transform = "translate3d("
                    .concat(xPos, "px, ")
                    .concat(yPos, "px, 0)"));
              },
            },
          ]),
          DragSlides
        );
      })();
    function slideImage(slide, data, index, callback) {
      var slideMedia = slide.querySelector(".gslide-media"),
        img = new Image(),
        titleID = "gSlideTitle_" + index,
        textID = "gSlideDesc_" + index;
      img.addEventListener(
        "load",
        function () {
          isFunction(callback) && callback();
        },
        !1
      ),
        (img.src = data.href),
        (img.alt = ""),
        "" !== data.title && img.setAttribute("aria-labelledby", titleID),
        "" !== data.description && img.setAttribute("aria-describedby", textID),
        slideMedia.insertBefore(img, slideMedia.firstChild);
    }
    function slideVideo(slide, data, index, callback) {
      var _this = this,
        slideContainer = slide.querySelector(".ginner-container"),
        videoID = "gvideo" + index,
        slideMedia = slide.querySelector(".gslide-media"),
        videoPlayers = this.getAllPlayers();
      addClass(slideContainer, "gvideo-container"),
        slideMedia.insertBefore(
          createHTML('<div class="gvideo-wrapper"></div>'),
          slideMedia.firstChild
        );
      var videoWrapper = slide.querySelector(".gvideo-wrapper");
      injectAssets(this.settings.plyr.css, "Plyr");
      var url = data.href,
        protocol = location.protocol.replace(":", ""),
        videoSource = "",
        embedID = "",
        customPlaceholder = !1;
      "file" == protocol && (protocol = "http"),
        (slideMedia.style.maxWidth = data.width),
        injectAssets(this.settings.plyr.js, "Plyr", function () {
          if (url.match(/vimeo\.com\/([0-9]*)/)) {
            var vimeoID = /vimeo.*\/(\d+)/i.exec(url);
            (videoSource = "vimeo"), (embedID = vimeoID[1]);
          }
          if (
            url.match(
              /(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/
            ) ||
            url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) ||
            url.match(
              /(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/
            )
          ) {
            var youtubeID = (function getYoutubeID(url) {
              var videoID = "";
              videoID =
                void 0 !==
                (url = url
                  .replace(/(>|<)/gi, "")
                  .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/))[2]
                  ? (videoID = url[2].split(/[^0-9a-z_\-]/i))[0]
                  : url;
              return videoID;
            })(url);
            (videoSource = "youtube"), (embedID = youtubeID);
          }
          if (null !== url.match(/\.(mp4|ogg|webm|mov)$/)) {
            videoSource = "local";
            var html = '<video id="' + videoID + '" ';
            (html += 'style="background:#000; max-width: '.concat(
              data.width,
              ';" '
            )),
              (html += 'preload="metadata" '),
              (html += 'x-webkit-airplay="allow" '),
              (html += 'webkit-playsinline="" '),
              (html += "controls "),
              (html += 'class="gvideo-local">');
            var format = url.toLowerCase().split(".").pop(),
              sources = { mp4: "", ogg: "", webm: "" };
            for (var key in ((sources[
              (format = "mov" == format ? "mp4" : format)
            ] = url),
            sources))
              if (sources.hasOwnProperty(key)) {
                var videoFile = sources[key];
                data.hasOwnProperty(key) && (videoFile = data[key]),
                  "" !== videoFile &&
                    (html += '<source src="'
                      .concat(videoFile, '" type="video/')
                      .concat(key, '">'));
              }
            customPlaceholder = createHTML((html += "</video>"));
          }
          var placeholder =
            customPlaceholder ||
            createHTML(
              '<div id="'
                .concat(videoID, '" data-plyr-provider="')
                .concat(videoSource, '" data-plyr-embed-id="')
                .concat(embedID, '"></div>')
            );
          addClass(videoWrapper, "".concat(videoSource, "-video gvideo")),
            videoWrapper.appendChild(placeholder),
            videoWrapper.setAttribute("data-id", videoID),
            videoWrapper.setAttribute("data-index", index);
          var playerConfig = has(_this.settings.plyr, "config")
              ? _this.settings.plyr.config
              : {},
            player = new Plyr("#" + videoID, playerConfig);
          player.on("ready", function (event) {
            var instance = event.detail.plyr;
            (videoPlayers[videoID] = instance),
              isFunction(callback) && callback();
          }),
            player.on("enterfullscreen", handleMediaFullScreen),
            player.on("exitfullscreen", handleMediaFullScreen);
        });
    }
    function handleMediaFullScreen(event) {
      var media = closest(event.target, ".gslide-media");
      "enterfullscreen" == event.type && addClass(media, "fullscreen"),
        "exitfullscreen" == event.type && removeClass(media, "fullscreen");
    }
    function slideInline(slide, data, index, callback) {
      var innerContent,
        _this = this,
        slideMedia = slide.querySelector(".gslide-media"),
        hash =
          !(!has(data, "href") || !data.href) &&
          data.href.split("#").pop().trim(),
        content = !(!has(data, "content") || !data.content) && data.content;
      if (
        content &&
        (isString(content) &&
          (innerContent = createHTML(
            '<div class="ginlined-content">'.concat(content, "</div>")
          )),
        isNode(content))
      ) {
        "none" == content.style.display && (content.style.display = "block");
        var container = document.createElement("div");
        (container.className = "ginlined-content"),
          container.appendChild(content),
          (innerContent = container);
      }
      if (hash) {
        var div = document.getElementById(hash);
        if (!div) return !1;
        var cloned = div.cloneNode(!0);
        (cloned.style.height = data.height),
          (cloned.style.maxWidth = data.width),
          addClass(cloned, "ginlined-content"),
          (innerContent = cloned);
      }
      if (!innerContent)
        return console.error("Unable to append inline slide content", data), !1;
      (slideMedia.style.height = data.height),
        (slideMedia.style.width = data.width),
        slideMedia.appendChild(innerContent),
        (this.events["inlineclose" + hash] = addEvent("click", {
          onElement: slideMedia.querySelectorAll(".gtrigger-close"),
          withCallback: function withCallback(e) {
            e.preventDefault(), _this.close();
          },
        })),
        isFunction(callback) && callback();
    }
    function slideIframe(slide, data, index, callback) {
      var slideMedia = slide.querySelector(".gslide-media"),
        iframe = (function createIframe(config) {
          var url = config.url,
            allow = config.allow,
            callback = config.callback,
            appendTo = config.appendTo,
            iframe = document.createElement("iframe");
          return (
            (iframe.className = "vimeo-video gvideo"),
            (iframe.src = url),
            (iframe.style.width = "100%"),
            (iframe.style.height = "100%"),
            allow && iframe.setAttribute("allow", allow),
            (iframe.onload = function () {
              addClass(iframe, "node-ready"),
                isFunction(callback) && callback();
            }),
            appendTo && appendTo.appendChild(iframe),
            iframe
          );
        })({ url: data.href, callback: callback });
      (slideMedia.parentNode.style.maxWidth = data.width),
        (slideMedia.parentNode.style.height = data.height),
        slideMedia.appendChild(iframe);
    }
    var SlideConfigParser = (function () {
        function SlideConfigParser() {
          var slideParamas =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          _classCallCheck(this, SlideConfigParser),
            (this.defaults = {
              href: "",
              title: "",
              type: "",
              description: "",
              descPosition: "bottom",
              effect: "",
              width: "",
              height: "",
              content: !1,
              zoomable: !0,
              draggable: !0,
            }),
            isObject(slideParamas) &&
              (this.defaults = extend(this.defaults, slideParamas));
        }
        return (
          _createClass(SlideConfigParser, [
            {
              key: "sourceType",
              value: function sourceType(url) {
                var origin = url;
                if (
                  null !==
                  (url = url.toLowerCase()).match(
                    /\.(jpeg|jpg|jpe|gif|png|apn|webp|svg)$/
                  )
                )
                  return "image";
                if (
                  url.match(
                    /(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/
                  ) ||
                  url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) ||
                  url.match(
                    /(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/
                  )
                )
                  return "video";
                if (url.match(/vimeo\.com\/([0-9]*)/)) return "video";
                if (null !== url.match(/\.(mp4|ogg|webm|mov)$/)) return "video";
                if (null !== url.match(/\.(mp3|wav|wma|aac|ogg)$/))
                  return "audio";
                if (
                  url.indexOf("#") > -1 &&
                  "" !== origin.split("#").pop().trim()
                )
                  return "inline";
                return url.indexOf("goajax=true") > -1 ? "ajax" : "external";
              },
            },
            {
              key: "parseConfig",
              value: function parseConfig(element, settings) {
                var _this = this,
                  data = extend(
                    { descPosition: settings.descPosition },
                    this.defaults
                  );
                if (isObject(element) && !isNode(element)) {
                  has(element, "type") ||
                    (has(element, "content") && element.content
                      ? (element.type = "inline")
                      : has(element, "href") &&
                        (element.type = this.sourceType(element.href)));
                  var objectData = extend(data, element);
                  return this.setSize(objectData, settings), objectData;
                }
                var url = "",
                  config = element.getAttribute("data-glightbox"),
                  nodeType = element.nodeName.toLowerCase();
                if (
                  ("a" === nodeType && (url = element.href),
                  "img" === nodeType && (url = element.src),
                  (data.href = url),
                  each(data, function (val, key) {
                    has(settings, key) &&
                      "width" !== key &&
                      (data[key] = settings[key]);
                    var nodeData = element.dataset[key];
                    isNil(nodeData) ||
                      (data[key] = _this.sanitizeValue(nodeData));
                  }),
                  data.content && (data.type = "inline"),
                  !data.type && url && (data.type = this.sourceType(url)),
                  isNil(config))
                ) {
                  if (!data.title && "a" == nodeType) {
                    var title = element.title;
                    isNil(title) || "" === title || (data.title = title);
                  }
                  if (!data.title && "img" == nodeType) {
                    var alt = element.alt;
                    isNil(alt) || "" === alt || (data.title = alt);
                  }
                } else {
                  var cleanKeys = [];
                  each(data, function (v, k) {
                    cleanKeys.push(";\\s?" + k);
                  }),
                    (cleanKeys = cleanKeys.join("\\s?:|")),
                    "" !== config.trim() &&
                      each(data, function (val, key) {
                        var str = config,
                          regex = new RegExp(
                            "s?" + key + "s?:s?(.*?)(" + cleanKeys + "s?:|$)"
                          ),
                          matches = str.match(regex);
                        if (matches && matches.length && matches[1]) {
                          var value = matches[1].trim().replace(/;\s*$/, "");
                          data[key] = _this.sanitizeValue(value);
                        }
                      });
                }
                if (
                  data.description &&
                  "." == data.description.substring(0, 1) &&
                  document.querySelector(data.description)
                )
                  data.description = document.querySelector(
                    data.description
                  ).innerHTML;
                else {
                  var nodeDesc = element.querySelector(".glightbox-desc");
                  nodeDesc && (data.description = nodeDesc.innerHTML);
                }
                return (
                  this.setSize(data, settings), (this.slideConfig = data), data
                );
              },
            },
            {
              key: "setSize",
              value: function setSize(data, settings) {
                var defaultWith =
                    "video" == data.type
                      ? this.checkSize(settings.videosWidth)
                      : this.checkSize(settings.width),
                  defaultHeight = this.checkSize(settings.height);
                return (
                  (data.width =
                    has(data, "width") && "" !== data.width
                      ? this.checkSize(data.width)
                      : defaultWith),
                  (data.height =
                    has(data, "height") && "" !== data.height
                      ? this.checkSize(data.height)
                      : defaultHeight),
                  data
                );
              },
            },
            {
              key: "checkSize",
              value: function checkSize(size) {
                return isNumber(size) ? "".concat(size, "px") : size;
              },
            },
            {
              key: "sanitizeValue",
              value: function sanitizeValue(val) {
                return "true" !== val && "false" !== val ? val : "true" === val;
              },
            },
          ]),
          SlideConfigParser
        );
      })(),
      Slide = (function () {
        function Slide(el, instance, index) {
          _classCallCheck(this, Slide),
            (this.element = el),
            (this.instance = instance),
            (this.index = index);
        }
        return (
          _createClass(Slide, [
            {
              key: "setContent",
              value: function setContent() {
                var _this = this,
                  slide =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : null,
                  callback =
                    arguments.length > 1 &&
                    void 0 !== arguments[1] &&
                    arguments[1];
                if (hasClass(slide, "loaded")) return !1;
                var settings = this.instance.settings,
                  slideConfig = this.slideConfig,
                  isMobileDevice = isMobile();
                isFunction(settings.beforeSlideLoad) &&
                  settings.beforeSlideLoad({
                    index: this.index,
                    slide: slide,
                    player: !1,
                  });
                var type = slideConfig.type,
                  position = slideConfig.descPosition,
                  slideMedia = slide.querySelector(".gslide-media"),
                  slideTitle = slide.querySelector(".gslide-title"),
                  slideText = slide.querySelector(".gslide-desc"),
                  slideDesc = slide.querySelector(".gdesc-inner"),
                  finalCallback = callback,
                  titleID = "gSlideTitle_" + this.index,
                  textID = "gSlideDesc_" + this.index;
                if (
                  (isFunction(settings.afterSlideLoad) &&
                    (finalCallback = function finalCallback() {
                      isFunction(callback) && callback(),
                        settings.afterSlideLoad({
                          index: _this.index,
                          slide: slide,
                          player: _this.instance.getSlidePlayerInstance(
                            _this.index
                          ),
                        });
                    }),
                  "" == slideConfig.title && "" == slideConfig.description
                    ? slideDesc &&
                      slideDesc.parentNode.parentNode.removeChild(
                        slideDesc.parentNode
                      )
                    : (slideTitle && "" !== slideConfig.title
                        ? ((slideTitle.id = titleID),
                          (slideTitle.innerHTML = slideConfig.title))
                        : slideTitle.parentNode.removeChild(slideTitle),
                      slideText && "" !== slideConfig.description
                        ? ((slideText.id = textID),
                          isMobileDevice && settings.moreLength > 0
                            ? ((slideConfig.smallDescription =
                                this.slideShortDesc(
                                  slideConfig.description,
                                  settings.moreLength,
                                  settings.moreText
                                )),
                              (slideText.innerHTML =
                                slideConfig.smallDescription),
                              this.descriptionEvents(slideText, slideConfig))
                            : (slideText.innerHTML = slideConfig.description))
                        : slideText.parentNode.removeChild(slideText),
                      addClass(slideMedia.parentNode, "desc-".concat(position)),
                      addClass(
                        slideDesc.parentNode,
                        "description-".concat(position)
                      )),
                  addClass(slideMedia, "gslide-".concat(type)),
                  addClass(slide, "loaded"),
                  "video" !== type)
                ) {
                  if ("external" !== type)
                    return "inline" === type
                      ? (slideInline.apply(this.instance, [
                          slide,
                          slideConfig,
                          this.index,
                          finalCallback,
                        ]),
                        void (
                          settings.draggable &&
                          new DragSlides({
                            dragEl: slide.querySelector(".gslide-inline"),
                            toleranceX: settings.dragToleranceX,
                            toleranceY: settings.dragToleranceY,
                            slide: slide,
                            instance: this.instance,
                          })
                        ))
                      : void ("image" !== type
                          ? isFunction(finalCallback) && finalCallback()
                          : slideImage(
                              slide,
                              slideConfig,
                              this.index,
                              function () {
                                var img = slide.querySelector("img");
                                settings.draggable &&
                                  new DragSlides({
                                    dragEl: img,
                                    toleranceX: settings.dragToleranceX,
                                    toleranceY: settings.dragToleranceY,
                                    slide: slide,
                                    instance: _this.instance,
                                  }),
                                  slideConfig.zoomable &&
                                    img.naturalWidth > img.offsetWidth &&
                                    (addClass(img, "zoomable"),
                                    new ZoomImages(img, slide, function () {
                                      _this.instance.resize();
                                    })),
                                  isFunction(finalCallback) && finalCallback();
                              }
                            ));
                  slideIframe.apply(this, [
                    slide,
                    slideConfig,
                    this.index,
                    finalCallback,
                  ]);
                } else
                  slideVideo.apply(this.instance, [
                    slide,
                    slideConfig,
                    this.index,
                    finalCallback,
                  ]);
              },
            },
            {
              key: "slideShortDesc",
              value: function slideShortDesc(string) {
                var n =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : 50,
                  wordBoundary =
                    arguments.length > 2 &&
                    void 0 !== arguments[2] &&
                    arguments[2],
                  div = document.createElement("div");
                div.innerHTML = string;
                var cleanedString = div.innerText,
                  useWordBoundary = wordBoundary;
                if ((string = cleanedString.trim()).length <= n) return string;
                var subString = string.substr(0, n - 1);
                return useWordBoundary
                  ? ((div = null),
                    subString +
                      '... <a href="#" class="desc-more">' +
                      wordBoundary +
                      "</a>")
                  : subString;
              },
            },
            {
              key: "descriptionEvents",
              value: function descriptionEvents(desc, data) {
                var _this2 = this,
                  moreLink = desc.querySelector(".desc-more");
                if (!moreLink) return !1;
                addEvent("click", {
                  onElement: moreLink,
                  withCallback: function withCallback(event, target) {
                    event.preventDefault();
                    var body = document.body,
                      desc = closest(target, ".gslide-desc");
                    if (!desc) return !1;
                    (desc.innerHTML = data.description),
                      addClass(body, "gdesc-open");
                    var shortEvent = addEvent("click", {
                      onElement: [body, closest(desc, ".gslide-description")],
                      withCallback: function withCallback(event, target) {
                        "a" !== event.target.nodeName.toLowerCase() &&
                          (removeClass(body, "gdesc-open"),
                          addClass(body, "gdesc-closed"),
                          (desc.innerHTML = data.smallDescription),
                          _this2.descriptionEvents(desc, data),
                          setTimeout(function () {
                            removeClass(body, "gdesc-closed");
                          }, 400),
                          shortEvent.destroy());
                      },
                    });
                  },
                });
              },
            },
            {
              key: "create",
              value: function create() {
                return createHTML(this.instance.settings.slideHTML);
              },
            },
            {
              key: "getConfig",
              value: function getConfig() {
                var parser = new SlideConfigParser(
                  this.instance.settings.slideExtraAttributes
                );
                return (
                  (this.slideConfig = parser.parseConfig(
                    this.element,
                    this.instance.settings
                  )),
                  this.slideConfig
                );
              },
            },
          ]),
          Slide
        );
      })(),
      isMobile$1 = isMobile(),
      isTouch$1 = (function isTouch() {
        return (
          null !== isMobile() ||
          void 0 !== document.createTouch ||
          "ontouchstart" in window ||
          "onmsgesturechange" in window ||
          navigator.msMaxTouchPoints
        );
      })(),
      html = document.getElementsByTagName("html")[0],
      defaults = {
        selector: ".glightbox",
        elements: null,
        skin: "clean",
        theme: "clean",
        closeButton: !0,
        startAt: null,
        autoplayVideos: !0,
        autofocusVideos: !0,
        descPosition: "bottom",
        width: "900px",
        height: "506px",
        videosWidth: "960px",
        beforeSlideChange: null,
        afterSlideChange: null,
        beforeSlideLoad: null,
        afterSlideLoad: null,
        slideInserted: null,
        slideRemoved: null,
        slideExtraAttributes: null,
        onOpen: null,
        onClose: null,
        loop: !1,
        zoomable: !0,
        draggable: !0,
        dragAutoSnap: !1,
        dragToleranceX: 40,
        dragToleranceY: 65,
        preload: !0,
        oneSlidePerOpen: !1,
        touchNavigation: !0,
        touchFollowAxis: !0,
        keyboardNavigation: !0,
        closeOnOutsideClick: !0,
        plugins: !1,
        plyr: {
          css: "https://cdn.plyr.io/3.6.3/plyr.css",
          js: "https://cdn.plyr.io/3.6.3/plyr.js",
          config: {
            ratio: "16:9",
            fullscreen: { enabled: !0, iosNative: !0 },
            youtube: { noCookie: !0, rel: 0, showinfo: 0, iv_load_policy: 3 },
            vimeo: { byline: !1, portrait: !1, title: !1, transparent: !1 },
          },
        },
        openEffect: "zoom",
        closeEffect: "zoom",
        slideEffect: "slide",
        moreText: "See more",
        moreLength: 60,
        cssEfects: {
          fade: { in: "fadeIn", out: "fadeOut" },
          zoom: { in: "zoomIn", out: "zoomOut" },
          slide: { in: "slideInRight", out: "slideOutLeft" },
          slideBack: { in: "slideInLeft", out: "slideOutRight" },
          none: { in: "none", out: "none" },
        },
        svg: {
          close:
            '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>>',
          next: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>>',
          prev: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>>',
        },
        slideHTML:
          '<div class="gslide">\n    <div class="gslide-inner-content">\n        <div class="ginner-container">\n            <div class="gslide-media">\n            </div>\n            <div class="gslide-description">\n                <div class="gdesc-inner">\n                    <h4 class="gslide-title"></h4>\n                    <div class="gslide-desc"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>',
        lightboxHTML:
          '<div id="glightbox-body" class="glightbox-container">\n    <div class="gloader visible"></div>\n    <div class="goverlay"></div>\n    <div class="gcontainer">\n    <div id="glightbox-slider" class="gslider"></div>\n    <button class="gnext gbtn" tabindex="0" aria-label="Next">{nextSVG}</button>\n    <button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>\n    <button class="gclose gbtn" tabindex="2" aria-label="Close">{closeSVG}</button>\n</div>\n</div>',
      },
      GlightboxInit = (function () {
        function GlightboxInit() {
          var options =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          _classCallCheck(this, GlightboxInit),
            (this.settings = extend(defaults, options)),
            (this.effectsClasses = this.getAnimationClasses()),
            (this.videoPlayers = {}),
            (this.apiEvents = []),
            (this.fullElementsList = !1);
        }
        return (
          _createClass(GlightboxInit, [
            {
              key: "init",
              value: function init() {
                var _this = this,
                  selector = this.getSelector();
                selector &&
                  (this.baseEvents = addEvent("click", {
                    onElement: selector,
                    withCallback: function withCallback(e, target) {
                      e.preventDefault(), _this.open(target);
                    },
                  })),
                  (this.elements = this.getElements());
              },
            },
            {
              key: "open",
              value: function open() {
                var element =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : null,
                  startAt =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : null;
                if (0 == this.elements.length) return !1;
                (this.activeSlide = null),
                  (this.prevActiveSlideIndex = null),
                  (this.prevActiveSlide = null);
                var index = isNumber(startAt) ? startAt : this.settings.startAt;
                if (isNode(element)) {
                  var gallery = element.getAttribute("data-gallery");
                  gallery &&
                    ((this.fullElementsList = this.elements),
                    (this.elements = this.getGalleryElements(
                      this.elements,
                      gallery
                    ))),
                    isNil(index) &&
                      (index = this.getElementIndex(element)) < 0 &&
                      (index = 0);
                }
                isNumber(index) || (index = 0),
                  this.build(),
                  animateElement(
                    this.overlay,
                    "none" == this.settings.openEffect
                      ? "none"
                      : this.settings.cssEfects.fade.in
                  );
                var body = document.body,
                  scrollBar =
                    window.innerWidth - document.documentElement.clientWidth;
                if (scrollBar > 0) {
                  var styleSheet = document.createElement("style");
                  (styleSheet.type = "text/css"),
                    (styleSheet.className = "gcss-styles"),
                    (styleSheet.innerText =
                      ".gscrollbar-fixer {margin-right: ".concat(
                        scrollBar,
                        "px}"
                      )),
                    document.head.appendChild(styleSheet),
                    addClass(body, "gscrollbar-fixer");
                }
                addClass(body, "glightbox-open"),
                  addClass(html, "glightbox-open"),
                  isMobile$1 &&
                    (addClass(document.body, "glightbox-mobile"),
                    (this.settings.slideEffect = "slide")),
                  this.showSlide(index, !0),
                  1 == this.elements.length
                    ? (addClass(this.prevButton, "glightbox-button-hidden"),
                      addClass(this.nextButton, "glightbox-button-hidden"))
                    : (removeClass(this.prevButton, "glightbox-button-hidden"),
                      removeClass(this.nextButton, "glightbox-button-hidden")),
                  (this.lightboxOpen = !0),
                  this.trigger("open"),
                  isFunction(this.settings.onOpen) && this.settings.onOpen(),
                  isTouch$1 &&
                    this.settings.touchNavigation &&
                    touchNavigation(this),
                  this.settings.keyboardNavigation && keyboardNavigation(this);
              },
            },
            {
              key: "openAt",
              value: function openAt() {
                var index =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 0;
                this.open(null, index);
              },
            },
            {
              key: "showSlide",
              value: function showSlide() {
                var _this2 = this,
                  index =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : 0,
                  first =
                    arguments.length > 1 &&
                    void 0 !== arguments[1] &&
                    arguments[1];
                show(this.loader), (this.index = parseInt(index));
                var current = this.slidesContainer.querySelector(".current");
                current && removeClass(current, "current"),
                  this.slideAnimateOut();
                var slideNode =
                  this.slidesContainer.querySelectorAll(".gslide")[index];
                if (hasClass(slideNode, "loaded"))
                  this.slideAnimateIn(slideNode, first), hide(this.loader);
                else {
                  show(this.loader);
                  var slide = this.elements[index],
                    slideData = {
                      index: this.index,
                      slide: slideNode,
                      slideNode: slideNode,
                      slideConfig: slide.slideConfig,
                      slideIndex: this.index,
                      trigger: slide.node,
                      player: null,
                    };
                  this.trigger("slide_before_load", slideData),
                    slide.instance.setContent(slideNode, function () {
                      hide(_this2.loader),
                        _this2.resize(),
                        _this2.slideAnimateIn(slideNode, first),
                        _this2.trigger("slide_after_load", slideData);
                    });
                }
                (this.slideDescription = slideNode.querySelector(
                  ".gslide-description"
                )),
                  (this.slideDescriptionContained =
                    this.slideDescription &&
                    hasClass(this.slideDescription.parentNode, "gslide-media")),
                  this.settings.preload &&
                    (this.preloadSlide(index + 1),
                    this.preloadSlide(index - 1)),
                  this.updateNavigationClasses(),
                  (this.activeSlide = slideNode);
              },
            },
            {
              key: "preloadSlide",
              value: function preloadSlide(index) {
                var _this3 = this;
                if (index < 0 || index > this.elements.length - 1) return !1;
                if (isNil(this.elements[index])) return !1;
                var slideNode =
                  this.slidesContainer.querySelectorAll(".gslide")[index];
                if (hasClass(slideNode, "loaded")) return !1;
                var slide = this.elements[index],
                  type = slide.type,
                  slideData = {
                    index: index,
                    slide: slideNode,
                    slideNode: slideNode,
                    slideConfig: slide.slideConfig,
                    slideIndex: index,
                    trigger: slide.node,
                    player: null,
                  };
                this.trigger("slide_before_load", slideData),
                  "video" == type || "external" == type
                    ? setTimeout(function () {
                        slide.instance.setContent(slideNode, function () {
                          _this3.trigger("slide_after_load", slideData);
                        });
                      }, 200)
                    : slide.instance.setContent(slideNode, function () {
                        _this3.trigger("slide_after_load", slideData);
                      });
              },
            },
            {
              key: "prevSlide",
              value: function prevSlide() {
                this.goToSlide(this.index - 1);
              },
            },
            {
              key: "nextSlide",
              value: function nextSlide() {
                this.goToSlide(this.index + 1);
              },
            },
            {
              key: "goToSlide",
              value: function goToSlide() {
                var index =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0];
                if (
                  ((this.prevActiveSlide = this.activeSlide),
                  (this.prevActiveSlideIndex = this.index),
                  !this.loop() &&
                    (index < 0 || index > this.elements.length - 1))
                )
                  return !1;
                index < 0
                  ? (index = this.elements.length - 1)
                  : index >= this.elements.length && (index = 0),
                  this.showSlide(index);
              },
            },
            {
              key: "insertSlide",
              value: function insertSlide() {
                var config =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : {},
                  index =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : -1;
                index < 0 && (index = this.elements.length);
                var slide = new Slide(config, this, index),
                  data = slide.getConfig(),
                  slideInfo = extend({}, data),
                  newSlide = slide.create(),
                  totalSlides = this.elements.length - 1;
                (slideInfo.index = index),
                  (slideInfo.node = !1),
                  (slideInfo.instance = slide),
                  (slideInfo.slideConfig = data),
                  this.elements.splice(index, 0, slideInfo);
                var addedSlideNode = null,
                  addedSlidePlayer = null;
                if (this.slidesContainer) {
                  if (index > totalSlides)
                    this.slidesContainer.appendChild(newSlide);
                  else {
                    var existingSlide =
                      this.slidesContainer.querySelectorAll(".gslide")[index];
                    this.slidesContainer.insertBefore(newSlide, existingSlide);
                  }
                  ((this.settings.preload && 0 == this.index && 0 == index) ||
                    this.index - 1 == index ||
                    this.index + 1 == index) &&
                    this.preloadSlide(index),
                    0 == this.index && 0 == index && (this.index = 1),
                    this.updateNavigationClasses(),
                    (addedSlideNode =
                      this.slidesContainer.querySelectorAll(".gslide")[index]),
                    (addedSlidePlayer = this.getSlidePlayerInstance(index)),
                    (slideInfo.slideNode = addedSlideNode);
                }
                this.trigger("slide_inserted", {
                  index: index,
                  slide: addedSlideNode,
                  slideNode: addedSlideNode,
                  slideConfig: data,
                  slideIndex: index,
                  trigger: null,
                  player: addedSlidePlayer,
                }),
                  isFunction(this.settings.slideInserted) &&
                    this.settings.slideInserted({
                      index: index,
                      slide: addedSlideNode,
                      player: addedSlidePlayer,
                    });
              },
            },
            {
              key: "removeSlide",
              value: function removeSlide() {
                var index =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : -1;
                if (index < 0 || index > this.elements.length - 1) return !1;
                var slide =
                  this.slidesContainer &&
                  this.slidesContainer.querySelectorAll(".gslide")[index];
                slide &&
                  (this.getActiveSlideIndex() == index &&
                    (index == this.elements.length - 1
                      ? this.prevSlide()
                      : this.nextSlide()),
                  slide.parentNode.removeChild(slide)),
                  this.elements.splice(index, 1),
                  this.trigger("slide_removed", index),
                  isFunction(this.settings.slideRemoved) &&
                    this.settings.slideRemoved(index);
              },
            },
            {
              key: "slideAnimateIn",
              value: function slideAnimateIn(slide, first) {
                var _this4 = this,
                  slideMedia = slide.querySelector(".gslide-media"),
                  slideDesc = slide.querySelector(".gslide-description"),
                  prevData = {
                    index: this.prevActiveSlideIndex,
                    slide: this.prevActiveSlide,
                    slideNode: this.prevActiveSlide,
                    slideIndex: this.prevActiveSlide,
                    slideConfig: isNil(this.prevActiveSlideIndex)
                      ? null
                      : this.elements[this.prevActiveSlideIndex].slideConfig,
                    trigger: isNil(this.prevActiveSlideIndex)
                      ? null
                      : this.elements[this.prevActiveSlideIndex].node,
                    player: this.getSlidePlayerInstance(
                      this.prevActiveSlideIndex
                    ),
                  },
                  nextData = {
                    index: this.index,
                    slide: this.activeSlide,
                    slideNode: this.activeSlide,
                    slideConfig: this.elements[this.index].slideConfig,
                    slideIndex: this.index,
                    trigger: this.elements[this.index].node,
                    player: this.getSlidePlayerInstance(this.index),
                  };
                if (
                  (slideMedia.offsetWidth > 0 &&
                    slideDesc &&
                    (hide(slideDesc), (slideDesc.style.display = "")),
                  removeClass(slide, this.effectsClasses),
                  first)
                )
                  animateElement(
                    slide,
                    this.settings.cssEfects[this.settings.openEffect].in,
                    function () {
                      _this4.settings.autoplayVideos &&
                        _this4.slidePlayerPlay(slide),
                        _this4.trigger("slide_changed", {
                          prev: prevData,
                          current: nextData,
                        }),
                        isFunction(_this4.settings.afterSlideChange) &&
                          _this4.settings.afterSlideChange.apply(_this4, [
                            prevData,
                            nextData,
                          ]);
                    }
                  );
                else {
                  var effectName = this.settings.slideEffect,
                    animIn =
                      "none" !== effectName
                        ? this.settings.cssEfects[effectName].in
                        : effectName;
                  this.prevActiveSlideIndex > this.index &&
                    "slide" == this.settings.slideEffect &&
                    (animIn = this.settings.cssEfects.slideBack.in),
                    animateElement(slide, animIn, function () {
                      _this4.settings.autoplayVideos &&
                        _this4.slidePlayerPlay(slide),
                        _this4.trigger("slide_changed", {
                          prev: prevData,
                          current: nextData,
                        }),
                        isFunction(_this4.settings.afterSlideChange) &&
                          _this4.settings.afterSlideChange.apply(_this4, [
                            prevData,
                            nextData,
                          ]);
                    });
                }
                setTimeout(function () {
                  _this4.resize(slide);
                }, 100),
                  addClass(slide, "current");
              },
            },
            {
              key: "slideAnimateOut",
              value: function slideAnimateOut() {
                if (!this.prevActiveSlide) return !1;
                var prevSlide = this.prevActiveSlide;
                removeClass(prevSlide, this.effectsClasses),
                  addClass(prevSlide, "prev");
                var animation = this.settings.slideEffect,
                  animOut =
                    "none" !== animation
                      ? this.settings.cssEfects[animation].out
                      : animation;
                this.slidePlayerPause(prevSlide),
                  this.trigger("slide_before_change", {
                    prev: {
                      index: this.prevActiveSlideIndex,
                      slide: this.prevActiveSlide,
                      slideNode: this.prevActiveSlide,
                      slideIndex: this.prevActiveSlideIndex,
                      slideConfig: isNil(this.prevActiveSlideIndex)
                        ? null
                        : this.elements[this.prevActiveSlideIndex].slideConfig,
                      trigger: isNil(this.prevActiveSlideIndex)
                        ? null
                        : this.elements[this.prevActiveSlideIndex].node,
                      player: this.getSlidePlayerInstance(
                        this.prevActiveSlideIndex
                      ),
                    },
                    current: {
                      index: this.index,
                      slide: this.activeSlide,
                      slideNode: this.activeSlide,
                      slideIndex: this.index,
                      slideConfig: this.elements[this.index].slideConfig,
                      trigger: this.elements[this.index].node,
                      player: this.getSlidePlayerInstance(this.index),
                    },
                  }),
                  isFunction(this.settings.beforeSlideChange) &&
                    this.settings.beforeSlideChange.apply(this, [
                      {
                        index: this.prevActiveSlideIndex,
                        slide: this.prevActiveSlide,
                        player: this.getSlidePlayerInstance(
                          this.prevActiveSlideIndex
                        ),
                      },
                      {
                        index: this.index,
                        slide: this.activeSlide,
                        player: this.getSlidePlayerInstance(this.index),
                      },
                    ]),
                  this.prevActiveSlideIndex > this.index &&
                    "slide" == this.settings.slideEffect &&
                    (animOut = this.settings.cssEfects.slideBack.out),
                  animateElement(prevSlide, animOut, function () {
                    var media = prevSlide.querySelector(".gslide-media"),
                      desc = prevSlide.querySelector(".gslide-description");
                    (media.style.transform = ""),
                      removeClass(media, "greset"),
                      (media.style.opacity = ""),
                      desc && (desc.style.opacity = ""),
                      removeClass(prevSlide, "prev");
                  });
              },
            },
            {
              key: "getAllPlayers",
              value: function getAllPlayers() {
                return this.videoPlayers;
              },
            },
            {
              key: "getSlidePlayerInstance",
              value: function getSlidePlayerInstance(index) {
                var id = "gvideo" + index,
                  videoPlayers = this.getAllPlayers();
                return (
                  !(!has(videoPlayers, id) || !videoPlayers[id]) &&
                  videoPlayers[id]
                );
              },
            },
            {
              key: "stopSlideVideo",
              value: function stopSlideVideo(slide) {
                if (isNode(slide)) {
                  var node = slide.querySelector(".gvideo-wrapper");
                  node && (slide = node.getAttribute("data-index"));
                }
                console.log(
                  "stopSlideVideo is deprecated, use slidePlayerPause"
                );
                var player = this.getSlidePlayerInstance(slide);
                player && player.playing && player.pause();
              },
            },
            {
              key: "slidePlayerPause",
              value: function slidePlayerPause(slide) {
                if (isNode(slide)) {
                  var node = slide.querySelector(".gvideo-wrapper");
                  node && (slide = node.getAttribute("data-index"));
                }
                var player = this.getSlidePlayerInstance(slide);
                player && player.playing && player.pause();
              },
            },
            {
              key: "playSlideVideo",
              value: function playSlideVideo(slide) {
                if (isNode(slide)) {
                  var node = slide.querySelector(".gvideo-wrapper");
                  node && (slide = node.getAttribute("data-index"));
                }
                console.log(
                  "playSlideVideo is deprecated, use slidePlayerPlay"
                );
                var player = this.getSlidePlayerInstance(slide);
                player && !player.playing && player.play();
              },
            },
            {
              key: "slidePlayerPlay",
              value: function slidePlayerPlay(slide) {
                if (isNode(slide)) {
                  var node = slide.querySelector(".gvideo-wrapper");
                  node && (slide = node.getAttribute("data-index"));
                }
                var player = this.getSlidePlayerInstance(slide);
                console.log("Player is"),
                  console.log(player),
                  player &&
                    !player.playing &&
                    (player.play(),
                    this.settings.autofocusVideos &&
                      player.elements.container.focus());
              },
            },
            {
              key: "setElements",
              value: function setElements(elements) {
                var _this5 = this;
                this.settings.elements = !1;
                var newElements = [];
                elements &&
                  elements.length &&
                  each(elements, function (el, i) {
                    var slide = new Slide(el, _this5, i),
                      data = slide.getConfig(),
                      slideInfo = extend({}, data);
                    (slideInfo.slideConfig = data),
                      (slideInfo.instance = slide),
                      (slideInfo.index = i),
                      newElements.push(slideInfo);
                  }),
                  (this.elements = newElements),
                  this.lightboxOpen &&
                    ((this.slidesContainer.innerHTML = ""),
                    this.elements.length &&
                      (each(this.elements, function () {
                        var slide = createHTML(_this5.settings.slideHTML);
                        _this5.slidesContainer.appendChild(slide);
                      }),
                      this.showSlide(0, !0)));
              },
            },
            {
              key: "getElementIndex",
              value: function getElementIndex(node) {
                var index = !1;
                return (
                  each(this.elements, function (el, i) {
                    if (has(el, "node") && el.node == node)
                      return (index = i), !0;
                  }),
                  index
                );
              },
            },
            {
              key: "getElements",
              value: function getElements() {
                var _this6 = this,
                  list = [];
                (this.elements = this.elements ? this.elements : []),
                  !isNil(this.settings.elements) &&
                    isArray(this.settings.elements) &&
                    this.settings.elements.length &&
                    each(this.settings.elements, function (el, i) {
                      var slide = new Slide(el, _this6, i),
                        elData = slide.getConfig(),
                        slideInfo = extend({}, elData);
                      (slideInfo.node = !1),
                        (slideInfo.index = i),
                        (slideInfo.instance = slide),
                        (slideInfo.slideConfig = elData),
                        list.push(slideInfo);
                    });
                var nodes = !1;
                return (
                  this.getSelector() &&
                    (nodes = document.querySelectorAll(this.getSelector())),
                  nodes
                    ? (each(nodes, function (el, i) {
                        var slide = new Slide(el, _this6, i),
                          elData = slide.getConfig(),
                          slideInfo = extend({}, elData);
                        (slideInfo.node = el),
                          (slideInfo.index = i),
                          (slideInfo.instance = slide),
                          (slideInfo.slideConfig = elData),
                          (slideInfo.gallery = el.getAttribute("data-gallery")),
                          list.push(slideInfo);
                      }),
                      list)
                    : list
                );
              },
            },
            {
              key: "getGalleryElements",
              value: function getGalleryElements(list, gallery) {
                return list.filter(function (el) {
                  return el.gallery == gallery;
                });
              },
            },
            {
              key: "getSelector",
              value: function getSelector() {
                return (
                  !this.settings.elements &&
                  (this.settings.selector &&
                  "data-" == this.settings.selector.substring(0, 5)
                    ? "*[".concat(this.settings.selector, "]")
                    : this.settings.selector)
                );
              },
            },
            {
              key: "getActiveSlide",
              value: function getActiveSlide() {
                return this.slidesContainer.querySelectorAll(".gslide")[
                  this.index
                ];
              },
            },
            {
              key: "getActiveSlideIndex",
              value: function getActiveSlideIndex() {
                return this.index;
              },
            },
            {
              key: "getAnimationClasses",
              value: function getAnimationClasses() {
                var effects = [];
                for (var key in this.settings.cssEfects)
                  if (this.settings.cssEfects.hasOwnProperty(key)) {
                    var effect = this.settings.cssEfects[key];
                    effects.push("g".concat(effect.in)),
                      effects.push("g".concat(effect.out));
                  }
                return effects.join(" ");
              },
            },
            {
              key: "build",
              value: function build() {
                var _this7 = this;
                if (this.built) return !1;
                var nextSVG = has(this.settings.svg, "next")
                    ? this.settings.svg.next
                    : "",
                  prevSVG = has(this.settings.svg, "prev")
                    ? this.settings.svg.prev
                    : "",
                  closeSVG = has(this.settings.svg, "close")
                    ? this.settings.svg.close
                    : "",
                  lightboxHTML = this.settings.lightboxHTML;
                (lightboxHTML = createHTML(
                  (lightboxHTML = (lightboxHTML = (lightboxHTML =
                    lightboxHTML.replace(/{nextSVG}/g, nextSVG)).replace(
                    /{prevSVG}/g,
                    prevSVG
                  )).replace(/{closeSVG}/g, closeSVG))
                )),
                  document.body.appendChild(lightboxHTML);
                var modal = document.getElementById("glightbox-body");
                this.modal = modal;
                var closeButton = modal.querySelector(".gclose");
                (this.prevButton = modal.querySelector(".gprev")),
                  (this.nextButton = modal.querySelector(".gnext")),
                  (this.overlay = modal.querySelector(".goverlay")),
                  (this.loader = modal.querySelector(".gloader")),
                  (this.slidesContainer =
                    document.getElementById("glightbox-slider")),
                  (this.events = {}),
                  addClass(this.modal, "glightbox-" + this.settings.skin),
                  this.settings.closeButton &&
                    closeButton &&
                    (this.events.close = addEvent("click", {
                      onElement: closeButton,
                      withCallback: function withCallback(e, target) {
                        e.preventDefault(), _this7.close();
                      },
                    })),
                  closeButton &&
                    !this.settings.closeButton &&
                    closeButton.parentNode.removeChild(closeButton),
                  this.nextButton &&
                    (this.events.next = addEvent("click", {
                      onElement: this.nextButton,
                      withCallback: function withCallback(e, target) {
                        e.preventDefault(), _this7.nextSlide();
                      },
                    })),
                  this.prevButton &&
                    (this.events.prev = addEvent("click", {
                      onElement: this.prevButton,
                      withCallback: function withCallback(e, target) {
                        e.preventDefault(), _this7.prevSlide();
                      },
                    })),
                  this.settings.closeOnOutsideClick &&
                    (this.events.outClose = addEvent("click", {
                      onElement: modal,
                      withCallback: function withCallback(e, target) {
                        _this7.preventOutsideClick ||
                          hasClass(document.body, "glightbox-mobile") ||
                          closest(e.target, ".ginner-container") ||
                          closest(e.target, ".gbtn") ||
                          hasClass(e.target, "gnext") ||
                          hasClass(e.target, "gprev") ||
                          _this7.close();
                      },
                    })),
                  each(this.elements, function (slide, i) {
                    _this7.slidesContainer.appendChild(slide.instance.create()),
                      (slide.slideNode =
                        _this7.slidesContainer.querySelectorAll(".gslide")[i]);
                  }),
                  isTouch$1 && addClass(document.body, "glightbox-touch"),
                  (this.events.resize = addEvent("resize", {
                    onElement: window,
                    withCallback: function withCallback() {
                      _this7.resize();
                    },
                  })),
                  (this.built = !0);
              },
            },
            {
              key: "resize",
              value: function resize() {
                var slide =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : null;
                if (
                  (slide = slide || this.activeSlide) &&
                  !hasClass(slide, "zoomed")
                ) {
                  var winSize = windowSize(),
                    video = slide.querySelector(".gvideo-wrapper"),
                    image = slide.querySelector(".gslide-image"),
                    description = this.slideDescription,
                    winWidth = winSize.width,
                    winHeight = winSize.height;
                  if (
                    (winWidth <= 768
                      ? addClass(document.body, "glightbox-mobile")
                      : removeClass(document.body, "glightbox-mobile"),
                    video || image)
                  ) {
                    var descriptionResize = !1;
                    if (
                      (description &&
                        (hasClass(description, "description-bottom") ||
                          hasClass(description, "description-top")) &&
                        !hasClass(description, "gabsolute") &&
                        (descriptionResize = !0),
                      image)
                    )
                      if (winWidth <= 768) {
                        var imgNode = image.querySelector("img");
                        imgNode.setAttribute("style", "");
                      } else if (descriptionResize) {
                        var descHeight = description.offsetHeight,
                          _imgNode = image.querySelector("img");
                        _imgNode.setAttribute(
                          "style",
                          "max-height: calc(100vh - ".concat(descHeight, "px)")
                        ),
                          description.setAttribute(
                            "style",
                            "max-width: ".concat(_imgNode.offsetWidth, "px;")
                          );
                      }
                    if (video) {
                      var ratio = has(this.settings.plyr.config, "ratio")
                          ? this.settings.plyr.config.ratio
                          : "16:9",
                        videoRatio = ratio.split(":"),
                        maxWidth = 900,
                        maxHeight =
                          maxWidth /
                          (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
                      if (
                        ((maxHeight = Math.floor(maxHeight)),
                        descriptionResize &&
                          (winHeight -= description.offsetHeight),
                        winHeight < maxHeight && winWidth > maxWidth)
                      ) {
                        var vwidth = video.offsetWidth,
                          vheight = video.offsetHeight,
                          _ratio = winHeight / vheight,
                          vsize = {
                            width: vwidth * _ratio,
                            height: vheight * _ratio,
                          };
                        video.parentNode.setAttribute(
                          "style",
                          "max-width: ".concat(vsize.width, "px")
                        ),
                          descriptionResize &&
                            description.setAttribute(
                              "style",
                              "max-width: ".concat(vsize.width, "px;")
                            );
                      } else
                        (video.parentNode.style.maxWidth = "".concat(
                          maxWidth,
                          "px"
                        )),
                          descriptionResize &&
                            description.setAttribute(
                              "style",
                              "max-width: ".concat(maxWidth, "px;")
                            );
                    }
                  }
                }
              },
            },
            {
              key: "reload",
              value: function reload() {
                this.init();
              },
            },
            {
              key: "updateNavigationClasses",
              value: function updateNavigationClasses() {
                var loop = this.loop();
                removeClass(this.nextButton, "disabled"),
                  removeClass(this.prevButton, "disabled"),
                  0 == this.index && this.elements.length - 1 == 0
                    ? (addClass(this.prevButton, "disabled"),
                      addClass(this.nextButton, "disabled"))
                    : 0 !== this.index || loop
                    ? this.index !== this.elements.length - 1 ||
                      loop ||
                      addClass(this.nextButton, "disabled")
                    : addClass(this.prevButton, "disabled");
              },
            },
            {
              key: "loop",
              value: function loop() {
                var loop = has(this.settings, "loopAtEnd")
                  ? this.settings.loopAtEnd
                  : null;
                return (
                  (loop = has(this.settings, "loop")
                    ? this.settings.loop
                    : loop),
                  loop
                );
              },
            },
            {
              key: "close",
              value: function close() {
                var _this8 = this;
                if (!this.lightboxOpen) {
                  if (this.events) {
                    for (var key in this.events)
                      this.events.hasOwnProperty(key) &&
                        this.events[key].destroy();
                    this.events = null;
                  }
                  return !1;
                }
                if (this.closing) return !1;
                (this.closing = !0),
                  this.slidePlayerPause(this.activeSlide),
                  this.fullElementsList &&
                    (this.elements = this.fullElementsList),
                  addClass(this.modal, "glightbox-closing"),
                  animateElement(
                    this.overlay,
                    "none" == this.settings.openEffect
                      ? "none"
                      : this.settings.cssEfects.fade.out
                  ),
                  animateElement(
                    this.activeSlide,
                    this.settings.cssEfects[this.settings.closeEffect].out,
                    function () {
                      if (
                        ((_this8.activeSlide = null),
                        (_this8.prevActiveSlideIndex = null),
                        (_this8.prevActiveSlide = null),
                        (_this8.built = !1),
                        _this8.events)
                      ) {
                        for (var _key in _this8.events)
                          _this8.events.hasOwnProperty(_key) &&
                            _this8.events[_key].destroy();
                        _this8.events = null;
                      }
                      var body = document.body;
                      removeClass(html, "glightbox-open"),
                        removeClass(
                          body,
                          "glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer"
                        ),
                        _this8.modal.parentNode.removeChild(_this8.modal),
                        _this8.trigger("close"),
                        isFunction(_this8.settings.onClose) &&
                          _this8.settings.onClose();
                      var styles = document.querySelector(".gcss-styles");
                      styles && styles.parentNode.removeChild(styles),
                        (_this8.lightboxOpen = !1),
                        (_this8.closing = null);
                    }
                  );
              },
            },
            {
              key: "destroy",
              value: function destroy() {
                this.close(),
                  this.clearAllEvents(),
                  this.baseEvents && this.baseEvents.destroy();
              },
            },
            {
              key: "on",
              value: function on(evt, callback) {
                var once =
                  arguments.length > 2 &&
                  void 0 !== arguments[2] &&
                  arguments[2];
                if (!evt || !isFunction(callback))
                  throw new TypeError(
                    "Event name and callback must be defined"
                  );
                this.apiEvents.push({
                  evt: evt,
                  once: once,
                  callback: callback,
                });
              },
            },
            {
              key: "once",
              value: function once(evt, callback) {
                this.on(evt, callback, !0);
              },
            },
            {
              key: "trigger",
              value: function trigger(eventName) {
                var _this9 = this,
                  data =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : null,
                  onceTriggered = [];
                each(this.apiEvents, function (event, i) {
                  var evt = event.evt,
                    once = event.once,
                    callback = event.callback;
                  evt == eventName &&
                    (callback(data), once && onceTriggered.push(i));
                }),
                  onceTriggered.length &&
                    each(onceTriggered, function (i) {
                      return _this9.apiEvents.splice(i, 1);
                    });
              },
            },
            {
              key: "clearAllEvents",
              value: function clearAllEvents() {
                this.apiEvents.splice(0, this.apiEvents.length);
              },
            },
            {
              key: "version",
              value: function version() {
                return "3.0.7";
              },
            },
          ]),
          GlightboxInit
        );
      })();
    return function glightbox() {
      var options =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        instance = new GlightboxInit(options);
      return instance.init(), instance;
    };
  }),
  (function () {
    var objPopup = document.querySelectorAll("#tt-pageContent .glightbox");
    if (
      "object" == typeof objPopup &&
      null !== objPopup &&
      !/iPad/i.test(navigator.userAgent)
    )
      GLightbox({ selector: ".glightbox3" }), GLightbox({ autoplayVideos: !0 });
  })();
var menuDesktop = (function () {
  function dropdownHandler() {
    window.innerWidth >= 1100 &&
      document
        .querySelectorAll("#js-desktop-menu li")
        .forEach(function (dropdownItem) {
          dropdownItem.querySelectorAll("ul").forEach(function (itemUl) {
            itemUl.parentNode.classList.add("has-submenu");
          }),
            (dropdownItem.onmouseenter = function (event, dropdownItem) {
              dropdown_delay = setTimeout(
                function (dropdownItem) {
                  if (!event.target) return !1;
                  dropdownItem.classList.add("is-active");
                },
                200,
                this
              );
            }),
            (dropdownItem.onmouseleave = function (event, dropdownItem) {
              clearTimeout(dropdown_delay), this.classList.remove("is-active");
            });
        });
  }
  dropdownHandler(), window.addEventListener("resize", dropdownHandler);
})();
function menuMobile() {
  var objMenu = document.getElementById("js-mobile-menu"),
    objMenuNav = objMenu.querySelector("nav"),
    objMenuHeight = objMenu.offsetHeight;
  Array.prototype.slice
    .call(objMenu.querySelectorAll("li"))
    .forEach(function (itemUl) {
      itemUl.querySelectorAll("ul").length > 0 &&
        (itemUl.classList.add("has-submenu"),
        itemUl.insertAdjacentHTML(
          "afterbegin",
          '<div class="link__open-submenu"></div>'
        ));
    }),
    objMenu.addEventListener("click", function (e) {
      e.target &&
        e.target.classList.contains("link__open-submenu") &&
        (function showSubmenu($target) {
          $target.parentNode.classList.add("active"),
            (function setHeight($target) {
              $target.parentNode.classList.add("active");
              var objMenuHeightNew =
                $target.parentNode.querySelector("ul").offsetHeight;
              objMenuHeight < objMenuHeightNew &&
                (objMenu.style.minHeight = objMenuHeightNew + 40 + "px");
            })($target);
          var getValueLeft = objMenuNav.style.left || 0,
            setNewValue = parseInt(getValueLeft) - 100;
          (objMenuNav.style.left = setNewValue + "%"),
            objMenu.classList.contains("submenu-visible") ||
              objMenu.classList.add("submenu-visible");
        })(e.target),
        e.target &&
          e.target.classList.contains("tt-mobile-menu__back") &&
          (function stepBack() {
            var getValueLeft = objMenuNav.style.left || 0,
              setNewValue = parseInt(getValueLeft) + 100;
            (objMenuNav.style.left = setNewValue + "%"),
              0 == setNewValue &&
                (objMenu.classList.remove("submenu-visible"),
                document
                  .querySelectorAll("#js-mobile-menu li")
                  .forEach(function (item) {
                    item.classList.contains("active") &&
                      item.classList.remove("active");
                  }));
            var actives = Array.prototype.slice.call(
                objMenu.querySelectorAll("li.active")
              ),
              lastActive = actives[actives.length - 1] || !1;
            lastActive && lastActive.classList.remove("active");
            objMenu.style.minHeight = objMenuHeight + "px";
          })();
    });
}
var modal = (function (options) {
  var modalLinks = document.querySelectorAll("div[data-modal]"),
    $objLockOffsetRight = document.querySelector("#js-init-sticky"),
    $body = document.body;
  function closeModal(nameModal) {
    $body.classList.remove("show-modal"),
      $body.removeAttribute("style"),
      $objLockOffsetRight.removeAttribute("style"),
      document.getElementById(nameModal).classList.remove("tt-modal__open"),
      (function enableScroll() {
        window.removeEventListener("touchmove", preventDefault, {
          passive: !1,
        });
      })(),
      setTimeout(function () {
        var elem = document.getElementById(nameModal);
        elem.length > 0 && elem.remove();
      }, 1400);
  }
  function changeInput(event) {
    event.target.files.length > 0 &&
      event.target.parentNode.classList.add("tt-files-uploaded");
  }
  function preventDefault(e) {
    e.preventDefault();
  }
  modalLinks &&
    document.addEventListener(
      "click",
      function (e) {
        event.target.hasAttribute("data-modal") &&
          (function initModal(nameModal, sizeModal, srcModal) {
            $body.classList.contains("tt-pupup-open") &&
              document.querySelector("#js-popup .tt-popup__toggle").click();
            (function createModalWrapper(nameModal, sizeModal) {
              return (
                $body.insertAdjacentHTML(
                  "beforeend",
                  `<div class="tt-modal" id="${nameModal}">\n\t\t\t<div class="tt-modal__wrapper"></div>\n\t\t\t<div class="tt-modal__body ${sizeModal}">\n\t\t\t\t<div class="tt-modal__close icon-748122"><label>Close</label></div>\n\t\t\t\t<div class="tt-modal__layout"></div>\n\t\t\t</div>\n\t\t</div>`
                ),
                modal
              );
            })(nameModal, sizeModal),
              (function includeLayout(nameModal, srcModal) {
                var xhttp = new XMLHttpRequest();
                (xhttp.onreadystatechange = function () {
                  4 == this.readyState &&
                    200 == this.status &&
                    (document.querySelector(
                      "#" + nameModal + " .tt-modal__layout"
                    ).innerHTML = this.responseText);
                }),
                  xhttp.open("GET", srcModal, !0),
                  xhttp.send();
                var withScroll =
                  window.innerWidth - document.documentElement.clientWidth;
                setTimeout(function () {
                  !(function showModal(nameModal, withScroll) {
                    $body.classList.add("show-modal"),
                      document
                        .getElementById(nameModal)
                        .classList.add("tt-modal__open"),
                      (function hangHandlerClose(nameModal) {
                        (objAsideClose = document.getElementById(nameModal)),
                          objAsideClose
                            .querySelector(".tt-modal__close")
                            .addEventListener("click", function (e) {
                              closeModal(nameModal);
                            });
                      })(nameModal),
                      (function lockOffsetRight(withScroll) {
                        ($body.style.paddingRight = withScroll + "px"),
                          $objLockOffsetRight.classList.contains(
                            "sticky-header"
                          ) &&
                            ($objLockOffsetRight.style.paddingRight =
                              withScroll + "px");
                      })(withScroll),
                      (function clickoutside(nameModal) {
                        if (document.body.classList.contains("touch-device"))
                          var objEvents = "touchstart";
                        else objEvents = "click";
                        document.addEventListener(objEvents, function (event) {
                          event.target.classList.contains(
                            "tt-modal__wrapper"
                          ) && closeModal(nameModal);
                        });
                      })(nameModal),
                      setTimeout(function () {
                        !(function uploadFile(nameModal) {
                          document
                            .querySelectorAll(
                              "#" + nameModal + " .tt-upload__item"
                            )
                            .forEach(function (objItem) {
                              objItem.addEventListener("click", function (e) {
                                var $this = this;
                                $this.querySelector("input").click(),
                                  $this.addEventListener("change", changeInput);
                              });
                            });
                        })(nameModal);
                      }, 100),
                      setTimeout(function () {
                        !(function initScroll(nameModal) {
                          var obj = document.querySelector("#" + nameModal),
                            pointInitScroll =
                              obj.querySelector(".tt-modal__body"),
                            pointHeight = pointInitScroll.clientHeight;
                          window.innerHeight <= pointHeight &&
                            (!(function disableScroll() {
                              window.addEventListener(
                                "touchmove",
                                preventDefault,
                                { passive: !1 }
                              );
                            })(),
                            obj
                              .querySelector(".tt-modal__close")
                              .classList.add("btn-close__inner"),
                            pointInitScroll.classList.add("fixed-height"),
                            new PerfectScrollbar(pointInitScroll));
                        })(nameModal),
                          validationInit();
                      }, 200);
                    var checkWidth = window.innerWidth;
                    window.addEventListener("resize", function () {
                      window.innerWidth !== checkWidth && closeModal(nameModal);
                    });
                  })(nameModal, withScroll);
                }, 200);
              })(nameModal, srcModal),
              setTimeout(function () {
                flatpickr(".tt-flatpickr-time", {
                  enableTime: !0,
                  noCalendar: !0,
                  dateFormat: "H:i",
                }),
                  flatpickr(".tt-flatpickr", { wrap: !0 });
              }, 400);
          })(
            event.target.dataset.modal,
            event.target.dataset.modalSize,
            event.target.dataset.modalSrc
          );
      },
      !1
    );
})();
/*!
 * perfect-scrollbar v1.4.0
 * (c) 2018 Hyunje Jun
 * @license MIT
 */ function hasClass(elem, className) {
  return elem.classList.contains(className);
}
!(function (global, factory) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = factory())
    : "function" == typeof define && define.amd
    ? define(factory)
    : (global.PerfectScrollbar = factory());
})(this, function () {
  "use strict";
  function get(element) {
    return getComputedStyle(element);
  }
  function set(element, obj) {
    for (var key in obj) {
      var val = obj[key];
      "number" == typeof val && (val += "px"), (element.style[key] = val);
    }
    return element;
  }
  function div(className) {
    var div = document.createElement("div");
    return (div.className = className), div;
  }
  var elMatches =
    "undefined" != typeof Element &&
    (Element.prototype.matches ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector);
  function matches(element, query) {
    if (!elMatches) throw new Error("No element matching method supported");
    return elMatches.call(element, query);
  }
  function remove(element) {
    element.remove
      ? element.remove()
      : element.parentNode && element.parentNode.removeChild(element);
  }
  function queryChildren(element, selector) {
    return Array.prototype.filter.call(element.children, function (child) {
      return matches(child, selector);
    });
  }
  var cls_main = "ps",
    cls_element = {
      thumb: function (x) {
        return "ps__thumb-" + x;
      },
      rail: function (x) {
        return "ps__rail-" + x;
      },
      consuming: "ps__child--consume",
    },
    cls_state = {
      focus: "ps--focus",
      clicking: "ps--clicking",
      active: function (x) {
        return "ps--active-" + x;
      },
      scrolling: function (x) {
        return "ps--scrolling-" + x;
      },
    },
    scrollingClassTimeout = { x: null, y: null };
  function addScrollingClass(i, x) {
    var classList = i.element.classList,
      className = cls_state.scrolling(x);
    classList.contains(className)
      ? clearTimeout(scrollingClassTimeout[x])
      : classList.add(className);
  }
  function removeScrollingClass(i, x) {
    scrollingClassTimeout[x] = setTimeout(function () {
      return i.isAlive && i.element.classList.remove(cls_state.scrolling(x));
    }, i.settings.scrollingThreshold);
  }
  var EventElement = function EventElement(element) {
      (this.element = element), (this.handlers = {});
    },
    prototypeAccessors = { isEmpty: { configurable: !0 } };
  (EventElement.prototype.bind = function bind(eventName, handler) {
    void 0 === this.handlers[eventName] && (this.handlers[eventName] = []),
      this.handlers[eventName].push(handler),
      this.element.addEventListener(eventName, handler, !1);
  }),
    (EventElement.prototype.unbind = function unbind(eventName, target) {
      var this$1 = this;
      this.handlers[eventName] = this.handlers[eventName].filter(function (
        handler
      ) {
        return (
          !(!target || handler === target) ||
          (this$1.element.removeEventListener(eventName, handler, !1), !1)
        );
      });
    }),
    (EventElement.prototype.unbindAll = function unbindAll() {
      for (var name in this.handlers) this.unbind(name);
    }),
    (prototypeAccessors.isEmpty.get = function () {
      var this$1 = this;
      return Object.keys(this.handlers).every(function (key) {
        return 0 === this$1.handlers[key].length;
      });
    }),
    Object.defineProperties(EventElement.prototype, prototypeAccessors);
  var EventManager = function EventManager() {
    this.eventElements = [];
  };
  function createEvent(name) {
    if ("function" == typeof window.CustomEvent) return new CustomEvent(name);
    var evt = document.createEvent("CustomEvent");
    return evt.initCustomEvent(name, !1, !1, void 0), evt;
  }
  (EventManager.prototype.eventElement = function eventElement(element) {
    var ee = this.eventElements.filter(function (ee) {
      return ee.element === element;
    })[0];
    return (
      ee || ((ee = new EventElement(element)), this.eventElements.push(ee)), ee
    );
  }),
    (EventManager.prototype.bind = function bind(element, eventName, handler) {
      this.eventElement(element).bind(eventName, handler);
    }),
    (EventManager.prototype.unbind = function unbind(
      element,
      eventName,
      handler
    ) {
      var ee = this.eventElement(element);
      ee.unbind(eventName, handler),
        ee.isEmpty &&
          this.eventElements.splice(this.eventElements.indexOf(ee), 1);
    }),
    (EventManager.prototype.unbindAll = function unbindAll() {
      this.eventElements.forEach(function (e) {
        return e.unbindAll();
      }),
        (this.eventElements = []);
    }),
    (EventManager.prototype.once = function once(element, eventName, handler) {
      var ee = this.eventElement(element),
        onceHandler = function (evt) {
          ee.unbind(eventName, onceHandler), handler(evt);
        };
      ee.bind(eventName, onceHandler);
    });
  var processScrollDiff = function (
    i,
    axis,
    diff,
    useScrollingClass,
    forceFireReachEvent
  ) {
    var fields;
    if (
      (void 0 === useScrollingClass && (useScrollingClass = !0),
      void 0 === forceFireReachEvent && (forceFireReachEvent = !1),
      "top" === axis)
    )
      fields = [
        "contentHeight",
        "containerHeight",
        "scrollTop",
        "y",
        "up",
        "down",
      ];
    else {
      if ("left" !== axis) throw new Error("A proper axis should be provided");
      fields = [
        "contentWidth",
        "containerWidth",
        "scrollLeft",
        "x",
        "left",
        "right",
      ];
    }
    !(function processScrollDiff$1(
      i,
      diff,
      ref,
      useScrollingClass,
      forceFireReachEvent
    ) {
      var contentHeight = ref[0],
        containerHeight = ref[1],
        scrollTop = ref[2],
        y = ref[3],
        up = ref[4],
        down = ref[5];
      void 0 === useScrollingClass && (useScrollingClass = !0);
      void 0 === forceFireReachEvent && (forceFireReachEvent = !1);
      var element = i.element;
      (i.reach[y] = null), element[scrollTop] < 1 && (i.reach[y] = "start");
      element[scrollTop] > i[contentHeight] - i[containerHeight] - 1 &&
        (i.reach[y] = "end");
      diff &&
        (element.dispatchEvent(createEvent("ps-scroll-" + y)),
        diff < 0
          ? element.dispatchEvent(createEvent("ps-scroll-" + up))
          : diff > 0 && element.dispatchEvent(createEvent("ps-scroll-" + down)),
        useScrollingClass &&
          (function setScrollingClassInstantly(i, x) {
            addScrollingClass(i, x), removeScrollingClass(i, x);
          })(i, y));
      i.reach[y] &&
        (diff || forceFireReachEvent) &&
        element.dispatchEvent(createEvent("ps-" + y + "-reach-" + i.reach[y]));
    })(i, diff, fields, useScrollingClass, forceFireReachEvent);
  };
  function toInt(x) {
    return parseInt(x, 10) || 0;
  }
  var env = {
      isWebKit:
        "undefined" != typeof document &&
        "WebkitAppearance" in document.documentElement.style,
      supportsTouch:
        "undefined" != typeof window &&
        ("ontouchstart" in window ||
          (window.DocumentTouch && document instanceof window.DocumentTouch)),
      supportsIePointer:
        "undefined" != typeof navigator && navigator.msMaxTouchPoints,
      isChrome:
        "undefined" != typeof navigator &&
        /Chrome/i.test(navigator && navigator.userAgent),
    },
    updateGeometry = function (i) {
      var element = i.element,
        roundedScrollTop = Math.floor(element.scrollTop);
      (i.containerWidth = element.clientWidth),
        (i.containerHeight = element.clientHeight),
        (i.contentWidth = element.scrollWidth),
        (i.contentHeight = element.scrollHeight),
        element.contains(i.scrollbarXRail) ||
          (queryChildren(element, cls_element.rail("x")).forEach(function (el) {
            return remove(el);
          }),
          element.appendChild(i.scrollbarXRail)),
        element.contains(i.scrollbarYRail) ||
          (queryChildren(element, cls_element.rail("y")).forEach(function (el) {
            return remove(el);
          }),
          element.appendChild(i.scrollbarYRail)),
        !i.settings.suppressScrollX &&
        i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
          ? ((i.scrollbarXActive = !0),
            (i.railXWidth = i.containerWidth - i.railXMarginWidth),
            (i.railXRatio = i.containerWidth / i.railXWidth),
            (i.scrollbarXWidth = getThumbSize(
              i,
              toInt((i.railXWidth * i.containerWidth) / i.contentWidth)
            )),
            (i.scrollbarXLeft = toInt(
              ((i.negativeScrollAdjustment + element.scrollLeft) *
                (i.railXWidth - i.scrollbarXWidth)) /
                (i.contentWidth - i.containerWidth)
            )))
          : (i.scrollbarXActive = !1),
        !i.settings.suppressScrollY &&
        i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
          ? ((i.scrollbarYActive = !0),
            (i.railYHeight = i.containerHeight - i.railYMarginHeight),
            (i.railYRatio = i.containerHeight / i.railYHeight),
            (i.scrollbarYHeight = getThumbSize(
              i,
              toInt((i.railYHeight * i.containerHeight) / i.contentHeight)
            )),
            (i.scrollbarYTop = toInt(
              (roundedScrollTop * (i.railYHeight - i.scrollbarYHeight)) /
                (i.contentHeight - i.containerHeight)
            )))
          : (i.scrollbarYActive = !1),
        i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth &&
          (i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth),
        i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight &&
          (i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight),
        (function updateCss(element, i) {
          var xRailOffset = { width: i.railXWidth },
            roundedScrollTop = Math.floor(element.scrollTop);
          i.isRtl
            ? (xRailOffset.left =
                i.negativeScrollAdjustment +
                element.scrollLeft +
                i.containerWidth -
                i.contentWidth)
            : (xRailOffset.left = element.scrollLeft);
          i.isScrollbarXUsingBottom
            ? (xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop)
            : (xRailOffset.top = i.scrollbarXTop + roundedScrollTop);
          set(i.scrollbarXRail, xRailOffset);
          var yRailOffset = { top: roundedScrollTop, height: i.railYHeight };
          i.isScrollbarYUsingRight
            ? i.isRtl
              ? (yRailOffset.right =
                  i.contentWidth -
                  (i.negativeScrollAdjustment + element.scrollLeft) -
                  i.scrollbarYRight -
                  i.scrollbarYOuterWidth)
              : (yRailOffset.right = i.scrollbarYRight - element.scrollLeft)
            : i.isRtl
            ? (yRailOffset.left =
                i.negativeScrollAdjustment +
                element.scrollLeft +
                2 * i.containerWidth -
                i.contentWidth -
                i.scrollbarYLeft -
                i.scrollbarYOuterWidth)
            : (yRailOffset.left = i.scrollbarYLeft + element.scrollLeft);
          set(i.scrollbarYRail, yRailOffset),
            set(i.scrollbarX, {
              left: i.scrollbarXLeft,
              width: i.scrollbarXWidth - i.railBorderXWidth,
            }),
            set(i.scrollbarY, {
              top: i.scrollbarYTop,
              height: i.scrollbarYHeight - i.railBorderYWidth,
            });
        })(element, i),
        i.scrollbarXActive
          ? element.classList.add(cls_state.active("x"))
          : (element.classList.remove(cls_state.active("x")),
            (i.scrollbarXWidth = 0),
            (i.scrollbarXLeft = 0),
            (element.scrollLeft = 0)),
        i.scrollbarYActive
          ? element.classList.add(cls_state.active("y"))
          : (element.classList.remove(cls_state.active("y")),
            (i.scrollbarYHeight = 0),
            (i.scrollbarYTop = 0),
            (element.scrollTop = 0));
    };
  function getThumbSize(i, thumbSize) {
    return (
      i.settings.minScrollbarLength &&
        (thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength)),
      i.settings.maxScrollbarLength &&
        (thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength)),
      thumbSize
    );
  }
  function bindMouseScrollHandler(i, ref) {
    var containerHeight = ref[0],
      contentHeight = ref[1],
      pageY = ref[2],
      railYHeight = ref[3],
      scrollbarY = ref[4],
      scrollbarYHeight = ref[5],
      scrollTop = ref[6],
      y = ref[7],
      scrollbarYRail = ref[8],
      element = i.element,
      startingScrollTop = null,
      startingMousePageY = null,
      scrollBy = null;
    function mouseMoveHandler(e) {
      (element[scrollTop] =
        startingScrollTop + scrollBy * (e[pageY] - startingMousePageY)),
        addScrollingClass(i, y),
        updateGeometry(i),
        e.stopPropagation(),
        e.preventDefault();
    }
    function mouseUpHandler() {
      removeScrollingClass(i, y),
        i[scrollbarYRail].classList.remove(cls_state.clicking),
        i.event.unbind(i.ownerDocument, "mousemove", mouseMoveHandler);
    }
    i.event.bind(i[scrollbarY], "mousedown", function (e) {
      (startingScrollTop = element[scrollTop]),
        (startingMousePageY = e[pageY]),
        (scrollBy =
          (i[contentHeight] - i[containerHeight]) /
          (i[railYHeight] - i[scrollbarYHeight])),
        i.event.bind(i.ownerDocument, "mousemove", mouseMoveHandler),
        i.event.once(i.ownerDocument, "mouseup", mouseUpHandler),
        i[scrollbarYRail].classList.add(cls_state.clicking),
        e.stopPropagation(),
        e.preventDefault();
    });
  }
  var handlers = {
      "click-rail": function (i) {
        i.event.bind(i.scrollbarY, "mousedown", function (e) {
          return e.stopPropagation();
        }),
          i.event.bind(i.scrollbarYRail, "mousedown", function (e) {
            var direction =
              e.pageY -
                window.pageYOffset -
                i.scrollbarYRail.getBoundingClientRect().top >
              i.scrollbarYTop
                ? 1
                : -1;
            (i.element.scrollTop += direction * i.containerHeight),
              updateGeometry(i),
              e.stopPropagation();
          }),
          i.event.bind(i.scrollbarX, "mousedown", function (e) {
            return e.stopPropagation();
          }),
          i.event.bind(i.scrollbarXRail, "mousedown", function (e) {
            var direction =
              e.pageX -
                window.pageXOffset -
                i.scrollbarXRail.getBoundingClientRect().left >
              i.scrollbarXLeft
                ? 1
                : -1;
            (i.element.scrollLeft += direction * i.containerWidth),
              updateGeometry(i),
              e.stopPropagation();
          });
      },
      "drag-thumb": function (i) {
        bindMouseScrollHandler(i, [
          "containerWidth",
          "contentWidth",
          "pageX",
          "railXWidth",
          "scrollbarX",
          "scrollbarXWidth",
          "scrollLeft",
          "x",
          "scrollbarXRail",
        ]),
          bindMouseScrollHandler(i, [
            "containerHeight",
            "contentHeight",
            "pageY",
            "railYHeight",
            "scrollbarY",
            "scrollbarYHeight",
            "scrollTop",
            "y",
            "scrollbarYRail",
          ]);
      },
      keyboard: function (i) {
        var element = i.element;
        i.event.bind(i.ownerDocument, "keydown", function (e) {
          if (
            !(
              (e.isDefaultPrevented && e.isDefaultPrevented()) ||
              e.defaultPrevented
            ) &&
            (matches(element, ":hover") ||
              matches(i.scrollbarX, ":focus") ||
              matches(i.scrollbarY, ":focus"))
          ) {
            var activeElement = document.activeElement
              ? document.activeElement
              : i.ownerDocument.activeElement;
            if (activeElement) {
              if ("IFRAME" === activeElement.tagName)
                activeElement = activeElement.contentDocument.activeElement;
              else
                for (; activeElement.shadowRoot; )
                  activeElement = activeElement.shadowRoot.activeElement;
              if (
                (function isEditable(el) {
                  return (
                    matches(el, "input,[contenteditable]") ||
                    matches(el, "select,[contenteditable]") ||
                    matches(el, "textarea,[contenteditable]") ||
                    matches(el, "button,[contenteditable]")
                  );
                })(activeElement)
              )
                return;
            }
            var deltaX = 0,
              deltaY = 0;
            switch (e.which) {
              case 37:
                deltaX = e.metaKey
                  ? -i.contentWidth
                  : e.altKey
                  ? -i.containerWidth
                  : -30;
                break;
              case 38:
                deltaY = e.metaKey
                  ? i.contentHeight
                  : e.altKey
                  ? i.containerHeight
                  : 30;
                break;
              case 39:
                deltaX = e.metaKey
                  ? i.contentWidth
                  : e.altKey
                  ? i.containerWidth
                  : 30;
                break;
              case 40:
                deltaY = e.metaKey
                  ? -i.contentHeight
                  : e.altKey
                  ? -i.containerHeight
                  : -30;
                break;
              case 32:
                deltaY = e.shiftKey ? i.containerHeight : -i.containerHeight;
                break;
              case 33:
                deltaY = i.containerHeight;
                break;
              case 34:
                deltaY = -i.containerHeight;
                break;
              case 36:
                deltaY = i.contentHeight;
                break;
              case 35:
                deltaY = -i.contentHeight;
                break;
              default:
                return;
            }
            (i.settings.suppressScrollX && 0 !== deltaX) ||
              (i.settings.suppressScrollY && 0 !== deltaY) ||
              ((element.scrollTop -= deltaY),
              (element.scrollLeft += deltaX),
              updateGeometry(i),
              (function shouldPreventDefault(deltaX, deltaY) {
                var scrollTop = Math.floor(element.scrollTop);
                if (0 === deltaX) {
                  if (!i.scrollbarYActive) return !1;
                  if (
                    (0 === scrollTop && deltaY > 0) ||
                    (scrollTop >= i.contentHeight - i.containerHeight &&
                      deltaY < 0)
                  )
                    return !i.settings.wheelPropagation;
                }
                var scrollLeft = element.scrollLeft;
                if (0 === deltaY) {
                  if (!i.scrollbarXActive) return !1;
                  if (
                    (0 === scrollLeft && deltaX < 0) ||
                    (scrollLeft >= i.contentWidth - i.containerWidth &&
                      deltaX > 0)
                  )
                    return !i.settings.wheelPropagation;
                }
                return !0;
              })(deltaX, deltaY) && e.preventDefault());
          }
        });
      },
      wheel: function (i) {
        var element = i.element;
        function mousewheelHandler(e) {
          var ref = (function getDeltaFromEvent(e) {
              var deltaX = e.deltaX,
                deltaY = -1 * e.deltaY;
              return (
                (void 0 !== deltaX && void 0 !== deltaY) ||
                  ((deltaX = (-1 * e.wheelDeltaX) / 6),
                  (deltaY = e.wheelDeltaY / 6)),
                e.deltaMode &&
                  1 === e.deltaMode &&
                  ((deltaX *= 10), (deltaY *= 10)),
                deltaX != deltaX &&
                  deltaY != deltaY &&
                  ((deltaX = 0), (deltaY = e.wheelDelta)),
                e.shiftKey ? [-deltaY, -deltaX] : [deltaX, deltaY]
              );
            })(e),
            deltaX = ref[0],
            deltaY = ref[1];
          if (
            !(function shouldBeConsumedByChild(target, deltaX, deltaY) {
              if (!env.isWebKit && element.querySelector("select:focus"))
                return !0;
              if (!element.contains(target)) return !1;
              for (var cursor = target; cursor && cursor !== element; ) {
                if (cursor.classList.contains(cls_element.consuming)) return !0;
                var style = get(cursor);
                if (
                  [style.overflow, style.overflowX, style.overflowY]
                    .join("")
                    .match(/(scroll|auto)/)
                ) {
                  var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
                  if (
                    maxScrollTop > 0 &&
                    !(
                      (0 === cursor.scrollTop && deltaY > 0) ||
                      (cursor.scrollTop === maxScrollTop && deltaY < 0)
                    )
                  )
                    return !0;
                  var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
                  if (
                    maxScrollLeft > 0 &&
                    !(
                      (0 === cursor.scrollLeft && deltaX < 0) ||
                      (cursor.scrollLeft === maxScrollLeft && deltaX > 0)
                    )
                  )
                    return !0;
                }
                cursor = cursor.parentNode;
              }
              return !1;
            })(e.target, deltaX, deltaY)
          ) {
            var shouldPrevent = !1;
            i.settings.useBothWheelAxes
              ? i.scrollbarYActive && !i.scrollbarXActive
                ? (deltaY
                    ? (element.scrollTop -= deltaY * i.settings.wheelSpeed)
                    : (element.scrollTop += deltaX * i.settings.wheelSpeed),
                  (shouldPrevent = !0))
                : i.scrollbarXActive &&
                  !i.scrollbarYActive &&
                  (deltaX
                    ? (element.scrollLeft += deltaX * i.settings.wheelSpeed)
                    : (element.scrollLeft -= deltaY * i.settings.wheelSpeed),
                  (shouldPrevent = !0))
              : ((element.scrollTop -= deltaY * i.settings.wheelSpeed),
                (element.scrollLeft += deltaX * i.settings.wheelSpeed)),
              updateGeometry(i),
              (shouldPrevent =
                shouldPrevent ||
                (function shouldPreventDefault(deltaX, deltaY) {
                  var roundedScrollTop = Math.floor(element.scrollTop),
                    isTop = 0 === element.scrollTop,
                    isBottom =
                      roundedScrollTop + element.offsetHeight ===
                      element.scrollHeight,
                    isLeft = 0 === element.scrollLeft,
                    isRight =
                      element.scrollLeft + element.offsetWidth ===
                      element.scrollWidth;
                  return (
                    !(Math.abs(deltaY) > Math.abs(deltaX)
                      ? isTop || isBottom
                      : isLeft || isRight) || !i.settings.wheelPropagation
                  );
                })(deltaX, deltaY)),
              shouldPrevent &&
                !e.ctrlKey &&
                (e.stopPropagation(), e.preventDefault());
          }
        }
        void 0 !== window.onwheel
          ? i.event.bind(element, "wheel", mousewheelHandler)
          : void 0 !== window.onmousewheel &&
            i.event.bind(element, "mousewheel", mousewheelHandler);
      },
      touch: function (i) {
        if (env.supportsTouch || env.supportsIePointer) {
          var element = i.element,
            startOffset = {},
            startTime = 0,
            speed = {},
            easingLoop = null;
          env.supportsTouch
            ? (i.event.bind(element, "touchstart", touchStart),
              i.event.bind(element, "touchmove", touchMove),
              i.event.bind(element, "touchend", touchEnd))
            : env.supportsIePointer &&
              (window.PointerEvent
                ? (i.event.bind(element, "pointerdown", touchStart),
                  i.event.bind(element, "pointermove", touchMove),
                  i.event.bind(element, "pointerup", touchEnd))
                : window.MSPointerEvent &&
                  (i.event.bind(element, "MSPointerDown", touchStart),
                  i.event.bind(element, "MSPointerMove", touchMove),
                  i.event.bind(element, "MSPointerUp", touchEnd)));
        }
        function applyTouchMove(differenceX, differenceY) {
          (element.scrollTop -= differenceY),
            (element.scrollLeft -= differenceX),
            updateGeometry(i);
        }
        function getTouch(e) {
          return e.targetTouches ? e.targetTouches[0] : e;
        }
        function shouldHandle(e) {
          return (
            (!e.pointerType || "pen" !== e.pointerType || 0 !== e.buttons) &&
            (!(!e.targetTouches || 1 !== e.targetTouches.length) ||
              !(
                !e.pointerType ||
                "mouse" === e.pointerType ||
                e.pointerType === e.MSPOINTER_TYPE_MOUSE
              ))
          );
        }
        function touchStart(e) {
          if (shouldHandle(e)) {
            var touch = getTouch(e);
            (startOffset.pageX = touch.pageX),
              (startOffset.pageY = touch.pageY),
              (startTime = new Date().getTime()),
              null !== easingLoop && clearInterval(easingLoop);
          }
        }
        function touchMove(e) {
          if (shouldHandle(e)) {
            var touch = getTouch(e),
              currentOffset = { pageX: touch.pageX, pageY: touch.pageY },
              differenceX = currentOffset.pageX - startOffset.pageX,
              differenceY = currentOffset.pageY - startOffset.pageY;
            if (
              (function shouldBeConsumedByChild(target, deltaX, deltaY) {
                if (!element.contains(target)) return !1;
                for (var cursor = target; cursor && cursor !== element; ) {
                  if (cursor.classList.contains(cls_element.consuming))
                    return !0;
                  var style = get(cursor);
                  if (
                    [style.overflow, style.overflowX, style.overflowY]
                      .join("")
                      .match(/(scroll|auto)/)
                  ) {
                    var maxScrollTop =
                      cursor.scrollHeight - cursor.clientHeight;
                    if (
                      maxScrollTop > 0 &&
                      !(
                        (0 === cursor.scrollTop && deltaY > 0) ||
                        (cursor.scrollTop === maxScrollTop && deltaY < 0)
                      )
                    )
                      return !0;
                    var maxScrollLeft = cursor.scrollLeft - cursor.clientWidth;
                    if (
                      maxScrollLeft > 0 &&
                      !(
                        (0 === cursor.scrollLeft && deltaX < 0) ||
                        (cursor.scrollLeft === maxScrollLeft && deltaX > 0)
                      )
                    )
                      return !0;
                  }
                  cursor = cursor.parentNode;
                }
                return !1;
              })(e.target, differenceX, differenceY)
            )
              return;
            applyTouchMove(differenceX, differenceY),
              (startOffset = currentOffset);
            var currentTime = new Date().getTime(),
              timeGap = currentTime - startTime;
            timeGap > 0 &&
              ((speed.x = differenceX / timeGap),
              (speed.y = differenceY / timeGap),
              (startTime = currentTime)),
              (function shouldPrevent(deltaX, deltaY) {
                var scrollTop = Math.floor(element.scrollTop),
                  scrollLeft = element.scrollLeft,
                  magnitudeX = Math.abs(deltaX),
                  magnitudeY = Math.abs(deltaY);
                if (magnitudeY > magnitudeX) {
                  if (
                    (deltaY < 0 &&
                      scrollTop === i.contentHeight - i.containerHeight) ||
                    (deltaY > 0 && 0 === scrollTop)
                  )
                    return 0 === window.scrollY && deltaY > 0 && env.isChrome;
                } else if (
                  magnitudeX > magnitudeY &&
                  ((deltaX < 0 &&
                    scrollLeft === i.contentWidth - i.containerWidth) ||
                    (deltaX > 0 && 0 === scrollLeft))
                )
                  return !0;
                return !0;
              })(differenceX, differenceY) && e.preventDefault();
          }
        }
        function touchEnd() {
          i.settings.swipeEasing &&
            (clearInterval(easingLoop),
            (easingLoop = setInterval(function () {
              i.isInitialized
                ? clearInterval(easingLoop)
                : speed.x || speed.y
                ? Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01
                  ? clearInterval(easingLoop)
                  : (applyTouchMove(30 * speed.x, 30 * speed.y),
                    (speed.x *= 0.8),
                    (speed.y *= 0.8))
                : clearInterval(easingLoop);
            }, 10)));
        }
      },
    },
    PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
      var this$1 = this;
      if (
        (void 0 === userSettings && (userSettings = {}),
        "string" == typeof element &&
          (element = document.querySelector(element)),
        !element || !element.nodeName)
      )
        throw new Error(
          "no element is specified to initialize PerfectScrollbar"
        );
      for (var key in ((this.element = element),
      element.classList.add(cls_main),
      (this.settings = {
        handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
        maxScrollbarLength: null,
        minScrollbarLength: null,
        scrollingThreshold: 1e3,
        scrollXMarginOffset: 0,
        scrollYMarginOffset: 0,
        suppressScrollX: !1,
        suppressScrollY: !1,
        swipeEasing: !0,
        useBothWheelAxes: !1,
        wheelPropagation: !0,
        wheelSpeed: 1,
      }),
      userSettings))
        this$1.settings[key] = userSettings[key];
      (this.containerWidth = null),
        (this.containerHeight = null),
        (this.contentWidth = null),
        (this.contentHeight = null);
      var result,
        originalScrollLeft,
        focus = function () {
          return element.classList.add(cls_state.focus);
        },
        blur = function () {
          return element.classList.remove(cls_state.focus);
        };
      (this.isRtl = "rtl" === get(element).direction),
        (this.isNegativeScroll =
          ((originalScrollLeft = element.scrollLeft),
          (element.scrollLeft = -1),
          (result = element.scrollLeft < 0),
          (element.scrollLeft = originalScrollLeft),
          result)),
        (this.negativeScrollAdjustment = this.isNegativeScroll
          ? element.scrollWidth - element.clientWidth
          : 0),
        (this.event = new EventManager()),
        (this.ownerDocument = element.ownerDocument || document),
        (this.scrollbarXRail = div(cls_element.rail("x"))),
        element.appendChild(this.scrollbarXRail),
        (this.scrollbarX = div(cls_element.thumb("x"))),
        this.scrollbarXRail.appendChild(this.scrollbarX),
        this.scrollbarX.setAttribute("tabindex", 0),
        this.event.bind(this.scrollbarX, "focus", focus),
        this.event.bind(this.scrollbarX, "blur", blur),
        (this.scrollbarXActive = null),
        (this.scrollbarXWidth = null),
        (this.scrollbarXLeft = null);
      var railXStyle = get(this.scrollbarXRail);
      (this.scrollbarXBottom = parseInt(railXStyle.bottom, 10)),
        isNaN(this.scrollbarXBottom)
          ? ((this.isScrollbarXUsingBottom = !1),
            (this.scrollbarXTop = toInt(railXStyle.top)))
          : (this.isScrollbarXUsingBottom = !0),
        (this.railBorderXWidth =
          toInt(railXStyle.borderLeftWidth) +
          toInt(railXStyle.borderRightWidth)),
        set(this.scrollbarXRail, { display: "block" }),
        (this.railXMarginWidth =
          toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight)),
        set(this.scrollbarXRail, { display: "" }),
        (this.railXWidth = null),
        (this.railXRatio = null),
        (this.scrollbarYRail = div(cls_element.rail("y"))),
        element.appendChild(this.scrollbarYRail),
        (this.scrollbarY = div(cls_element.thumb("y"))),
        this.scrollbarYRail.appendChild(this.scrollbarY),
        this.scrollbarY.setAttribute("tabindex", 0),
        this.event.bind(this.scrollbarY, "focus", focus),
        this.event.bind(this.scrollbarY, "blur", blur),
        (this.scrollbarYActive = null),
        (this.scrollbarYHeight = null),
        (this.scrollbarYTop = null);
      var railYStyle = get(this.scrollbarYRail);
      (this.scrollbarYRight = parseInt(railYStyle.right, 10)),
        isNaN(this.scrollbarYRight)
          ? ((this.isScrollbarYUsingRight = !1),
            (this.scrollbarYLeft = toInt(railYStyle.left)))
          : (this.isScrollbarYUsingRight = !0),
        (this.scrollbarYOuterWidth = this.isRtl
          ? (function outerWidth(element) {
              var styles = get(element);
              return (
                toInt(styles.width) +
                toInt(styles.paddingLeft) +
                toInt(styles.paddingRight) +
                toInt(styles.borderLeftWidth) +
                toInt(styles.borderRightWidth)
              );
            })(this.scrollbarY)
          : null),
        (this.railBorderYWidth =
          toInt(railYStyle.borderTopWidth) +
          toInt(railYStyle.borderBottomWidth)),
        set(this.scrollbarYRail, { display: "block" }),
        (this.railYMarginHeight =
          toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom)),
        set(this.scrollbarYRail, { display: "" }),
        (this.railYHeight = null),
        (this.railYRatio = null),
        (this.reach = {
          x:
            element.scrollLeft <= 0
              ? "start"
              : element.scrollLeft >= this.contentWidth - this.containerWidth
              ? "end"
              : null,
          y:
            element.scrollTop <= 0
              ? "start"
              : element.scrollTop >= this.contentHeight - this.containerHeight
              ? "end"
              : null,
        }),
        (this.isAlive = !0),
        this.settings.handlers.forEach(function (handlerName) {
          return handlers[handlerName](this$1);
        }),
        (this.lastScrollTop = Math.floor(element.scrollTop)),
        (this.lastScrollLeft = element.scrollLeft),
        this.event.bind(this.element, "scroll", function (e) {
          return this$1.onScroll(e);
        }),
        updateGeometry(this);
    };
  return (
    (PerfectScrollbar.prototype.update = function update() {
      this.isAlive &&
        ((this.negativeScrollAdjustment = this.isNegativeScroll
          ? this.element.scrollWidth - this.element.clientWidth
          : 0),
        set(this.scrollbarXRail, { display: "block" }),
        set(this.scrollbarYRail, { display: "block" }),
        (this.railXMarginWidth =
          toInt(get(this.scrollbarXRail).marginLeft) +
          toInt(get(this.scrollbarXRail).marginRight)),
        (this.railYMarginHeight =
          toInt(get(this.scrollbarYRail).marginTop) +
          toInt(get(this.scrollbarYRail).marginBottom)),
        set(this.scrollbarXRail, { display: "none" }),
        set(this.scrollbarYRail, { display: "none" }),
        updateGeometry(this),
        processScrollDiff(this, "top", 0, !1, !0),
        processScrollDiff(this, "left", 0, !1, !0),
        set(this.scrollbarXRail, { display: "" }),
        set(this.scrollbarYRail, { display: "" }));
    }),
    (PerfectScrollbar.prototype.onScroll = function onScroll(e) {
      this.isAlive &&
        (updateGeometry(this),
        processScrollDiff(
          this,
          "top",
          this.element.scrollTop - this.lastScrollTop
        ),
        processScrollDiff(
          this,
          "left",
          this.element.scrollLeft - this.lastScrollLeft
        ),
        (this.lastScrollTop = Math.floor(this.element.scrollTop)),
        (this.lastScrollLeft = this.element.scrollLeft));
    }),
    (PerfectScrollbar.prototype.destroy = function destroy() {
      this.isAlive &&
        (this.event.unbindAll(),
        remove(this.scrollbarX),
        remove(this.scrollbarY),
        remove(this.scrollbarXRail),
        remove(this.scrollbarYRail),
        this.removePsClasses(),
        (this.element = null),
        (this.scrollbarX = null),
        (this.scrollbarY = null),
        (this.scrollbarXRail = null),
        (this.scrollbarYRail = null),
        (this.isAlive = !1));
    }),
    (PerfectScrollbar.prototype.removePsClasses = function removePsClasses() {
      this.element.className = this.element.className
        .split(" ")
        .filter(function (name) {
          return !name.match(/^ps([-_].+|)$/);
        })
        .join(" ");
    }),
    PerfectScrollbar
  );
}),
  Element.prototype.matches ||
    (Element.prototype.matches = Element.prototype.msMatchesSelector),
  Element.prototype.closest ||
    (Element.prototype.closest = function (selector) {
      for (var el = this; el; ) {
        if (el.matches(selector)) return el;
        el = el.parentElement;
      }
    }),
  window.NodeList &&
    !NodeList.prototype.forEach &&
    (NodeList.prototype.forEach = Array.prototype.forEach);
var popupDropdown = (function () {
  var obj = document.querySelector("#js-header .tt-popup"),
    $body = document.body,
    $objLockOffsetRight = document.querySelector("#js-init-sticky");
  function preventDefault(e) {
    e.preventDefault();
  }
  document.addEventListener(
    "click",
    function (e) {
      var $target = e.target,
        objWrapper = document.getElementById("js-popup-wrapper"),
        withScroll = window.innerWidth - document.documentElement.clientWidth;
      !(function checkInclude($target) {
        if ($target.classList.contains("tt-popup__toggle")) {
          "true" === $target.closest(".tt-popup").dataset.ajaxCheck &&
            (function include() {
              var xhttp = new XMLHttpRequest();
              (xhttp.onreadystatechange = function () {
                if (4 == this.readyState && 200 == this.status) {
                  var pointInclude = document.querySelector(
                    "#js-popup .tt-dropdown"
                  );
                  (pointInclude.innerHTML = this.responseText),
                    menuMobile(),
                    new PerfectScrollbar(pointInclude, {
                      wheelSpeed: 2,
                      wheelPropagation: !0,
                      minScrollbarLength: 20,
                    });
                }
              }),
                xhttp.open("GET", "ajax-content/header-popup.html", !0),
                xhttp.send();
            })();
        }
      })($target),
        objWrapper ||
          (function createPopupWrapper() {
            obj.insertAdjacentHTML(
              "beforeend",
              '<div class="tt-popup__wrapper" id="js-popup-wrapper"></div>'
            );
          })(),
        (function openPopup($target, withScroll) {
          hasClass($target, "tt-popup__toggle") &&
            (!(function lockOffsetRight(withScroll) {
              ($body.style.paddingRight = withScroll + "px"),
                $objLockOffsetRight.classList.contains("sticky-header") &&
                  ($objLockOffsetRight.style.paddingRight = withScroll + "px");
            })(withScroll),
            (function lockOffsetTop() {
              var valueScroll =
                $body.scrollTop || document.documentElement.scrollTop;
              $body.style.top = valueScroll + "px";
            })(),
            $target.closest(".tt-popup").classList.toggle("to-show"),
            $body.classList.toggle("tt-pupup-open"),
            (function disableScroll() {
              document.body.addEventListener("touchmove", preventDefault, {
                passive: !1,
              });
            })());
        })($target, withScroll),
        (function closePopup($target) {
          hasClass($target, "tt-popup__toggle") &&
            !hasClass(obj, "to-show") &&
            document.querySelector("#js-popup-wrapper").click();
          hasClass($target, "tt-popup__close") &&
            ($target.closest(".tt-popup").classList.remove("to-show"),
            $body.classList.remove("tt-pupup-open"),
            $body.removeAttribute("style"),
            $objLockOffsetRight.removeAttribute("style"),
            (function enableScroll() {
              document.body.removeEventListener("touchmove", preventDefault);
            })());
        })($target);
    },
    !1
  ),
    window.addEventListener("resize", function close() {
      hasClass($body, "tt-pupup-open") &&
        obj.querySelector(".tt-popup__toggle").touchstart();
    }),
    document.addEventListener("click", function (event) {
      document.getElementById("js-popup-wrapper").contains(event.target) &&
        document.querySelector("#js-header .tt-popup__close").click();
    });
})();
function findOffset(element) {
  var top = 0,
    left = 0;
  do {
    (top += element.offsetTop || 0),
      (left += element.offsetLeft || 0),
      (element = element.offsetParent);
  } while (element);
  return { top: top, left: left };
}
!(function initCarusel(searchpoint) {
  document
    .querySelectorAll("#" + searchpoint + ' [data-carousel="swiper"]')
    .forEach(function (objCarusel) {
      var slidesXXl = objCarusel.dataset.slidesXxl,
        slidesXl = objCarusel.dataset.slidesXl,
        slidesLg = objCarusel.dataset.slidesLg,
        slidesMd = objCarusel.dataset.slidesMd,
        slidesSm = objCarusel.dataset.slidesSm,
        autoplayDelay =
          ((slidesSm = objCarusel.dataset.slidesSm),
          objCarusel.dataset.autoplayDelay),
        spaceBetween = Number(objCarusel.dataset.spaceBetween),
        arrowLeft = objCarusel.getElementsByClassName("swiper-next")[0],
        arrowRight = objCarusel.getElementsByClassName("swiper-prev")[0],
        swiper = new Swiper(objCarusel, {
          watchOverflow: !0,
          spaceBetween: spaceBetween || 15,
          pagination: { el: ".swiper-pagination", clickable: !0 },
          navigation: { nextEl: arrowLeft, prevEl: arrowRight, clickable: !0 },
          autoplay: {
            delay: autoplayDelay || 5e3,
            stopOnLastSlide: !1,
            disableOnInteraction: !1,
          },
          autoHeight: !0,
          speed: 1e3,
          breakpoints: {
            320: { slidesPerView: slidesSm || 2 },
            576: { slidesPerView: slidesMd || 2, autoHeight: !0 },
            768: {
              slidesPerView: slidesLg || 2,
              spaceBetween: spaceBetween || 30,
            },
            1025: { slidesPerView: slidesXl || 3 },
            1500: { slidesPerView: slidesXXl || 3 },
          },
          preloadeImages: !1,
        });
      window.addEventListener("resize", function () {
        var timer;
        timer && clearTimeout(timer),
          (timer = setTimeout(function () {
            swiper.updateAutoHeight();
          }, 200));
      }),
        window.addEventListener("DOMContentLoaded", function () {
          var timer;
          timer && clearTimeout(timer),
            (timer = setTimeout(function () {
              swiper.update();
            }, 200));
        });
    });
})("tt-pageContent"),
  (function () {
    var caruselGalleryLarge = document.querySelector(".gallery-large"),
      caruselGalleryThumbs = document.querySelector(".gallery-thumbs");
    if (caruselGalleryLarge && caruselGalleryThumbs) {
      var galleryTop = new Swiper(caruselGalleryLarge, {
          spaceBetween: 10,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          loop: !0,
          loopedSlides: 4,
          onSlideChangeEnd: function (s) {
            console.log("onSlideChangeEnd");
          },
        }),
        galleryThumbs = new Swiper(caruselGalleryThumbs, {
          spaceBetween: 14,
          slidesPerView: 4,
          slideToClickedSlide: !0,
          loop: !0,
          loopedSlides: 4,
          on: {
            progress: function () {
              Array.prototype.slice
                .call(caruselGalleryLarge.querySelectorAll("video"))
                .forEach(function (obj) {
                  obj.pause(), obj.parentNode.classList.remove("tt-show-video");
                });
            },
          },
        });
      (galleryTop.controller.control = galleryThumbs),
        (galleryThumbs.controller.control = galleryTop),
        window.addEventListener("DOMContentLoaded", function () {
          var timer;
          timer && clearTimeout(timer),
            (timer = setTimeout(function () {
              galleryTop.update(), galleryThumbs.update();
            }, 500));
        }),
        (function playVideoLinks() {
          var linkVideo = document.querySelectorAll(
              "#tt-pageContent .tt-link-video video"
            ),
            linkVideoArray = Array.prototype.slice.call(linkVideo);
          if (linkVideo) {
            if (document.body.classList.contains("touch-device"))
              var objEvents = "touchstart";
            else objEvents = "click";
            linkVideoArray.forEach(function (el) {
              el.addEventListener(objEvents, function (e) {
                event.preventDefault();
                var objWrapper = e.target.parentNode;
                objWrapper.classList.contains("tt-show-video")
                  ? objWrapper.classList.contains("tt-show-video") &&
                    (this.pause(), objWrapper.classList.remove("tt-show-video"))
                  : (objWrapper.classList.add("tt-show-video"), this.play());
              });
            });
          }
        })();
    }
  })(),
  (function () {
    var global, factory;
    (global = this),
      (factory = function () {
        "use strict";
        var win =
            "undefined" == typeof window
              ? {
                  navigator: { userAgent: "" },
                  location: {},
                  history: {},
                  addEventListener: function addEventListener() {},
                  removeEventListener: function removeEventListener() {},
                  getComputedStyle: function getComputedStyle() {
                    return {};
                  },
                  Image: function Image() {},
                  Date: function Date() {},
                  screen: {},
                }
              : window,
          Dom7 = function Dom7(arr) {
            for (var i = 0; i < arr.length; i += 1) this[i] = arr[i];
            return (this.length = arr.length), this;
          };
        function $$1(selector, context) {
          var arr = [],
            i = 0;
          if (selector && !context && selector instanceof Dom7) return selector;
          if (selector)
            if ("string" == typeof selector) {
              var els,
                tempParent,
                html = selector.trim();
              if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                var toCreate = "div";
                for (
                  0 === html.indexOf("<li") && (toCreate = "ul"),
                    0 === html.indexOf("<tr") && (toCreate = "tbody"),
                    (0 !== html.indexOf("<td") && 0 !== html.indexOf("<th")) ||
                      (toCreate = "tr"),
                    0 === html.indexOf("<tbody") && (toCreate = "table"),
                    0 === html.indexOf("<option") && (toCreate = "select"),
                    (tempParent = document.createElement(toCreate)).innerHTML =
                      html,
                    i = 0;
                  i < tempParent.childNodes.length;
                  i += 1
                )
                  arr.push(tempParent.childNodes[i]);
              } else
                for (
                  els =
                    context || "#" !== selector[0] || selector.match(/[ .<>:~]/)
                      ? (context || document).querySelectorAll(selector.trim())
                      : [
                          document.getElementById(
                            selector.trim().split("#")[1]
                          ),
                        ],
                    i = 0;
                  i < els.length;
                  i += 1
                )
                  els[i] && arr.push(els[i]);
            } else if (
              selector.nodeType ||
              selector === window ||
              selector === document
            )
              arr.push(selector);
            else if (selector.length > 0 && selector[0].nodeType)
              for (i = 0; i < selector.length; i += 1) arr.push(selector[i]);
          return new Dom7(arr);
        }
        function unique(arr) {
          for (var uniqueArray = [], i = 0; i < arr.length; i += 1)
            -1 === uniqueArray.indexOf(arr[i]) && uniqueArray.push(arr[i]);
          return uniqueArray;
        }
        ($$1.fn = Dom7.prototype),
          ($$1.Class = Dom7),
          ($$1.Dom7 = Dom7),
          "resize scroll".split(" ");
        var Methods = {
          addClass: function addClass(className) {
            if (void 0 === className) return this;
            for (
              var classes = className.split(" "), i = 0;
              i < classes.length;
              i += 1
            )
              for (var j = 0; j < this.length; j += 1)
                void 0 !== this[j].classList &&
                  this[j].classList.add(classes[i]);
            return this;
          },
          removeClass: function removeClass(className) {
            for (
              var classes = className.split(" "), i = 0;
              i < classes.length;
              i += 1
            )
              for (var j = 0; j < this.length; j += 1)
                void 0 !== this[j].classList &&
                  this[j].classList.remove(classes[i]);
            return this;
          },
          hasClass: function hasClass(className) {
            return !!this[0] && this[0].classList.contains(className);
          },
          toggleClass: function toggleClass(className) {
            for (
              var classes = className.split(" "), i = 0;
              i < classes.length;
              i += 1
            )
              for (var j = 0; j < this.length; j += 1)
                void 0 !== this[j].classList &&
                  this[j].classList.toggle(classes[i]);
            return this;
          },
          attr: function attr(attrs, value) {
            var arguments$1 = arguments,
              this$1 = this;
            if (1 === arguments.length && "string" == typeof attrs)
              return this[0] ? this[0].getAttribute(attrs) : void 0;
            for (var i = 0; i < this.length; i += 1)
              if (2 === arguments$1.length)
                this$1[i].setAttribute(attrs, value);
              else
                for (var attrName in attrs)
                  (this$1[i][attrName] = attrs[attrName]),
                    this$1[i].setAttribute(attrName, attrs[attrName]);
            return this;
          },
          removeAttr: function removeAttr(attr) {
            for (var i = 0; i < this.length; i += 1)
              this[i].removeAttribute(attr);
            return this;
          },
          data: function data(key, value) {
            var el;
            if (void 0 !== value) {
              for (var i = 0; i < this.length; i += 1)
                (el = this[i]).dom7ElementDataStorage ||
                  (el.dom7ElementDataStorage = {}),
                  (el.dom7ElementDataStorage[key] = value);
              return this;
            }
            if ((el = this[0])) {
              if (el.dom7ElementDataStorage && key in el.dom7ElementDataStorage)
                return el.dom7ElementDataStorage[key];
              var dataKey = el.getAttribute("data-" + key);
              return dataKey || void 0;
            }
          },
          transform: function transform(transform) {
            for (var i = 0; i < this.length; i += 1) {
              var elStyle = this[i].style;
              (elStyle.webkitTransform = transform),
                (elStyle.transform = transform);
            }
            return this;
          },
          transition: function transition(duration) {
            "string" != typeof duration && (duration += "ms");
            for (var i = 0; i < this.length; i += 1) {
              var elStyle = this[i].style;
              (elStyle.webkitTransitionDuration = duration),
                (elStyle.transitionDuration = duration);
            }
            return this;
          },
          on: function on() {
            for (var this$1 = this, args = [], len = arguments.length; len--; )
              args[len] = arguments[len];
            var assign,
              eventType = args[0],
              targetSelector = args[1],
              listener = args[2],
              capture = args[3];
            function handleLiveEvent(e) {
              var target = e.target;
              if (target) {
                var eventData = e.target.dom7EventData || [];
                if ((eventData.unshift(e), $$1(target).is(targetSelector)))
                  listener.apply(target, eventData);
                else
                  for (
                    var parents = $$1(target).parents(), k = 0;
                    k < parents.length;
                    k += 1
                  )
                    $$1(parents[k]).is(targetSelector) &&
                      listener.apply(parents[k], eventData);
              }
            }
            function handleEvent(e) {
              var eventData = (e && e.target && e.target.dom7EventData) || [];
              eventData.unshift(e), listener.apply(this, eventData);
            }
            "function" == typeof args[1] &&
              ((eventType = (assign = args)[0]),
              (listener = assign[1]),
              (capture = assign[2]),
              (targetSelector = void 0)),
              capture || (capture = !1);
            for (
              var j, events = eventType.split(" "), i = 0;
              i < this.length;
              i += 1
            ) {
              var el = this$1[i];
              if (targetSelector)
                for (j = 0; j < events.length; j += 1)
                  el.dom7LiveListeners || (el.dom7LiveListeners = []),
                    el.dom7LiveListeners.push({
                      type: eventType,
                      listener: listener,
                      proxyListener: handleLiveEvent,
                    }),
                    el.addEventListener(events[j], handleLiveEvent, capture);
              else
                for (j = 0; j < events.length; j += 1)
                  el.dom7Listeners || (el.dom7Listeners = []),
                    el.dom7Listeners.push({
                      type: eventType,
                      listener: listener,
                      proxyListener: handleEvent,
                    }),
                    el.addEventListener(events[j], handleEvent, capture);
            }
            return this;
          },
          off: function off() {
            for (var this$1 = this, args = [], len = arguments.length; len--; )
              args[len] = arguments[len];
            var assign,
              eventType = args[0],
              targetSelector = args[1],
              listener = args[2],
              capture = args[3];
            "function" == typeof args[1] &&
              ((eventType = (assign = args)[0]),
              (listener = assign[1]),
              (capture = assign[2]),
              (targetSelector = void 0)),
              capture || (capture = !1);
            for (
              var events = eventType.split(" "), i = 0;
              i < events.length;
              i += 1
            )
              for (var j = 0; j < this.length; j += 1) {
                var el = this$1[j];
                if (targetSelector) {
                  if (el.dom7LiveListeners)
                    for (
                      var k$1 = 0;
                      k$1 < el.dom7LiveListeners.length;
                      k$1 += 1
                    )
                      listener
                        ? el.dom7LiveListeners[k$1].listener === listener &&
                          el.removeEventListener(
                            events[i],
                            el.dom7LiveListeners[k$1].proxyListener,
                            capture
                          )
                        : el.dom7LiveListeners[k$1].type === events[i] &&
                          el.removeEventListener(
                            events[i],
                            el.dom7LiveListeners[k$1].proxyListener,
                            capture
                          );
                } else if (el.dom7Listeners)
                  for (var k = 0; k < el.dom7Listeners.length; k += 1)
                    listener
                      ? el.dom7Listeners[k].listener === listener &&
                        el.removeEventListener(
                          events[i],
                          el.dom7Listeners[k].proxyListener,
                          capture
                        )
                      : el.dom7Listeners[k].type === events[i] &&
                        el.removeEventListener(
                          events[i],
                          el.dom7Listeners[k].proxyListener,
                          capture
                        );
              }
            return this;
          },
          trigger: function trigger() {
            for (var this$1 = this, args = [], len = arguments.length; len--; )
              args[len] = arguments[len];
            for (
              var events = args[0].split(" "), eventData = args[1], i = 0;
              i < events.length;
              i += 1
            )
              for (var j = 0; j < this.length; j += 1) {
                var evt = void 0;
                try {
                  evt = new window.CustomEvent(events[i], {
                    detail: eventData,
                    bubbles: !0,
                    cancelable: !0,
                  });
                } catch (e) {
                  (evt = document.createEvent("Event")).initEvent(
                    events[i],
                    !0,
                    !0
                  ),
                    (evt.detail = eventData);
                }
                (this$1[j].dom7EventData = args.filter(function (
                  data,
                  dataIndex
                ) {
                  return dataIndex > 0;
                })),
                  this$1[j].dispatchEvent(evt),
                  (this$1[j].dom7EventData = []),
                  delete this$1[j].dom7EventData;
              }
            return this;
          },
          transitionEnd: function transitionEnd(callback) {
            var i,
              events = ["webkitTransitionEnd", "transitionend"],
              dom = this;
            function fireCallBack(e) {
              if (e.target === this)
                for (callback.call(this, e), i = 0; i < events.length; i += 1)
                  dom.off(events[i], fireCallBack);
            }
            if (callback)
              for (i = 0; i < events.length; i += 1)
                dom.on(events[i], fireCallBack);
            return this;
          },
          outerWidth: function outerWidth(includeMargins) {
            if (this.length > 0) {
              if (includeMargins) {
                var styles = this.styles();
                return (
                  this[0].offsetWidth +
                  parseFloat(styles.getPropertyValue("margin-right")) +
                  parseFloat(styles.getPropertyValue("margin-left"))
                );
              }
              return this[0].offsetWidth;
            }
            return null;
          },
          outerHeight: function outerHeight(includeMargins) {
            if (this.length > 0) {
              if (includeMargins) {
                var styles = this.styles();
                return (
                  this[0].offsetHeight +
                  parseFloat(styles.getPropertyValue("margin-top")) +
                  parseFloat(styles.getPropertyValue("margin-bottom"))
                );
              }
              return this[0].offsetHeight;
            }
            return null;
          },
          offset: function offset() {
            if (this.length > 0) {
              var el = this[0],
                box = el.getBoundingClientRect(),
                body = document.body,
                clientTop = el.clientTop || body.clientTop || 0,
                clientLeft = el.clientLeft || body.clientLeft || 0,
                scrollTop = el === window ? window.scrollY : el.scrollTop,
                scrollLeft = el === window ? window.scrollX : el.scrollLeft;
              return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft,
              };
            }
            return null;
          },
          css: function css(props, value) {
            var i,
              this$1 = this;
            if (1 === arguments.length) {
              if ("string" != typeof props) {
                for (i = 0; i < this.length; i += 1)
                  for (var prop in props) this$1[i].style[prop] = props[prop];
                return this;
              }
              if (this[0])
                return window
                  .getComputedStyle(this[0], null)
                  .getPropertyValue(props);
            }
            if (2 === arguments.length && "string" == typeof props) {
              for (i = 0; i < this.length; i += 1)
                this$1[i].style[props] = value;
              return this;
            }
            return this;
          },
          each: function each(callback) {
            if (!callback) return this;
            for (var i = 0; i < this.length; i += 1)
              if (!1 === callback.call(this[i], i, this[i])) return this;
            return this;
          },
          html: function html(html) {
            if (void 0 === html) return this[0] ? this[0].innerHTML : void 0;
            for (var i = 0; i < this.length; i += 1) this[i].innerHTML = html;
            return this;
          },
          text: function text(text) {
            if (void 0 === text)
              return this[0] ? this[0].textContent.trim() : null;
            for (var i = 0; i < this.length; i += 1) this[i].textContent = text;
            return this;
          },
          is: function is(selector) {
            var compareWith,
              i,
              el = this[0];
            if (!el || void 0 === selector) return !1;
            if ("string" == typeof selector) {
              if (el.matches) return el.matches(selector);
              if (el.webkitMatchesSelector)
                return el.webkitMatchesSelector(selector);
              if (el.msMatchesSelector) return el.msMatchesSelector(selector);
              for (
                compareWith = $$1(selector), i = 0;
                i < compareWith.length;
                i += 1
              )
                if (compareWith[i] === el) return !0;
              return !1;
            }
            if (selector === document) return el === document;
            if (selector === window) return el === window;
            if (selector.nodeType || selector instanceof Dom7) {
              for (
                compareWith = selector.nodeType ? [selector] : selector, i = 0;
                i < compareWith.length;
                i += 1
              )
                if (compareWith[i] === el) return !0;
              return !1;
            }
            return !1;
          },
          index: function index() {
            var i,
              child = this[0];
            if (child) {
              for (i = 0; null !== (child = child.previousSibling); )
                1 === child.nodeType && (i += 1);
              return i;
            }
          },
          eq: function eq(index) {
            if (void 0 === index) return this;
            var returnIndex,
              length = this.length;
            return new Dom7(
              index > length - 1
                ? []
                : index < 0
                ? (returnIndex = length + index) < 0
                  ? []
                  : [this[returnIndex]]
                : [this[index]]
            );
          },
          append: function append() {
            for (
              var newChild, this$1 = this, args = [], len = arguments.length;
              len--;

            )
              args[len] = arguments[len];
            for (var k = 0; k < args.length; k += 1) {
              newChild = args[k];
              for (var i = 0; i < this.length; i += 1)
                if ("string" == typeof newChild) {
                  var tempDiv = document.createElement("div");
                  for (tempDiv.innerHTML = newChild; tempDiv.firstChild; )
                    this$1[i].appendChild(tempDiv.firstChild);
                } else if (newChild instanceof Dom7)
                  for (var j = 0; j < newChild.length; j += 1)
                    this$1[i].appendChild(newChild[j]);
                else this$1[i].appendChild(newChild);
            }
            return this;
          },
          prepend: function prepend(newChild) {
            var i, j;
            for (i = 0; i < this.length; i += 1)
              if ("string" == typeof newChild) {
                var tempDiv = document.createElement("div");
                for (
                  tempDiv.innerHTML = newChild,
                    j = tempDiv.childNodes.length - 1;
                  j >= 0;
                  j -= 1
                )
                  this[i].insertBefore(
                    tempDiv.childNodes[j],
                    this[i].childNodes[0]
                  );
              } else if (newChild instanceof Dom7)
                for (j = 0; j < newChild.length; j += 1)
                  this[i].insertBefore(newChild[j], this[i].childNodes[0]);
              else this[i].insertBefore(newChild, this[i].childNodes[0]);
            return this;
          },
          next: function next(selector) {
            return this.length > 0
              ? selector
                ? this[0].nextElementSibling &&
                  $$1(this[0].nextElementSibling).is(selector)
                  ? new Dom7([this[0].nextElementSibling])
                  : new Dom7([])
                : this[0].nextElementSibling
                ? new Dom7([this[0].nextElementSibling])
                : new Dom7([])
              : new Dom7([]);
          },
          nextAll: function nextAll(selector) {
            var nextEls = [],
              el = this[0];
            if (!el) return new Dom7([]);
            for (; el.nextElementSibling; ) {
              var next = el.nextElementSibling;
              selector
                ? $$1(next).is(selector) && nextEls.push(next)
                : nextEls.push(next),
                (el = next);
            }
            return new Dom7(nextEls);
          },
          prev: function prev(selector) {
            if (this.length > 0) {
              var el = this[0];
              return selector
                ? el.previousElementSibling &&
                  $$1(el.previousElementSibling).is(selector)
                  ? new Dom7([el.previousElementSibling])
                  : new Dom7([])
                : el.previousElementSibling
                ? new Dom7([el.previousElementSibling])
                : new Dom7([]);
            }
            return new Dom7([]);
          },
          prevAll: function prevAll(selector) {
            var prevEls = [],
              el = this[0];
            if (!el) return new Dom7([]);
            for (; el.previousElementSibling; ) {
              var prev = el.previousElementSibling;
              selector
                ? $$1(prev).is(selector) && prevEls.push(prev)
                : prevEls.push(prev),
                (el = prev);
            }
            return new Dom7(prevEls);
          },
          parent: function parent(selector) {
            for (var parents = [], i = 0; i < this.length; i += 1)
              null !== this[i].parentNode &&
                (selector
                  ? $$1(this[i].parentNode).is(selector) &&
                    parents.push(this[i].parentNode)
                  : parents.push(this[i].parentNode));
            return $$1(unique(parents));
          },
          parents: function parents(selector) {
            for (var parents = [], i = 0; i < this.length; i += 1)
              for (var parent = this[i].parentNode; parent; )
                selector
                  ? $$1(parent).is(selector) && parents.push(parent)
                  : parents.push(parent),
                  (parent = parent.parentNode);
            return $$1(unique(parents));
          },
          closest: function closest(selector) {
            var closest = this;
            return void 0 === selector
              ? new Dom7([])
              : (closest.is(selector) ||
                  (closest = closest.parents(selector).eq(0)),
                closest);
          },
          find: function find(selector) {
            for (var foundElements = [], i = 0; i < this.length; i += 1)
              for (
                var found = this[i].querySelectorAll(selector), j = 0;
                j < found.length;
                j += 1
              )
                foundElements.push(found[j]);
            return new Dom7(foundElements);
          },
          children: function children(selector) {
            for (var children = [], i = 0; i < this.length; i += 1)
              for (
                var childNodes = this[i].childNodes, j = 0;
                j < childNodes.length;
                j += 1
              )
                selector
                  ? 1 === childNodes[j].nodeType &&
                    $$1(childNodes[j]).is(selector) &&
                    children.push(childNodes[j])
                  : 1 === childNodes[j].nodeType &&
                    children.push(childNodes[j]);
            return new Dom7(unique(children));
          },
          remove: function remove() {
            for (var i = 0; i < this.length; i += 1)
              this[i].parentNode && this[i].parentNode.removeChild(this[i]);
            return this;
          },
          add: function add() {
            for (var args = [], len = arguments.length; len--; )
              args[len] = arguments[len];
            var i,
              j,
              dom = this;
            for (i = 0; i < args.length; i += 1) {
              var toAdd = $$1(args[i]);
              for (j = 0; j < toAdd.length; j += 1)
                (dom[dom.length] = toAdd[j]), (dom.length += 1);
            }
            return dom;
          },
          styles: function styles() {
            return this[0] ? window.getComputedStyle(this[0], null) : {};
          },
        };
        Object.keys(Methods).forEach(function (methodName) {
          $$1.fn[methodName] = Methods[methodName];
        });
        var Utils = {
            deleteProps: function deleteProps(obj) {
              var object = obj;
              Object.keys(object).forEach(function (key) {
                try {
                  object[key] = null;
                } catch (e) {}
                try {
                  delete object[key];
                } catch (e) {}
              });
            },
            nextTick: function nextTick(callback, delay) {
              return (
                void 0 === delay && (delay = 0), setTimeout(callback, delay)
              );
            },
            now: function now() {
              return Date.now();
            },
            getTranslate: function getTranslate(el, axis) {
              var matrix, curTransform, transformMatrix;
              void 0 === axis && (axis = "x");
              var curStyle = win.getComputedStyle(el, null);
              return (
                win.WebKitCSSMatrix
                  ? ((curTransform =
                      curStyle.transform || curStyle.webkitTransform).split(",")
                      .length > 6 &&
                      (curTransform = curTransform
                        .split(", ")
                        .map(function (a) {
                          return a.replace(",", ".");
                        })
                        .join(", ")),
                    (transformMatrix = new win.WebKitCSSMatrix(
                      "none" === curTransform ? "" : curTransform
                    )))
                  : (matrix = (transformMatrix =
                      curStyle.MozTransform ||
                      curStyle.OTransform ||
                      curStyle.MsTransform ||
                      curStyle.msTransform ||
                      curStyle.transform ||
                      curStyle
                        .getPropertyValue("transform")
                        .replace("translate(", "matrix(1, 0, 0, 1,"))
                      .toString()
                      .split(",")),
                "x" === axis &&
                  (curTransform = win.WebKitCSSMatrix
                    ? transformMatrix.m41
                    : 16 === matrix.length
                    ? parseFloat(matrix[12])
                    : parseFloat(matrix[4])),
                "y" === axis &&
                  (curTransform = win.WebKitCSSMatrix
                    ? transformMatrix.m42
                    : 16 === matrix.length
                    ? parseFloat(matrix[13])
                    : parseFloat(matrix[5])),
                curTransform || 0
              );
            },
            parseUrlQuery: function parseUrlQuery(url) {
              var i,
                params,
                param,
                length,
                query = {},
                urlToParse = url || win.location.href;
              if ("string" == typeof urlToParse && urlToParse.length)
                for (
                  length = (params = (urlToParse =
                    urlToParse.indexOf("?") > -1
                      ? urlToParse.replace(/\S*\?/, "")
                      : "")
                    .split("&")
                    .filter(function (paramsPart) {
                      return "" !== paramsPart;
                    })).length,
                    i = 0;
                  i < length;
                  i += 1
                )
                  (param = params[i].replace(/#\S+/g, "").split("=")),
                    (query[decodeURIComponent(param[0])] =
                      void 0 === param[1]
                        ? void 0
                        : decodeURIComponent(param[1]) || "");
              return query;
            },
            isObject: function isObject(o) {
              return (
                "object" == typeof o &&
                null !== o &&
                o.constructor &&
                o.constructor === Object
              );
            },
            extend: function extend() {
              for (var args = [], len$1 = arguments.length; len$1--; )
                args[len$1] = arguments[len$1];
              for (var to = Object(args[0]), i = 1; i < args.length; i += 1) {
                var nextSource = args[i];
                if (null != nextSource)
                  for (
                    var keysArray = Object.keys(Object(nextSource)),
                      nextIndex = 0,
                      len = keysArray.length;
                    nextIndex < len;
                    nextIndex += 1
                  ) {
                    var nextKey = keysArray[nextIndex],
                      desc = Object.getOwnPropertyDescriptor(
                        nextSource,
                        nextKey
                      );
                    void 0 !== desc &&
                      desc.enumerable &&
                      (Utils.isObject(to[nextKey]) &&
                      Utils.isObject(nextSource[nextKey])
                        ? Utils.extend(to[nextKey], nextSource[nextKey])
                        : !Utils.isObject(to[nextKey]) &&
                          Utils.isObject(nextSource[nextKey])
                        ? ((to[nextKey] = {}),
                          Utils.extend(to[nextKey], nextSource[nextKey]))
                        : (to[nextKey] = nextSource[nextKey]));
                  }
              }
              return to;
            },
          },
          doc =
            "undefined" == typeof document
              ? {
                  addEventListener: function addEventListener() {},
                  removeEventListener: function removeEventListener() {},
                  activeElement: { blur: function blur() {}, nodeName: "" },
                  querySelector: function querySelector() {
                    return {};
                  },
                  querySelectorAll: function querySelectorAll() {
                    return [];
                  },
                  createElement: function createElement() {
                    return {
                      style: {},
                      setAttribute: function setAttribute() {},
                      getElementsByTagName: function getElementsByTagName() {
                        return [];
                      },
                    };
                  },
                  location: { hash: "" },
                }
              : document,
          Support = (function Support() {
            return {
              touch:
                (win.Modernizr && !0 === win.Modernizr.touch) ||
                (function checkTouch() {
                  return !!(
                    "ontouchstart" in win ||
                    (win.DocumentTouch && doc instanceof win.DocumentTouch)
                  );
                })(),
              transforms3d:
                (win.Modernizr && !0 === win.Modernizr.csstransforms3d) ||
                (function checkTransforms3d() {
                  var div = doc.createElement("div").style;
                  return (
                    "webkitPerspective" in div ||
                    "MozPerspective" in div ||
                    "OPerspective" in div ||
                    "MsPerspective" in div ||
                    "perspective" in div
                  );
                })(),
              flexbox: (function checkFlexbox() {
                for (
                  var div = doc.createElement("div").style,
                    styles =
                      "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(
                        " "
                      ),
                    i = 0;
                  i < styles.length;
                  i += 1
                )
                  if (styles[i] in div) return !0;
                return !1;
              })(),
              observer: (function checkObserver() {
                return (
                  "MutationObserver" in win || "WebkitMutationObserver" in win
                );
              })(),
              passiveListener: (function checkPassiveListener() {
                var supportsPassive = !1;
                try {
                  var opts = Object.defineProperty({}, "passive", {
                    get: function get() {
                      supportsPassive = !0;
                    },
                  });
                  win.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
              })(),
              gestures: (function checkGestures() {
                return "ongesturestart" in win;
              })(),
            };
          })(),
          SwiperClass = function SwiperClass(params) {
            void 0 === params && (params = {});
            var self = this;
            (self.params = params),
              (self.eventsListeners = {}),
              self.params &&
                self.params.on &&
                Object.keys(self.params.on).forEach(function (eventName) {
                  self.on(eventName, self.params.on[eventName]);
                });
          },
          staticAccessors = { components: {} };
        (SwiperClass.prototype.on = function on(events, handler) {
          var self = this;
          return (
            "function" != typeof handler ||
              events.split(" ").forEach(function (event) {
                self.eventsListeners[event] ||
                  (self.eventsListeners[event] = []),
                  self.eventsListeners[event].push(handler);
              }),
            self
          );
        }),
          (SwiperClass.prototype.once = function once(events, handler) {
            var self = this;
            return "function" != typeof handler
              ? self
              : self.on(events, function onceHandler() {
                  for (var args = [], len = arguments.length; len--; )
                    args[len] = arguments[len];
                  handler.apply(self, args), self.off(events, onceHandler);
                });
          }),
          (SwiperClass.prototype.off = function off(events, handler) {
            var self = this;
            return (
              events.split(" ").forEach(function (event) {
                void 0 === handler
                  ? (self.eventsListeners[event] = [])
                  : self.eventsListeners[event].forEach(function (
                      eventHandler,
                      index
                    ) {
                      eventHandler === handler &&
                        self.eventsListeners[event].splice(index, 1);
                    });
              }),
              self
            );
          }),
          (SwiperClass.prototype.emit = function emit() {
            for (var args = [], len = arguments.length; len--; )
              args[len] = arguments[len];
            var events,
              data,
              context,
              self = this;
            if (!self.eventsListeners) return self;
            "string" == typeof args[0] || Array.isArray(args[0])
              ? ((events = args[0]),
                (data = args.slice(1, args.length)),
                (context = self))
              : ((events = args[0].events),
                (data = args[0].data),
                (context = args[0].context || self));
            var eventsArray = Array.isArray(events)
              ? events
              : events.split(" ");
            return (
              eventsArray.forEach(function (event) {
                if (self.eventsListeners[event]) {
                  var handlers = [];
                  self.eventsListeners[event].forEach(function (eventHandler) {
                    handlers.push(eventHandler);
                  }),
                    handlers.forEach(function (eventHandler) {
                      eventHandler.apply(context, data);
                    });
                }
              }),
              self
            );
          }),
          (SwiperClass.prototype.useModulesParams = function useModulesParams(
            instanceParams
          ) {
            var instance = this;
            instance.modules &&
              Object.keys(instance.modules).forEach(function (moduleName) {
                var module = instance.modules[moduleName];
                module.params && Utils.extend(instanceParams, module.params);
              });
          }),
          (SwiperClass.prototype.useModules = function useModules(
            modulesParams
          ) {
            void 0 === modulesParams && (modulesParams = {});
            var instance = this;
            instance.modules &&
              Object.keys(instance.modules).forEach(function (moduleName) {
                var module = instance.modules[moduleName],
                  moduleParams = modulesParams[moduleName] || {};
                module.instance &&
                  Object.keys(module.instance).forEach(function (
                    modulePropName
                  ) {
                    var moduleProp = module.instance[modulePropName];
                    instance[modulePropName] =
                      "function" == typeof moduleProp
                        ? moduleProp.bind(instance)
                        : moduleProp;
                  }),
                  module.on &&
                    instance.on &&
                    Object.keys(module.on).forEach(function (moduleEventName) {
                      instance.on(moduleEventName, module.on[moduleEventName]);
                    }),
                  module.create && module.create.bind(instance)(moduleParams);
              });
          }),
          (staticAccessors.components.set = function (components) {
            this.use && this.use(components);
          }),
          (SwiperClass.installModule = function installModule(module) {
            for (var params = [], len = arguments.length - 1; len-- > 0; )
              params[len] = arguments[len + 1];
            var Class = this;
            Class.prototype.modules || (Class.prototype.modules = {});
            var name =
              module.name ||
              Object.keys(Class.prototype.modules).length + "_" + Utils.now();
            return (
              (Class.prototype.modules[name] = module),
              module.proto &&
                Object.keys(module.proto).forEach(function (key) {
                  Class.prototype[key] = module.proto[key];
                }),
              module.static &&
                Object.keys(module.static).forEach(function (key) {
                  Class[key] = module.static[key];
                }),
              module.install && module.install.apply(Class, params),
              Class
            );
          }),
          (SwiperClass.use = function use(module) {
            for (var params = [], len = arguments.length - 1; len-- > 0; )
              params[len] = arguments[len + 1];
            var Class = this;
            return Array.isArray(module)
              ? (module.forEach(function (m) {
                  return Class.installModule(m);
                }),
                Class)
              : Class.installModule.apply(Class, [module].concat(params));
          }),
          Object.defineProperties(SwiperClass, staticAccessors);
        var update = {
            updateSize: function () {
              var width,
                height,
                $el = this.$el;
              (width =
                void 0 !== this.params.width
                  ? this.params.width
                  : $el[0].clientWidth),
                (height =
                  void 0 !== this.params.height
                    ? this.params.height
                    : $el[0].clientHeight),
                (0 === width && this.isHorizontal()) ||
                  (0 === height && this.isVertical()) ||
                  ((width =
                    width -
                    parseInt($el.css("padding-left"), 10) -
                    parseInt($el.css("padding-right"), 10)),
                  (height =
                    height -
                    parseInt($el.css("padding-top"), 10) -
                    parseInt($el.css("padding-bottom"), 10)),
                  Utils.extend(this, {
                    width: width,
                    height: height,
                    size: this.isHorizontal() ? width : height,
                  }));
            },
            updateSlides: function () {
              var params = this.params,
                $wrapperEl = this.$wrapperEl,
                swiperSize = this.size,
                rtl = this.rtl,
                wrongRTL = this.wrongRTL,
                slides = $wrapperEl.children("." + this.params.slideClass),
                slidesLength =
                  this.virtual && params.virtual.enabled
                    ? this.virtual.slides.length
                    : slides.length,
                snapGrid = [],
                slidesGrid = [],
                slidesSizesGrid = [],
                offsetBefore = params.slidesOffsetBefore;
              "function" == typeof offsetBefore &&
                (offsetBefore = params.slidesOffsetBefore.call(this));
              var offsetAfter = params.slidesOffsetAfter;
              "function" == typeof offsetAfter &&
                (offsetAfter = params.slidesOffsetAfter.call(this));
              var previousSlidesLength = slidesLength,
                previousSnapGridLength = this.snapGrid.length,
                previousSlidesGridLength = this.snapGrid.length,
                spaceBetween = params.spaceBetween,
                slidePosition = -offsetBefore,
                prevSlideSize = 0,
                index = 0;
              if (void 0 !== swiperSize) {
                var slidesNumberEvenToRows, slideSize;
                "string" == typeof spaceBetween &&
                  spaceBetween.indexOf("%") >= 0 &&
                  (spaceBetween =
                    (parseFloat(spaceBetween.replace("%", "")) / 100) *
                    swiperSize),
                  (this.virtualSize = -spaceBetween),
                  rtl
                    ? slides.css({ marginLeft: "", marginTop: "" })
                    : slides.css({ marginRight: "", marginBottom: "" }),
                  params.slidesPerColumn > 1 &&
                    ((slidesNumberEvenToRows =
                      Math.floor(slidesLength / params.slidesPerColumn) ===
                      slidesLength / this.params.slidesPerColumn
                        ? slidesLength
                        : Math.ceil(slidesLength / params.slidesPerColumn) *
                          params.slidesPerColumn),
                    "auto" !== params.slidesPerView &&
                      "row" === params.slidesPerColumnFill &&
                      (slidesNumberEvenToRows = Math.max(
                        slidesNumberEvenToRows,
                        params.slidesPerView * params.slidesPerColumn
                      )));
                for (
                  var newSlidesGrid,
                    slidesPerColumn = params.slidesPerColumn,
                    slidesPerRow = slidesNumberEvenToRows / slidesPerColumn,
                    numFullColumns =
                      slidesPerRow -
                      (params.slidesPerColumn * slidesPerRow - slidesLength),
                    i = 0;
                  i < slidesLength;
                  i += 1
                ) {
                  slideSize = 0;
                  var slide = slides.eq(i);
                  if (params.slidesPerColumn > 1) {
                    var newSlideOrderIndex = void 0,
                      column = void 0,
                      row = void 0;
                    "column" === params.slidesPerColumnFill
                      ? ((row =
                          i -
                          (column = Math.floor(i / slidesPerColumn)) *
                            slidesPerColumn),
                        (column > numFullColumns ||
                          (column === numFullColumns &&
                            row === slidesPerColumn - 1)) &&
                          (row += 1) >= slidesPerColumn &&
                          ((row = 0), (column += 1)),
                        (newSlideOrderIndex =
                          column +
                          (row * slidesNumberEvenToRows) / slidesPerColumn),
                        slide.css({
                          "-webkit-box-ordinal-group": newSlideOrderIndex,
                          "-moz-box-ordinal-group": newSlideOrderIndex,
                          "-ms-flex-order": newSlideOrderIndex,
                          "-webkit-order": newSlideOrderIndex,
                          order: newSlideOrderIndex,
                        }))
                      : (column =
                          i -
                          (row = Math.floor(i / slidesPerRow)) * slidesPerRow),
                      slide
                        .css(
                          "margin-" + (this.isHorizontal() ? "top" : "left"),
                          0 !== row &&
                            params.spaceBetween &&
                            params.spaceBetween + "px"
                        )
                        .attr("data-swiper-column", column)
                        .attr("data-swiper-row", row);
                  }
                  "none" !== slide.css("display") &&
                    ("auto" === params.slidesPerView
                      ? ((slideSize = this.isHorizontal()
                          ? slide.outerWidth(!0)
                          : slide.outerHeight(!0)),
                        params.roundLengths &&
                          (slideSize = Math.floor(slideSize)))
                      : ((slideSize =
                          (swiperSize -
                            (params.slidesPerView - 1) * spaceBetween) /
                          params.slidesPerView),
                        params.roundLengths &&
                          (slideSize = Math.floor(slideSize)),
                        slides[i] &&
                          (this.isHorizontal()
                            ? (slides[i].style.width = slideSize + "px")
                            : (slides[i].style.height = slideSize + "px"))),
                    slides[i] && (slides[i].swiperSlideSize = slideSize),
                    slidesSizesGrid.push(slideSize),
                    params.centeredSlides
                      ? ((slidePosition =
                          slidePosition +
                          slideSize / 2 +
                          prevSlideSize / 2 +
                          spaceBetween),
                        0 === prevSlideSize &&
                          0 !== i &&
                          (slidePosition =
                            slidePosition - swiperSize / 2 - spaceBetween),
                        0 === i &&
                          (slidePosition =
                            slidePosition - swiperSize / 2 - spaceBetween),
                        Math.abs(slidePosition) < 0.001 && (slidePosition = 0),
                        index % params.slidesPerGroup == 0 &&
                          snapGrid.push(slidePosition),
                        slidesGrid.push(slidePosition))
                      : (index % params.slidesPerGroup == 0 &&
                          snapGrid.push(slidePosition),
                        slidesGrid.push(slidePosition),
                        (slidePosition =
                          slidePosition + slideSize + spaceBetween)),
                    (this.virtualSize += slideSize + spaceBetween),
                    (prevSlideSize = slideSize),
                    (index += 1));
                }
                if (
                  ((this.virtualSize =
                    Math.max(this.virtualSize, swiperSize) + offsetAfter),
                  rtl &&
                    wrongRTL &&
                    ("slide" === params.effect ||
                      "coverflow" === params.effect) &&
                    $wrapperEl.css({
                      width: this.virtualSize + params.spaceBetween + "px",
                    }),
                  (Support.flexbox && !params.setWrapperSize) ||
                    (this.isHorizontal()
                      ? $wrapperEl.css({
                          width: this.virtualSize + params.spaceBetween + "px",
                        })
                      : $wrapperEl.css({
                          height: this.virtualSize + params.spaceBetween + "px",
                        })),
                  params.slidesPerColumn > 1 &&
                    ((this.virtualSize =
                      (slideSize + params.spaceBetween) *
                      slidesNumberEvenToRows),
                    (this.virtualSize =
                      Math.ceil(this.virtualSize / params.slidesPerColumn) -
                      params.spaceBetween),
                    this.isHorizontal()
                      ? $wrapperEl.css({
                          width: this.virtualSize + params.spaceBetween + "px",
                        })
                      : $wrapperEl.css({
                          height: this.virtualSize + params.spaceBetween + "px",
                        }),
                    params.centeredSlides))
                ) {
                  newSlidesGrid = [];
                  for (var i$1 = 0; i$1 < snapGrid.length; i$1 += 1)
                    snapGrid[i$1] < this.virtualSize + snapGrid[0] &&
                      newSlidesGrid.push(snapGrid[i$1]);
                  snapGrid = newSlidesGrid;
                }
                if (!params.centeredSlides) {
                  newSlidesGrid = [];
                  for (var i$2 = 0; i$2 < snapGrid.length; i$2 += 1)
                    snapGrid[i$2] <= this.virtualSize - swiperSize &&
                      newSlidesGrid.push(snapGrid[i$2]);
                  (snapGrid = newSlidesGrid),
                    Math.floor(this.virtualSize - swiperSize) -
                      Math.floor(snapGrid[snapGrid.length - 1]) >
                      1 && snapGrid.push(this.virtualSize - swiperSize);
                }
                0 === snapGrid.length && (snapGrid = [0]),
                  0 !== params.spaceBetween &&
                    (this.isHorizontal()
                      ? rtl
                        ? slides.css({ marginLeft: spaceBetween + "px" })
                        : slides.css({ marginRight: spaceBetween + "px" })
                      : slides.css({ marginBottom: spaceBetween + "px" })),
                  Utils.extend(this, {
                    slides: slides,
                    snapGrid: snapGrid,
                    slidesGrid: slidesGrid,
                    slidesSizesGrid: slidesSizesGrid,
                  }),
                  slidesLength !== previousSlidesLength &&
                    this.emit("slidesLengthChange"),
                  snapGrid.length !== previousSnapGridLength &&
                    this.emit("snapGridLengthChange"),
                  slidesGrid.length !== previousSlidesGridLength &&
                    this.emit("slidesGridLengthChange"),
                  (params.watchSlidesProgress ||
                    params.watchSlidesVisibility) &&
                    this.updateSlidesOffset();
              }
            },
            updateAutoHeight: function () {
              var i,
                activeSlides = [],
                newHeight = 0;
              if (
                "auto" !== this.params.slidesPerView &&
                this.params.slidesPerView > 1
              )
                for (i = 0; i < Math.ceil(this.params.slidesPerView); i += 1) {
                  var index = this.activeIndex + i;
                  if (index > this.slides.length) break;
                  activeSlides.push(this.slides.eq(index)[0]);
                }
              else activeSlides.push(this.slides.eq(this.activeIndex)[0]);
              for (i = 0; i < activeSlides.length; i += 1)
                if (void 0 !== activeSlides[i]) {
                  var height = activeSlides[i].offsetHeight;
                  newHeight = height > newHeight ? height : newHeight;
                }
              newHeight && this.$wrapperEl.css("height", newHeight + "px");
            },
            updateSlidesOffset: function () {
              for (var slides = this.slides, i = 0; i < slides.length; i += 1)
                slides[i].swiperSlideOffset = this.isHorizontal()
                  ? slides[i].offsetLeft
                  : slides[i].offsetTop;
            },
            updateSlidesProgress: function (translate) {
              void 0 === translate && (translate = this.translate || 0);
              var params = this.params,
                slides = this.slides,
                rtl = this.rtl;
              if (0 !== slides.length) {
                void 0 === slides[0].swiperSlideOffset &&
                  this.updateSlidesOffset();
                var offsetCenter = -translate;
                rtl && (offsetCenter = translate),
                  slides.removeClass(params.slideVisibleClass);
                for (var i = 0; i < slides.length; i += 1) {
                  var slide = slides[i],
                    slideProgress =
                      (offsetCenter +
                        (params.centeredSlides ? this.minTranslate() : 0) -
                        slide.swiperSlideOffset) /
                      (slide.swiperSlideSize + params.spaceBetween);
                  if (params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset),
                      slideAfter = slideBefore + this.slidesSizesGrid[i];
                    ((slideBefore >= 0 && slideBefore < this.size) ||
                      (slideAfter > 0 && slideAfter <= this.size) ||
                      (slideBefore <= 0 && slideAfter >= this.size)) &&
                      slides.eq(i).addClass(params.slideVisibleClass);
                  }
                  slide.progress = rtl ? -slideProgress : slideProgress;
                }
              }
            },
            updateProgress: function (translate) {
              void 0 === translate && (translate = this.translate || 0);
              var params = this.params,
                translatesDiff = this.maxTranslate() - this.minTranslate(),
                progress = this.progress,
                isBeginning = this.isBeginning,
                isEnd = this.isEnd,
                wasBeginning = isBeginning,
                wasEnd = isEnd;
              0 === translatesDiff
                ? ((progress = 0), (isBeginning = !0), (isEnd = !0))
                : ((isBeginning =
                    (progress =
                      (translate - this.minTranslate()) / translatesDiff) <= 0),
                  (isEnd = progress >= 1)),
                Utils.extend(this, {
                  progress: progress,
                  isBeginning: isBeginning,
                  isEnd: isEnd,
                }),
                (params.watchSlidesProgress || params.watchSlidesVisibility) &&
                  this.updateSlidesProgress(translate),
                isBeginning &&
                  !wasBeginning &&
                  this.emit("reachBeginning toEdge"),
                isEnd && !wasEnd && this.emit("reachEnd toEdge"),
                ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) &&
                  this.emit("fromEdge"),
                this.emit("progress", progress);
            },
            updateSlidesClasses: function () {
              var activeSlide,
                slides = this.slides,
                params = this.params,
                $wrapperEl = this.$wrapperEl,
                activeIndex = this.activeIndex,
                realIndex = this.realIndex,
                isVirtual = this.virtual && params.virtual.enabled;
              slides.removeClass(
                params.slideActiveClass +
                  " " +
                  params.slideNextClass +
                  " " +
                  params.slidePrevClass +
                  " " +
                  params.slideDuplicateActiveClass +
                  " " +
                  params.slideDuplicateNextClass +
                  " " +
                  params.slideDuplicatePrevClass
              ),
                (activeSlide = isVirtual
                  ? this.$wrapperEl.find(
                      "." +
                        params.slideClass +
                        '[data-swiper-slide-index="' +
                        activeIndex +
                        '"]'
                    )
                  : slides.eq(activeIndex)).addClass(params.slideActiveClass),
                params.loop &&
                  (activeSlide.hasClass(params.slideDuplicateClass)
                    ? $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            ":not(." +
                            params.slideDuplicateClass +
                            ')[data-swiper-slide-index="' +
                            realIndex +
                            '"]'
                        )
                        .addClass(params.slideDuplicateActiveClass)
                    : $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            "." +
                            params.slideDuplicateClass +
                            '[data-swiper-slide-index="' +
                            realIndex +
                            '"]'
                        )
                        .addClass(params.slideDuplicateActiveClass));
              var nextSlide = activeSlide
                .nextAll("." + params.slideClass)
                .eq(0)
                .addClass(params.slideNextClass);
              params.loop &&
                0 === nextSlide.length &&
                (nextSlide = slides.eq(0)).addClass(params.slideNextClass);
              var prevSlide = activeSlide
                .prevAll("." + params.slideClass)
                .eq(0)
                .addClass(params.slidePrevClass);
              params.loop &&
                0 === prevSlide.length &&
                (prevSlide = slides.eq(-1)).addClass(params.slidePrevClass),
                params.loop &&
                  (nextSlide.hasClass(params.slideDuplicateClass)
                    ? $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            ":not(." +
                            params.slideDuplicateClass +
                            ')[data-swiper-slide-index="' +
                            nextSlide.attr("data-swiper-slide-index") +
                            '"]'
                        )
                        .addClass(params.slideDuplicateNextClass)
                    : $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            "." +
                            params.slideDuplicateClass +
                            '[data-swiper-slide-index="' +
                            nextSlide.attr("data-swiper-slide-index") +
                            '"]'
                        )
                        .addClass(params.slideDuplicateNextClass),
                  prevSlide.hasClass(params.slideDuplicateClass)
                    ? $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            ":not(." +
                            params.slideDuplicateClass +
                            ')[data-swiper-slide-index="' +
                            prevSlide.attr("data-swiper-slide-index") +
                            '"]'
                        )
                        .addClass(params.slideDuplicatePrevClass)
                    : $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            "." +
                            params.slideDuplicateClass +
                            '[data-swiper-slide-index="' +
                            prevSlide.attr("data-swiper-slide-index") +
                            '"]'
                        )
                        .addClass(params.slideDuplicatePrevClass));
            },
            updateActiveIndex: function (newActiveIndex) {
              var snapIndex,
                translate = this.rtl ? this.translate : -this.translate,
                slidesGrid = this.slidesGrid,
                snapGrid = this.snapGrid,
                params = this.params,
                previousIndex = this.activeIndex,
                previousRealIndex = this.realIndex,
                previousSnapIndex = this.snapIndex,
                activeIndex = newActiveIndex;
              if (void 0 === activeIndex) {
                for (var i = 0; i < slidesGrid.length; i += 1)
                  void 0 !== slidesGrid[i + 1]
                    ? translate >= slidesGrid[i] &&
                      translate <
                        slidesGrid[i + 1] -
                          (slidesGrid[i + 1] - slidesGrid[i]) / 2
                      ? (activeIndex = i)
                      : translate >= slidesGrid[i] &&
                        translate < slidesGrid[i + 1] &&
                        (activeIndex = i + 1)
                    : translate >= slidesGrid[i] && (activeIndex = i);
                params.normalizeSlideIndex &&
                  (activeIndex < 0 || void 0 === activeIndex) &&
                  (activeIndex = 0);
              }
              if (
                ((snapIndex =
                  snapGrid.indexOf(translate) >= 0
                    ? snapGrid.indexOf(translate)
                    : Math.floor(activeIndex / params.slidesPerGroup)) >=
                  snapGrid.length && (snapIndex = snapGrid.length - 1),
                activeIndex !== previousIndex)
              ) {
                var realIndex = parseInt(
                  this.slides.eq(activeIndex).attr("data-swiper-slide-index") ||
                    activeIndex,
                  10
                );
                Utils.extend(this, {
                  snapIndex: snapIndex,
                  realIndex: realIndex,
                  previousIndex: previousIndex,
                  activeIndex: activeIndex,
                }),
                  this.emit("activeIndexChange"),
                  this.emit("snapIndexChange"),
                  previousRealIndex !== realIndex &&
                    this.emit("realIndexChange"),
                  this.emit("slideChange");
              } else
                snapIndex !== previousSnapIndex &&
                  ((this.snapIndex = snapIndex), this.emit("snapIndexChange"));
            },
            updateClickedSlide: function (e) {
              var params = this.params,
                slide = $$1(e.target).closest("." + params.slideClass)[0],
                slideFound = !1;
              if (slide)
                for (var i = 0; i < this.slides.length; i += 1)
                  this.slides[i] === slide && (slideFound = !0);
              if (!slide || !slideFound)
                return (
                  (this.clickedSlide = void 0),
                  void (this.clickedIndex = void 0)
                );
              (this.clickedSlide = slide),
                this.virtual && this.params.virtual.enabled
                  ? (this.clickedIndex = parseInt(
                      $$1(slide).attr("data-swiper-slide-index"),
                      10
                    ))
                  : (this.clickedIndex = $$1(slide).index()),
                params.slideToClickedSlide &&
                  void 0 !== this.clickedIndex &&
                  this.clickedIndex !== this.activeIndex &&
                  this.slideToClickedSlide();
            },
          },
          translate = {
            getTranslate: function (axis) {
              void 0 === axis && (axis = this.isHorizontal() ? "x" : "y");
              var params = this.params,
                rtl = this.rtl,
                translate = this.translate,
                $wrapperEl = this.$wrapperEl;
              if (params.virtualTranslate) return rtl ? -translate : translate;
              var currentTranslate = Utils.getTranslate($wrapperEl[0], axis);
              return (
                rtl && (currentTranslate = -currentTranslate),
                currentTranslate || 0
              );
            },
            setTranslate: function (translate, byController) {
              var rtl = this.rtl,
                params = this.params,
                $wrapperEl = this.$wrapperEl,
                progress = this.progress,
                x = 0,
                y = 0;
              this.isHorizontal()
                ? (x = rtl ? -translate : translate)
                : (y = translate),
                params.roundLengths &&
                  ((x = Math.floor(x)), (y = Math.floor(y))),
                params.virtualTranslate ||
                  (Support.transforms3d
                    ? $wrapperEl.transform(
                        "translate3d(" + x + "px, " + y + "px, 0px)"
                      )
                    : $wrapperEl.transform(
                        "translate(" + x + "px, " + y + "px)"
                      )),
                (this.translate = this.isHorizontal() ? x : y);
              var translatesDiff = this.maxTranslate() - this.minTranslate();
              (0 === translatesDiff
                ? 0
                : (translate - this.minTranslate()) / translatesDiff) !==
                progress && this.updateProgress(translate),
                this.emit("setTranslate", this.translate, byController);
            },
            minTranslate: function () {
              return -this.snapGrid[0];
            },
            maxTranslate: function () {
              return -this.snapGrid[this.snapGrid.length - 1];
            },
          },
          transition$1 = {
            setTransition: function (duration, byController) {
              this.$wrapperEl.transition(duration),
                this.emit("setTransition", duration, byController);
            },
            transitionStart: function (runCallbacks) {
              void 0 === runCallbacks && (runCallbacks = !0);
              var activeIndex = this.activeIndex,
                params = this.params,
                previousIndex = this.previousIndex;
              params.autoHeight && this.updateAutoHeight(),
                this.emit("transitionStart"),
                runCallbacks &&
                  activeIndex !== previousIndex &&
                  (this.emit("slideChangeTransitionStart"),
                  activeIndex > previousIndex
                    ? this.emit("slideNextTransitionStart")
                    : this.emit("slidePrevTransitionStart"));
            },
            transitionEnd: function (runCallbacks) {
              void 0 === runCallbacks && (runCallbacks = !0);
              var activeIndex = this.activeIndex,
                previousIndex = this.previousIndex;
              (this.animating = !1),
                this.setTransition(0),
                this.emit("transitionEnd"),
                runCallbacks &&
                  activeIndex !== previousIndex &&
                  (this.emit("slideChangeTransitionEnd"),
                  activeIndex > previousIndex
                    ? this.emit("slideNextTransitionEnd")
                    : this.emit("slidePrevTransitionEnd"));
            },
          },
          Browser = (function Browser() {
            return {
              isSafari: (function isSafari() {
                var ua = win.navigator.userAgent.toLowerCase();
                return (
                  ua.indexOf("safari") >= 0 &&
                  ua.indexOf("chrome") < 0 &&
                  ua.indexOf("android") < 0
                );
              })(),
              isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
                win.navigator.userAgent
              ),
              ie:
                win.navigator.pointerEnabled || win.navigator.msPointerEnabled,
              ieTouch:
                (win.navigator.msPointerEnabled &&
                  win.navigator.msMaxTouchPoints > 1) ||
                (win.navigator.pointerEnabled &&
                  win.navigator.maxTouchPoints > 1),
              lteIE9: (function isIE9() {
                var div = doc.createElement("div");
                return (
                  (div.innerHTML =
                    "\x3c!--[if lte IE 9]><i></i><![endif]--\x3e"),
                  1 === div.getElementsByTagName("i").length
                );
              })(),
            };
          })(),
          slide = {
            slideTo: function (index, speed, runCallbacks, internal) {
              void 0 === index && (index = 0),
                void 0 === speed && (speed = this.params.speed),
                void 0 === runCallbacks && (runCallbacks = !0);
              var swiper = this,
                slideIndex = index;
              slideIndex < 0 && (slideIndex = 0);
              var params = swiper.params,
                snapGrid = swiper.snapGrid,
                slidesGrid = swiper.slidesGrid,
                previousIndex = swiper.previousIndex,
                activeIndex = swiper.activeIndex,
                rtl = swiper.rtl,
                $wrapperEl = swiper.$wrapperEl,
                snapIndex = Math.floor(slideIndex / params.slidesPerGroup);
              snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1),
                (activeIndex || params.initialSlide || 0) ===
                  (previousIndex || 0) &&
                  runCallbacks &&
                  swiper.emit("beforeSlideChangeStart");
              var translate = -snapGrid[snapIndex];
              if (
                (swiper.updateProgress(translate), params.normalizeSlideIndex)
              )
                for (var i = 0; i < slidesGrid.length; i += 1)
                  -Math.floor(100 * translate) >=
                    Math.floor(100 * slidesGrid[i]) && (slideIndex = i);
              return !(
                (!swiper.allowSlideNext &&
                  translate < swiper.translate &&
                  translate < swiper.minTranslate()) ||
                (!swiper.allowSlidePrev &&
                  translate > swiper.translate &&
                  translate > swiper.maxTranslate() &&
                  (activeIndex || 0) !== slideIndex) ||
                ((rtl && -translate === swiper.translate) ||
                (!rtl && translate === swiper.translate)
                  ? (swiper.updateActiveIndex(slideIndex),
                    params.autoHeight && swiper.updateAutoHeight(),
                    swiper.updateSlidesClasses(),
                    "slide" !== params.effect && swiper.setTranslate(translate),
                    1)
                  : (0 === speed || Browser.lteIE9
                      ? (swiper.setTransition(0),
                        swiper.setTranslate(translate),
                        swiper.updateActiveIndex(slideIndex),
                        swiper.updateSlidesClasses(),
                        swiper.emit("beforeTransitionStart", speed, internal),
                        swiper.transitionStart(runCallbacks),
                        swiper.transitionEnd(runCallbacks))
                      : (swiper.setTransition(speed),
                        swiper.setTranslate(translate),
                        swiper.updateActiveIndex(slideIndex),
                        swiper.updateSlidesClasses(),
                        swiper.emit("beforeTransitionStart", speed, internal),
                        swiper.transitionStart(runCallbacks),
                        swiper.animating ||
                          ((swiper.animating = !0),
                          $wrapperEl.transitionEnd(function () {
                            swiper &&
                              !swiper.destroyed &&
                              swiper.transitionEnd(runCallbacks);
                          }))),
                    0))
              );
            },
            slideNext: function (speed, runCallbacks, internal) {
              void 0 === speed && (speed = this.params.speed),
                void 0 === runCallbacks && (runCallbacks = !0);
              var params = this.params,
                animating = this.animating;
              return params.loop
                ? !animating &&
                    (this.loopFix(),
                    (this._clientLeft = this.$wrapperEl[0].clientLeft),
                    this.slideTo(
                      this.activeIndex + params.slidesPerGroup,
                      speed,
                      runCallbacks,
                      internal
                    ))
                : this.slideTo(
                    this.activeIndex + params.slidesPerGroup,
                    speed,
                    runCallbacks,
                    internal
                  );
            },
            slidePrev: function (speed, runCallbacks, internal) {
              void 0 === speed && (speed = this.params.speed),
                void 0 === runCallbacks && (runCallbacks = !0);
              var params = this.params,
                animating = this.animating;
              return params.loop
                ? !animating &&
                    (this.loopFix(),
                    (this._clientLeft = this.$wrapperEl[0].clientLeft),
                    this.slideTo(
                      this.activeIndex - 1,
                      speed,
                      runCallbacks,
                      internal
                    ))
                : this.slideTo(
                    this.activeIndex - 1,
                    speed,
                    runCallbacks,
                    internal
                  );
            },
            slideReset: function (speed, runCallbacks, internal) {
              return (
                void 0 === speed && (speed = this.params.speed),
                void 0 === runCallbacks && (runCallbacks = !0),
                this.slideTo(this.activeIndex, speed, runCallbacks, internal)
              );
            },
            slideToClickedSlide: function () {
              var realIndex,
                swiper = this,
                params = swiper.params,
                $wrapperEl = swiper.$wrapperEl,
                slidesPerView =
                  "auto" === params.slidesPerView
                    ? swiper.slidesPerViewDynamic()
                    : params.slidesPerView,
                slideToIndex = swiper.clickedIndex;
              if (params.loop) {
                if (swiper.animating) return;
                (realIndex = parseInt(
                  $$1(swiper.clickedSlide).attr("data-swiper-slide-index"),
                  10
                )),
                  params.centeredSlides
                    ? slideToIndex < swiper.loopedSlides - slidesPerView / 2 ||
                      slideToIndex >
                        swiper.slides.length -
                          swiper.loopedSlides +
                          slidesPerView / 2
                      ? (swiper.loopFix(),
                        (slideToIndex = $wrapperEl
                          .children(
                            "." +
                              params.slideClass +
                              '[data-swiper-slide-index="' +
                              realIndex +
                              '"]:not(.' +
                              params.slideDuplicateClass +
                              ")"
                          )
                          .eq(0)
                          .index()),
                        Utils.nextTick(function () {
                          swiper.slideTo(slideToIndex);
                        }))
                      : swiper.slideTo(slideToIndex)
                    : slideToIndex > swiper.slides.length - slidesPerView
                    ? (swiper.loopFix(),
                      (slideToIndex = $wrapperEl
                        .children(
                          "." +
                            params.slideClass +
                            '[data-swiper-slide-index="' +
                            realIndex +
                            '"]:not(.' +
                            params.slideDuplicateClass +
                            ")"
                        )
                        .eq(0)
                        .index()),
                      Utils.nextTick(function () {
                        swiper.slideTo(slideToIndex);
                      }))
                    : swiper.slideTo(slideToIndex);
              } else swiper.slideTo(slideToIndex);
            },
          },
          loop = {
            loopCreate: function () {
              var swiper = this,
                params = swiper.params,
                $wrapperEl = swiper.$wrapperEl;
              $wrapperEl
                .children(
                  "." + params.slideClass + "." + params.slideDuplicateClass
                )
                .remove();
              var slides = $wrapperEl.children("." + params.slideClass);
              if (params.loopFillGroupWithBlank) {
                var blankSlidesNum =
                  params.slidesPerGroup -
                  (slides.length % params.slidesPerGroup);
                if (blankSlidesNum !== params.slidesPerGroup) {
                  for (var i = 0; i < blankSlidesNum; i += 1) {
                    var blankNode = $$1(doc.createElement("div")).addClass(
                      params.slideClass + " " + params.slideBlankClass
                    );
                    $wrapperEl.append(blankNode);
                  }
                  slides = $wrapperEl.children("." + params.slideClass);
                }
              }
              "auto" !== params.slidesPerView ||
                params.loopedSlides ||
                (params.loopedSlides = slides.length),
                (swiper.loopedSlides = parseInt(
                  params.loopedSlides || params.slidesPerView,
                  10
                )),
                (swiper.loopedSlides += params.loopAdditionalSlides),
                swiper.loopedSlides > slides.length &&
                  (swiper.loopedSlides = slides.length);
              var prependSlides = [],
                appendSlides = [];
              slides.each(function (index, el) {
                var slide = $$1(el);
                index < swiper.loopedSlides && appendSlides.push(el),
                  index < slides.length &&
                    index >= slides.length - swiper.loopedSlides &&
                    prependSlides.push(el),
                  slide.attr("data-swiper-slide-index", index);
              });
              for (var i$1 = 0; i$1 < appendSlides.length; i$1 += 1)
                $wrapperEl.append(
                  $$1(appendSlides[i$1].cloneNode(!0)).addClass(
                    params.slideDuplicateClass
                  )
                );
              for (var i$2 = prependSlides.length - 1; i$2 >= 0; i$2 -= 1)
                $wrapperEl.prepend(
                  $$1(prependSlides[i$2].cloneNode(!0)).addClass(
                    params.slideDuplicateClass
                  )
                );
            },
            loopFix: function () {
              var newIndex,
                params = this.params,
                activeIndex = this.activeIndex,
                slides = this.slides,
                loopedSlides = this.loopedSlides,
                allowSlidePrev = this.allowSlidePrev,
                allowSlideNext = this.allowSlideNext;
              (this.allowSlidePrev = !0),
                (this.allowSlideNext = !0),
                activeIndex < loopedSlides
                  ? ((newIndex =
                      slides.length - 3 * loopedSlides + activeIndex),
                    (newIndex += loopedSlides),
                    this.slideTo(newIndex, 0, !1, !0))
                  : (("auto" === params.slidesPerView &&
                      activeIndex >= 2 * loopedSlides) ||
                      activeIndex > slides.length - 2 * params.slidesPerView) &&
                    ((newIndex = -slides.length + activeIndex + loopedSlides),
                    (newIndex += loopedSlides),
                    this.slideTo(newIndex, 0, !1, !0)),
                (this.allowSlidePrev = allowSlidePrev),
                (this.allowSlideNext = allowSlideNext);
            },
            loopDestroy: function () {
              var $wrapperEl = this.$wrapperEl,
                params = this.params,
                slides = this.slides;
              $wrapperEl
                .children(
                  "." + params.slideClass + "." + params.slideDuplicateClass
                )
                .remove(),
                slides.removeAttr("data-swiper-slide-index");
            },
          },
          grabCursor = {
            setGrabCursor: function (moving) {
              if (!Support.touch && this.params.simulateTouch) {
                var el = this.el;
                (el.style.cursor = "move"),
                  (el.style.cursor = moving
                    ? "-webkit-grabbing"
                    : "-webkit-grab"),
                  (el.style.cursor = moving ? "-moz-grabbin" : "-moz-grab"),
                  (el.style.cursor = moving ? "grabbing" : "grab");
              }
            },
            unsetGrabCursor: function () {
              Support.touch || (this.el.style.cursor = "");
            },
          },
          manipulation = {
            appendSlide: function (slides) {
              var $wrapperEl = this.$wrapperEl,
                params = this.params;
              if (
                (params.loop && this.loopDestroy(),
                "object" == typeof slides && "length" in slides)
              )
                for (var i = 0; i < slides.length; i += 1)
                  slides[i] && $wrapperEl.append(slides[i]);
              else $wrapperEl.append(slides);
              params.loop && this.loopCreate(),
                (params.observer && Support.observer) || this.update();
            },
            prependSlide: function (slides) {
              var params = this.params,
                $wrapperEl = this.$wrapperEl,
                activeIndex = this.activeIndex;
              params.loop && this.loopDestroy();
              var newActiveIndex = activeIndex + 1;
              if ("object" == typeof slides && "length" in slides) {
                for (var i = 0; i < slides.length; i += 1)
                  slides[i] && $wrapperEl.prepend(slides[i]);
                newActiveIndex = activeIndex + slides.length;
              } else $wrapperEl.prepend(slides);
              params.loop && this.loopCreate(),
                (params.observer && Support.observer) || this.update(),
                this.slideTo(newActiveIndex, 0, !1);
            },
            removeSlide: function (slidesIndexes) {
              var params = this.params,
                $wrapperEl = this.$wrapperEl,
                activeIndex = this.activeIndex;
              params.loop &&
                (this.loopDestroy(),
                (this.slides = $wrapperEl.children("." + params.slideClass)));
              var indexToRemove,
                newActiveIndex = activeIndex;
              if (
                "object" == typeof slidesIndexes &&
                "length" in slidesIndexes
              ) {
                for (var i = 0; i < slidesIndexes.length; i += 1)
                  (indexToRemove = slidesIndexes[i]),
                    this.slides[indexToRemove] &&
                      this.slides.eq(indexToRemove).remove(),
                    indexToRemove < newActiveIndex && (newActiveIndex -= 1);
                newActiveIndex = Math.max(newActiveIndex, 0);
              } else
                (indexToRemove = slidesIndexes),
                  this.slides[indexToRemove] &&
                    this.slides.eq(indexToRemove).remove(),
                  indexToRemove < newActiveIndex && (newActiveIndex -= 1),
                  (newActiveIndex = Math.max(newActiveIndex, 0));
              params.loop && this.loopCreate(),
                (params.observer && Support.observer) || this.update(),
                params.loop
                  ? this.slideTo(newActiveIndex + this.loopedSlides, 0, !1)
                  : this.slideTo(newActiveIndex, 0, !1);
            },
            removeAllSlides: function () {
              for (
                var slidesIndexes = [], i = 0;
                i < this.slides.length;
                i += 1
              )
                slidesIndexes.push(i);
              this.removeSlide(slidesIndexes);
            },
          },
          Device = (function Device() {
            var ua = win.navigator.userAgent,
              device = {
                ios: !1,
                android: !1,
                androidChrome: !1,
                desktop: !1,
                windows: !1,
                iphone: !1,
                ipod: !1,
                ipad: !1,
                cordova: win.cordova || win.phonegap,
                phonegap: win.cordova || win.phonegap,
              },
              windows = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/),
              android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
              ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
              ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
              iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
            if (
              (windows &&
                ((device.os = "windows"),
                (device.osVersion = windows[2]),
                (device.windows = !0)),
              android &&
                !windows &&
                ((device.os = "android"),
                (device.osVersion = android[2]),
                (device.android = !0),
                (device.androidChrome =
                  ua.toLowerCase().indexOf("chrome") >= 0)),
              (ipad || iphone || ipod) &&
                ((device.os = "ios"), (device.ios = !0)),
              iphone &&
                !ipod &&
                ((device.osVersion = iphone[2].replace(/_/g, ".")),
                (device.iphone = !0)),
              ipad &&
                ((device.osVersion = ipad[2].replace(/_/g, ".")),
                (device.ipad = !0)),
              ipod &&
                ((device.osVersion = ipod[3]
                  ? ipod[3].replace(/_/g, ".")
                  : null),
                (device.iphone = !0)),
              device.ios &&
                device.osVersion &&
                ua.indexOf("Version/") >= 0 &&
                "10" === device.osVersion.split(".")[0] &&
                (device.osVersion = ua
                  .toLowerCase()
                  .split("version/")[1]
                  .split(" ")[0]),
              (device.desktop = !(
                device.os ||
                device.android ||
                device.webView
              )),
              (device.webView =
                (iphone || ipad || ipod) &&
                ua.match(/.*AppleWebKit(?!.*Safari)/i)),
              device.os && "ios" === device.os)
            ) {
              var osVersionArr = device.osVersion.split("."),
                metaViewport = doc.querySelector('meta[name="viewport"]');
              device.minimalUi =
                !device.webView &&
                (ipod || iphone) &&
                (1 * osVersionArr[0] == 7
                  ? 1 * osVersionArr[1] >= 1
                  : 1 * osVersionArr[0] > 7) &&
                metaViewport &&
                metaViewport.getAttribute("content").indexOf("minimal-ui") >= 0;
            }
            return (device.pixelRatio = win.devicePixelRatio || 1), device;
          })(),
          onTouchStart = function (event) {
            var data = this.touchEventsData,
              params = this.params,
              touches = this.touches,
              e = event;
            if (
              (e.originalEvent && (e = e.originalEvent),
              (data.isTouchEvent = "touchstart" === e.type),
              (data.isTouchEvent || !("which" in e) || 3 !== e.which) &&
                (!data.isTouched || !data.isMoved))
            )
              if (
                params.noSwiping &&
                $$1(e.target).closest("." + params.noSwipingClass)[0]
              )
                this.allowClick = !0;
              else if (
                !params.swipeHandler ||
                $$1(e).closest(params.swipeHandler)[0]
              ) {
                (touches.currentX =
                  "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX),
                  (touches.currentY =
                    "touchstart" === e.type
                      ? e.targetTouches[0].pageY
                      : e.pageY);
                var startX = touches.currentX,
                  startY = touches.currentY;
                if (
                  !(
                    Device.ios &&
                    !Device.cordova &&
                    params.iOSEdgeSwipeDetection &&
                    startX <= params.iOSEdgeSwipeThreshold &&
                    startX >= window.screen.width - params.iOSEdgeSwipeThreshold
                  )
                ) {
                  if (
                    (Utils.extend(data, {
                      isTouched: !0,
                      isMoved: !1,
                      allowTouchCallbacks: !0,
                      isScrolling: void 0,
                      startMoving: void 0,
                    }),
                    (touches.startX = startX),
                    (touches.startY = startY),
                    (data.touchStartTime = Utils.now()),
                    (this.allowClick = !0),
                    this.updateSize(),
                    (this.swipeDirection = void 0),
                    params.threshold > 0 && (data.allowThresholdMove = !1),
                    "touchstart" !== e.type)
                  ) {
                    var preventDefault = !0;
                    $$1(e.target).is(data.formElements) &&
                      (preventDefault = !1),
                      doc.activeElement &&
                        $$1(doc.activeElement).is(data.formElements) &&
                        doc.activeElement.blur(),
                      preventDefault &&
                        this.allowTouchMove &&
                        e.preventDefault();
                  }
                  this.emit("touchStart", e);
                }
              }
          },
          onTouchMove = function (event) {
            var data = this.touchEventsData,
              params = this.params,
              touches = this.touches,
              rtl = this.rtl,
              e = event;
            if (
              (e.originalEvent && (e = e.originalEvent),
              !data.isTouchEvent || "mousemove" !== e.type)
            ) {
              var pageX =
                  "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                pageY =
                  "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
              if (e.preventedByNestedSwiper)
                return (touches.startX = pageX), void (touches.startY = pageY);
              if (!this.allowTouchMove)
                return (
                  (this.allowClick = !1),
                  void (
                    data.isTouched &&
                    (Utils.extend(touches, {
                      startX: pageX,
                      startY: pageY,
                      currentX: pageX,
                      currentY: pageY,
                    }),
                    (data.touchStartTime = Utils.now()))
                  )
                );
              if (
                data.isTouchEvent &&
                params.touchReleaseOnEdges &&
                !params.loop
              )
                if (this.isVertical()) {
                  if (
                    (pageY < touches.startY &&
                      this.translate <= this.maxTranslate()) ||
                    (pageY > touches.startY &&
                      this.translate >= this.minTranslate())
                  )
                    return (data.isTouched = !1), void (data.isMoved = !1);
                } else if (
                  (pageX < touches.startX &&
                    this.translate <= this.maxTranslate()) ||
                  (pageX > touches.startX &&
                    this.translate >= this.minTranslate())
                )
                  return;
              if (
                data.isTouchEvent &&
                doc.activeElement &&
                e.target === doc.activeElement &&
                $$1(e.target).is(data.formElements)
              )
                return (data.isMoved = !0), void (this.allowClick = !1);
              if (
                (data.allowTouchCallbacks && this.emit("touchMove", e),
                !(e.targetTouches && e.targetTouches.length > 1))
              ) {
                (touches.currentX = pageX), (touches.currentY = pageY);
                var touchAngle,
                  diffX = touches.currentX - touches.startX,
                  diffY = touches.currentY - touches.startY;
                if (
                  (void 0 === data.isScrolling &&
                    ((this.isHorizontal() &&
                      touches.currentY === touches.startY) ||
                    (this.isVertical() && touches.currentX === touches.startX)
                      ? (data.isScrolling = !1)
                      : diffX * diffX + diffY * diffY >= 25 &&
                        ((touchAngle =
                          (180 * Math.atan2(Math.abs(diffY), Math.abs(diffX))) /
                          Math.PI),
                        (data.isScrolling = this.isHorizontal()
                          ? touchAngle > params.touchAngle
                          : 90 - touchAngle > params.touchAngle))),
                  data.isScrolling && this.emit("touchMoveOpposite", e),
                  "undefined" == typeof startMoving &&
                    ((touches.currentX === touches.startX &&
                      touches.currentY === touches.startY) ||
                      (data.startMoving = !0)),
                  data.isTouched)
                )
                  if (data.isScrolling) data.isTouched = !1;
                  else if (data.startMoving) {
                    (this.allowClick = !1),
                      e.preventDefault(),
                      params.touchMoveStopPropagation &&
                        !params.nested &&
                        e.stopPropagation(),
                      data.isMoved ||
                        (params.loop && this.loopFix(),
                        (data.startTranslate = this.getTranslate()),
                        this.setTransition(0),
                        this.animating &&
                          this.$wrapperEl.trigger(
                            "webkitTransitionEnd transitionend"
                          ),
                        (data.allowMomentumBounce = !1),
                        !params.grabCursor ||
                          (!0 !== this.allowSlideNext &&
                            !0 !== this.allowSlidePrev) ||
                          this.setGrabCursor(!0),
                        this.emit("sliderFirstMove", e)),
                      this.emit("sliderMove", e),
                      (data.isMoved = !0);
                    var diff = this.isHorizontal() ? diffX : diffY;
                    (touches.diff = diff),
                      (diff *= params.touchRatio),
                      rtl && (diff = -diff),
                      (this.swipeDirection = diff > 0 ? "prev" : "next"),
                      (data.currentTranslate = diff + data.startTranslate);
                    var disableParentSwiper = !0,
                      resistanceRatio = params.resistanceRatio;
                    if (
                      (params.touchReleaseOnEdges && (resistanceRatio = 0),
                      diff > 0 && data.currentTranslate > this.minTranslate()
                        ? ((disableParentSwiper = !1),
                          params.resistance &&
                            (data.currentTranslate =
                              this.minTranslate() -
                              1 +
                              Math.pow(
                                -this.minTranslate() +
                                  data.startTranslate +
                                  diff,
                                resistanceRatio
                              )))
                        : diff < 0 &&
                          data.currentTranslate < this.maxTranslate() &&
                          ((disableParentSwiper = !1),
                          params.resistance &&
                            (data.currentTranslate =
                              this.maxTranslate() +
                              1 -
                              Math.pow(
                                this.maxTranslate() -
                                  data.startTranslate -
                                  diff,
                                resistanceRatio
                              ))),
                      disableParentSwiper && (e.preventedByNestedSwiper = !0),
                      !this.allowSlideNext &&
                        "next" === this.swipeDirection &&
                        data.currentTranslate < data.startTranslate &&
                        (data.currentTranslate = data.startTranslate),
                      !this.allowSlidePrev &&
                        "prev" === this.swipeDirection &&
                        data.currentTranslate > data.startTranslate &&
                        (data.currentTranslate = data.startTranslate),
                      params.threshold > 0)
                    ) {
                      if (
                        !(
                          Math.abs(diff) > params.threshold ||
                          data.allowThresholdMove
                        )
                      )
                        return void (data.currentTranslate =
                          data.startTranslate);
                      if (!data.allowThresholdMove)
                        return (
                          (data.allowThresholdMove = !0),
                          (touches.startX = touches.currentX),
                          (touches.startY = touches.currentY),
                          (data.currentTranslate = data.startTranslate),
                          void (touches.diff = this.isHorizontal()
                            ? touches.currentX - touches.startX
                            : touches.currentY - touches.startY)
                        );
                    }
                    params.followFinger &&
                      ((params.freeMode ||
                        params.watchSlidesProgress ||
                        params.watchSlidesVisibility) &&
                        (this.updateActiveIndex(), this.updateSlidesClasses()),
                      params.freeMode &&
                        (0 === data.velocities.length &&
                          data.velocities.push({
                            position:
                              touches[
                                this.isHorizontal() ? "startX" : "startY"
                              ],
                            time: data.touchStartTime,
                          }),
                        data.velocities.push({
                          position:
                            touches[
                              this.isHorizontal() ? "currentX" : "currentY"
                            ],
                          time: Utils.now(),
                        })),
                      this.updateProgress(data.currentTranslate),
                      this.setTranslate(data.currentTranslate));
                  }
              }
            }
          },
          onTouchEnd = function (event) {
            var swiper = this,
              data = swiper.touchEventsData,
              params = swiper.params,
              touches = swiper.touches,
              rtl = swiper.rtl,
              $wrapperEl = swiper.$wrapperEl,
              slidesGrid = swiper.slidesGrid,
              snapGrid = swiper.snapGrid,
              e = event;
            if (
              (e.originalEvent && (e = e.originalEvent),
              data.allowTouchCallbacks && swiper.emit("touchEnd", e),
              (data.allowTouchCallbacks = !1),
              data.isTouched)
            ) {
              params.grabCursor &&
                data.isMoved &&
                data.isTouched &&
                (!0 === swiper.allowSlideNext ||
                  !0 === swiper.allowSlidePrev) &&
                swiper.setGrabCursor(!1);
              var currentPos,
                touchEndTime = Utils.now(),
                timeDiff = touchEndTime - data.touchStartTime;
              if (
                (swiper.allowClick &&
                  (swiper.updateClickedSlide(e),
                  swiper.emit("tap", e),
                  timeDiff < 300 &&
                    touchEndTime - data.lastClickTime > 300 &&
                    (data.clickTimeout && clearTimeout(data.clickTimeout),
                    (data.clickTimeout = Utils.nextTick(function () {
                      swiper && !swiper.destroyed && swiper.emit("click", e);
                    }, 300))),
                  timeDiff < 300 &&
                    touchEndTime - data.lastClickTime < 300 &&
                    (data.clickTimeout && clearTimeout(data.clickTimeout),
                    swiper.emit("doubleTap", e))),
                (data.lastClickTime = Utils.now()),
                Utils.nextTick(function () {
                  swiper.destroyed || (swiper.allowClick = !0);
                }),
                !data.isTouched ||
                  !data.isMoved ||
                  !swiper.swipeDirection ||
                  0 === touches.diff ||
                  data.currentTranslate === data.startTranslate)
              )
                return (data.isTouched = !1), void (data.isMoved = !1);
              if (
                ((data.isTouched = !1),
                (data.isMoved = !1),
                (currentPos = params.followFinger
                  ? rtl
                    ? swiper.translate
                    : -swiper.translate
                  : -data.currentTranslate),
                params.freeMode)
              ) {
                if (currentPos < -swiper.minTranslate())
                  return void swiper.slideTo(swiper.activeIndex);
                if (currentPos > -swiper.maxTranslate())
                  return void (swiper.slides.length < snapGrid.length
                    ? swiper.slideTo(snapGrid.length - 1)
                    : swiper.slideTo(swiper.slides.length - 1));
                if (params.freeModeMomentum) {
                  if (data.velocities.length > 1) {
                    var lastMoveEvent = data.velocities.pop(),
                      velocityEvent = data.velocities.pop(),
                      distance =
                        lastMoveEvent.position - velocityEvent.position,
                      time = lastMoveEvent.time - velocityEvent.time;
                    (swiper.velocity = distance / time),
                      (swiper.velocity /= 2),
                      Math.abs(swiper.velocity) <
                        params.freeModeMinimumVelocity && (swiper.velocity = 0),
                      (time > 150 || Utils.now() - lastMoveEvent.time > 300) &&
                        (swiper.velocity = 0);
                  } else swiper.velocity = 0;
                  (swiper.velocity *= params.freeModeMomentumVelocityRatio),
                    (data.velocities.length = 0);
                  var momentumDuration = 1e3 * params.freeModeMomentumRatio,
                    momentumDistance = swiper.velocity * momentumDuration,
                    newPosition = swiper.translate + momentumDistance;
                  rtl && (newPosition = -newPosition);
                  var afterBouncePosition,
                    doBounce = !1,
                    bounceAmount =
                      20 *
                      Math.abs(swiper.velocity) *
                      params.freeModeMomentumBounceRatio;
                  if (newPosition < swiper.maxTranslate())
                    params.freeModeMomentumBounce
                      ? (newPosition + swiper.maxTranslate() < -bounceAmount &&
                          (newPosition = swiper.maxTranslate() - bounceAmount),
                        (afterBouncePosition = swiper.maxTranslate()),
                        (doBounce = !0),
                        (data.allowMomentumBounce = !0))
                      : (newPosition = swiper.maxTranslate());
                  else if (newPosition > swiper.minTranslate())
                    params.freeModeMomentumBounce
                      ? (newPosition - swiper.minTranslate() > bounceAmount &&
                          (newPosition = swiper.minTranslate() + bounceAmount),
                        (afterBouncePosition = swiper.minTranslate()),
                        (doBounce = !0),
                        (data.allowMomentumBounce = !0))
                      : (newPosition = swiper.minTranslate());
                  else if (params.freeModeSticky) {
                    for (var nextSlide, j = 0; j < snapGrid.length; j += 1)
                      if (snapGrid[j] > -newPosition) {
                        nextSlide = j;
                        break;
                      }
                    newPosition = -(newPosition =
                      Math.abs(snapGrid[nextSlide] - newPosition) <
                        Math.abs(snapGrid[nextSlide - 1] - newPosition) ||
                      "next" === swiper.swipeDirection
                        ? snapGrid[nextSlide]
                        : snapGrid[nextSlide - 1]);
                  }
                  if (0 !== swiper.velocity)
                    momentumDuration = rtl
                      ? Math.abs(
                          (-newPosition - swiper.translate) / swiper.velocity
                        )
                      : Math.abs(
                          (newPosition - swiper.translate) / swiper.velocity
                        );
                  else if (params.freeModeSticky)
                    return void swiper.slideReset();
                  params.freeModeMomentumBounce && doBounce
                    ? (swiper.updateProgress(afterBouncePosition),
                      swiper.setTransition(momentumDuration),
                      swiper.setTranslate(newPosition),
                      swiper.transitionStart(),
                      (swiper.animating = !0),
                      $wrapperEl.transitionEnd(function () {
                        swiper &&
                          !swiper.destroyed &&
                          data.allowMomentumBounce &&
                          (swiper.emit("momentumBounce"),
                          swiper.setTransition(params.speed),
                          swiper.setTranslate(afterBouncePosition),
                          $wrapperEl.transitionEnd(function () {
                            swiper &&
                              !swiper.destroyed &&
                              swiper.transitionEnd();
                          }));
                      }))
                    : swiper.velocity
                    ? (swiper.updateProgress(newPosition),
                      swiper.setTransition(momentumDuration),
                      swiper.setTranslate(newPosition),
                      swiper.transitionStart(),
                      swiper.animating ||
                        ((swiper.animating = !0),
                        $wrapperEl.transitionEnd(function () {
                          swiper && !swiper.destroyed && swiper.transitionEnd();
                        })))
                    : swiper.updateProgress(newPosition),
                    swiper.updateActiveIndex(),
                    swiper.updateSlidesClasses();
                }
                (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) &&
                  (swiper.updateProgress(),
                  swiper.updateActiveIndex(),
                  swiper.updateSlidesClasses());
              } else {
                for (
                  var stopIndex = 0,
                    groupSize = swiper.slidesSizesGrid[0],
                    i = 0;
                  i < slidesGrid.length;
                  i += params.slidesPerGroup
                )
                  void 0 !== slidesGrid[i + params.slidesPerGroup]
                    ? currentPos >= slidesGrid[i] &&
                      currentPos < slidesGrid[i + params.slidesPerGroup] &&
                      ((stopIndex = i),
                      (groupSize =
                        slidesGrid[i + params.slidesPerGroup] - slidesGrid[i]))
                    : currentPos >= slidesGrid[i] &&
                      ((stopIndex = i),
                      (groupSize =
                        slidesGrid[slidesGrid.length - 1] -
                        slidesGrid[slidesGrid.length - 2]));
                var ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
                if (timeDiff > params.longSwipesMs) {
                  if (!params.longSwipes)
                    return void swiper.slideTo(swiper.activeIndex);
                  "next" === swiper.swipeDirection &&
                    (ratio >= params.longSwipesRatio
                      ? swiper.slideTo(stopIndex + params.slidesPerGroup)
                      : swiper.slideTo(stopIndex)),
                    "prev" === swiper.swipeDirection &&
                      (ratio > 1 - params.longSwipesRatio
                        ? swiper.slideTo(stopIndex + params.slidesPerGroup)
                        : swiper.slideTo(stopIndex));
                } else {
                  if (!params.shortSwipes)
                    return void swiper.slideTo(swiper.activeIndex);
                  "next" === swiper.swipeDirection &&
                    swiper.slideTo(stopIndex + params.slidesPerGroup),
                    "prev" === swiper.swipeDirection &&
                      swiper.slideTo(stopIndex);
                }
              }
            }
          },
          onResize = function () {
            var params = this.params,
              el = this.el;
            if (!el || 0 !== el.offsetWidth) {
              params.breakpoints && this.setBreakpoint();
              var allowSlideNext = this.allowSlideNext,
                allowSlidePrev = this.allowSlidePrev;
              if (
                ((this.allowSlideNext = !0),
                (this.allowSlidePrev = !0),
                this.updateSize(),
                this.updateSlides(),
                params.freeMode)
              ) {
                var newTranslate = Math.min(
                  Math.max(this.translate, this.maxTranslate()),
                  this.minTranslate()
                );
                this.setTranslate(newTranslate),
                  this.updateActiveIndex(),
                  this.updateSlidesClasses(),
                  params.autoHeight && this.updateAutoHeight();
              } else
                this.updateSlidesClasses(),
                  ("auto" === params.slidesPerView ||
                    params.slidesPerView > 1) &&
                  this.isEnd &&
                  !this.params.centeredSlides
                    ? this.slideTo(this.slides.length - 1, 0, !1, !0)
                    : this.slideTo(this.activeIndex, 0, !1, !0);
              (this.allowSlidePrev = allowSlidePrev),
                (this.allowSlideNext = allowSlideNext);
            }
          },
          onClick = function (e) {
            this.allowClick ||
              (this.params.preventClicks && e.preventDefault(),
              this.params.preventClicksPropagation &&
                this.animating &&
                (e.stopPropagation(), e.stopImmediatePropagation()));
          },
          images = {
            loadImage: function (
              imageEl,
              src,
              srcset,
              sizes,
              checkForComplete,
              callback
            ) {
              var image;
              function onReady() {
                callback && callback();
              }
              imageEl.complete && checkForComplete
                ? onReady()
                : src
                ? (((image = new win.Image()).onload = onReady),
                  (image.onerror = onReady),
                  sizes && (image.sizes = sizes),
                  srcset && (image.srcset = srcset),
                  src && (image.src = src))
                : onReady();
            },
            preloadImages: function () {
              var swiper = this;
              function onReady() {
                null != swiper &&
                  swiper &&
                  !swiper.destroyed &&
                  (void 0 !== swiper.imagesLoaded && (swiper.imagesLoaded += 1),
                  swiper.imagesLoaded === swiper.imagesToLoad.length &&
                    (swiper.params.updateOnImagesReady && swiper.update(),
                    swiper.emit("imagesReady")));
              }
              swiper.imagesToLoad = swiper.$el.find("img");
              for (var i = 0; i < swiper.imagesToLoad.length; i += 1) {
                var imageEl = swiper.imagesToLoad[i];
                swiper.loadImage(
                  imageEl,
                  imageEl.currentSrc || imageEl.getAttribute("src"),
                  imageEl.srcset || imageEl.getAttribute("srcset"),
                  imageEl.sizes || imageEl.getAttribute("sizes"),
                  !0,
                  onReady
                );
              }
            },
          },
          defaults = {
            init: !0,
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            iOSEdgeSwipeDetection: !1,
            iOSEdgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeMomentumVelocityRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: 0.02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            centeredSlides: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            normalizeSlideIndex: !0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: !0,
            allowTouchMove: !0,
            threshold: 0,
            touchMoveStopPropagation: !0,
            touchReleaseOnEdges: !1,
            uniqueNavElements: !0,
            resistance: !0,
            resistanceRatio: 0.85,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            loopFillGroupWithBlank: !1,
            allowSlidePrev: !0,
            allowSlideNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            passiveListeners: !0,
            containerModifierClass: "swiper-container-",
            slideClass: "swiper-slide",
            slideBlankClass: "swiper-slide-invisible-blank",
            slideActiveClass: "swiper-slide-active",
            slideDuplicateActiveClass: "swiper-slide-duplicate-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slideDuplicateNextClass: "swiper-slide-duplicate-next",
            slidePrevClass: "swiper-slide-prev",
            slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
            wrapperClass: "swiper-wrapper",
            runCallbacksOnInit: !0,
          },
          prototypes = {
            update: update,
            translate: translate,
            transition: transition$1,
            slide: slide,
            loop: loop,
            grabCursor: grabCursor,
            manipulation: manipulation,
            events: {
              attachEvents: function attachEvents() {
                var params = this.params,
                  touchEvents = this.touchEvents,
                  el = this.el,
                  wrapperEl = this.wrapperEl;
                (this.onTouchStart = onTouchStart.bind(this)),
                  (this.onTouchMove = onTouchMove.bind(this)),
                  (this.onTouchEnd = onTouchEnd.bind(this)),
                  (this.onClick = onClick.bind(this));
                var target =
                    "container" === params.touchEventsTarget ? el : wrapperEl,
                  capture = !!params.nested;
                if (Browser.ie)
                  target.addEventListener(
                    touchEvents.start,
                    this.onTouchStart,
                    !1
                  ),
                    (Support.touch ? target : doc).addEventListener(
                      touchEvents.move,
                      this.onTouchMove,
                      capture
                    ),
                    (Support.touch ? target : doc).addEventListener(
                      touchEvents.end,
                      this.onTouchEnd,
                      !1
                    );
                else {
                  if (Support.touch) {
                    var passiveListener = !(
                      "touchstart" !== touchEvents.start ||
                      !Support.passiveListener ||
                      !params.passiveListeners
                    ) && { passive: !0, capture: !1 };
                    target.addEventListener(
                      touchEvents.start,
                      this.onTouchStart,
                      passiveListener
                    ),
                      target.addEventListener(
                        touchEvents.move,
                        this.onTouchMove,
                        Support.passiveListener
                          ? { passive: !1, capture: capture }
                          : capture
                      ),
                      target.addEventListener(
                        touchEvents.end,
                        this.onTouchEnd,
                        passiveListener
                      );
                  }
                  ((params.simulateTouch && !Device.ios && !Device.android) ||
                    (params.simulateTouch && !Support.touch && Device.ios)) &&
                    (target.addEventListener(
                      "mousedown",
                      this.onTouchStart,
                      !1
                    ),
                    doc.addEventListener(
                      "mousemove",
                      this.onTouchMove,
                      capture
                    ),
                    doc.addEventListener("mouseup", this.onTouchEnd, !1));
                }
                (params.preventClicks || params.preventClicksPropagation) &&
                  target.addEventListener("click", this.onClick, !0),
                  this.on("resize observerUpdate", onResize);
              },
              detachEvents: function detachEvents() {
                var params = this.params,
                  touchEvents = this.touchEvents,
                  el = this.el,
                  wrapperEl = this.wrapperEl,
                  target =
                    "container" === params.touchEventsTarget ? el : wrapperEl,
                  capture = !!params.nested;
                if (Browser.ie)
                  target.removeEventListener(
                    touchEvents.start,
                    this.onTouchStart,
                    !1
                  ),
                    (Support.touch ? target : doc).removeEventListener(
                      touchEvents.move,
                      this.onTouchMove,
                      capture
                    ),
                    (Support.touch ? target : doc).removeEventListener(
                      touchEvents.end,
                      this.onTouchEnd,
                      !1
                    );
                else {
                  if (Support.touch) {
                    var passiveListener = !(
                      "onTouchStart" !== touchEvents.start ||
                      !Support.passiveListener ||
                      !params.passiveListeners
                    ) && { passive: !0, capture: !1 };
                    target.removeEventListener(
                      touchEvents.start,
                      this.onTouchStart,
                      passiveListener
                    ),
                      target.removeEventListener(
                        touchEvents.move,
                        this.onTouchMove,
                        capture
                      ),
                      target.removeEventListener(
                        touchEvents.end,
                        this.onTouchEnd,
                        passiveListener
                      );
                  }
                  ((params.simulateTouch && !Device.ios && !Device.android) ||
                    (params.simulateTouch && !Support.touch && Device.ios)) &&
                    (target.removeEventListener(
                      "mousedown",
                      this.onTouchStart,
                      !1
                    ),
                    doc.removeEventListener(
                      "mousemove",
                      this.onTouchMove,
                      capture
                    ),
                    doc.removeEventListener("mouseup", this.onTouchEnd, !1));
                }
                (params.preventClicks || params.preventClicksPropagation) &&
                  target.removeEventListener("click", this.onClick, !0),
                  this.off("resize observerUpdate", onResize);
              },
            },
            breakpoints: {
              setBreakpoint: function () {
                var activeIndex = this.activeIndex,
                  loopedSlides = this.loopedSlides;
                void 0 === loopedSlides && (loopedSlides = 0);
                var params = this.params,
                  breakpoints = params.breakpoints;
                if (
                  breakpoints &&
                  (!breakpoints || 0 !== Object.keys(breakpoints).length)
                ) {
                  var breakpoint = this.getBreakpoint(breakpoints);
                  if (breakpoint && this.currentBreakpoint !== breakpoint) {
                    var breakPointsParams =
                        breakpoint in breakpoints
                          ? breakpoints[breakpoint]
                          : this.originalParams,
                      needsReLoop =
                        params.loop &&
                        breakPointsParams.slidesPerView !==
                          params.slidesPerView;
                    Utils.extend(this.params, breakPointsParams),
                      Utils.extend(this, {
                        allowTouchMove: this.params.allowTouchMove,
                        allowSlideNext: this.params.allowSlideNext,
                        allowSlidePrev: this.params.allowSlidePrev,
                      }),
                      (this.currentBreakpoint = breakpoint),
                      needsReLoop &&
                        (this.loopDestroy(),
                        this.loopCreate(),
                        this.updateSlides(),
                        this.slideTo(
                          activeIndex - loopedSlides + this.loopedSlides,
                          0,
                          !1
                        )),
                      this.emit("breakpoint", breakPointsParams);
                  }
                }
              },
              getBreakpoint: function (breakpoints) {
                if (breakpoints) {
                  var breakpoint = !1,
                    points = [];
                  Object.keys(breakpoints).forEach(function (point) {
                    points.push(point);
                  }),
                    points.sort(function (a, b) {
                      return parseInt(a, 10) - parseInt(b, 10);
                    });
                  for (var i = 0; i < points.length; i += 1) {
                    var point = points[i];
                    point >= win.innerWidth &&
                      !breakpoint &&
                      (breakpoint = point);
                  }
                  return breakpoint || "max";
                }
              },
            },
            classes: {
              addClasses: function () {
                var classNames = this.classNames,
                  params = this.params,
                  rtl = this.rtl,
                  $el = this.$el,
                  suffixes = [];
                suffixes.push(params.direction),
                  params.freeMode && suffixes.push("free-mode"),
                  Support.flexbox || suffixes.push("no-flexbox"),
                  params.autoHeight && suffixes.push("autoheight"),
                  rtl && suffixes.push("rtl"),
                  params.slidesPerColumn > 1 && suffixes.push("multirow"),
                  Device.android && suffixes.push("android"),
                  Device.ios && suffixes.push("ios"),
                  (win.navigator.pointerEnabled ||
                    win.navigator.msPointerEnabled) &&
                    suffixes.push("wp8-" + params.direction),
                  suffixes.forEach(function (suffix) {
                    classNames.push(params.containerModifierClass + suffix);
                  }),
                  $el.addClass(classNames.join(" "));
              },
              removeClasses: function () {
                var $el = this.$el,
                  classNames = this.classNames;
                $el.removeClass(classNames.join(" "));
              },
            },
            images: images,
          },
          extendedDefaults = {},
          Swiper$1 = (function (SwiperClass$$1) {
            function Swiper() {
              for (
                var el, params, assign, args = [], len = arguments.length;
                len--;

              )
                args[len] = arguments[len];
              1 === args.length &&
              args[0].constructor &&
              args[0].constructor === Object
                ? (params = args[0])
                : ((el = (assign = args)[0]), (params = assign[1])),
                params || (params = {}),
                (params = Utils.extend({}, params)),
                el && !params.el && (params.el = el),
                SwiperClass$$1.call(this, params),
                Object.keys(prototypes).forEach(function (prototypeGroup) {
                  Object.keys(prototypes[prototypeGroup]).forEach(function (
                    protoMethod
                  ) {
                    Swiper.prototype[protoMethod] ||
                      (Swiper.prototype[protoMethod] =
                        prototypes[prototypeGroup][protoMethod]);
                  });
                });
              var swiper = this;
              void 0 === swiper.modules && (swiper.modules = {}),
                Object.keys(swiper.modules).forEach(function (moduleName) {
                  var module = swiper.modules[moduleName];
                  if (module.params) {
                    var moduleParamName = Object.keys(module.params)[0],
                      moduleParams = module.params[moduleParamName];
                    if ("object" != typeof moduleParams) return;
                    if (
                      !(moduleParamName in params) ||
                      !("enabled" in moduleParams)
                    )
                      return;
                    !0 === params[moduleParamName] &&
                      (params[moduleParamName] = { enabled: !0 }),
                      "object" != typeof params[moduleParamName] ||
                        "enabled" in params[moduleParamName] ||
                        (params[moduleParamName].enabled = !0),
                      params[moduleParamName] ||
                        (params[moduleParamName] = { enabled: !1 });
                  }
                });
              var swiperParams = Utils.extend({}, defaults);
              swiper.useModulesParams(swiperParams),
                (swiper.params = Utils.extend(
                  {},
                  swiperParams,
                  extendedDefaults,
                  params
                )),
                (swiper.originalParams = Utils.extend({}, swiper.params)),
                (swiper.passedParams = Utils.extend({}, params));
              var $el = $$1(swiper.params.el);
              if ((el = $el[0])) {
                if ($el.length > 1) {
                  var swipers = [];
                  return (
                    $el.each(function (index, containerEl) {
                      var newParams = Utils.extend({}, params, {
                        el: containerEl,
                      });
                      swipers.push(new Swiper(newParams));
                    }),
                    swipers
                  );
                }
                (el.swiper = swiper), $el.data("swiper", swiper);
                var $wrapperEl = $el.children("." + swiper.params.wrapperClass);
                return (
                  Utils.extend(swiper, {
                    $el: $el,
                    el: el,
                    $wrapperEl: $wrapperEl,
                    wrapperEl: $wrapperEl[0],
                    classNames: [],
                    slides: $$1(),
                    slidesGrid: [],
                    snapGrid: [],
                    slidesSizesGrid: [],
                    isHorizontal: function isHorizontal() {
                      return "horizontal" === swiper.params.direction;
                    },
                    isVertical: function isVertical() {
                      return "vertical" === swiper.params.direction;
                    },
                    rtl:
                      "horizontal" === swiper.params.direction &&
                      ("rtl" === el.dir.toLowerCase() ||
                        "rtl" === $el.css("direction")),
                    wrongRTL: "-webkit-box" === $wrapperEl.css("display"),
                    activeIndex: 0,
                    realIndex: 0,
                    isBeginning: !0,
                    isEnd: !1,
                    translate: 0,
                    progress: 0,
                    velocity: 0,
                    animating: !1,
                    allowSlideNext: swiper.params.allowSlideNext,
                    allowSlidePrev: swiper.params.allowSlidePrev,
                    touchEvents: (function touchEvents() {
                      var touch = ["touchstart", "touchmove", "touchend"],
                        desktop = ["mousedown", "mousemove", "mouseup"];
                      return (
                        win.navigator.pointerEnabled
                          ? (desktop = [
                              "pointerdown",
                              "pointermove",
                              "pointerup",
                            ])
                          : win.navigator.msPointerEnabled &&
                            (desktop = [
                              "MSPointerDown",
                              "MsPointerMove",
                              "MsPointerUp",
                            ]),
                        {
                          start:
                            Support.touch || !swiper.params.simulateTouch
                              ? touch[0]
                              : desktop[0],
                          move:
                            Support.touch || !swiper.params.simulateTouch
                              ? touch[1]
                              : desktop[1],
                          end:
                            Support.touch || !swiper.params.simulateTouch
                              ? touch[2]
                              : desktop[2],
                        }
                      );
                    })(),
                    touchEventsData: {
                      isTouched: void 0,
                      isMoved: void 0,
                      allowTouchCallbacks: void 0,
                      touchStartTime: void 0,
                      isScrolling: void 0,
                      currentTranslate: void 0,
                      startTranslate: void 0,
                      allowThresholdMove: void 0,
                      formElements:
                        "input, select, option, textarea, button, video",
                      lastClickTime: Utils.now(),
                      clickTimeout: void 0,
                      velocities: [],
                      allowMomentumBounce: void 0,
                      isTouchEvent: void 0,
                      startMoving: void 0,
                    },
                    allowClick: !0,
                    allowTouchMove: swiper.params.allowTouchMove,
                    touches: {
                      startX: 0,
                      startY: 0,
                      currentX: 0,
                      currentY: 0,
                      diff: 0,
                    },
                    imagesToLoad: [],
                    imagesLoaded: 0,
                  }),
                  swiper.useModules(),
                  swiper.params.init && swiper.init(),
                  swiper
                );
              }
            }
            SwiperClass$$1 && (Swiper.__proto__ = SwiperClass$$1),
              (Swiper.prototype = Object.create(
                SwiperClass$$1 && SwiperClass$$1.prototype
              )),
              (Swiper.prototype.constructor = Swiper);
            var staticAccessors = {
              extendedDefaults: {},
              defaults: {},
              Class: {},
              $: {},
            };
            return (
              (Swiper.prototype.slidesPerViewDynamic =
                function slidesPerViewDynamic() {
                  var params = this.params,
                    slides = this.slides,
                    slidesGrid = this.slidesGrid,
                    swiperSize = this.size,
                    activeIndex = this.activeIndex,
                    spv = 1;
                  if (params.centeredSlides) {
                    for (
                      var breakLoop,
                        slideSize = slides[activeIndex].swiperSlideSize,
                        i = activeIndex + 1;
                      i < slides.length;
                      i += 1
                    )
                      slides[i] &&
                        !breakLoop &&
                        ((spv += 1),
                        (slideSize += slides[i].swiperSlideSize) > swiperSize &&
                          (breakLoop = !0));
                    for (var i$1 = activeIndex - 1; i$1 >= 0; i$1 -= 1)
                      slides[i$1] &&
                        !breakLoop &&
                        ((spv += 1),
                        (slideSize += slides[i$1].swiperSlideSize) >
                          swiperSize && (breakLoop = !0));
                  } else
                    for (
                      var i$2 = activeIndex + 1;
                      i$2 < slides.length;
                      i$2 += 1
                    )
                      slidesGrid[i$2] - slidesGrid[activeIndex] < swiperSize &&
                        (spv += 1);
                  return spv;
                }),
              (Swiper.prototype.update = function update$$1() {
                var newTranslate,
                  swiper = this;
                function setTranslate() {
                  (newTranslate = Math.min(
                    Math.max(swiper.translate, swiper.maxTranslate()),
                    swiper.minTranslate()
                  )),
                    swiper.setTranslate(newTranslate),
                    swiper.updateActiveIndex(),
                    swiper.updateSlidesClasses();
                }
                swiper &&
                  !swiper.destroyed &&
                  (swiper.updateSize(),
                  swiper.updateSlides(),
                  swiper.updateProgress(),
                  swiper.updateSlidesClasses(),
                  swiper.params.freeMode
                    ? (setTranslate(),
                      swiper.params.autoHeight && swiper.updateAutoHeight())
                    : (("auto" === swiper.params.slidesPerView ||
                        swiper.params.slidesPerView > 1) &&
                      swiper.isEnd &&
                      !swiper.params.centeredSlides
                        ? swiper.slideTo(swiper.slides.length - 1, 0, !1, !0)
                        : swiper.slideTo(swiper.activeIndex, 0, !1, !0)) ||
                      setTranslate(),
                  swiper.emit("update"));
              }),
              (Swiper.prototype.init = function init() {
                this.initialized ||
                  (this.emit("beforeInit"),
                  this.params.breakpoints && this.setBreakpoint(),
                  this.addClasses(),
                  this.params.loop && this.loopCreate(),
                  this.updateSize(),
                  this.updateSlides(),
                  this.params.grabCursor && this.setGrabCursor(),
                  this.params.preloadImages && this.preloadImages(),
                  this.params.loop
                    ? this.slideTo(
                        this.params.initialSlide + this.loopedSlides,
                        0,
                        this.params.runCallbacksOnInit
                      )
                    : this.slideTo(
                        this.params.initialSlide,
                        0,
                        this.params.runCallbacksOnInit
                      ),
                  this.attachEvents(),
                  (this.initialized = !0),
                  this.emit("init"));
              }),
              (Swiper.prototype.destroy = function destroy(
                deleteInstance,
                cleanStyles
              ) {
                void 0 === deleteInstance && (deleteInstance = !0),
                  void 0 === cleanStyles && (cleanStyles = !0);
                var swiper = this,
                  params = swiper.params,
                  $el = swiper.$el,
                  $wrapperEl = swiper.$wrapperEl,
                  slides = swiper.slides;
                swiper.emit("beforeDestroy"),
                  (swiper.initialized = !1),
                  swiper.detachEvents(),
                  params.loop && swiper.loopDestroy(),
                  cleanStyles &&
                    (swiper.removeClasses(),
                    $el.removeAttr("style"),
                    $wrapperEl.removeAttr("style"),
                    slides &&
                      slides.length &&
                      slides
                        .removeClass(
                          [
                            params.slideVisibleClass,
                            params.slideActiveClass,
                            params.slideNextClass,
                            params.slidePrevClass,
                          ].join(" ")
                        )
                        .removeAttr("style")
                        .removeAttr("data-swiper-slide-index")
                        .removeAttr("data-swiper-column")
                        .removeAttr("data-swiper-row")),
                  swiper.emit("destroy"),
                  Object.keys(swiper.eventsListeners).forEach(function (
                    eventName
                  ) {
                    swiper.off(eventName);
                  }),
                  !1 !== deleteInstance &&
                    ((swiper.$el[0].swiper = null),
                    swiper.$el.data("swiper", null),
                    Utils.deleteProps(swiper)),
                  (swiper.destroyed = !0);
              }),
              (Swiper.extendDefaults = function extendDefaults(newDefaults) {
                Utils.extend(extendedDefaults, newDefaults);
              }),
              (staticAccessors.extendedDefaults.get = function () {
                return extendedDefaults;
              }),
              (staticAccessors.defaults.get = function () {
                return defaults;
              }),
              (staticAccessors.Class.get = function () {
                return SwiperClass$$1;
              }),
              (staticAccessors.$.get = function () {
                return $$1;
              }),
              Object.defineProperties(Swiper, staticAccessors),
              Swiper
            );
          })(SwiperClass),
          Device$2 = {
            name: "device",
            proto: { device: Device },
            static: { device: Device },
          },
          Support$2 = {
            name: "support",
            proto: { support: Support },
            static: { support: Support },
          },
          Browser$2 = {
            name: "browser",
            proto: { browser: Browser },
            static: { browser: Browser },
          },
          Resize = {
            name: "resize",
            create: function create() {
              var swiper = this;
              Utils.extend(swiper, {
                resize: {
                  resizeHandler: function resizeHandler() {
                    swiper &&
                      !swiper.destroyed &&
                      swiper.initialized &&
                      (swiper.emit("beforeResize"), swiper.emit("resize"));
                  },
                  orientationChangeHandler:
                    function orientationChangeHandler() {
                      swiper &&
                        !swiper.destroyed &&
                        swiper.initialized &&
                        swiper.emit("orientationchange");
                    },
                },
              });
            },
            on: {
              init: function init() {
                win.addEventListener("resize", this.resize.resizeHandler),
                  win.addEventListener(
                    "orientationchange",
                    this.resize.orientationChangeHandler
                  );
              },
              destroy: function destroy() {
                win.removeEventListener("resize", this.resize.resizeHandler),
                  win.removeEventListener(
                    "orientationchange",
                    this.resize.orientationChangeHandler
                  );
              },
            },
          },
          Observer = {
            func: win.MutationObserver || win.WebkitMutationObserver,
            attach: function attach(target, options) {
              void 0 === options && (options = {});
              var swiper = this,
                observer = new (0, Observer.func)(function (mutations) {
                  mutations.forEach(function (mutation) {
                    swiper.emit("observerUpdate", mutation);
                  });
                });
              observer.observe(target, {
                attributes: void 0 === options.attributes || options.attributes,
                childList: void 0 === options.childList || options.childList,
                characterData:
                  void 0 === options.characterData || options.characterData,
              }),
                swiper.observer.observers.push(observer);
            },
            init: function init() {
              if (Support.observer && this.params.observer) {
                if (this.params.observeParents)
                  for (
                    var containerParents = this.$el.parents(), i = 0;
                    i < containerParents.length;
                    i += 1
                  )
                    this.observer.attach(containerParents[i]);
                this.observer.attach(this.$el[0], { childList: !1 }),
                  this.observer.attach(this.$wrapperEl[0], { attributes: !1 });
              }
            },
            destroy: function destroy() {
              this.observer.observers.forEach(function (observer) {
                observer.disconnect();
              }),
                (this.observer.observers = []);
            },
          },
          Observer$1 = {
            name: "observer",
            params: { observer: !1, observeParents: !1 },
            create: function create() {
              Utils.extend(this, {
                observer: {
                  init: Observer.init.bind(this),
                  attach: Observer.attach.bind(this),
                  destroy: Observer.destroy.bind(this),
                  observers: [],
                },
              });
            },
            on: {
              init: function init() {
                this.observer.init();
              },
              destroy: function destroy() {
                this.observer.destroy();
              },
            },
          },
          Virtual = {
            update: function update(force) {
              var swiper = this,
                ref = swiper.params,
                slidesPerView = ref.slidesPerView,
                slidesPerGroup = ref.slidesPerGroup,
                centeredSlides = ref.centeredSlides,
                ref$1 = swiper.virtual,
                previousFrom = ref$1.from,
                previousTo = ref$1.to,
                slides = ref$1.slides,
                previousSlidesGrid = ref$1.slidesGrid,
                renderSlide = ref$1.renderSlide,
                previousOffset = ref$1.offset;
              swiper.updateActiveIndex();
              var offsetProp,
                slidesAfter,
                slidesBefore,
                activeIndex = swiper.activeIndex || 0;
              (offsetProp =
                swiper.rtl && swiper.isHorizontal()
                  ? "right"
                  : swiper.isHorizontal()
                  ? "left"
                  : "top"),
                centeredSlides
                  ? ((slidesAfter =
                      Math.floor(slidesPerView / 2) + slidesPerGroup),
                    (slidesBefore =
                      Math.floor(slidesPerView / 2) + slidesPerGroup))
                  : ((slidesAfter = slidesPerView + (slidesPerGroup - 1)),
                    (slidesBefore = slidesPerGroup));
              var from = Math.max((activeIndex || 0) - slidesBefore, 0),
                to = Math.min(
                  (activeIndex || 0) + slidesAfter,
                  slides.length - 1
                ),
                offset =
                  (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
              function onRendered() {
                swiper.updateSlides(),
                  swiper.updateProgress(),
                  swiper.updateSlidesClasses(),
                  swiper.lazy &&
                    swiper.params.lazy.enabled &&
                    swiper.lazy.load();
              }
              if (
                (Utils.extend(swiper.virtual, {
                  from: from,
                  to: to,
                  offset: offset,
                  slidesGrid: swiper.slidesGrid,
                }),
                previousFrom === from && previousTo === to && !force)
              )
                return (
                  swiper.slidesGrid !== previousSlidesGrid &&
                    offset !== previousOffset &&
                    swiper.slides.css(offsetProp, offset + "px"),
                  void swiper.updateProgress()
                );
              if (swiper.params.virtual.renderExternal)
                return (
                  swiper.params.virtual.renderExternal.call(swiper, {
                    offset: offset,
                    from: from,
                    to: to,
                    slides: (function getSlides() {
                      for (var slidesToRender = [], i = from; i <= to; i += 1)
                        slidesToRender.push(slides[i]);
                      return slidesToRender;
                    })(),
                  }),
                  void onRendered()
                );
              var prependIndexes = [],
                appendIndexes = [];
              if (force)
                swiper.$wrapperEl.find("." + swiper.params.slideClass).remove();
              else
                for (var i = previousFrom; i <= previousTo; i += 1)
                  (i < from || i > to) &&
                    swiper.$wrapperEl
                      .find(
                        "." +
                          swiper.params.slideClass +
                          '[data-swiper-slide-index="' +
                          i +
                          '"]'
                      )
                      .remove();
              for (var i$1 = 0; i$1 < slides.length; i$1 += 1)
                i$1 >= from &&
                  i$1 <= to &&
                  (void 0 === previousTo || force
                    ? appendIndexes.push(i$1)
                    : (i$1 > previousTo && appendIndexes.push(i$1),
                      i$1 < previousFrom && prependIndexes.push(i$1)));
              appendIndexes.forEach(function (index) {
                swiper.$wrapperEl.append(renderSlide(slides[index], index));
              }),
                prependIndexes
                  .sort(function (a, b) {
                    return a < b;
                  })
                  .forEach(function (index) {
                    swiper.$wrapperEl.prepend(
                      renderSlide(slides[index], index)
                    );
                  }),
                swiper.$wrapperEl
                  .children(".swiper-slide")
                  .css(offsetProp, offset + "px"),
                onRendered();
            },
            renderSlide: function renderSlide(slide, index) {
              var params = this.params.virtual;
              if (params.cache && this.virtual.cache[index])
                return this.virtual.cache[index];
              var $slideEl = params.renderSlide
                ? $$1(params.renderSlide.call(this, slide, index))
                : $$1(
                    '<div class="' +
                      this.params.slideClass +
                      '" data-swiper-slide-index="' +
                      index +
                      '">' +
                      slide +
                      "</div>"
                  );
              return (
                $slideEl.attr("data-swiper-slide-index") ||
                  $slideEl.attr("data-swiper-slide-index", index),
                params.cache && (this.virtual.cache[index] = $slideEl),
                $slideEl
              );
            },
            appendSlide: function appendSlide(slide) {
              this.virtual.slides.push(slide), this.virtual.update(!0);
            },
            prependSlide: function prependSlide(slide) {
              if (
                (this.virtual.slides.unshift(slide), this.params.virtual.cache)
              ) {
                var cache = this.virtual.cache,
                  newCache = {};
                Object.keys(cache).forEach(function (cachedIndex) {
                  newCache[cachedIndex + 1] = cache[cachedIndex];
                }),
                  (this.virtual.cache = newCache);
              }
              this.virtual.update(!0), this.slideNext(0);
            },
          },
          Virtual$1 = {
            name: "virtual",
            params: {
              virtual: {
                enabled: !1,
                slides: [],
                cache: !0,
                renderSlide: null,
                renderExternal: null,
              },
            },
            create: function create() {
              Utils.extend(this, {
                virtual: {
                  update: Virtual.update.bind(this),
                  appendSlide: Virtual.appendSlide.bind(this),
                  prependSlide: Virtual.prependSlide.bind(this),
                  renderSlide: Virtual.renderSlide.bind(this),
                  slides: this.params.virtual.slides,
                  cache: {},
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                if (this.params.virtual.enabled) {
                  this.classNames.push(
                    this.params.containerModifierClass + "virtual"
                  );
                  var overwriteParams = { watchSlidesProgress: !0 };
                  Utils.extend(this.params, overwriteParams),
                    Utils.extend(this.originalParams, overwriteParams),
                    this.virtual.update();
                }
              },
              setTranslate: function setTranslate() {
                this.params.virtual.enabled && this.virtual.update();
              },
            },
          },
          Keyboard = {
            handle: function handle(event) {
              var e = event;
              e.originalEvent && (e = e.originalEvent);
              var kc = e.keyCode || e.charCode;
              if (
                !this.allowSlideNext &&
                ((this.isHorizontal() && 39 === kc) ||
                  (this.isVertical() && 40 === kc))
              )
                return !1;
              if (
                !this.allowSlidePrev &&
                ((this.isHorizontal() && 37 === kc) ||
                  (this.isVertical() && 38 === kc))
              )
                return !1;
              if (
                !(
                  e.shiftKey ||
                  e.altKey ||
                  e.ctrlKey ||
                  e.metaKey ||
                  (doc.activeElement &&
                    doc.activeElement.nodeName &&
                    ("input" === doc.activeElement.nodeName.toLowerCase() ||
                      "textarea" === doc.activeElement.nodeName.toLowerCase()))
                )
              ) {
                if (37 === kc || 39 === kc || 38 === kc || 40 === kc) {
                  var inView = !1;
                  if (
                    this.$el.parents("." + this.params.slideClass).length > 0 &&
                    0 ===
                      this.$el.parents("." + this.params.slideActiveClass)
                        .length
                  )
                    return;
                  var windowScroll = {
                      left: win.pageXOffset,
                      top: win.pageYOffset,
                    },
                    windowWidth = win.innerWidth,
                    windowHeight = win.innerHeight,
                    swiperOffset = this.$el.offset();
                  this.rtl && (swiperOffset.left -= this.$el[0].scrollLeft);
                  for (
                    var swiperCoord = [
                        [swiperOffset.left, swiperOffset.top],
                        [swiperOffset.left + this.width, swiperOffset.top],
                        [swiperOffset.left, swiperOffset.top + this.height],
                        [
                          swiperOffset.left + this.width,
                          swiperOffset.top + this.height,
                        ],
                      ],
                      i = 0;
                    i < swiperCoord.length;
                    i += 1
                  ) {
                    var point = swiperCoord[i];
                    point[0] >= windowScroll.left &&
                      point[0] <= windowScroll.left + windowWidth &&
                      point[1] >= windowScroll.top &&
                      point[1] <= windowScroll.top + windowHeight &&
                      (inView = !0);
                  }
                  if (!inView) return;
                }
                this.isHorizontal()
                  ? ((37 !== kc && 39 !== kc) ||
                      (e.preventDefault
                        ? e.preventDefault()
                        : (e.returnValue = !1)),
                    ((39 === kc && !this.rtl) || (37 === kc && this.rtl)) &&
                      this.slideNext(),
                    ((37 === kc && !this.rtl) || (39 === kc && this.rtl)) &&
                      this.slidePrev())
                  : ((38 !== kc && 40 !== kc) ||
                      (e.preventDefault
                        ? e.preventDefault()
                        : (e.returnValue = !1)),
                    40 === kc && this.slideNext(),
                    38 === kc && this.slidePrev()),
                  this.emit("keyPress", kc);
              }
            },
            enable: function enable() {
              this.keyboard.enabled ||
                ($$1(doc).on("keydown", this.keyboard.handle),
                (this.keyboard.enabled = !0));
            },
            disable: function disable() {
              this.keyboard.enabled &&
                ($$1(doc).off("keydown", this.keyboard.handle),
                (this.keyboard.enabled = !1));
            },
          },
          Keyboard$1 = {
            name: "keyboard",
            params: { keyboard: { enabled: !1 } },
            create: function create() {
              Utils.extend(this, {
                keyboard: {
                  enabled: !1,
                  enable: Keyboard.enable.bind(this),
                  disable: Keyboard.disable.bind(this),
                  handle: Keyboard.handle.bind(this),
                },
              });
            },
            on: {
              init: function init() {
                this.params.keyboard.enabled && this.keyboard.enable();
              },
              destroy: function destroy() {
                this.keyboard.enabled && this.keyboard.disable();
              },
            },
          },
          Mousewheel = {
            lastScrollTime: Utils.now(),
            event: (function getEvent() {
              return win.navigator.userAgent.indexOf("firefox") > -1
                ? "DOMMouseScroll"
                : (function isEventSupported() {
                    var isSupported = "onwheel" in doc;
                    if (!isSupported) {
                      var element = doc.createElement("div");
                      element.setAttribute("onwheel", "return;"),
                        (isSupported = "function" == typeof element.onwheel);
                    }
                    return (
                      !isSupported &&
                        doc.implementation &&
                        doc.implementation.hasFeature &&
                        !0 !== doc.implementation.hasFeature("", "") &&
                        (isSupported = doc.implementation.hasFeature(
                          "Events.wheel",
                          "3.0"
                        )),
                      isSupported
                    );
                  })()
                ? "wheel"
                : "mousewheel";
            })(),
            normalize: function normalize(e) {
              var sX = 0,
                sY = 0,
                pX = 0,
                pY = 0;
              return (
                "detail" in e && (sY = e.detail),
                "wheelDelta" in e && (sY = -e.wheelDelta / 120),
                "wheelDeltaY" in e && (sY = -e.wheelDeltaY / 120),
                "wheelDeltaX" in e && (sX = -e.wheelDeltaX / 120),
                "axis" in e &&
                  e.axis === e.HORIZONTAL_AXIS &&
                  ((sX = sY), (sY = 0)),
                (pX = 10 * sX),
                (pY = 10 * sY),
                "deltaY" in e && (pY = e.deltaY),
                "deltaX" in e && (pX = e.deltaX),
                (pX || pY) &&
                  e.deltaMode &&
                  (1 === e.deltaMode
                    ? ((pX *= 40), (pY *= 40))
                    : ((pX *= 800), (pY *= 800))),
                pX && !sX && (sX = pX < 1 ? -1 : 1),
                pY && !sY && (sY = pY < 1 ? -1 : 1),
                { spinX: sX, spinY: sY, pixelX: pX, pixelY: pY }
              );
            },
            handle: function handle(event) {
              var e = event,
                swiper = this,
                params = swiper.params.mousewheel;
              e.originalEvent && (e = e.originalEvent);
              var delta = 0,
                rtlFactor = swiper.rtl ? -1 : 1,
                data = Mousewheel.normalize(e);
              if (params.forceToAxis)
                if (swiper.isHorizontal()) {
                  if (!(Math.abs(data.pixelX) > Math.abs(data.pixelY)))
                    return !0;
                  delta = data.pixelX * rtlFactor;
                } else {
                  if (!(Math.abs(data.pixelY) > Math.abs(data.pixelX)))
                    return !0;
                  delta = data.pixelY;
                }
              else
                delta =
                  Math.abs(data.pixelX) > Math.abs(data.pixelY)
                    ? -data.pixelX * rtlFactor
                    : -data.pixelY;
              if (0 === delta) return !0;
              if ((params.invert && (delta = -delta), swiper.params.freeMode)) {
                var position =
                    swiper.getTranslate() + delta * params.sensitivity,
                  wasBeginning = swiper.isBeginning,
                  wasEnd = swiper.isEnd;
                if (
                  (position >= swiper.minTranslate() &&
                    (position = swiper.minTranslate()),
                  position <= swiper.maxTranslate() &&
                    (position = swiper.maxTranslate()),
                  swiper.setTransition(0),
                  swiper.setTranslate(position),
                  swiper.updateProgress(),
                  swiper.updateActiveIndex(),
                  swiper.updateSlidesClasses(),
                  ((!wasBeginning && swiper.isBeginning) ||
                    (!wasEnd && swiper.isEnd)) &&
                    swiper.updateSlidesClasses(),
                  swiper.params.freeModeSticky &&
                    (clearTimeout(swiper.mousewheel.timeout),
                    (swiper.mousewheel.timeout = Utils.nextTick(function () {
                      swiper.slideReset();
                    }, 300))),
                  swiper.emit("scroll", e),
                  swiper.params.autoplay &&
                    swiper.params.autoplayDisableOnInteraction &&
                    swiper.stopAutoplay(),
                  0 === position || position === swiper.maxTranslate())
                )
                  return !0;
              } else {
                if (Utils.now() - swiper.mousewheel.lastScrollTime > 60)
                  if (delta < 0)
                    if (
                      (swiper.isEnd && !swiper.params.loop) ||
                      swiper.animating
                    ) {
                      if (params.releaseOnEdges) return !0;
                    } else swiper.slideNext(), swiper.emit("scroll", e);
                  else if (
                    (swiper.isBeginning && !swiper.params.loop) ||
                    swiper.animating
                  ) {
                    if (params.releaseOnEdges) return !0;
                  } else swiper.slidePrev(), swiper.emit("scroll", e);
                swiper.mousewheel.lastScrollTime = new win.Date().getTime();
              }
              return (
                e.preventDefault ? e.preventDefault() : (e.returnValue = !1), !1
              );
            },
            enable: function enable() {
              if (!Mousewheel.event) return !1;
              if (this.mousewheel.enabled) return !1;
              var target = this.$el;
              return (
                "container" !== this.params.mousewheel.eventsTarged &&
                  (target = $$1(this.params.mousewheel.eventsTarged)),
                target.on(Mousewheel.event, this.mousewheel.handle),
                (this.mousewheel.enabled = !0),
                !0
              );
            },
            disable: function disable() {
              if (!Mousewheel.event) return !1;
              if (!this.mousewheel.enabled) return !1;
              var target = this.$el;
              return (
                "container" !== this.params.mousewheel.eventsTarged &&
                  (target = $$1(this.params.mousewheel.eventsTarged)),
                target.off(Mousewheel.event, this.mousewheel.handle),
                (this.mousewheel.enabled = !1),
                !0
              );
            },
          },
          Mousewheel$1 = {
            name: "mousewheel",
            params: {
              mousewheel: {
                enabled: !1,
                releaseOnEdges: !1,
                invert: !1,
                forceToAxis: !1,
                sensitivity: 1,
                eventsTarged: "container",
              },
            },
            create: function create() {
              Utils.extend(this, {
                mousewheel: {
                  enabled: !1,
                  enable: Mousewheel.enable.bind(this),
                  disable: Mousewheel.disable.bind(this),
                  handle: Mousewheel.handle.bind(this),
                  lastScrollTime: Utils.now(),
                },
              });
            },
            on: {
              init: function init() {
                this.params.mousewheel.enabled && this.mousewheel.enable();
              },
              destroy: function destroy() {
                this.mousewheel.enabled && this.mousewheel.disable();
              },
            },
          },
          Navigation = {
            update: function update() {
              var params = this.params.navigation;
              if (!this.params.loop) {
                var ref = this.navigation,
                  $nextEl = ref.$nextEl,
                  $prevEl = ref.$prevEl;
                $prevEl &&
                  $prevEl.length > 0 &&
                  (this.isBeginning
                    ? $prevEl.addClass(params.disabledClass)
                    : $prevEl.removeClass(params.disabledClass)),
                  $nextEl &&
                    $nextEl.length > 0 &&
                    (this.isEnd
                      ? $nextEl.addClass(params.disabledClass)
                      : $nextEl.removeClass(params.disabledClass));
              }
            },
            init: function init() {
              var $nextEl,
                $prevEl,
                swiper = this,
                params = swiper.params.navigation;
              (params.nextEl || params.prevEl) &&
                (params.nextEl &&
                  (($nextEl = $$1(params.nextEl)),
                  swiper.params.uniqueNavElements &&
                    "string" == typeof params.nextEl &&
                    $nextEl.length > 1 &&
                    1 === swiper.$el.find(params.nextEl).length &&
                    ($nextEl = swiper.$el.find(params.nextEl))),
                params.prevEl &&
                  (($prevEl = $$1(params.prevEl)),
                  swiper.params.uniqueNavElements &&
                    "string" == typeof params.prevEl &&
                    $prevEl.length > 1 &&
                    1 === swiper.$el.find(params.prevEl).length &&
                    ($prevEl = swiper.$el.find(params.prevEl))),
                $nextEl &&
                  $nextEl.length > 0 &&
                  $nextEl.on("click", function (e) {
                    e.preventDefault(),
                      (swiper.isEnd && !swiper.params.loop) ||
                        swiper.slideNext();
                  }),
                $prevEl &&
                  $prevEl.length > 0 &&
                  $prevEl.on("click", function (e) {
                    e.preventDefault(),
                      (swiper.isBeginning && !swiper.params.loop) ||
                        swiper.slidePrev();
                  }),
                Utils.extend(swiper.navigation, {
                  $nextEl: $nextEl,
                  nextEl: $nextEl && $nextEl[0],
                  $prevEl: $prevEl,
                  prevEl: $prevEl && $prevEl[0],
                }));
            },
            destroy: function destroy() {
              var ref = this.navigation,
                $nextEl = ref.$nextEl,
                $prevEl = ref.$prevEl;
              $nextEl &&
                $nextEl.length &&
                ($nextEl.off("click"),
                $nextEl.removeClass(this.params.navigation.disabledClass)),
                $prevEl &&
                  $prevEl.length &&
                  ($prevEl.off("click"),
                  $prevEl.removeClass(this.params.navigation.disabledClass));
            },
          },
          Navigation$1 = {
            name: "navigation",
            params: {
              navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
              },
            },
            create: function create() {
              Utils.extend(this, {
                navigation: {
                  init: Navigation.init.bind(this),
                  update: Navigation.update.bind(this),
                  destroy: Navigation.destroy.bind(this),
                },
              });
            },
            on: {
              init: function init() {
                this.navigation.init(), this.navigation.update();
              },
              toEdge: function toEdge() {
                this.navigation.update();
              },
              fromEdge: function fromEdge() {
                this.navigation.update();
              },
              destroy: function destroy() {
                this.navigation.destroy();
              },
              click: function click(e) {
                var ref = this.navigation,
                  $nextEl = ref.$nextEl,
                  $prevEl = ref.$prevEl;
                !this.params.navigation.hideOnClick ||
                  $$1(e.target).is($prevEl) ||
                  $$1(e.target).is($nextEl) ||
                  ($nextEl &&
                    $nextEl.toggleClass(this.params.navigation.hiddenClass),
                  $prevEl &&
                    $prevEl.toggleClass(this.params.navigation.hiddenClass));
              },
            },
          },
          Pagination = {
            update: function update() {
              var rtl = this.rtl,
                params = this.params.pagination;
              if (
                params.el &&
                this.pagination.el &&
                this.pagination.$el &&
                0 !== this.pagination.$el.length
              ) {
                var current,
                  slidesLength =
                    this.virtual && this.params.virtual.enabled
                      ? this.virtual.slides.length
                      : this.slides.length,
                  $el = this.pagination.$el,
                  total = this.params.loop
                    ? Math.ceil(
                        (slidesLength - 2 * this.loopedSlides) /
                          this.params.slidesPerGroup
                      )
                    : this.snapGrid.length;
                if (
                  (this.params.loop
                    ? ((current = Math.ceil(
                        (this.activeIndex - this.loopedSlides) /
                          this.params.slidesPerGroup
                      )) >
                        slidesLength - 1 - 2 * this.loopedSlides &&
                        (current -= slidesLength - 2 * this.loopedSlides),
                      current > total - 1 && (current -= total),
                      current < 0 &&
                        "bullets" !== this.params.paginationType &&
                        (current = total + current))
                    : (current =
                        void 0 !== this.snapIndex
                          ? this.snapIndex
                          : this.activeIndex || 0),
                  "bullets" === params.type &&
                    this.pagination.bullets &&
                    this.pagination.bullets.length > 0)
                ) {
                  var bullets = this.pagination.bullets;
                  if (
                    (params.dynamicBullets &&
                      ((this.pagination.bulletSize = bullets
                        .eq(0)
                        [this.isHorizontal() ? "outerWidth" : "outerHeight"](
                          !0
                        )),
                      $el.css(
                        this.isHorizontal() ? "width" : "height",
                        5 * this.pagination.bulletSize + "px"
                      )),
                    bullets.removeClass(
                      params.bulletActiveClass +
                        " " +
                        params.bulletActiveClass +
                        "-next " +
                        params.bulletActiveClass +
                        "-next-next " +
                        params.bulletActiveClass +
                        "-prev " +
                        params.bulletActiveClass +
                        "-prev-prev"
                    ),
                    $el.length > 1)
                  )
                    bullets.each(function (index, bullet) {
                      var $bullet = $$1(bullet);
                      $bullet.index() === current &&
                        ($bullet.addClass(params.bulletActiveClass),
                        params.dynamicBullets &&
                          ($bullet
                            .prev()
                            .addClass(params.bulletActiveClass + "-prev")
                            .prev()
                            .addClass(params.bulletActiveClass + "-prev-prev"),
                          $bullet
                            .next()
                            .addClass(params.bulletActiveClass + "-next")
                            .next()
                            .addClass(
                              params.bulletActiveClass + "-next-next"
                            )));
                    });
                  else {
                    var $bullet = bullets.eq(current);
                    $bullet.addClass(params.bulletActiveClass),
                      params.dynamicBullets &&
                        ($bullet
                          .prev()
                          .addClass(params.bulletActiveClass + "-prev")
                          .prev()
                          .addClass(params.bulletActiveClass + "-prev-prev"),
                        $bullet
                          .next()
                          .addClass(params.bulletActiveClass + "-next")
                          .next()
                          .addClass(params.bulletActiveClass + "-next-next"));
                  }
                  if (params.dynamicBullets) {
                    var dynamicBulletsLength = Math.min(bullets.length, 5),
                      bulletsOffset =
                        (this.pagination.bulletSize * dynamicBulletsLength -
                          this.pagination.bulletSize) /
                          2 -
                        current * this.pagination.bulletSize,
                      offsetProp = rtl ? "right" : "left";
                    bullets.css(
                      this.isHorizontal() ? offsetProp : "top",
                      bulletsOffset + "px"
                    );
                  }
                }
                if (
                  ("fraction" === params.type &&
                    ($el.find("." + params.currentClass).text(current + 1),
                    $el.find("." + params.totalClass).text(total)),
                  "progressbar" === params.type)
                ) {
                  var scale = (current + 1) / total,
                    scaleX = scale,
                    scaleY = 1;
                  this.isHorizontal() || ((scaleY = scale), (scaleX = 1)),
                    $el
                      .find("." + params.progressbarFillClass)
                      .transform(
                        "translate3d(0,0,0) scaleX(" +
                          scaleX +
                          ") scaleY(" +
                          scaleY +
                          ")"
                      )
                      .transition(this.params.speed);
                }
                "custom" === params.type && params.renderCustom
                  ? ($el.html(params.renderCustom(this, current + 1, total)),
                    this.emit("paginationRender", this, $el[0]))
                  : this.emit("paginationUpdate", this, $el[0]);
              }
            },
            render: function render() {
              var params = this.params.pagination;
              if (
                params.el &&
                this.pagination.el &&
                this.pagination.$el &&
                0 !== this.pagination.$el.length
              ) {
                var slidesLength =
                    this.virtual && this.params.virtual.enabled
                      ? this.virtual.slides.length
                      : this.slides.length,
                  $el = this.pagination.$el,
                  paginationHTML = "";
                if ("bullets" === params.type) {
                  for (
                    var numberOfBullets = this.params.loop
                        ? Math.ceil(
                            (slidesLength - 2 * this.loopedSlides) /
                              this.params.slidesPerGroup
                          )
                        : this.snapGrid.length,
                      i = 0;
                    i < numberOfBullets;
                    i += 1
                  )
                    params.renderBullet
                      ? (paginationHTML += params.renderBullet.call(
                          this,
                          i,
                          params.bulletClass
                        ))
                      : (paginationHTML +=
                          "<" +
                          params.bulletElement +
                          ' class="' +
                          params.bulletClass +
                          '"></' +
                          params.bulletElement +
                          ">");
                  $el.html(paginationHTML),
                    (this.pagination.bullets = $el.find(
                      "." + params.bulletClass
                    ));
                }
                "fraction" === params.type &&
                  ((paginationHTML = params.renderFraction
                    ? params.renderFraction.call(
                        this,
                        params.currentClass,
                        params.totalClass
                      )
                    : '<span class="' +
                      params.currentClass +
                      '"></span> / <span class="' +
                      params.totalClass +
                      '"></span>'),
                  $el.html(paginationHTML)),
                  "progressbar" === params.type &&
                    ((paginationHTML = params.renderProgressbar
                      ? params.renderProgressbar.call(
                          this,
                          params.progressbarFillClass
                        )
                      : '<span class="' +
                        params.progressbarFillClass +
                        '"></span>'),
                    $el.html(paginationHTML)),
                  "custom" !== params.type &&
                    this.emit("paginationRender", this.pagination.$el[0]);
              }
            },
            init: function init() {
              var swiper = this,
                params = swiper.params.pagination;
              if (params.el) {
                var $el = $$1(params.el);
                0 !== $el.length &&
                  (swiper.params.uniqueNavElements &&
                    "string" == typeof params.el &&
                    $el.length > 1 &&
                    1 === swiper.$el.find(params.el).length &&
                    ($el = swiper.$el.find(params.el)),
                  "bullets" === params.type &&
                    params.clickable &&
                    $el.addClass(params.clickableClass),
                  $el.addClass(params.modifierClass + params.type),
                  "bullets" === params.type &&
                    params.dynamicBullets &&
                    $el.addClass(
                      "" + params.modifierClass + params.type + "-dynamic"
                    ),
                  params.clickable &&
                    $el.on(
                      "click",
                      "." + params.bulletClass,
                      function onClick(e) {
                        e.preventDefault();
                        var index =
                          $$1(this).index() * swiper.params.slidesPerGroup;
                        swiper.params.loop && (index += swiper.loopedSlides),
                          swiper.slideTo(index);
                      }
                    ),
                  Utils.extend(swiper.pagination, { $el: $el, el: $el[0] }));
              }
            },
            destroy: function destroy() {
              var params = this.params.pagination;
              if (
                params.el &&
                this.pagination.el &&
                this.pagination.$el &&
                0 !== this.pagination.$el.length
              ) {
                var $el = this.pagination.$el;
                $el.removeClass(params.hiddenClass),
                  $el.removeClass(params.modifierClass + params.type),
                  this.pagination.bullets &&
                    this.pagination.bullets.removeClass(
                      params.bulletActiveClass
                    ),
                  params.clickable &&
                    $el.off("click", "." + params.bulletClass);
              }
            },
          },
          Pagination$1 = {
            name: "pagination",
            params: {
              pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                type: "bullets",
                dynamicBullets: !1,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
                modifierClass: "swiper-pagination-",
                currentClass: "swiper-pagination-current",
                totalClass: "swiper-pagination-total",
                hiddenClass: "swiper-pagination-hidden",
                progressbarFillClass: "swiper-pagination-progressbar-fill",
                clickableClass: "swiper-pagination-clickable",
              },
            },
            create: function create() {
              Utils.extend(this, {
                pagination: {
                  init: Pagination.init.bind(this),
                  render: Pagination.render.bind(this),
                  update: Pagination.update.bind(this),
                  destroy: Pagination.destroy.bind(this),
                },
              });
            },
            on: {
              init: function init() {
                this.pagination.init(),
                  this.pagination.render(),
                  this.pagination.update();
              },
              activeIndexChange: function activeIndexChange() {
                (this.params.loop || void 0 === this.snapIndex) &&
                  this.pagination.update();
              },
              snapIndexChange: function snapIndexChange() {
                this.params.loop || this.pagination.update();
              },
              slidesLengthChange: function slidesLengthChange() {
                this.params.loop &&
                  (this.pagination.render(), this.pagination.update());
              },
              snapGridLengthChange: function snapGridLengthChange() {
                this.params.loop ||
                  (this.pagination.render(), this.pagination.update());
              },
              destroy: function destroy() {
                this.pagination.destroy();
              },
              click: function click(e) {
                this.params.pagination.el &&
                  this.params.pagination.hideOnClick &&
                  this.pagination.$el.length > 0 &&
                  !$$1(e.target).hasClass(this.params.pagination.bulletClass) &&
                  this.pagination.$el.toggleClass(
                    this.params.pagination.hiddenClass
                  );
              },
            },
          },
          Scrollbar = {
            setTranslate: function setTranslate() {
              if (this.params.scrollbar.el && this.scrollbar.el) {
                var scrollbar = this.scrollbar,
                  rtl = this.rtl,
                  progress = this.progress,
                  dragSize = scrollbar.dragSize,
                  trackSize = scrollbar.trackSize,
                  $dragEl = scrollbar.$dragEl,
                  $el = scrollbar.$el,
                  params = this.params.scrollbar,
                  newSize = dragSize,
                  newPos = (trackSize - dragSize) * progress;
                rtl && this.isHorizontal()
                  ? (newPos = -newPos) > 0
                    ? ((newSize = dragSize - newPos), (newPos = 0))
                    : -newPos + dragSize > trackSize &&
                      (newSize = trackSize + newPos)
                  : newPos < 0
                  ? ((newSize = dragSize + newPos), (newPos = 0))
                  : newPos + dragSize > trackSize &&
                    (newSize = trackSize - newPos),
                  this.isHorizontal()
                    ? (Support.transforms3d
                        ? $dragEl.transform(
                            "translate3d(" + newPos + "px, 0, 0)"
                          )
                        : $dragEl.transform("translateX(" + newPos + "px)"),
                      ($dragEl[0].style.width = newSize + "px"))
                    : (Support.transforms3d
                        ? $dragEl.transform(
                            "translate3d(0px, " + newPos + "px, 0)"
                          )
                        : $dragEl.transform("translateY(" + newPos + "px)"),
                      ($dragEl[0].style.height = newSize + "px")),
                  params.hide &&
                    (clearTimeout(this.scrollbar.timeout),
                    ($el[0].style.opacity = 1),
                    (this.scrollbar.timeout = setTimeout(function () {
                      ($el[0].style.opacity = 0), $el.transition(400);
                    }, 1e3)));
              }
            },
            setTransition: function setTransition(duration) {
              this.params.scrollbar.el &&
                this.scrollbar.el &&
                this.scrollbar.$dragEl.transition(duration);
            },
            updateSize: function updateSize() {
              if (this.params.scrollbar.el && this.scrollbar.el) {
                var scrollbar = this.scrollbar,
                  $dragEl = scrollbar.$dragEl,
                  $el = scrollbar.$el;
                ($dragEl[0].style.width = ""), ($dragEl[0].style.height = "");
                var dragSize,
                  trackSize = this.isHorizontal()
                    ? $el[0].offsetWidth
                    : $el[0].offsetHeight,
                  divider = this.size / this.virtualSize,
                  moveDivider = divider * (trackSize / this.size);
                (dragSize =
                  "auto" === this.params.scrollbar.dragSize
                    ? trackSize * divider
                    : parseInt(this.params.scrollbar.dragSize, 10)),
                  this.isHorizontal()
                    ? ($dragEl[0].style.width = dragSize + "px")
                    : ($dragEl[0].style.height = dragSize + "px"),
                  ($el[0].style.display = divider >= 1 ? "none" : ""),
                  this.params.scrollbarHide && ($el[0].style.opacity = 0),
                  Utils.extend(scrollbar, {
                    trackSize: trackSize,
                    divider: divider,
                    moveDivider: moveDivider,
                    dragSize: dragSize,
                  });
              }
            },
            setDragPosition: function setDragPosition(e) {
              var positionRatio,
                scrollbar = this.scrollbar,
                $el = scrollbar.$el,
                dragSize = scrollbar.dragSize,
                trackSize = scrollbar.trackSize;
              (positionRatio =
                ((this.isHorizontal()
                  ? "touchstart" === e.type || "touchmove" === e.type
                    ? e.targetTouches[0].pageX
                    : e.pageX || e.clientX
                  : "touchstart" === e.type || "touchmove" === e.type
                  ? e.targetTouches[0].pageY
                  : e.pageY || e.clientY) -
                  $el.offset()[this.isHorizontal() ? "left" : "top"] -
                  dragSize / 2) /
                (trackSize - dragSize)),
                (positionRatio = Math.max(Math.min(positionRatio, 1), 0)),
                this.rtl && (positionRatio = 1 - positionRatio);
              var position =
                this.minTranslate() +
                (this.maxTranslate() - this.minTranslate()) * positionRatio;
              this.updateProgress(position),
                this.setTranslate(position),
                this.updateActiveIndex(),
                this.updateSlidesClasses();
            },
            onDragStart: function onDragStart(e) {
              var params = this.params.scrollbar,
                scrollbar = this.scrollbar,
                $wrapperEl = this.$wrapperEl,
                $el = scrollbar.$el,
                $dragEl = scrollbar.$dragEl;
              (this.scrollbar.isTouched = !0),
                e.preventDefault(),
                e.stopPropagation(),
                $wrapperEl.transition(100),
                $dragEl.transition(100),
                scrollbar.setDragPosition(e),
                clearTimeout(this.scrollbar.dragTimeout),
                $el.transition(0),
                params.hide && $el.css("opacity", 1),
                this.emit("scrollbarDragStart", e);
            },
            onDragMove: function onDragMove(e) {
              var scrollbar = this.scrollbar,
                $wrapperEl = this.$wrapperEl,
                $el = scrollbar.$el,
                $dragEl = scrollbar.$dragEl;
              this.scrollbar.isTouched &&
                (e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
                scrollbar.setDragPosition(e),
                $wrapperEl.transition(0),
                $el.transition(0),
                $dragEl.transition(0),
                this.emit("scrollbarDragMove", e));
            },
            onDragEnd: function onDragEnd(e) {
              var params = this.params.scrollbar,
                $el = this.scrollbar.$el;
              this.scrollbar.isTouched &&
                ((this.scrollbar.isTouched = !1),
                params.hide &&
                  (clearTimeout(this.scrollbar.dragTimeout),
                  (this.scrollbar.dragTimeout = Utils.nextTick(function () {
                    $el.css("opacity", 0), $el.transition(400);
                  }, 1e3))),
                this.emit("scrollbarDragEnd", e),
                params.snapOnRelease && this.slideReset());
            },
            enableDraggable: function enableDraggable() {
              if (this.params.scrollbar.el) {
                var $el = this.scrollbar.$el,
                  target = Support.touch ? $el[0] : document;
                $el.on(
                  this.scrollbar.dragEvents.start,
                  this.scrollbar.onDragStart
                ),
                  $$1(target).on(
                    this.scrollbar.dragEvents.move,
                    this.scrollbar.onDragMove
                  ),
                  $$1(target).on(
                    this.scrollbar.dragEvents.end,
                    this.scrollbar.onDragEnd
                  );
              }
            },
            disableDraggable: function disableDraggable() {
              if (this.params.scrollbar.el) {
                var $el = this.scrollbar.$el,
                  target = Support.touch ? $el[0] : document;
                $el.off(this.scrollbar.dragEvents.start),
                  $$1(target).off(this.scrollbar.dragEvents.move),
                  $$1(target).off(this.scrollbar.dragEvents.end);
              }
            },
            init: function init() {
              var swiper = this;
              if (swiper.params.scrollbar.el) {
                var scrollbar = swiper.scrollbar,
                  $swiperEl = swiper.$el,
                  touchEvents = swiper.touchEvents,
                  params = swiper.params.scrollbar,
                  $el = $$1(params.el);
                swiper.params.uniqueNavElements &&
                  "string" == typeof params.el &&
                  $el.length > 1 &&
                  1 === $swiperEl.find(params.el).length &&
                  ($el = $swiperEl.find(params.el));
                var $dragEl = $el.find(".swiper-scrollbar-drag");
                0 === $dragEl.length &&
                  (($dragEl = $$1('<div class="swiper-scrollbar-drag"></div>')),
                  $el.append($dragEl)),
                  (swiper.scrollbar.dragEvents = (function dragEvents() {
                    return !1 !== swiper.params.simulateTouch || Support.touch
                      ? touchEvents
                      : {
                          start: "mousedown",
                          move: "mousemove",
                          end: "mouseup",
                        };
                  })()),
                  Utils.extend(scrollbar, {
                    $el: $el,
                    el: $el[0],
                    $dragEl: $dragEl,
                    dragEl: $dragEl[0],
                  }),
                  params.draggable && scrollbar.enableDraggable();
              }
            },
            destroy: function destroy() {
              this.scrollbar.disableDraggable();
            },
          },
          Scrollbar$1 = {
            name: "scrollbar",
            params: {
              scrollbar: {
                el: null,
                dragSize: "auto",
                hide: !1,
                draggable: !1,
                snapOnRelease: !0,
              },
            },
            create: function create() {
              Utils.extend(this, {
                scrollbar: {
                  init: Scrollbar.init.bind(this),
                  destroy: Scrollbar.destroy.bind(this),
                  updateSize: Scrollbar.updateSize.bind(this),
                  setTranslate: Scrollbar.setTranslate.bind(this),
                  setTransition: Scrollbar.setTransition.bind(this),
                  enableDraggable: Scrollbar.enableDraggable.bind(this),
                  disableDraggable: Scrollbar.disableDraggable.bind(this),
                  setDragPosition: Scrollbar.setDragPosition.bind(this),
                  onDragStart: Scrollbar.onDragStart.bind(this),
                  onDragMove: Scrollbar.onDragMove.bind(this),
                  onDragEnd: Scrollbar.onDragEnd.bind(this),
                  isTouched: !1,
                  timeout: null,
                  dragTimeout: null,
                },
              });
            },
            on: {
              init: function init() {
                this.scrollbar.init(),
                  this.scrollbar.updateSize(),
                  this.scrollbar.setTranslate();
              },
              update: function update() {
                this.scrollbar.updateSize();
              },
              resize: function resize() {
                this.scrollbar.updateSize();
              },
              observerUpdate: function observerUpdate() {
                this.scrollbar.updateSize();
              },
              setTranslate: function setTranslate() {
                this.scrollbar.setTranslate();
              },
              setTransition: function setTransition(duration) {
                this.scrollbar.setTransition(duration);
              },
              destroy: function destroy() {
                this.scrollbar.destroy();
              },
            },
          },
          Parallax = {
            setTransform: function setTransform(el, progress) {
              var rtl = this.rtl,
                $el = $$1(el),
                rtlFactor = rtl ? -1 : 1,
                p = $el.attr("data-swiper-parallax") || "0",
                x = $el.attr("data-swiper-parallax-x"),
                y = $el.attr("data-swiper-parallax-y"),
                scale = $el.attr("data-swiper-parallax-scale"),
                opacity = $el.attr("data-swiper-parallax-opacity");
              if (
                (x || y
                  ? ((x = x || "0"), (y = y || "0"))
                  : this.isHorizontal()
                  ? ((x = p), (y = "0"))
                  : ((y = p), (x = "0")),
                (x =
                  x.indexOf("%") >= 0
                    ? parseInt(x, 10) * progress * rtlFactor + "%"
                    : x * progress * rtlFactor + "px"),
                (y =
                  y.indexOf("%") >= 0
                    ? parseInt(y, 10) * progress + "%"
                    : y * progress + "px"),
                null != opacity)
              ) {
                var currentOpacity =
                  opacity - (opacity - 1) * (1 - Math.abs(progress));
                $el[0].style.opacity = currentOpacity;
              }
              if (null == scale)
                $el.transform("translate3d(" + x + ", " + y + ", 0px)");
              else {
                var currentScale =
                  scale - (scale - 1) * (1 - Math.abs(progress));
                $el.transform(
                  "translate3d(" +
                    x +
                    ", " +
                    y +
                    ", 0px) scale(" +
                    currentScale +
                    ")"
                );
              }
            },
            setTranslate: function setTranslate() {
              var swiper = this,
                $el = swiper.$el,
                slides = swiper.slides,
                progress = swiper.progress,
                snapGrid = swiper.snapGrid;
              $el
                .children(
                  "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]"
                )
                .each(function (index, el) {
                  swiper.parallax.setTransform(el, progress);
                }),
                slides.each(function (slideIndex, slideEl) {
                  var slideProgress = slideEl.progress;
                  swiper.params.slidesPerGroup > 1 &&
                    "auto" !== swiper.params.slidesPerView &&
                    (slideProgress +=
                      Math.ceil(slideIndex / 2) -
                      progress * (snapGrid.length - 1)),
                    (slideProgress = Math.min(Math.max(slideProgress, -1), 1)),
                    $$1(slideEl)
                      .find(
                        "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]"
                      )
                      .each(function (index, el) {
                        swiper.parallax.setTransform(el, slideProgress);
                      });
                });
            },
            setTransition: function setTransition(duration) {
              void 0 === duration && (duration = this.params.speed),
                this.$el
                  .find(
                    "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]"
                  )
                  .each(function (index, parallaxEl) {
                    var $parallaxEl = $$1(parallaxEl),
                      parallaxDuration =
                        parseInt(
                          $parallaxEl.attr("data-swiper-parallax-duration"),
                          10
                        ) || duration;
                    0 === duration && (parallaxDuration = 0),
                      $parallaxEl.transition(parallaxDuration);
                  });
            },
          },
          Parallax$1 = {
            name: "parallax",
            params: { parallax: { enabled: !1 } },
            create: function create() {
              Utils.extend(this, {
                parallax: {
                  setTransform: Parallax.setTransform.bind(this),
                  setTranslate: Parallax.setTranslate.bind(this),
                  setTransition: Parallax.setTransition.bind(this),
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                this.params.watchSlidesProgress = !0;
              },
              init: function init() {
                this.params.parallax && this.parallax.setTranslate();
              },
              setTranslate: function setTranslate() {
                this.params.parallax && this.parallax.setTranslate();
              },
              setTransition: function setTransition(duration) {
                this.params.parallax && this.parallax.setTransition(duration);
              },
            },
          },
          Zoom = {
            getDistanceBetweenTouches: function getDistanceBetweenTouches(e) {
              if (e.targetTouches.length < 2) return 1;
              var x1 = e.targetTouches[0].pageX,
                y1 = e.targetTouches[0].pageY,
                x2 = e.targetTouches[1].pageX,
                y2 = e.targetTouches[1].pageY;
              return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            },
            onGestureStart: function onGestureStart(e) {
              var params = this.params.zoom,
                zoom = this.zoom,
                gesture = zoom.gesture;
              if (
                ((zoom.fakeGestureTouched = !1),
                (zoom.fakeGestureMoved = !1),
                !Support.gestures)
              ) {
                if (
                  "touchstart" !== e.type ||
                  ("touchstart" === e.type && e.targetTouches.length < 2)
                )
                  return;
                (zoom.fakeGestureTouched = !0),
                  (gesture.scaleStart = Zoom.getDistanceBetweenTouches(e));
              }
              (gesture.$slideEl && gesture.$slideEl.length) ||
              ((gesture.$slideEl = $$1(this)),
              0 === gesture.$slideEl.length &&
                (gesture.$slideEl = this.slides.eq(this.activeIndex)),
              (gesture.$imageEl = gesture.$slideEl.find("img, svg, canvas")),
              (gesture.$imageWrapEl = gesture.$imageEl.parent(
                "." + params.containerClass
              )),
              (gesture.maxRatio =
                gesture.$imageWrapEl.attr("data-swiper-zoom") ||
                params.maxRatio),
              0 !== gesture.$imageWrapEl.length)
                ? (gesture.$imageEl.transition(0), (this.zoom.isScaling = !0))
                : (gesture.$imageEl = void 0);
            },
            onGestureChange: function onGestureChange(e) {
              var params = this.params.zoom,
                zoom = this.zoom,
                gesture = zoom.gesture;
              if (!Support.gestures) {
                if (
                  "touchmove" !== e.type ||
                  ("touchmove" === e.type && e.targetTouches.length < 2)
                )
                  return;
                (zoom.fakeGestureMoved = !0),
                  (gesture.scaleMove = Zoom.getDistanceBetweenTouches(e));
              }
              gesture.$imageEl &&
                0 !== gesture.$imageEl.length &&
                (Support.gestures
                  ? (this.zoom.scale = e.scale * zoom.currentScale)
                  : (zoom.scale =
                      (gesture.scaleMove / gesture.scaleStart) *
                      zoom.currentScale),
                zoom.scale > gesture.maxRatio &&
                  (zoom.scale =
                    gesture.maxRatio -
                    1 +
                    Math.pow(zoom.scale - gesture.maxRatio + 1, 0.5)),
                zoom.scale < params.minRatio &&
                  (zoom.scale =
                    params.minRatio +
                    1 -
                    Math.pow(params.minRatio - zoom.scale + 1, 0.5)),
                gesture.$imageEl.transform(
                  "translate3d(0,0,0) scale(" + zoom.scale + ")"
                ));
            },
            onGestureEnd: function onGestureEnd(e) {
              var params = this.params.zoom,
                zoom = this.zoom,
                gesture = zoom.gesture;
              if (!Support.gestures) {
                if (!zoom.fakeGestureTouched || !zoom.fakeGestureMoved) return;
                if (
                  "touchend" !== e.type ||
                  ("touchend" === e.type &&
                    e.changedTouches.length < 2 &&
                    !Device.android)
                )
                  return;
                (zoom.fakeGestureTouched = !1), (zoom.fakeGestureMoved = !1);
              }
              gesture.$imageEl &&
                0 !== gesture.$imageEl.length &&
                ((zoom.scale = Math.max(
                  Math.min(zoom.scale, gesture.maxRatio),
                  params.minRatio
                )),
                gesture.$imageEl
                  .transition(this.params.speed)
                  .transform("translate3d(0,0,0) scale(" + zoom.scale + ")"),
                (zoom.currentScale = zoom.scale),
                (zoom.isScaling = !1),
                1 === zoom.scale && (gesture.$slideEl = void 0));
            },
            onTouchStart: function onTouchStart(e) {
              var zoom = this.zoom,
                gesture = zoom.gesture,
                image = zoom.image;
              gesture.$imageEl &&
                0 !== gesture.$imageEl.length &&
                (image.isTouched ||
                  (Device.android && e.preventDefault(),
                  (image.isTouched = !0),
                  (image.touchesStart.x =
                    "touchstart" === e.type
                      ? e.targetTouches[0].pageX
                      : e.pageX),
                  (image.touchesStart.y =
                    "touchstart" === e.type
                      ? e.targetTouches[0].pageY
                      : e.pageY)));
            },
            onTouchMove: function onTouchMove(e) {
              var zoom = this.zoom,
                gesture = zoom.gesture,
                image = zoom.image,
                velocity = zoom.velocity;
              if (
                gesture.$imageEl &&
                0 !== gesture.$imageEl.length &&
                ((this.allowClick = !1), image.isTouched && gesture.$slideEl)
              ) {
                image.isMoved ||
                  ((image.width = gesture.$imageEl[0].offsetWidth),
                  (image.height = gesture.$imageEl[0].offsetHeight),
                  (image.startX =
                    Utils.getTranslate(gesture.$imageWrapEl[0], "x") || 0),
                  (image.startY =
                    Utils.getTranslate(gesture.$imageWrapEl[0], "y") || 0),
                  (gesture.slideWidth = gesture.$slideEl[0].offsetWidth),
                  (gesture.slideHeight = gesture.$slideEl[0].offsetHeight),
                  gesture.$imageWrapEl.transition(0),
                  this.rtl && (image.startX = -image.startX),
                  this.rtl && (image.startY = -image.startY));
                var scaledWidth = image.width * zoom.scale,
                  scaledHeight = image.height * zoom.scale;
                if (
                  !(
                    scaledWidth < gesture.slideWidth &&
                    scaledHeight < gesture.slideHeight
                  )
                ) {
                  if (
                    ((image.minX = Math.min(
                      gesture.slideWidth / 2 - scaledWidth / 2,
                      0
                    )),
                    (image.maxX = -image.minX),
                    (image.minY = Math.min(
                      gesture.slideHeight / 2 - scaledHeight / 2,
                      0
                    )),
                    (image.maxY = -image.minY),
                    (image.touchesCurrent.x =
                      "touchmove" === e.type
                        ? e.targetTouches[0].pageX
                        : e.pageX),
                    (image.touchesCurrent.y =
                      "touchmove" === e.type
                        ? e.targetTouches[0].pageY
                        : e.pageY),
                    !image.isMoved && !zoom.isScaling)
                  ) {
                    if (
                      this.isHorizontal() &&
                      ((Math.floor(image.minX) === Math.floor(image.startX) &&
                        image.touchesCurrent.x < image.touchesStart.x) ||
                        (Math.floor(image.maxX) === Math.floor(image.startX) &&
                          image.touchesCurrent.x > image.touchesStart.x))
                    )
                      return void (image.isTouched = !1);
                    if (
                      !this.isHorizontal() &&
                      ((Math.floor(image.minY) === Math.floor(image.startY) &&
                        image.touchesCurrent.y < image.touchesStart.y) ||
                        (Math.floor(image.maxY) === Math.floor(image.startY) &&
                          image.touchesCurrent.y > image.touchesStart.y))
                    )
                      return void (image.isTouched = !1);
                  }
                  e.preventDefault(),
                    e.stopPropagation(),
                    (image.isMoved = !0),
                    (image.currentX =
                      image.touchesCurrent.x -
                      image.touchesStart.x +
                      image.startX),
                    (image.currentY =
                      image.touchesCurrent.y -
                      image.touchesStart.y +
                      image.startY),
                    image.currentX < image.minX &&
                      (image.currentX =
                        image.minX +
                        1 -
                        Math.pow(image.minX - image.currentX + 1, 0.8)),
                    image.currentX > image.maxX &&
                      (image.currentX =
                        image.maxX -
                        1 +
                        Math.pow(image.currentX - image.maxX + 1, 0.8)),
                    image.currentY < image.minY &&
                      (image.currentY =
                        image.minY +
                        1 -
                        Math.pow(image.minY - image.currentY + 1, 0.8)),
                    image.currentY > image.maxY &&
                      (image.currentY =
                        image.maxY -
                        1 +
                        Math.pow(image.currentY - image.maxY + 1, 0.8)),
                    velocity.prevPositionX ||
                      (velocity.prevPositionX = image.touchesCurrent.x),
                    velocity.prevPositionY ||
                      (velocity.prevPositionY = image.touchesCurrent.y),
                    velocity.prevTime || (velocity.prevTime = Date.now()),
                    (velocity.x =
                      (image.touchesCurrent.x - velocity.prevPositionX) /
                      (Date.now() - velocity.prevTime) /
                      2),
                    (velocity.y =
                      (image.touchesCurrent.y - velocity.prevPositionY) /
                      (Date.now() - velocity.prevTime) /
                      2),
                    Math.abs(image.touchesCurrent.x - velocity.prevPositionX) <
                      2 && (velocity.x = 0),
                    Math.abs(image.touchesCurrent.y - velocity.prevPositionY) <
                      2 && (velocity.y = 0),
                    (velocity.prevPositionX = image.touchesCurrent.x),
                    (velocity.prevPositionY = image.touchesCurrent.y),
                    (velocity.prevTime = Date.now()),
                    gesture.$imageWrapEl.transform(
                      "translate3d(" +
                        image.currentX +
                        "px, " +
                        image.currentY +
                        "px,0)"
                    );
                }
              }
            },
            onTouchEnd: function onTouchEnd() {
              var zoom = this.zoom,
                gesture = zoom.gesture,
                image = zoom.image,
                velocity = zoom.velocity;
              if (gesture.$imageEl && 0 !== gesture.$imageEl.length) {
                if (!image.isTouched || !image.isMoved)
                  return (image.isTouched = !1), void (image.isMoved = !1);
                (image.isTouched = !1), (image.isMoved = !1);
                var momentumDurationX = 300,
                  momentumDurationY = 300,
                  momentumDistanceX = velocity.x * momentumDurationX,
                  newPositionX = image.currentX + momentumDistanceX,
                  momentumDistanceY = velocity.y * momentumDurationY,
                  newPositionY = image.currentY + momentumDistanceY;
                0 !== velocity.x &&
                  (momentumDurationX = Math.abs(
                    (newPositionX - image.currentX) / velocity.x
                  )),
                  0 !== velocity.y &&
                    (momentumDurationY = Math.abs(
                      (newPositionY - image.currentY) / velocity.y
                    ));
                var momentumDuration = Math.max(
                  momentumDurationX,
                  momentumDurationY
                );
                (image.currentX = newPositionX),
                  (image.currentY = newPositionY);
                var scaledWidth = image.width * zoom.scale,
                  scaledHeight = image.height * zoom.scale;
                (image.minX = Math.min(
                  gesture.slideWidth / 2 - scaledWidth / 2,
                  0
                )),
                  (image.maxX = -image.minX),
                  (image.minY = Math.min(
                    gesture.slideHeight / 2 - scaledHeight / 2,
                    0
                  )),
                  (image.maxY = -image.minY),
                  (image.currentX = Math.max(
                    Math.min(image.currentX, image.maxX),
                    image.minX
                  )),
                  (image.currentY = Math.max(
                    Math.min(image.currentY, image.maxY),
                    image.minY
                  )),
                  gesture.$imageWrapEl
                    .transition(momentumDuration)
                    .transform(
                      "translate3d(" +
                        image.currentX +
                        "px, " +
                        image.currentY +
                        "px,0)"
                    );
              }
            },
            onTransitionEnd: function onTransitionEnd() {
              var zoom = this.zoom,
                gesture = zoom.gesture;
              gesture.$slideEl &&
                this.previousIndex !== this.activeIndex &&
                (gesture.$imageEl.transform("translate3d(0,0,0) scale(1)"),
                gesture.$imageWrapEl.transform("translate3d(0,0,0)"),
                (gesture.$slideEl = void 0),
                (gesture.$imageEl = void 0),
                (gesture.$imageWrapEl = void 0),
                (zoom.scale = 1),
                (zoom.currentScale = 1));
            },
            toggle: function toggle(e) {
              var zoom = this.zoom;
              zoom.scale && 1 !== zoom.scale ? zoom.out() : zoom.in(e);
            },
            in: function in$1(e) {
              var touchX,
                touchY,
                diffX,
                diffY,
                translateX,
                translateY,
                imageWidth,
                imageHeight,
                scaledWidth,
                scaledHeight,
                translateMinX,
                translateMinY,
                translateMaxX,
                translateMaxY,
                slideWidth,
                slideHeight,
                zoom = this.zoom,
                params = this.params.zoom,
                gesture = zoom.gesture,
                image = zoom.image;
              gesture.$slideEl ||
                ((gesture.$slideEl = this.clickedSlide
                  ? $$1(this.clickedSlide)
                  : this.slides.eq(this.activeIndex)),
                (gesture.$imageEl = gesture.$slideEl.find("img, svg, canvas")),
                (gesture.$imageWrapEl = gesture.$imageEl.parent(
                  "." + params.containerClass
                ))),
                gesture.$imageEl &&
                  0 !== gesture.$imageEl.length &&
                  (gesture.$slideEl.addClass("" + params.zoomedSlideClass),
                  void 0 === image.touchesStart.x && e
                    ? ((touchX =
                        "touchend" === e.type
                          ? e.changedTouches[0].pageX
                          : e.pageX),
                      (touchY =
                        "touchend" === e.type
                          ? e.changedTouches[0].pageY
                          : e.pageY))
                    : ((touchX = image.touchesStart.x),
                      (touchY = image.touchesStart.y)),
                  (zoom.scale =
                    gesture.$imageWrapEl.attr("data-swiper-zoom") ||
                    params.maxRatio),
                  (zoom.currentScale =
                    gesture.$imageWrapEl.attr("data-swiper-zoom") ||
                    params.maxRatio),
                  e
                    ? ((slideWidth = gesture.$slideEl[0].offsetWidth),
                      (slideHeight = gesture.$slideEl[0].offsetHeight),
                      (diffX =
                        gesture.$slideEl.offset().left +
                        slideWidth / 2 -
                        touchX),
                      (diffY =
                        gesture.$slideEl.offset().top +
                        slideHeight / 2 -
                        touchY),
                      (imageWidth = gesture.$imageEl[0].offsetWidth),
                      (imageHeight = gesture.$imageEl[0].offsetHeight),
                      (scaledWidth = imageWidth * zoom.scale),
                      (scaledHeight = imageHeight * zoom.scale),
                      (translateMaxX = -(translateMinX = Math.min(
                        slideWidth / 2 - scaledWidth / 2,
                        0
                      ))),
                      (translateMaxY = -(translateMinY = Math.min(
                        slideHeight / 2 - scaledHeight / 2,
                        0
                      ))),
                      (translateX = diffX * zoom.scale) < translateMinX &&
                        (translateX = translateMinX),
                      translateX > translateMaxX &&
                        (translateX = translateMaxX),
                      (translateY = diffY * zoom.scale) < translateMinY &&
                        (translateY = translateMinY),
                      translateY > translateMaxY &&
                        (translateY = translateMaxY))
                    : ((translateX = 0), (translateY = 0)),
                  gesture.$imageWrapEl
                    .transition(300)
                    .transform(
                      "translate3d(" +
                        translateX +
                        "px, " +
                        translateY +
                        "px,0)"
                    ),
                  gesture.$imageEl
                    .transition(300)
                    .transform("translate3d(0,0,0) scale(" + zoom.scale + ")"));
            },
            out: function out() {
              var zoom = this.zoom,
                params = this.params.zoom,
                gesture = zoom.gesture;
              gesture.$slideEl ||
                ((gesture.$slideEl = this.clickedSlide
                  ? $$1(this.clickedSlide)
                  : this.slides.eq(this.activeIndex)),
                (gesture.$imageEl = gesture.$slideEl.find("img, svg, canvas")),
                (gesture.$imageWrapEl = gesture.$imageEl.parent(
                  "." + params.containerClass
                ))),
                gesture.$imageEl &&
                  0 !== gesture.$imageEl.length &&
                  ((zoom.scale = 1),
                  (zoom.currentScale = 1),
                  gesture.$imageWrapEl
                    .transition(300)
                    .transform("translate3d(0,0,0)"),
                  gesture.$imageEl
                    .transition(300)
                    .transform("translate3d(0,0,0) scale(1)"),
                  gesture.$slideEl.removeClass("" + params.zoomedSlideClass),
                  (gesture.$slideEl = void 0));
            },
            enable: function enable() {
              var swiper = this,
                zoom = swiper.zoom;
              if (!zoom.enabled) {
                zoom.enabled = !0;
                var slides = swiper.slides,
                  passiveListener = !(
                    "touchstart" !== swiper.touchEvents.start ||
                    !Support.passiveListener ||
                    !swiper.params.passiveListeners
                  ) && { passive: !0, capture: !1 };
                Support.gestures
                  ? (slides.on(
                      "gesturestart",
                      zoom.onGestureStart,
                      passiveListener
                    ),
                    slides.on(
                      "gesturechange",
                      zoom.onGestureChange,
                      passiveListener
                    ),
                    slides.on("gestureend", zoom.onGestureEnd, passiveListener))
                  : "touchstart" === swiper.touchEvents.start &&
                    (slides.on(
                      swiper.touchEvents.start,
                      zoom.onGestureStart,
                      passiveListener
                    ),
                    slides.on(
                      swiper.touchEvents.move,
                      zoom.onGestureChange,
                      passiveListener
                    ),
                    slides.on(
                      swiper.touchEvents.end,
                      zoom.onGestureEnd,
                      passiveListener
                    )),
                  swiper.slides.each(function (index, slideEl) {
                    var $slideEl = $$1(slideEl);
                    $slideEl.find("." + swiper.params.zoom.containerClass)
                      .length > 0 &&
                      $slideEl.on(swiper.touchEvents.move, zoom.onTouchMove);
                  });
              }
            },
            disable: function disable() {
              var swiper = this,
                zoom = swiper.zoom;
              if (zoom.enabled) {
                swiper.zoom.enabled = !1;
                var slides = swiper.slides,
                  passiveListener = !(
                    "touchstart" !== swiper.touchEvents.start ||
                    !Support.passiveListener ||
                    !swiper.params.passiveListeners
                  ) && { passive: !0, capture: !1 };
                Support.gestures
                  ? (slides.off(
                      "gesturestart",
                      zoom.onGestureStart,
                      passiveListener
                    ),
                    slides.off(
                      "gesturechange",
                      zoom.onGestureChange,
                      passiveListener
                    ),
                    slides.off(
                      "gestureend",
                      zoom.onGestureEnd,
                      passiveListener
                    ))
                  : "touchstart" === swiper.touchEvents.start &&
                    (slides.off(
                      swiper.touchEvents.start,
                      zoom.onGestureStart,
                      passiveListener
                    ),
                    slides.off(
                      swiper.touchEvents.move,
                      zoom.onGestureChange,
                      passiveListener
                    ),
                    slides.off(
                      swiper.touchEvents.end,
                      zoom.onGestureEnd,
                      passiveListener
                    )),
                  swiper.slides.each(function (index, slideEl) {
                    var $slideEl = $$1(slideEl);
                    $slideEl.find("." + swiper.params.zoom.containerClass)
                      .length > 0 &&
                      $slideEl.off(swiper.touchEvents.move, zoom.onTouchMove);
                  });
              }
            },
          },
          Zoom$1 = {
            name: "zoom",
            params: {
              zoom: {
                enabled: !1,
                maxRatio: 3,
                minRatio: 1,
                toggle: !0,
                containerClass: "swiper-zoom-container",
                zoomedSlideClass: "swiper-slide-zoomed",
              },
            },
            create: function create() {
              var swiper = this,
                zoom = {
                  enabled: !1,
                  scale: 1,
                  currentScale: 1,
                  isScaling: !1,
                  gesture: {
                    $slideEl: void 0,
                    slideWidth: void 0,
                    slideHeight: void 0,
                    $imageEl: void 0,
                    $imageWrapEl: void 0,
                    maxRatio: 3,
                  },
                  image: {
                    isTouched: void 0,
                    isMoved: void 0,
                    currentX: void 0,
                    currentY: void 0,
                    minX: void 0,
                    minY: void 0,
                    maxX: void 0,
                    maxY: void 0,
                    width: void 0,
                    height: void 0,
                    startX: void 0,
                    startY: void 0,
                    touchesStart: {},
                    touchesCurrent: {},
                  },
                  velocity: {
                    x: void 0,
                    y: void 0,
                    prevPositionX: void 0,
                    prevPositionY: void 0,
                    prevTime: void 0,
                  },
                };
              "onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out"
                .split(" ")
                .forEach(function (methodName) {
                  zoom[methodName] = Zoom[methodName].bind(swiper);
                }),
                Utils.extend(swiper, { zoom: zoom });
            },
            on: {
              init: function init() {
                this.params.zoom.enabled && this.zoom.enable();
              },
              destroy: function destroy() {
                this.zoom.disable();
              },
              touchStart: function touchStart(e) {
                this.zoom.enabled && this.zoom.onTouchStart(e);
              },
              touchEnd: function touchEnd(e) {
                this.zoom.enabled && this.zoom.onTouchEnd(e);
              },
              doubleTap: function doubleTap(e) {
                this.params.zoom.enabled &&
                  this.zoom.enabled &&
                  this.params.zoom.toggle &&
                  this.zoom.toggle(e);
              },
              transitionEnd: function transitionEnd() {
                this.zoom.enabled &&
                  this.params.zoom.enabled &&
                  this.zoom.onTransitionEnd();
              },
            },
          },
          Lazy = {
            loadInSlide: function loadInSlide(index, loadInDuplicate) {
              void 0 === loadInDuplicate && (loadInDuplicate = !0);
              var swiper = this,
                params = swiper.params.lazy;
              if (void 0 !== index && 0 !== swiper.slides.length) {
                var $slideEl =
                    swiper.virtual && swiper.params.virtual.enabled
                      ? swiper.$wrapperEl.children(
                          "." +
                            swiper.params.slideClass +
                            '[data-swiper-slide-index="' +
                            index +
                            '"]'
                        )
                      : swiper.slides.eq(index),
                  $images = $slideEl.find(
                    "." +
                      params.elementClass +
                      ":not(." +
                      params.loadedClass +
                      "):not(." +
                      params.loadingClass +
                      ")"
                  );
                !$slideEl.hasClass(params.elementClass) ||
                  $slideEl.hasClass(params.loadedClass) ||
                  $slideEl.hasClass(params.loadingClass) ||
                  ($images = $images.add($slideEl[0])),
                  0 !== $images.length &&
                    $images.each(function (imageIndex, imageEl) {
                      var $imageEl = $$1(imageEl);
                      $imageEl.addClass(params.loadingClass);
                      var background = $imageEl.attr("data-background"),
                        src = $imageEl.attr("data-src"),
                        srcset = $imageEl.attr("data-srcset"),
                        sizes = $imageEl.attr("data-sizes");
                      swiper.loadImage(
                        $imageEl[0],
                        src || background,
                        srcset,
                        sizes,
                        !1,
                        function () {
                          if (
                            null != swiper &&
                            swiper &&
                            (!swiper || swiper.params) &&
                            !swiper.destroyed
                          ) {
                            if (
                              (background
                                ? ($imageEl.css(
                                    "background-image",
                                    'url("' + background + '")'
                                  ),
                                  $imageEl.removeAttr("data-background"))
                                : (srcset &&
                                    ($imageEl.attr("srcset", srcset),
                                    $imageEl.removeAttr("data-srcset")),
                                  sizes &&
                                    ($imageEl.attr("sizes", sizes),
                                    $imageEl.removeAttr("data-sizes")),
                                  src &&
                                    ($imageEl.attr("src", src),
                                    $imageEl.removeAttr("data-src"))),
                              $imageEl
                                .addClass(params.loadedClass)
                                .removeClass(params.loadingClass),
                              $slideEl
                                .find("." + params.preloaderClass)
                                .remove(),
                              swiper.params.loop && loadInDuplicate)
                            ) {
                              var slideOriginalIndex = $slideEl.attr(
                                "data-swiper-slide-index"
                              );
                              if (
                                $slideEl.hasClass(
                                  swiper.params.slideDuplicateClass
                                )
                              ) {
                                var originalSlide = swiper.$wrapperEl.children(
                                  '[data-swiper-slide-index="' +
                                    slideOriginalIndex +
                                    '"]:not(.' +
                                    swiper.params.slideDuplicateClass +
                                    ")"
                                );
                                swiper.lazy.loadInSlide(
                                  originalSlide.index(),
                                  !1
                                );
                              } else {
                                var duplicatedSlide =
                                  swiper.$wrapperEl.children(
                                    "." +
                                      swiper.params.slideDuplicateClass +
                                      '[data-swiper-slide-index="' +
                                      slideOriginalIndex +
                                      '"]'
                                  );
                                swiper.lazy.loadInSlide(
                                  duplicatedSlide.index(),
                                  !1
                                );
                              }
                            }
                            swiper.emit(
                              "lazyImageReady",
                              $slideEl[0],
                              $imageEl[0]
                            );
                          }
                        }
                      ),
                        swiper.emit("lazyImageLoad", $slideEl[0], $imageEl[0]);
                    });
              }
            },
            load: function load() {
              var swiper = this,
                $wrapperEl = swiper.$wrapperEl,
                swiperParams = swiper.params,
                slides = swiper.slides,
                activeIndex = swiper.activeIndex,
                isVirtual = swiper.virtual && swiperParams.virtual.enabled,
                params = swiperParams.lazy,
                slidesPerView = swiperParams.slidesPerView;
              function slideExist(index) {
                if (isVirtual) {
                  if (
                    $wrapperEl.children(
                      "." +
                        swiperParams.slideClass +
                        '[data-swiper-slide-index="' +
                        index +
                        '"]'
                    ).length
                  )
                    return !0;
                } else if (slides[index]) return !0;
                return !1;
              }
              function slideIndex(slideEl) {
                return isVirtual
                  ? $$1(slideEl).attr("data-swiper-slide-index")
                  : $$1(slideEl).index();
              }
              if (
                ("auto" === slidesPerView && (slidesPerView = 0),
                swiper.lazy.initialImageLoaded ||
                  (swiper.lazy.initialImageLoaded = !0),
                swiper.params.watchSlidesVisibility)
              )
                $wrapperEl
                  .children("." + swiperParams.slideVisibleClass)
                  .each(function (elIndex, slideEl) {
                    var index = isVirtual
                      ? $$1(slideEl).attr("data-swiper-slide-index")
                      : $$1(slideEl).index();
                    swiper.lazy.loadInSlide(index);
                  });
              else if (slidesPerView > 1)
                for (
                  var i = activeIndex;
                  i < activeIndex + slidesPerView;
                  i += 1
                )
                  slideExist(i) && swiper.lazy.loadInSlide(i);
              else swiper.lazy.loadInSlide(activeIndex);
              if (params.loadPrevNext)
                if (
                  slidesPerView > 1 ||
                  (params.loadPrevNextAmount && params.loadPrevNextAmount > 1)
                ) {
                  for (
                    var amount = params.loadPrevNextAmount,
                      spv = slidesPerView,
                      maxIndex = Math.min(
                        activeIndex + spv + Math.max(amount, spv),
                        slides.length
                      ),
                      minIndex = Math.max(
                        activeIndex - Math.max(spv, amount),
                        0
                      ),
                      i$1 = activeIndex + slidesPerView;
                    i$1 < maxIndex;
                    i$1 += 1
                  )
                    slideExist(i$1) && swiper.lazy.loadInSlide(i$1);
                  for (var i$2 = minIndex; i$2 < activeIndex; i$2 += 1)
                    slideExist(i$2) && swiper.lazy.loadInSlide(i$2);
                } else {
                  var nextSlide = $wrapperEl.children(
                    "." + swiperParams.slideNextClass
                  );
                  nextSlide.length > 0 &&
                    swiper.lazy.loadInSlide(slideIndex(nextSlide));
                  var prevSlide = $wrapperEl.children(
                    "." + swiperParams.slidePrevClass
                  );
                  prevSlide.length > 0 &&
                    swiper.lazy.loadInSlide(slideIndex(prevSlide));
                }
            },
          },
          Lazy$1 = {
            name: "lazy",
            params: {
              lazy: {
                enabled: !1,
                loadPrevNext: !1,
                loadPrevNextAmount: 1,
                loadOnTransitionStart: !1,
                elementClass: "swiper-lazy",
                loadingClass: "swiper-lazy-loading",
                loadedClass: "swiper-lazy-loaded",
                preloaderClass: "swiper-lazy-preloader",
              },
            },
            create: function create() {
              Utils.extend(this, {
                lazy: {
                  initialImageLoaded: !1,
                  load: Lazy.load.bind(this),
                  loadInSlide: Lazy.loadInSlide.bind(this),
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                this.params.lazy.enabled &&
                  this.params.preloadImages &&
                  (this.params.preloadImages = !1);
              },
              init: function init() {
                this.params.lazy.enabled &&
                  !this.params.loop &&
                  0 === this.params.initialSlide &&
                  this.lazy.load();
              },
              scroll: function scroll() {
                this.params.freeMode &&
                  !this.params.freeModeSticky &&
                  this.lazy.load();
              },
              resize: function resize() {
                this.params.lazy.enabled && this.lazy.load();
              },
              scrollbarDragMove: function scrollbarDragMove() {
                this.params.lazy.enabled && this.lazy.load();
              },
              transitionStart: function transitionStart() {
                this.params.lazy.enabled &&
                  (this.params.lazy.loadOnTransitionStart ||
                    (!this.params.lazy.loadOnTransitionStart &&
                      !this.lazy.initialImageLoaded)) &&
                  this.lazy.load();
              },
              transitionEnd: function transitionEnd() {
                this.params.lazy.enabled &&
                  !this.params.lazy.loadOnTransitionStart &&
                  this.lazy.load();
              },
            },
          },
          Controller = {
            LinearSpline: function LinearSpline(x, y) {
              var i1,
                i3,
                binarySearch = (function search() {
                  var maxIndex, minIndex, guess;
                  return function (array, val) {
                    for (
                      minIndex = -1, maxIndex = array.length;
                      maxIndex - minIndex > 1;)
                      array[(guess = (maxIndex + minIndex) >> 1)] <= val
                        ? (minIndex = guess)
                        : (maxIndex = guess);
                    return maxIndex;
                  };
                })();
              return (
                (this.x = x),
                (this.y = y),
                (this.lastIndex = x.length - 1),
                (this.interpolate = function interpolate(x2) {
                  return x2
                    ? ((i3 = binarySearch(this.x, x2)),
                      (i1 = i3 - 1),
                      ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) /
                        (this.x[i3] - this.x[i1]) +
                        this.y[i1])
                    : 0;
                }),
                this
              );
            },
            getInterpolateFunction: function getInterpolateFunction(c) {
              this.controller.spline ||
                (this.controller.spline = this.params.loop
                  ? new Controller.LinearSpline(this.slidesGrid, c.slidesGrid)
                  : new Controller.LinearSpline(this.snapGrid, c.snapGrid));
            },
            setTranslate: function setTranslate(setTranslate$1, byController) {
              var multiplier,
                controlledTranslate,
                swiper = this,
                controlled = swiper.controller.control;
              function setControlledTranslate(c) {
                var translate =
                  c.rtl && "horizontal" === c.params.direction
                    ? -swiper.translate
                    : swiper.translate;
                "slide" === swiper.params.controller.by &&
                  (swiper.controller.getInterpolateFunction(c),
                  (controlledTranslate = -swiper.controller.spline.interpolate(
                    -translate
                  ))),
                  (controlledTranslate &&
                    "container" !== swiper.params.controller.by) ||
                    ((multiplier =
                      (c.maxTranslate() - c.minTranslate()) /
                      (swiper.maxTranslate() - swiper.minTranslate())),
                    (controlledTranslate =
                      (translate - swiper.minTranslate()) * multiplier +
                      c.minTranslate())),
                  swiper.params.controller.inverse &&
                    (controlledTranslate =
                      c.maxTranslate() - controlledTranslate),
                  c.updateProgress(controlledTranslate),
                  c.setTranslate(controlledTranslate, swiper),
                  c.updateActiveIndex(),
                  c.updateSlidesClasses();
              }
              if (Array.isArray(controlled))
                for (var i = 0; i < controlled.length; i += 1)
                  controlled[i] !== byController &&
                    controlled[i] instanceof Swiper$1 &&
                    setControlledTranslate(controlled[i]);
              else
                controlled instanceof Swiper$1 &&
                  byController !== controlled &&
                  setControlledTranslate(controlled);
            },
            setTransition: function setTransition(duration, byController) {
              var i,
                swiper = this,
                controlled = swiper.controller.control;
              function setControlledTransition(c) {
                c.setTransition(duration, swiper),
                  0 !== duration &&
                    (c.transitionStart(),
                    c.$wrapperEl.transitionEnd(function () {
                      controlled &&
                        (c.params.loop &&
                          "slide" === swiper.params.controller.by &&
                          c.loopFix(),
                        c.transitionEnd());
                    }));
              }
              if (Array.isArray(controlled))
                for (i = 0; i < controlled.length; i += 1)
                  controlled[i] !== byController &&
                    controlled[i] instanceof Swiper$1 &&
                    setControlledTransition(controlled[i]);
              else
                controlled instanceof Swiper$1 &&
                  byController !== controlled &&
                  setControlledTransition(controlled);
            },
          },
          Controller$1 = {
            name: "controller",
            params: {
              controller: { control: void 0, inverse: !1, by: "slide" },
            },
            create: function create() {
              Utils.extend(this, {
                controller: {
                  control: this.params.controller.control,
                  getInterpolateFunction:
                    Controller.getInterpolateFunction.bind(this),
                  setTranslate: Controller.setTranslate.bind(this),
                  setTransition: Controller.setTransition.bind(this),
                },
              });
            },
            on: {
              update: function update() {
                this.controller.control &&
                  this.controller.spline &&
                  ((this.controller.spline = void 0),
                  delete this.controller.spline);
              },
              resize: function resize() {
                this.controller.control &&
                  this.controller.spline &&
                  ((this.controller.spline = void 0),
                  delete this.controller.spline);
              },
              observerUpdate: function observerUpdate() {
                this.controller.control &&
                  this.controller.spline &&
                  ((this.controller.spline = void 0),
                  delete this.controller.spline);
              },
              setTranslate: function setTranslate(translate, byController) {
                this.controller.control &&
                  this.controller.setTranslate(translate, byController);
              },
              setTransition: function setTransition(duration, byController) {
                this.controller.control &&
                  this.controller.setTransition(duration, byController);
              },
            },
          },
          a11y = {
            makeElFocusable: function makeElFocusable($el) {
              return $el.attr("tabIndex", "0"), $el;
            },
            addElRole: function addElRole($el, role) {
              return $el.attr("role", role), $el;
            },
            addElLabel: function addElLabel($el, label) {
              return $el.attr("aria-label", label), $el;
            },
            disableEl: function disableEl($el) {
              return $el.attr("aria-disabled", !0), $el;
            },
            enableEl: function enableEl($el) {
              return $el.attr("aria-disabled", !1), $el;
            },
            onEnterKey: function onEnterKey(e) {
              var params = this.params.a11y;
              if (13 === e.keyCode) {
                var $targetEl = $$1(e.target);
                this.navigation &&
                  this.navigation.$nextEl &&
                  $targetEl.is(this.navigation.$nextEl) &&
                  ((this.isEnd && !this.params.loop) || this.slideNext(),
                  this.isEnd
                    ? this.a11y.notify(params.lastSlideMessage)
                    : this.a11y.notify(params.nextSlideMessage)),
                  this.navigation &&
                    this.navigation.$prevEl &&
                    $targetEl.is(this.navigation.$prevEl) &&
                    ((this.isBeginning && !this.params.loop) ||
                      this.slidePrev(),
                    this.isBeginning
                      ? this.a11y.notify(params.firstSlideMessage)
                      : this.a11y.notify(params.prevSlideMessage)),
                  this.pagination &&
                    $targetEl.is("." + this.params.pagination.bulletClass) &&
                    $targetEl[0].click();
              }
            },
            notify: function notify(message) {
              var notification = this.a11y.liveRegion;
              0 !== notification.length &&
                (notification.html(""), notification.html(message));
            },
            updateNavigation: function updateNavigation() {
              if (!this.params.loop) {
                var ref = this.navigation,
                  $nextEl = ref.$nextEl,
                  $prevEl = ref.$prevEl;
                $prevEl &&
                  $prevEl.length > 0 &&
                  (this.isBeginning
                    ? this.a11y.disableEl($prevEl)
                    : this.a11y.enableEl($prevEl)),
                  $nextEl &&
                    $nextEl.length > 0 &&
                    (this.isEnd
                      ? this.a11y.disableEl($nextEl)
                      : this.a11y.enableEl($nextEl));
              }
            },
            updatePagination: function updatePagination() {
              var swiper = this,
                params = swiper.params.a11y;
              swiper.pagination &&
                swiper.params.pagination.clickable &&
                swiper.pagination.bullets &&
                swiper.pagination.bullets.length &&
                swiper.pagination.bullets.each(function (
                  bulletIndex,
                  bulletEl
                ) {
                  var $bulletEl = $$1(bulletEl);
                  swiper.a11y.makeElFocusable($bulletEl),
                    swiper.a11y.addElRole($bulletEl, "button"),
                    swiper.a11y.addElLabel(
                      $bulletEl,
                      params.paginationBulletMessage.replace(
                        /{{index}}/,
                        $bulletEl.index() + 1
                      )
                    );
                });
            },
            init: function init() {
              this.$el.append(this.a11y.liveRegion);
              var $nextEl,
                $prevEl,
                params = this.params.a11y;
              this.navigation &&
                this.navigation.$nextEl &&
                ($nextEl = this.navigation.$nextEl),
                this.navigation &&
                  this.navigation.$prevEl &&
                  ($prevEl = this.navigation.$prevEl),
                $nextEl &&
                  (this.a11y.makeElFocusable($nextEl),
                  this.a11y.addElRole($nextEl, "button"),
                  this.a11y.addElLabel($nextEl, params.nextSlideMessage),
                  $nextEl.on("keydown", this.a11y.onEnterKey)),
                $prevEl &&
                  (this.a11y.makeElFocusable($prevEl),
                  this.a11y.addElRole($prevEl, "button"),
                  this.a11y.addElLabel($prevEl, params.prevSlideMessage),
                  $prevEl.on("keydown", this.a11y.onEnterKey)),
                this.pagination &&
                  this.params.pagination.clickable &&
                  this.pagination.bullets &&
                  this.pagination.bullets.length &&
                  this.pagination.$el.on(
                    "keydown",
                    "." + this.params.pagination.bulletClass,
                    this.a11y.onEnterKey
                  );
            },
            destroy: function destroy() {
              var $nextEl, $prevEl;
              this.a11y.liveRegion &&
                this.a11y.liveRegion.length > 0 &&
                this.a11y.liveRegion.remove(),
                this.navigation &&
                  this.navigation.$nextEl &&
                  ($nextEl = this.navigation.$nextEl),
                this.navigation &&
                  this.navigation.$prevEl &&
                  ($prevEl = this.navigation.$prevEl),
                $nextEl && $nextEl.off("keydown", this.a11y.onEnterKey),
                $prevEl && $prevEl.off("keydown", this.a11y.onEnterKey),
                this.pagination &&
                  this.params.pagination.clickable &&
                  this.pagination.bullets &&
                  this.pagination.bullets.length &&
                  this.pagination.$el.off(
                    "keydown",
                    "." + this.params.pagination.bulletClass,
                    this.a11y.onEnterKey
                  );
            },
          },
          A11y = {
            name: "a11y",
            params: {
              a11y: {
                enabled: !1,
                notificationClass: "swiper-notification",
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                paginationBulletMessage: "Go to slide {{index}}",
              },
            },
            create: function create() {
              var swiper = this;
              Utils.extend(swiper, {
                a11y: {
                  liveRegion: $$1(
                    '<span class="' +
                      swiper.params.a11y.notificationClass +
                      '" aria-live="assertive" aria-atomic="true"></span>'
                  ),
                },
              }),
                Object.keys(a11y).forEach(function (methodName) {
                  swiper.a11y[methodName] = a11y[methodName].bind(swiper);
                });
            },
            on: {
              init: function init() {
                this.params.a11y.enabled &&
                  (this.a11y.init(), this.a11y.updateNavigation());
              },
              toEdge: function toEdge() {
                this.params.a11y.enabled && this.a11y.updateNavigation();
              },
              fromEdge: function fromEdge() {
                this.params.a11y.enabled && this.a11y.updateNavigation();
              },
              paginationUpdate: function paginationUpdate() {
                this.params.a11y.enabled && this.a11y.updatePagination();
              },
              destroy: function destroy() {
                this.params.a11y.enabled && this.a11y.destroy();
              },
            },
          },
          History = {
            init: function init() {
              if (this.params.history) {
                if (!win.history || !win.history.pushState)
                  return (
                    (this.params.history.enabled = !1),
                    void (this.params.hashNavigation.enabled = !0)
                  );
                var history = this.history;
                (history.initialized = !0),
                  (history.paths = History.getPathValues()),
                  (history.paths.key || history.paths.value) &&
                    (history.scrollToSlide(
                      0,
                      history.paths.value,
                      this.params.runCallbacksOnInit
                    ),
                    this.params.history.replaceState ||
                      win.addEventListener(
                        "popstate",
                        this.history.setHistoryPopState
                      ));
              }
            },
            destroy: function destroy() {
              this.params.history.replaceState ||
                win.removeEventListener(
                  "popstate",
                  this.history.setHistoryPopState
                );
            },
            setHistoryPopState: function setHistoryPopState() {
              (this.history.paths = History.getPathValues()),
                this.history.scrollToSlide(
                  this.params.speed,
                  this.history.paths.value,
                  !1
                );
            },
            getPathValues: function getPathValues() {
              var pathArray = win.location.pathname
                  .slice(1)
                  .split("/")
                  .filter(function (part) {
                    return "" !== part;
                  }),
                total = pathArray.length;
              return { key: pathArray[total - 2], value: pathArray[total - 1] };
            },
            setHistory: function setHistory(key, index) {
              if (this.history.initialized && this.params.history.enabled) {
                var slide = this.slides.eq(index),
                  value = History.slugify(slide.attr("data-history"));
                win.location.pathname.includes(key) ||
                  (value = key + "/" + value);
                var currentState = win.history.state;
                (currentState && currentState.value === value) ||
                  (this.params.history.replaceState
                    ? win.history.replaceState({ value: value }, null, value)
                    : win.history.pushState({ value: value }, null, value));
              }
            },
            slugify: function slugify(text) {
              return text
                .toString()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-")
                .replace(/^-+/, "")
                .replace(/-+$/, "");
            },
            scrollToSlide: function scrollToSlide(speed, value, runCallbacks) {
              if (value)
                for (
                  var i = 0, length = this.slides.length;
                  i < length;
                  i += 1
                ) {
                  var slide = this.slides.eq(i);
                  if (
                    History.slugify(slide.attr("data-history")) === value &&
                    !slide.hasClass(this.params.slideDuplicateClass)
                  ) {
                    var index = slide.index();
                    this.slideTo(index, speed, runCallbacks);
                  }
                }
              else this.slideTo(0, speed, runCallbacks);
            },
          },
          History$1 = {
            name: "history",
            params: {
              history: { enabled: !1, replaceState: !1, key: "slides" },
            },
            create: function create() {
              Utils.extend(this, {
                history: {
                  init: History.init.bind(this),
                  setHistory: History.setHistory.bind(this),
                  setHistoryPopState: History.setHistoryPopState.bind(this),
                  scrollToSlide: History.scrollToSlide.bind(this),
                  destroy: History.destroy.bind(this),
                },
              });
            },
            on: {
              init: function init() {
                this.params.history.enabled && this.history.init();
              },
              destroy: function destroy() {
                this.params.history.enabled && this.history.destroy();
              },
              transitionEnd: function transitionEnd() {
                this.history.initialized &&
                  this.history.setHistory(
                    this.params.history.key,
                    this.activeIndex
                  );
              },
            },
          },
          HashNavigation = {
            onHashCange: function onHashCange() {
              var newHash = doc.location.hash.replace("#", "");
              newHash !== this.slides.eq(this.activeIndex).attr("data-hash") &&
                this.slideTo(
                  this.$wrapperEl
                    .children(
                      "." +
                        this.params.slideClass +
                        '[data-hash="' +
                        newHash +
                        '"]'
                    )
                    .index()
                );
            },
            setHash: function setHash() {
              if (
                this.hashNavigation.initialized &&
                this.params.hashNavigation.enabled
              )
                if (
                  this.params.hashNavigation.replaceState &&
                  win.history &&
                  win.history.replaceState
                )
                  win.history.replaceState(
                    null,
                    null,
                    "#" + this.slides.eq(this.activeIndex).attr("data-hash") ||
                      ""
                  );
                else {
                  var slide = this.slides.eq(this.activeIndex),
                    hash =
                      slide.attr("data-hash") || slide.attr("data-history");
                  doc.location.hash = hash || "";
                }
            },
            init: function init() {
              if (
                !(
                  !this.params.hashNavigation.enabled ||
                  (this.params.history && this.params.history.enabled)
                )
              ) {
                this.hashNavigation.initialized = !0;
                var hash = doc.location.hash.replace("#", "");
                if (hash)
                  for (
                    var i = 0, length = this.slides.length;
                    i < length;
                    i += 1
                  ) {
                    var slide = this.slides.eq(i);
                    if (
                      (slide.attr("data-hash") ||
                        slide.attr("data-history")) === hash &&
                      !slide.hasClass(this.params.slideDuplicateClass)
                    ) {
                      var index = slide.index();
                      this.slideTo(
                        index,
                        0,
                        this.params.runCallbacksOnInit,
                        !0
                      );
                    }
                  }
                this.params.hashNavigation.watchState &&
                  $$1(win).on("hashchange", this.hashNavigation.onHashCange);
              }
            },
            destroy: function destroy() {
              this.params.hashNavigation.watchState &&
                $$1(win).off("hashchange", this.hashNavigation.onHashCange);
            },
          },
          HashNavigation$1 = {
            name: "hash-navigation",
            params: {
              hashNavigation: { enabled: !1, replaceState: !1, watchState: !1 },
            },
            create: function create() {
              Utils.extend(this, {
                hashNavigation: {
                  initialized: !1,
                  init: HashNavigation.init.bind(this),
                  destroy: HashNavigation.destroy.bind(this),
                  setHash: HashNavigation.setHash.bind(this),
                  onHashCange: HashNavigation.onHashCange.bind(this),
                },
              });
            },
            on: {
              init: function init() {
                this.params.hashNavigation.enabled &&
                  this.hashNavigation.init();
              },
              destroy: function destroy() {
                this.params.hashNavigation.enabled &&
                  this.hashNavigation.destroy();
              },
              transitionEnd: function transitionEnd() {
                this.hashNavigation.initialized &&
                  this.hashNavigation.setHash();
              },
            },
          },
          Autoplay = {
            run: function run() {
              var swiper = this,
                $activeSlideEl = swiper.slides.eq(swiper.activeIndex),
                delay = swiper.params.autoplay.delay;
              $activeSlideEl.attr("data-swiper-autoplay") &&
                (delay =
                  $activeSlideEl.attr("data-swiper-autoplay") ||
                  swiper.params.autoplay.delay),
                (swiper.autoplay.timeout = Utils.nextTick(function () {
                  swiper.params.loop
                    ? (swiper.loopFix(),
                      swiper.slideNext(swiper.params.speed, !0, !0),
                      swiper.emit("autoplay"))
                    : swiper.isEnd
                    ? swiper.params.autoplay.stopOnLastSlide
                      ? swiper.autoplay.stop()
                      : (swiper.slideTo(0, swiper.params.speed, !0, !0),
                        swiper.emit("autoplay"))
                    : (swiper.slideNext(swiper.params.speed, !0, !0),
                      swiper.emit("autoplay"));
                }, delay));
            },
            start: function start() {
              return (
                void 0 === this.autoplay.timeout &&
                !this.autoplay.running &&
                ((this.autoplay.running = !0),
                this.emit("autoplayStart"),
                this.autoplay.run(),
                !0)
              );
            },
            stop: function stop() {
              return (
                !!this.autoplay.running &&
                void 0 !== this.autoplay.timeout &&
                (this.autoplay.timeout &&
                  (clearTimeout(this.autoplay.timeout),
                  (this.autoplay.timeout = void 0)),
                (this.autoplay.running = !1),
                this.emit("autoplayStop"),
                !0)
              );
            },
            pause: function pause(speed) {
              var swiper = this;
              swiper.autoplay.running &&
                (swiper.autoplay.paused ||
                  (swiper.autoplay.timeout &&
                    clearTimeout(swiper.autoplay.timeout),
                  (swiper.autoplay.paused = !0),
                  0 === speed
                    ? ((swiper.autoplay.paused = !1), swiper.autoplay.run())
                    : swiper.$wrapperEl.transitionEnd(function () {
                        swiper &&
                          !swiper.destroyed &&
                          ((swiper.autoplay.paused = !1),
                          swiper.autoplay.running
                            ? swiper.autoplay.run()
                            : swiper.autoplay.stop());
                      })));
            },
          },
          Autoplay$1 = {
            name: "autoplay",
            params: {
              autoplay: {
                enabled: !1,
                delay: 3e3,
                disableOnInteraction: !0,
                stopOnLastSlide: !1,
              },
            },
            create: function create() {
              Utils.extend(this, {
                autoplay: {
                  running: !1,
                  paused: !1,
                  run: Autoplay.run.bind(this),
                  start: Autoplay.start.bind(this),
                  stop: Autoplay.stop.bind(this),
                  pause: Autoplay.pause.bind(this),
                },
              });
            },
            on: {
              init: function init() {
                this.params.autoplay.enabled && this.autoplay.start();
              },
              beforeTransitionStart: function beforeTransitionStart(
                speed,
                internal
              ) {
                this.autoplay.running &&
                  (internal || !this.params.autoplay.disableOnInteraction
                    ? this.autoplay.pause(speed)
                    : this.autoplay.stop());
              },
              sliderFirstMove: function sliderFirstMove() {
                this.autoplay.running &&
                  (this.params.autoplay.disableOnInteraction
                    ? this.autoplay.stop()
                    : this.autoplay.pause());
              },
              destroy: function destroy() {
                this.autoplay.running && this.autoplay.stop();
              },
            },
          },
          Fade = {
            setTranslate: function setTranslate() {
              for (var slides = this.slides, i = 0; i < slides.length; i += 1) {
                var $slideEl = this.slides.eq(i),
                  tx = -$slideEl[0].swiperSlideOffset;
                this.params.virtualTranslate || (tx -= this.translate);
                var ty = 0;
                this.isHorizontal() || ((ty = tx), (tx = 0));
                var slideOpacity = this.params.fadeEffect.crossFade
                  ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
                  : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
                $slideEl
                  .css({ opacity: slideOpacity })
                  .transform("translate3d(" + tx + "px, " + ty + "px, 0px)");
              }
            },
            setTransition: function setTransition(duration) {
              var swiper = this,
                slides = swiper.slides,
                $wrapperEl = swiper.$wrapperEl;
              if (
                (slides.transition(duration),
                swiper.params.virtualTranslate && 0 !== duration)
              ) {
                var eventTriggered = !1;
                slides.transitionEnd(function () {
                  if (!eventTriggered && swiper && !swiper.destroyed) {
                    (eventTriggered = !0), (swiper.animating = !1);
                    for (
                      var triggerEvents = [
                          "webkitTransitionEnd",
                          "transitionend",
                        ],
                        i = 0;
                      i < triggerEvents.length;
                      i += 1
                    )
                      $wrapperEl.trigger(triggerEvents[i]);
                  }
                });
              }
            },
          },
          EffectFade = {
            name: "effect-fade",
            params: { fadeEffect: { crossFade: !1 } },
            create: function create() {
              Utils.extend(this, {
                fadeEffect: {
                  setTranslate: Fade.setTranslate.bind(this),
                  setTransition: Fade.setTransition.bind(this),
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                if ("fade" === this.params.effect) {
                  this.classNames.push(
                    this.params.containerModifierClass + "fade"
                  );
                  var overwriteParams = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    spaceBetween: 0,
                    virtualTranslate: !0,
                  };
                  Utils.extend(this.params, overwriteParams),
                    Utils.extend(this.originalParams, overwriteParams);
                }
              },
              setTranslate: function setTranslate() {
                "fade" === this.params.effect && this.fadeEffect.setTranslate();
              },
              setTransition: function setTransition(duration) {
                "fade" === this.params.effect &&
                  this.fadeEffect.setTransition(duration);
              },
            },
          },
          Cube = {
            setTranslate: function setTranslate() {
              var $cubeShadowEl,
                $el = this.$el,
                $wrapperEl = this.$wrapperEl,
                slides = this.slides,
                swiperWidth = this.width,
                swiperHeight = this.height,
                rtl = this.rtl,
                swiperSize = this.size,
                params = this.params.cubeEffect,
                isHorizontal = this.isHorizontal(),
                isVirtual = this.virtual && this.params.virtual.enabled,
                wrapperRotate = 0;
              params.shadow &&
                (isHorizontal
                  ? (0 ===
                      ($cubeShadowEl = $wrapperEl.find(".swiper-cube-shadow"))
                        .length &&
                      (($cubeShadowEl = $$1(
                        '<div class="swiper-cube-shadow"></div>'
                      )),
                      $wrapperEl.append($cubeShadowEl)),
                    $cubeShadowEl.css({ height: swiperWidth + "px" }))
                  : 0 ===
                      ($cubeShadowEl = $el.find(".swiper-cube-shadow"))
                        .length &&
                    (($cubeShadowEl = $$1(
                      '<div class="swiper-cube-shadow"></div>'
                    )),
                    $el.append($cubeShadowEl)));
              for (var i = 0; i < slides.length; i += 1) {
                var $slideEl = slides.eq(i),
                  slideIndex = i;
                isVirtual &&
                  (slideIndex = parseInt(
                    $slideEl.attr("data-swiper-slide-index"),
                    10
                  ));
                var slideAngle = 90 * slideIndex,
                  round = Math.floor(slideAngle / 360);
                rtl &&
                  ((slideAngle = -slideAngle),
                  (round = Math.floor(-slideAngle / 360)));
                var progress = Math.max(Math.min($slideEl[0].progress, 1), -1),
                  tx = 0,
                  ty = 0,
                  tz = 0;
                slideIndex % 4 == 0
                  ? ((tx = 4 * -round * swiperSize), (tz = 0))
                  : (slideIndex - 1) % 4 == 0
                  ? ((tx = 0), (tz = 4 * -round * swiperSize))
                  : (slideIndex - 2) % 4 == 0
                  ? ((tx = swiperSize + 4 * round * swiperSize),
                    (tz = swiperSize))
                  : (slideIndex - 3) % 4 == 0 &&
                    ((tx = -swiperSize),
                    (tz = 3 * swiperSize + 4 * swiperSize * round)),
                  rtl && (tx = -tx),
                  isHorizontal || ((ty = tx), (tx = 0));
                var transform =
                  "rotateX(" +
                  (isHorizontal ? 0 : -slideAngle) +
                  "deg) rotateY(" +
                  (isHorizontal ? slideAngle : 0) +
                  "deg) translate3d(" +
                  tx +
                  "px, " +
                  ty +
                  "px, " +
                  tz +
                  "px)";
                if (
                  (progress <= 1 &&
                    progress > -1 &&
                    ((wrapperRotate = 90 * slideIndex + 90 * progress),
                    rtl && (wrapperRotate = 90 * -slideIndex - 90 * progress)),
                  $slideEl.transform(transform),
                  params.slideShadows)
                ) {
                  var shadowBefore = isHorizontal
                      ? $slideEl.find(".swiper-slide-shadow-left")
                      : $slideEl.find(".swiper-slide-shadow-top"),
                    shadowAfter = isHorizontal
                      ? $slideEl.find(".swiper-slide-shadow-right")
                      : $slideEl.find(".swiper-slide-shadow-bottom");
                  0 === shadowBefore.length &&
                    ((shadowBefore = $$1(
                      '<div class="swiper-slide-shadow-' +
                        (isHorizontal ? "left" : "top") +
                        '"></div>'
                    )),
                    $slideEl.append(shadowBefore)),
                    0 === shadowAfter.length &&
                      ((shadowAfter = $$1(
                        '<div class="swiper-slide-shadow-' +
                          (isHorizontal ? "right" : "bottom") +
                          '"></div>'
                      )),
                      $slideEl.append(shadowAfter)),
                    shadowBefore.length &&
                      (shadowBefore[0].style.opacity = Math.max(-progress, 0)),
                    shadowAfter.length &&
                      (shadowAfter[0].style.opacity = Math.max(progress, 0));
                }
              }
              if (
                ($wrapperEl.css({
                  "-webkit-transform-origin":
                    "50% 50% -" + swiperSize / 2 + "px",
                  "-moz-transform-origin": "50% 50% -" + swiperSize / 2 + "px",
                  "-ms-transform-origin": "50% 50% -" + swiperSize / 2 + "px",
                  "transform-origin": "50% 50% -" + swiperSize / 2 + "px",
                }),
                params.shadow)
              )
                if (isHorizontal)
                  $cubeShadowEl.transform(
                    "translate3d(0px, " +
                      (swiperWidth / 2 + params.shadowOffset) +
                      "px, " +
                      -swiperWidth / 2 +
                      "px) rotateX(90deg) rotateZ(0deg) scale(" +
                      params.shadowScale +
                      ")"
                  );
                else {
                  var shadowAngle =
                      Math.abs(wrapperRotate) -
                      90 * Math.floor(Math.abs(wrapperRotate) / 90),
                    multiplier =
                      1.5 -
                      (Math.sin((2 * shadowAngle * Math.PI) / 360) / 2 +
                        Math.cos((2 * shadowAngle * Math.PI) / 360) / 2),
                    scale1 = params.shadowScale,
                    scale2 = params.shadowScale / multiplier,
                    offset = params.shadowOffset;
                  $cubeShadowEl.transform(
                    "scale3d(" +
                      scale1 +
                      ", 1, " +
                      scale2 +
                      ") translate3d(0px, " +
                      (swiperHeight / 2 + offset) +
                      "px, " +
                      -swiperHeight / 2 / scale2 +
                      "px) rotateX(-90deg)"
                  );
                }
              var zFactor =
                Browser.isSafari || Browser.isUiWebView ? -swiperSize / 2 : 0;
              $wrapperEl.transform(
                "translate3d(0px,0," +
                  zFactor +
                  "px) rotateX(" +
                  (this.isHorizontal() ? 0 : wrapperRotate) +
                  "deg) rotateY(" +
                  (this.isHorizontal() ? -wrapperRotate : 0) +
                  "deg)"
              );
            },
            setTransition: function setTransition(duration) {
              var $el = this.$el;
              this.slides
                .transition(duration)
                .find(
                  ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
                )
                .transition(duration),
                this.params.cubeEffect.shadow &&
                  !this.isHorizontal() &&
                  $el.find(".swiper-cube-shadow").transition(duration);
            },
          },
          EffectCube = {
            name: "effect-cube",
            params: {
              cubeEffect: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: 0.94,
              },
            },
            create: function create() {
              Utils.extend(this, {
                cubeEffect: {
                  setTranslate: Cube.setTranslate.bind(this),
                  setTransition: Cube.setTransition.bind(this),
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                if ("cube" === this.params.effect) {
                  this.classNames.push(
                    this.params.containerModifierClass + "cube"
                  ),
                    this.classNames.push(
                      this.params.containerModifierClass + "3d"
                    );
                  var overwriteParams = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    resistanceRatio: 0,
                    spaceBetween: 0,
                    centeredSlides: !1,
                    virtualTranslate: !0,
                  };
                  Utils.extend(this.params, overwriteParams),
                    Utils.extend(this.originalParams, overwriteParams);
                }
              },
              setTranslate: function setTranslate() {
                "cube" === this.params.effect && this.cubeEffect.setTranslate();
              },
              setTransition: function setTransition(duration) {
                "cube" === this.params.effect &&
                  this.cubeEffect.setTransition(duration);
              },
            },
          },
          Flip = {
            setTranslate: function setTranslate() {
              for (var slides = this.slides, i = 0; i < slides.length; i += 1) {
                var $slideEl = slides.eq(i),
                  progress = $slideEl[0].progress;
                this.params.flipEffect.limitRotation &&
                  (progress = Math.max(Math.min($slideEl[0].progress, 1), -1));
                var rotateY = -180 * progress,
                  rotateX = 0,
                  tx = -$slideEl[0].swiperSlideOffset,
                  ty = 0;
                if (
                  (this.isHorizontal()
                    ? this.rtl && (rotateY = -rotateY)
                    : ((ty = tx),
                      (tx = 0),
                      (rotateX = -rotateY),
                      (rotateY = 0)),
                  ($slideEl[0].style.zIndex =
                    -Math.abs(Math.round(progress)) + slides.length),
                  this.params.flipEffect.slideShadows)
                ) {
                  var shadowBefore = this.isHorizontal()
                      ? $slideEl.find(".swiper-slide-shadow-left")
                      : $slideEl.find(".swiper-slide-shadow-top"),
                    shadowAfter = this.isHorizontal()
                      ? $slideEl.find(".swiper-slide-shadow-right")
                      : $slideEl.find(".swiper-slide-shadow-bottom");
                  0 === shadowBefore.length &&
                    ((shadowBefore = $$1(
                      '<div class="swiper-slide-shadow-' +
                        (this.isHorizontal() ? "left" : "top") +
                        '"></div>'
                    )),
                    $slideEl.append(shadowBefore)),
                    0 === shadowAfter.length &&
                      ((shadowAfter = $$1(
                        '<div class="swiper-slide-shadow-' +
                          (this.isHorizontal() ? "right" : "bottom") +
                          '"></div>'
                      )),
                      $slideEl.append(shadowAfter)),
                    shadowBefore.length &&
                      (shadowBefore[0].style.opacity = Math.max(-progress, 0)),
                    shadowAfter.length &&
                      (shadowAfter[0].style.opacity = Math.max(progress, 0));
                }
                $slideEl.transform(
                  "translate3d(" +
                    tx +
                    "px, " +
                    ty +
                    "px, 0px) rotateX(" +
                    rotateX +
                    "deg) rotateY(" +
                    rotateY +
                    "deg)"
                );
              }
            },
            setTransition: function setTransition(duration) {
              var swiper = this,
                slides = swiper.slides,
                activeIndex = swiper.activeIndex,
                $wrapperEl = swiper.$wrapperEl;
              if (
                (slides
                  .transition(duration)
                  .find(
                    ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
                  )
                  .transition(duration),
                swiper.params.virtualTranslate && 0 !== duration)
              ) {
                var eventTriggered = !1;
                slides
                  .eq(activeIndex)
                  .transitionEnd(function onTransitionEnd() {
                    if (!eventTriggered && swiper && !swiper.destroyed) {
                      (eventTriggered = !0), (swiper.animating = !1);
                      for (
                        var triggerEvents = [
                            "webkitTransitionEnd",
                            "transitionend",
                          ],
                          i = 0;
                        i < triggerEvents.length;
                        i += 1
                      )
                        $wrapperEl.trigger(triggerEvents[i]);
                    }
                  });
              }
            },
          },
          EffectFlip = {
            name: "effect-flip",
            params: { flipEffect: { slideShadows: !0, limitRotation: !0 } },
            create: function create() {
              Utils.extend(this, {
                flipEffect: {
                  setTranslate: Flip.setTranslate.bind(this),
                  setTransition: Flip.setTransition.bind(this),
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                if ("flip" === this.params.effect) {
                  this.classNames.push(
                    this.params.containerModifierClass + "flip"
                  ),
                    this.classNames.push(
                      this.params.containerModifierClass + "3d"
                    );
                  var overwriteParams = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    spaceBetween: 0,
                    virtualTranslate: !0,
                  };
                  Utils.extend(this.params, overwriteParams),
                    Utils.extend(this.originalParams, overwriteParams);
                }
              },
              setTranslate: function setTranslate() {
                "flip" === this.params.effect && this.flipEffect.setTranslate();
              },
              setTransition: function setTransition(duration) {
                "flip" === this.params.effect &&
                  this.flipEffect.setTransition(duration);
              },
            },
          },
          Coverflow = {
            setTranslate: function setTranslate() {
              for (
                var swiperWidth = this.width,
                  swiperHeight = this.height,
                  slides = this.slides,
                  $wrapperEl = this.$wrapperEl,
                  slidesSizesGrid = this.slidesSizesGrid,
                  params = this.params.coverflowEffect,
                  isHorizontal = this.isHorizontal(),
                  transform = this.translate,
                  center = isHorizontal
                    ? swiperWidth / 2 - transform
                    : swiperHeight / 2 - transform,
                  rotate = isHorizontal ? params.rotate : -params.rotate,
                  translate = params.depth,
                  i = 0,
                  length = slides.length;
                i < length;
                i += 1
              ) {
                var $slideEl = slides.eq(i),
                  slideSize = slidesSizesGrid[i],
                  offsetMultiplier =
                    ((center - $slideEl[0].swiperSlideOffset - slideSize / 2) /
                      slideSize) *
                    params.modifier,
                  rotateY = isHorizontal ? rotate * offsetMultiplier : 0,
                  rotateX = isHorizontal ? 0 : rotate * offsetMultiplier,
                  translateZ = -translate * Math.abs(offsetMultiplier),
                  translateY = isHorizontal
                    ? 0
                    : params.stretch * offsetMultiplier,
                  translateX = isHorizontal
                    ? params.stretch * offsetMultiplier
                    : 0;
                Math.abs(translateX) < 0.001 && (translateX = 0),
                  Math.abs(translateY) < 0.001 && (translateY = 0),
                  Math.abs(translateZ) < 0.001 && (translateZ = 0),
                  Math.abs(rotateY) < 0.001 && (rotateY = 0),
                  Math.abs(rotateX) < 0.001 && (rotateX = 0);
                var slideTransform =
                  "translate3d(" +
                  translateX +
                  "px," +
                  translateY +
                  "px," +
                  translateZ +
                  "px)  rotateX(" +
                  rotateX +
                  "deg) rotateY(" +
                  rotateY +
                  "deg)";
                if (
                  ($slideEl.transform(slideTransform),
                  ($slideEl[0].style.zIndex =
                    1 - Math.abs(Math.round(offsetMultiplier))),
                  params.slideShadows)
                ) {
                  var $shadowBeforeEl = isHorizontal
                      ? $slideEl.find(".swiper-slide-shadow-left")
                      : $slideEl.find(".swiper-slide-shadow-top"),
                    $shadowAfterEl = isHorizontal
                      ? $slideEl.find(".swiper-slide-shadow-right")
                      : $slideEl.find(".swiper-slide-shadow-bottom");
                  0 === $shadowBeforeEl.length &&
                    (($shadowBeforeEl = $$1(
                      '<div class="swiper-slide-shadow-' +
                        (isHorizontal ? "left" : "top") +
                        '"></div>'
                    )),
                    $slideEl.append($shadowBeforeEl)),
                    0 === $shadowAfterEl.length &&
                      (($shadowAfterEl = $$1(
                        '<div class="swiper-slide-shadow-' +
                          (isHorizontal ? "right" : "bottom") +
                          '"></div>'
                      )),
                      $slideEl.append($shadowAfterEl)),
                    $shadowBeforeEl.length &&
                      ($shadowBeforeEl[0].style.opacity =
                        offsetMultiplier > 0 ? offsetMultiplier : 0),
                    $shadowAfterEl.length &&
                      ($shadowAfterEl[0].style.opacity =
                        -offsetMultiplier > 0 ? -offsetMultiplier : 0);
                }
              }
              Browser.ie &&
                ($wrapperEl[0].style.perspectiveOrigin = center + "px 50%");
            },
            setTransition: function setTransition(duration) {
              this.slides
                .transition(duration)
                .find(
                  ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
                )
                .transition(duration);
            },
          },
          EffectCoverflow = {
            name: "effect-coverflow",
            params: {
              coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: !0,
              },
            },
            create: function create() {
              Utils.extend(this, {
                coverflowEffect: {
                  setTranslate: Coverflow.setTranslate.bind(this),
                  setTransition: Coverflow.setTransition.bind(this),
                },
              });
            },
            on: {
              beforeInit: function beforeInit() {
                "coverflow" === this.params.effect &&
                  (this.classNames.push(
                    this.params.containerModifierClass + "coverflow"
                  ),
                  this.classNames.push(
                    this.params.containerModifierClass + "3d"
                  ),
                  (this.params.watchSlidesProgress = !0),
                  (this.originalParams.watchSlidesProgress = !0));
              },
              setTranslate: function setTranslate() {
                "coverflow" === this.params.effect &&
                  this.coverflowEffect.setTranslate();
              },
              setTransition: function setTransition(duration) {
                "coverflow" === this.params.effect &&
                  this.coverflowEffect.setTransition(duration);
              },
            },
          };
        return (
          Swiper$1.use([
            Device$2,
            Support$2,
            Browser$2,
            Resize,
            Observer$1,
            Virtual$1,
            Keyboard$1,
            Mousewheel$1,
            Navigation$1,
            Pagination$1,
            Scrollbar$1,
            Parallax$1,
            Zoom$1,
            Lazy$1,
            Controller$1,
            A11y,
            History$1,
            HashNavigation$1,
            Autoplay$1,
            EffectFade,
            EffectCube,
            EffectFlip,
            EffectCoverflow,
          ]),
          Swiper$1
        );
      }),
      "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = factory())
        : "function" == typeof define && define.amd
        ? define(factory)
        : (global.Swiper = factory());
    var mainSlider = document.getElementById("js-mainslider");
    if (mainSlider)
      new Swiper(mainSlider, {
        loop: !0,
        speed: 1500,
        watchOverflow: !0,
        grabCursor: !0,
        watchSlidesProgress: !0,
        mousewheelControl: !0,
        keyboardControl: !0,
        loop: !0,
        observer: !0,
        observeParents: !0,
        slidesPerView: "auto",
        navigation: {
          nextEl: ".mainslider__button-next",
          prevEl: ".mainslider__button-prev",
        },
        autoplay: { delay: 3e3 },
        on: {
          progress: function () {
            for (var i = 0; i < this.slides.length; i++) {
              var innerTranslate = this.slides[i].progress * (0.5 * this.width);
              this.slides[i].querySelector(
                ".mainslider__imgbg"
              ).style.transform = "translate3d(" + innerTranslate + "px, 0, 0)";
            }
          },
          touchStart: function () {
            for (var i = 0; i < this.slides.length; i++)
              this.slides[i].style.transition = "";
          },
          setTransition: function (speed) {
            for (var i = 0; i < this.slides.length; i++)
              (this.slides[i].style.transition = speed + "ms"),
                (this.slides[i].querySelector(
                  ".mainslider__imgbg"
                ).style.transition = speed + "ms");
          },
        },
        breakpoints: { 600: { speed: 1200 } },
      });
  })(),
  (window.onload = function () {
    var stickyHeader = document.getElementById("js-init-sticky"),
      headerOffset = findOffset(stickyHeader);
    function initStickyheader() {
      (document.documentElement.scrollTop || document.body.scrollTop) >=
      headerOffset.top
        ? stickyHeader.classList.add("sticky-header")
        : stickyHeader.classList.remove("sticky-header");
    }
    stickyHeader &&
      headerOffset &&
      ((window.onscroll = function () {
        initStickyheader();
      }),
      initStickyheader());
  });
var tabs = (function () {
  if (document.body.classList.contains("touch-device"))
    var objEvents = "touchstart";
  else objEvents = "click";
  document.body.addEventListener(
    objEvents,
    function (event) {
      if (event.target.classList.contains("tabs__nav-item")) {
        var $target = event.target;
        !(function checkInclude(el) {
          if (el.closest(".js-tabs").dataset.ajaxcheck) {
            var layouyItem = el
              .closest(".js-tabs")
              .querySelectorAll(".tabs__container .tabs__layout-item");
            Array.prototype.slice.call(layouyItem).forEach(function (item) {
              var valueSrc = item.dataset.include;
              if (valueSrc) {
                var xhttp = new XMLHttpRequest();
                (xhttp.onreadystatechange = function () {
                  4 == this.readyState &&
                    200 == this.status &&
                    (item.innerHTML = this.responseText);
                }),
                  xhttp.open("GET", valueSrc, !0),
                  xhttp.send();
              }
            });
          }
        })($target),
          (function checkNavActive($target) {
            var navItem =
              $target.parentNode.querySelectorAll(".tabs__nav-item");
            Array.prototype.slice.call(navItem).forEach(function (navItem) {
              navItem.classList.contains("active") &&
                navItem.classList.remove("active");
            }),
              $target.classList.add("active");
          })($target),
          (function checkTabActive($target) {
            var pathtabActive = $target.dataset.pathtab,
              srcItem = document.querySelector("#" + pathtabActive),
              layouyItem =
                srcItem.parentNode.querySelectorAll(".tabs__layout-item");
            Array.prototype.slice.call(layouyItem).forEach(function (tabItem) {
              tabItem.classList.contains("active") &&
                tabItem.classList.remove("active");
            }),
              srcItem.classList.add("active");
          })($target),
          (function checkIncludeFalse($target) {
            $target.closest(".js-tabs").dataset.ajaxcheck = "false";
          })($target);
      }
    },
    !1
  );
})();
