/**
 * Template
 * @constructor
 */
function Template() {
  this.separators = {
    "left": '{{',
    "right": '}}'
  };
  this.htmlSnippets = {};
}

/**
 * example: mm_inner_HTML = variant.template.set('myHTMLPart', mm_inner_HTML);
 * @param snippetName
 * @param text
 * @returns {string}
 */
Template.prototype.setHTML = function (snippetName, text) {
  this.htmlSnippets[snippetName] = text;
  return '';
};

/**
 * example inside variant class: this.template.get('myHTMLPart', {"variable": 'currentValue', ...});
 * @param snippetName
 * @param data
 * @returns {*|string}
 */
Template.prototype.getHTML = function (snippetName, data) {
  var name, regExp, text = this.htmlSnippets[snippetName] || '';
  if (data && typeof data === 'object') {
    for (name in data) {
      if (data.hasOwnProperty(name)) {
        regExp = new RegExp(this.separators.left + name + this.separators.right, 'g');
        text = text.replace(regExp, data[name]);
      }
    }
  }
  return text;
};

/**
 * part of async lib https://github.com/caolan/async
 * @constructor
 */
function Async() {}

/**
 * Run an array of functions in parallel
 * @param tasks
 * @param callback
 */
Async.prototype.parallel = function (tasks, callback) {
  var i = 0, len = tasks.length,
    executed = 0,
    errors = [],
    done = function (err) {
      if (err) {
        errors.push(err);
      }
      return ++executed === len ? callback(errors.length ? errors : null) : null;
    };
  for (i; i < len; i += 1) {
    try {
      tasks[i](done);
    } catch (exc) {
      done(exc);
    }
  }
};

/**
 * Runs an array of functions in series
 * @param tasks
 * @param callback
 */
Async.prototype.waterfall = function (tasks, callback) {
  var executed = 0,
    done = function () {
      var task = tasks[executed] || null;
      executed += 1;
      try {
        return task ? task(done) : callback(null);
      } catch (exc) {
        callback(exc);
      }
      return null;
    };
  done();
};

/**
 * part of underscore lib http://underscorejs.org/
 * @constructor
 */
function Underscore() {
  this.nativeMap = Array.prototype.map;
  this.nativeForEach = Array.prototype.forEach;
  this.nativeHasOwnProperty = Object.prototype.hasOwnProperty;
  this.breaker = {};
}

/**
 * Return the results of applying the iterator to each element.
 * Delegates to **ECMAScript 5**'s native `map` if available.
 * @param obj
 * @param iterator
 * @param context
 * @returns {*}
 */
Underscore.prototype.map = function (obj, iterator, context) {
  var results = [];
  if (!obj) {
    return results;
  }
  if (this.nativeMap && obj.map === this.nativeMap) {
    return obj.map(iterator, context);
  }
  this.each(obj, function (value, index, list) {
    results[results.length] = iterator.call(context, value, index, list);
  });
  return results;
};

/**
 *  The cornerstone, an `each` implementation, aka `forEach`.
 *  Handles objects with the built-in `forEach`, arrays, and raw objects.
 *  Delegates to **ECMAScript 5**'s native `forEach` if available.
 * @param obj
 * @param iterator
 * @param context
 */
Underscore.prototype.each = function (obj, iterator, context) {
  if (!obj) {return; }
  if (this.nativeForEach && obj.forEach === this.nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (iterator.call(context, obj[i], i, obj) === this.breaker) {return;}
    }
  } else {
    for (var key in obj) {
      if (this.has(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === this.breaker) {return;}
      }
    }
  }
};

/**
 * Shortcut function for checking if an object has a given property directly on itself (in other words, not on a prototype).
 * @param obj
 * @param key
 * @returns boolean
 */
Underscore.prototype.has = function(obj, key) {
  return this.nativeHasOwnProperty ? this.nativeHasOwnProperty.call(obj, key) : true;
};

/**
 * Document - helpers with document work
 * @constructor
 */
function Document() {
  this.recursion = {
    "count": 0,
    "limit": 2500,
    "interval": 2
  };
}

/**
 * execute callback when all elements in selector appeared on the page
 * @param selectors - array || string || on doc load handler
 * @param callback
 * TODO: replace mmcore.AddDocLoadHandler with native DomContentLoaded event
 */
Document.prototype.ready = function (selectors, callback) {
  if (typeof selectors === 'function') {
    mmcore.AddDocLoadHandler(selectors);
    return;
  }
  var elementSelectors = typeof selectors === 'string' ? [selectors] : selectors,
    elementsLen = elementSelectors.length,
    arrivedElements = 0,
    elements = {},
    isArrived = true,
    done = function (element) {
      elements[elementSelectors[arrivedElements]] = element;
      isArrived = element ? isArrived : false;
      return ++arrivedElements === elementsLen ? callback(isArrived, elements) : null;
    };
  for (var i = 0; i < elementsLen; i += 1) {
    this.waitForElementArrived(elementSelectors[i], done);
  }
};

/**
 * execute callback when element in selector appeared on the page
 * @param selector - string
 * @param callback
 * TODO: implementation with out jQuery
 */
Document.prototype.waitForElementArrived = function (selector, callback) {
  var recursion = {}, field;
  for (field in this.recursion) {
    if (this.recursion.hasOwnProperty(field)) {
      recursion[field] = this.recursion[field];
    }
  }
  return function recExec() {
    try {
      var $element = $(selector);
      if (typeof $element === 'object' && $element.length > 0) {
        callback($element);
      } else if (recursion.count >= recursion.limit) {
        callback(null);
      } else {
        recursion.count += 1;
        setTimeout(recExec, recursion.interval);
      }
    } catch (exception) {
      mmcore.EH(new Error(selector));
      mmcore.EH(exception);
    }
  }();
};

/**
 * execute callback when window['objectName'] initialize on the page
 * @param objectName - string
 * @param callback
 * TODO: add sub objects support ex objectName = 'com.maxymiser.core.document' now only com can be defined
 */
Document.prototype.onDefined = function (objectName, callback) {
  var recursion = {}, field;
  for (field in this.recursion) {
    if (this.recursion.hasOwnProperty(field)) {
      recursion[field] = this.recursion[field];
    }
  }
  return function recExec() {
    var object = window[objectName];
    if (typeof object !== 'undefined') {
      callback(object);
    } else if (recursion.count >= recursion.limit) {
      callback(object);
    } else {
      recursion.count += 1;
      setTimeout(recExec, recursion.interval);
    }
  }();
};

/**
 * execute callback when one of elements in selector appeared on the page
 * @param selectors - array || string
 * @param callback
 * TODO: implementation with out jQuery
 */
Document.prototype.oneOfElementsArrived = function (selectors, callback) {
  var i = 0,
    elementsLen = selectors.length,
    arrivedElements = 0,
    isDone = false,
    done = function (element) {
      arrivedElements += 1;
      if (!isDone && (element || arrivedElements === elementsLen)) {
        isDone = true;
        callback(element);
      }
    };
  for (; i < elementsLen; i += 1) {
    this.waitForElementArrived(selectors[i], done);
  }
};

/**
 * hide once element appeared on the page
 * @param selector
 * TODO: implementation with out jQuery
 */
Document.prototype.hideElement = function (selector) {
  this.waitForElementArrived(selector, function (element) {
    return element ? element.hide() : null;
  });
};

/**
 * show once element appeared on the page
 * @param selector
 * TODO: implementation with out jQuery
 */
Document.prototype.showElement = function (selector) {
  this.waitForElementArrived(selector, function (element) {
    return element ? setTimeout(function () {
      element.show();
    }, 100) : null;
  });
};

/**
 * Events - event handler wrapper
 * @constructor
 * TODO: not tested yet
 */
function Events() {
  this.element = document;
  this.eventMethods = {};
  this.eventArguments = {};
  this.eventHandlers = {};
}

Events.prototype.add = function (type, handler, context) {
  var self = this;
  this.eventMethods[type] = this.eventMethods[type] || [];
  this.eventMethods[type].push(handler);
  this.eventHandlers[type] = function () {
    var i, len = self.eventMethods[type].length;
    for (i = 0; i < len; i += 1) {
      self.eventMethods[type][i].apply(context || window, self.eventArguments[type] || []);
    }
  };
};

/**
 * remove event listener
 * @param type
 * @param handler
 */
Events.prototype.unbind = function (type, handler) {
  var element = this.element;
  if (element.removeEventListener){
    element.removeEventListener(type, handler || this.eventHandlers[type], false);
  } else {
    element.detachEvent('on' + type, handler || this.eventHandlers[type]);
  }
  this.eventMethods = {};
  this.eventArguments = {};
  this.eventHandlers = {};
};

/**
 * subscribe on event type
 * @param type
 * @param handler
 * @param context
 */
Events.prototype.on = function (type, handler, context) {
  var element = this.element;
  this.unbind(type, handler);
  this.add(type, handler, context);
  if (element.addEventListener) {
    try {
    element.addEventListener(type, this.eventHandlers[type], false);
    } catch (e) {alert(e)}
  } else {
    element.attachEvent('on' + type, this.eventHandlers[type]);
  }
};

/**
 * trigger event
 * @param type
 * @param args []
 */
Events.prototype.fire = function (type, args) {
  var event, element = this.element;
  this.eventArguments[type] = args || [];
  if (element.createEvent) {
    event = element.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    element.dispatchEvent(event);
  } else if (element.createEventObject) {
    event = element.createEventObject();
    //TODO: fix ie8 bug with element.fireEvent "Error: Invalid argument."
    element.fireEvent('on' + type, event);
  } else {
    throw new Error('can not create event ' + type);
  }
};

/**
 * Core - mmcore functionality redefinition
 * @constructor
 * TODO: add popular mmcore methods AtachStyle
 */
function Core() {}

/**
 * track action immediate
 * @param action string || Object {
 *   name: string * required,
 *   value: number default 1
 *   attribute: string default '',
 *   pageId: string default mmevents
 * }
 * @param callback - CG request callback
 */
Core.prototype.trackActionImmediate = function (action, callback) {
  var name = typeof action === 'object' ? action.name : action,
    value = typeof action === 'object' ? (action.value || 1) : 1,
    attr = typeof action === 'object' ? (action.attr || action.attribute || '') : '',
    pageId = typeof action === 'object' ? (action.pageId || 'mmevents') : 'mmevents';
  mmcore._async = true;
  mmcore.SetAction(name, value, attr);
  mmcore.SetPageID(pageId);
  mmcore.CGRequest(callback);
};

/**
 * track action deferred
 * @param action string || {
 *   name: string * required,
 *   value: number default 1
 *   attribute: string default '',
 * }
 */
Core.prototype.trackActionDeferred = function (action) {
  var name = typeof action === 'object' ? action.name : action,
    value = typeof action === 'object' ? (action.value || 1) : 1,
    attr = typeof action === 'object' ? (action.attr || action.attribute || '') : '';
  mmcore.$Action(name, value, attr);
};

/**
 * Checker
 * @param test Object {
 *   name: string company name,
 *   hide: string css selector,
 *   pageID: string
 *   mmChecker: function
 * }
 */
Core.prototype.checker = function (test) {
  var _name = test.name.replace(/\s/g, "_"),
    n = 100,
    showFn = function () {
      var el = document.getElementById(_name);
      el.parentNode.removeChild(el);
    };
  (function fnWait() {
    if (test.mmChecker()) {
      mmcore.SetPageID(test.pageID);
      mmcore.HideMaxyboxes = function () {};
      mmcore.CGRequest(function () {
        mmcore.AddDocLoadHandler(showFn);
      });
    } else if (mmcore._docEnd || !n--) {
      showFn();
    } else {
      mmcore._async = true;
      setTimeout(fnWait, 50);
    }
  }());
  document.write("<style id='" + _name + "' type='text/css'>" + test.hide + "{position:relative; left:-10000px}</style>")
};

/**
 * Renderer
 * @param test Object {
 *   is_def: function,
 *   mm_path: string,
 *   name: string company name,
 *   hide: string css selectors
 * }
 */
Core.prototype.renderer = function (test) {
  var localTC,
    gi = mmcore.GenInfo[test.name],
    rmb = [],
    _name = test.name.replace(/\s/g, "_"),
    n = 100;
  try {
    localTC = tc;
  } catch (e) {
    localTC = {};
  }
  for (var mb in localTC) {
    if (!/undefined|Default/.test(gi[mb.toLowerCase()])) {
      rmb.push(mb);
    }
  }
  if (rmb.length) {
    if (test.displayNone) {
      document.write("<style id='" + _name + "' type='text/css'>" + test.hide + "{display: none !important;}</style>");
    } else {
      document.write("<style id='" + _name + "' type='text/css'>" + test.hide + "{position: relative !important; left:-10000px !important;}</style>");
    }
    var mmInt = setInterval(function() {
      if (typeof test.is_def === 'function' && test.is_def() || mmcore._docEnd || !n--) {
        var el = document.getElementById(_name);
        mmcore.RenderMaxyboxes(rmb);
        if (el) {
          el.parentNode.removeChild(el);
        }
        clearInterval(mmInt);
      }
    }, 50);
  }
};

/**
 * TestBase - parent class for test classes, snippets container
 * @constructor
 */
function TestBase() {
  window.onerror = function (exception) {
    mmcore.EH(exception);
    return true;
  };
}

TestBase.prototype.template = new Template();
TestBase.prototype.async = new Async();
TestBase.prototype._ = new Underscore();
TestBase.prototype.document = new Document();
TestBase.prototype.events = new Events();
TestBase.prototype.core = new Core();

/**
 * Some popular methods realisation
 * @constructor
 */

/**
 * @param context
 * @param fn
 * @returns {Function}
 */
TestBase.prototype.bind = function (context, fn) {
    return function () {
      return fn.apply(context, arguments);
    };
};

/**
 * @param str
 * @returns {XML}
 */
TestBase.prototype.trim = function (str) {
    return typeof str === 'string' ? str.replace(/^\s+/, '').replace(/\s+$/, '') : '';
};

/**
 *
 * @param context
 * @param methodName
 * @param decorator
 */
TestBase.prototype.decorate = function (context, methodName, decorator) {
  if (!context || typeof context[methodName] !== 'function' || typeof decorator !== 'function') {
    return;
  }
  var origin = context[methodName];
  context[methodName] = function () {
    decorator.apply(context, arguments);
    return origin.apply(context, arguments);
  };
};