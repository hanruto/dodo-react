// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"react/create-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createElement;

/**
 * @example
 * <h1> hello world </h1>
 * 可以通过jsx被转化为
 * createElement('h1', {id: 'greet'}, 'hello world')
 */
function createElement(tag, attrs) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    children: children
  };
}
},{}],"react-dom/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttribute = setAttribute;

function setAttribute(dom, attr, value) {
  var factAttr = attr,
      factValue = value;

  if (attr === 'style') {
    factValue = '';
    var styleObj = value;

    for (var key in styleObj) {
      factValue += "".concat(key, " : ").concat(styleObj[key]);
    }
  }

  if (attr === 'className') {
    factAttr = 'class';
  }

  if (/on([a-zA-Z]+)/.test(attr)) {
    var eventName = attr.match(/on([a-zA-Z]+)/)[1].toLowerCase();
    dom.addEventListener(eventName, value);
    return;
  }

  if (attr === 'dangerouslySetInnerHTML') {
    dom.innerHTML = value && value.__html;
    return;
  }

  dom.setAttribute(factAttr, factValue);
}
},{}],"react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSameNodeType = isSameNodeType;
exports.default = diff;

var _component = require("./component");

var _dom = require("./dom");

function isSameNodeType(node, vnode) {
  if (node.nodeType === 3 && typeof vnode === 'string') {
    return true;
  } else {
    return node.nodeName.toLowerCase() === vnode && vnode.tag;
  }
}
/**
 * @param {HTMLElemnet} dom 当前对比的dom树
 * @param {VNode} node dom树对应的vnode
 * @returns {HTMLElemnet} 更新后的dom
 */


function diff(dom, vnode, container) {
  // 对比文字
  var out = dom;

  if (typeof vnode === 'boolean' || vnode === null || vnode === undefined) {
    vnode = '';
  }

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  }

  if (typeof vnode === 'string') {
    out = diffString(dom, vnode);
  } // 对比dom节点


  if (typeof vnode.tag === 'string') {
    out = diffDOM(dom, vnode);
  } // 如果节点是个component实例


  if (typeof vnode.tag === 'function') {
    out = diffComponent(dom, vnode);
  }

  if (vnode.attrs) {
    diffAttributes(out, vnode.attrs);
  }

  if (vnode.children && vnode.children.length) {
    console.log(vnode);
    diffChildren(out, vnode.children);
  }

  if (container && out.parentNode !== container) {
    container.appendChild && container.appendChild(out);
  }

  return out;
}

function diffAttributes(dom, attrs) {
  var oldAttrs = {};
  var newAttrs = attrs || {};

  if (dom && dom.attributes) {
    Array.from(dom.attributes).forEach(function (attr) {
      oldAttrs[attr.name] = attr.value;
    });
  }

  for (var attr in oldAttrs) {
    if (!attr in newAttrs) {
      (0, _dom.setAttribute)(dom, attr, undefined);
    }
  }

  for (var _attr in newAttrs) {
    if (newAttrs[_attr] !== oldAttrs[_attr]) {
      (0, _dom.setAttribute)(dom, _attr, newAttrs[_attr]);
    }
  }
}
/**
 * @param {HTMLElement} dom dom节点
 * @param {Array[VNode]} vchildren vnode节点
 */


function diffChildren(dom, vchildren) {
  var notKeyedChildren = []; // 没有key的child

  var keyed = {}; // 有key的child
  // 分离有key和没有key的child，因为如果有key的话，可以更加方便的对比

  Array.from(dom.childNodes).forEach(function (child) {
    if (child.key) {
      keyed[key] = children;
    } else {
      notKeyedChildren.push(child);
    }
  }); // 遍历所有vchildren

  if (vchildren && vchildren.length > 0) {
    vchildren.forEach(function (vchild, i) {
      var key = vchild && vchild.key;
      var findedChild;

      if (key) {
        if (keyed[key]) {
          findedChild = keyed[key];
          keyed[key] = undefined;
        }
      } else {
        notKeyedChildren.forEach(function (child, index) {
          if (isSameNodeType(child, vchild)) {
            findedChild = child;
            notKeyedChildren.splice(index, 1);
          }
        });
      }

      if (!findedChild) {
        findedChild = notKeyedChildren.shift();
      }

      diff(findedChild, vchild, dom);
    });
  }
}

function diffComponent(dom, vnode) {
  var out = dom;
  var component = dom && dom._component;

  if (component && component.constructor === vnode.tag) {
    out = (0, _component.setComponentProps)(component, vnode.attrs);
    dom = component.base;
  } else {
    if (component) {
      (0, _component.unmountComponent)(component);
    }

    component = (0, _component.createComponent)(vnode.tag);
    out = (0, _component.setComponentProps)(component, vnode.attrs);
  }

  return out;
}

function diffString(dom, vnode) {
  var out = dom;

  if (dom && dom.nodeType === 3) {
    if (dom.nodeValue != vnode) {
      dom.nodeValue = vnode;
    }
  } else {
    out = document.createTextNode(vnode);

    if (dom && dom.parentNode) {
      dom.parentNode.replaceChild(out, dom);
    }
  }

  return out;
}

function diffDOM(dom, vnode) {
  var out = dom;

  if (!dom || vnode.tag.toLowerCase() !== dom.nodeName.toLowerCase()) {
    out = document.createElement(vnode.tag);

    if (dom && dom.childNodes) {
      dom.childNodes.forEach(out.appendChild);
    }

    if (dom && dom.parnetNode) {
      dom.parnetNode.replaceChild(out, dom);
    }
  }

  return out;
}
},{"./component":"react-dom/component.js","./dom":"react-dom/dom.js"}],"react-dom/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponent = createComponent;
exports.renderComponent = renderComponent;
exports.unmountComponent = unmountComponent;
exports.setComponentProps = setComponentProps;
exports.enqueueSetState = enqueueSetState;

var _diff = _interopRequireDefault(require("./diff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description 实例化组件
 * @param {function} Constructor vnode.tagName
 * @param {object} props vnode.attrs
 * @return {'import ../react/component'.instance} Constrcutor instance
 */
function createComponent(Constructor, props) {
  var inst;

  if (Constructor.prototype && Constructor.prototype.render) {
    inst = new Constructor();
  } else {
    inst = new Constructor();
    inst.constructor = Constructor;

    inst.render = function () {
      return inst.constructor(props);
    };
  }

  return inst;
}
/**
 * @description 渲染组件
 * @param {'import ../react/component'.instance} component
 * @return dom
 */


function renderComponent(component, isForceUpdate) {
  var isUpdate = !!component.base;
  var props = component.props,
      state = component.state,
      prevState = component.prevState || state,
      prevProps = component.prevProps || props;

  if (component.constructor.getDerivedStateFromProps) {
    Object.assign(component.state, component.constructor.getDerivedStateFromProps(props, prevState));
  }

  var skip = false;
  var base = component.base;

  if (isUpdate) {
    component.props = prevProps;
    component.state = prevState;

    if (!isForceUpdate && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state) === false) {
      skip = true;
    }

    component.props = props;
    component.state = state;
  }

  if (!skip) {
    var vnode = component.render();
    base = (0, _diff.default)(component.base, vnode, props);
    component.base = base;
    component.base._component = component;

    if (isUpdate) {
      component.componentDidUpdate && component.componentDidUpdate(prevProps, prevState);
    } else {
      component.componentDidMount && component.componentDidMount();
    }

    component.prevProps = component.props;
    component.prevState = component.state;
  }

  return base;
}

function unmountComponent(component) {
  if (component.componentWillUnMount) {
    component.componentWillUnMount();
  }

  if (component.base && component.base.parnetNode) {
    component.base._component = null;
    component.base.parnetNode.removeChild(component.base);
  }
}

function setComponentProps(component, props) {
  component.props = props || {};
  return renderComponent(component);
}

var stateQueue = [];
var renderQueue = [];

function enqueueSetState(stateChange, component) {
  if (stateQueue.length === 0) {
    Promise.resolve().then(flushComponent);
  }

  stateQueue.push({
    stateChange: stateChange,
    component: component
  });

  if (!renderQueue.includes(component)) {
    renderQueue.push(component);
  }
}

function flushComponent() {
  var item;

  while (item = stateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component;

    if (!_component.prevState) {
      _component.prevState = Object.assign({}, _component.state);
    }

    Object.assign(_component.state, typeof stateChange === 'function' ? stateChange(_component.prevState, _component.props) : stateChange);
    _component.prevState = _component.state;
  }

  var component;

  while (component = renderQueue.shift()) {
    renderComponent(component);
  }
}
},{"./diff":"react-dom/diff.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = require("../react-dom/component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component =
/*#__PURE__*/
function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.state = {};
    this.props = props;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(state) {
      (0, _component.enqueueSetState)(state, this);
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      (0, _component.renderComponent)(this, true);
    }
  }]);

  return Component;
}();

exports.default = Component;
},{"../react-dom/component":"react-dom/component.js"}],"react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createElement = _interopRequireDefault(require("./create-element"));

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
var _default = {
  createElement: _createElement.default,
  Component: _component.default
};
exports.default = _default;
},{"./create-element":"react/create-element.js","./component":"react/component.js"}],"react-dom/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _diff = _interopRequireDefault(require("./diff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(vnode, container) {
  (0, _diff.default)(null, vnode, container);
}
},{"./diff":"react-dom/diff.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  render: _render.default
};
exports.default = _default;
},{"./render":"react-dom/render.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Title =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Title, _React$Component);

  function Title() {
    _classCallCheck(this, Title);

    return _possibleConstructorReturn(this, _getPrototypeOf(Title).apply(this, arguments));
  }

  _createClass(Title, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("h1", null, this.props.text);
    }
  }]);

  return Title;
}(_react.default.Component);

var App =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.state = {
      greet: 'Hello',
      name: 'xiao han',
      count: 0
    };
    _this.handleAdd = _this.handleAdd.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(App, [{
    key: "shoudComponentUpdate",
    value: function shoudComponentUpdate(nextProps, nextState) {
      console.log('should update');
      return true;
    } // render之后的生命周期

  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps, prevState) {
      console.log('get snapshot');
      return null;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount(prevProps, prevState) {
      var _this2 = this;

      console.log('did mount');
      setTimeout(function () {
        _this2.setState({
          name: 'xiao ming'
        });
      }, 1000);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      console.log('did update');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      console.log('i will be die');
    }
  }, {
    key: "handleAdd",
    value: function handleAdd() {
      this.setState({
        count: this.state.count + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          greet = _this$state.greet,
          name = _this$state.name,
          count = _this$state.count;
      return _react.default.createElement("div", {
        id: 'app'
      }, _react.default.createElement(Title, {
        text: greet
      }), _react.default.createElement("p", null, "My name is ", name), _react.default.createElement(Title, {
        text: 'count is ' + count
      }), _react.default.createElement("button", {
        onClick: this.handleAdd
      }, "add Count"));
    }
  }]);

  return App;
}(_react.default.Component);

_reactDom.default.render(_react.default.createElement(App, null), document.getElementById('root'));
},{"./react":"react/index.js","./react-dom":"react-dom/index.js"}],"node_modules/_parcel-bundler@1.11.0@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52045" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/_parcel-bundler@1.11.0@parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/do-react.e31bb0bc.map