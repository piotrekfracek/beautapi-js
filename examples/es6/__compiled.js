(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "Posts": {
    "get":          "/posts/:id",
    "post":         "/posts",
    "put":          "/posts/:id",
    "patch":        "/posts/:id",
    "delete":       "/posts/:id",
    "getByUserId": ["/posts?userId=:userId", {"method": "GET"}],
    "Comments": {
      "get":  "/posts/:id/comments"
    }
  }
}

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _src = require("../../src/");

var _src2 = _interopRequireDefault(_src);

var _api = require("../api.json");

var _api2 = _interopRequireDefault(_api);

var _post = require("./post.es6");

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = (function () {
  function Main() {
    _classCallCheck(this, Main);

    this.API = _src2.default.parse(_api2.default, {
      endpointPrefix: "http://jsonplaceholder.typicode.com",
      thenChain: [_src2.default.helpers.throwErrors, _src2.default.helpers.parseJSON]
    });

    this.loadPostByUserId(3);
  }

  _createClass(Main, [{
    key: "loadPostByUserId",
    value: function loadPostByUserId(userId) {
      return this.API.Posts.getByUserId({ userId: userId }).then(_src2.default.helpers.mapTo(_post2.default)).then(function (posts) {
        console.log("Posts", posts);
      });
    }
  }]);

  return Main;
})();

new Main();

},{"../../src/":11,"../api.json":1,"./post.es6":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Post = function Post(_ref) {
  var id = _ref.id;
  var userId = _ref.userId;
  var title = _ref.title;
  var body = _ref.body;

  _classCallCheck(this, Post);

  this.id = id;
  this.userId = userId;
  this.title = title;
  this.body = body;
  this.length = title.length + body.length;
};

exports.default = Post;

},{}],4:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require("./errors");

var _errors2 = _interopRequireDefault(_errors);

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

var _defaultConfig = require("./default-config");

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = (function () {
  function Api() {
    _classCallCheck(this, Api);
  }

  _createClass(Api, null, [{
    key: "parse",
    value: function parse(apiPrototype) {
      var userBeautapiConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!Object.assign) throw _errors2.default.cantFindObjectAssign;
      var beautapiConfig = Object.assign({}, _defaultConfig2.default, userBeautapiConfig);

      if (!_util2.default.isObject(userBeautapiConfig)) throw _errors2.default.configShouldBeObject;
      if (!_util2.default.isObject(apiPrototype)) throw _errors2.default.apiPrototypeShouldBeObject;
      if (!userBeautapiConfig.fetchReference && !window.fetch) throw _errors2.default.cantFindFetch;
      if (beautapiConfig.fetchReference && !_util2.default.isFunction(beautapiConfig.fetchReference)) throw _errors2.default.fetchReferenceShouldBeFunction;
      if (!_util2.default.isRegex(beautapiConfig.endpointRegex)) throw _errors2.default.invalidRegex;
      if (!_util2.default.isString(beautapiConfig.endpointPrefix)) throw _errors2.default.prefixShouldBeString;
      if (!_util2.default.isObject(beautapiConfig.fetchConfig)) throw _errors2.default.fetchConfigShouldBeObject;
      if (!_util2.default.isArray(beautapiConfig.thenChain)) throw _errors2.default.thenChainShouldBeArray;

      return Api.__parseApiPrototype(apiPrototype, {}, beautapiConfig);
    }
  }, {
    key: "__parseApiPrototype",
    value: function __parseApiPrototype(node, acc, beautapiConfig) {
      if (!_util2.default.isObject(node)) throw _errors2.default.traversingApiObject;
      for (var key in node) {
        if (_util2.default.isObject(node[key])) {
          Api.__parseApiPrototype(node[key], acc[key] = {}, beautapiConfig);
        } else {
          var _Api$__getEndpointWit = Api.__getEndpointWithFetchConfig(node[key]);

          var _Api$__getEndpointWit2 = _slicedToArray(_Api$__getEndpointWit, 2);

          var endpoint = _Api$__getEndpointWit2[0];
          var endpointFetchConfig = _Api$__getEndpointWit2[1];

          var requestTypeByMethodName = Api.__getRequestTypeByMethodName(key);
          var prefixedEndpoint = Api.__prefixEndpoint(beautapiConfig.endpointPrefix, endpoint);
          var combinedFetchConfig = Object.assign({ method: requestTypeByMethodName }, beautapiConfig.fetchConfig, endpointFetchConfig);
          var fetchReference = beautapiConfig.fetchReference || fetch;
          acc[key] = Api.__provideFunction({
            endpoint: prefixedEndpoint,
            fetchConfig: combinedFetchConfig,
            fetchReference: fetchReference,
            endpointRegex: beautapiConfig.endpointRegex,
            thenFunctionsChain: beautapiConfig.thenChain
          });
        }
      }
      return acc;
    }
  }, {
    key: "__provideFunction",
    value: function __provideFunction(_ref) {
      var endpoint = _ref.endpoint;
      var fetchConfig = _ref.fetchConfig;
      var fetchReference = _ref.fetchReference;
      var endpointRegex = _ref.endpointRegex;
      var thenFunctionsChain = _ref.thenFunctionsChain;

      return function (params, invokeFetchConfig) {
        if (!_util2.default.isObject(params) && params !== undefined) throw _errors2.default.paramsShouldBeObject;
        if (!_util2.default.isObject(invokeFetchConfig) && invokeFetchConfig !== undefined) throw _errors2.default.fetchConfigShouldBeObject;
        var parameterizedEndpoint = Api.__parameterizeEndpoint(endpoint, params, endpointRegex);
        var combinedFetchConfig = Object.assign(fetchConfig, invokeFetchConfig);
        var fetchPromise = fetchReference(parameterizedEndpoint, combinedFetchConfig);
        return Api.__runChainOfThenFunctionsOnPromise(fetchPromise, thenFunctionsChain);
      };
    }
  }, {
    key: "__runChainOfThenFunctionsOnPromise",
    value: function __runChainOfThenFunctionsOnPromise(fetchPromise, thenFunctionsChain) {
      return thenFunctionsChain.reduce(function (promise, method) {
        return promise.then(method);
      }, fetchPromise);
    }
  }, {
    key: "__getEndpointWithFetchConfig",
    value: function __getEndpointWithFetchConfig(node) {
      if (!(_util2.default.isString(node) || _util2.default.isArray(node) && _util2.default.isString(node[0]))) throw _errors2.default.invalidEndpointNode;
      return _util2.default.isArray(node) ? node : [node, {}];
    }
  }, {
    key: "__prefixEndpoint",
    value: function __prefixEndpoint() {
      var prefix = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
      var endpoint = arguments[1];

      return "" + prefix + endpoint;
    }
  }, {
    key: "__parameterizeEndpoint",
    value: function __parameterizeEndpoint(endpoint, params, regex) {
      return endpoint.replace(regex, function (_, paramIndicator) {
        return params ? params[paramIndicator] || "" : "";
      });
    }
  }, {
    key: "__getRequestTypeByMethodName",
    value: function __getRequestTypeByMethodName(methodName) {
      var isNameRequestType = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH"].indexOf(methodName.toUpperCase()) != -1;
      return isNameRequestType ? methodName.toUpperCase() : "GET";
    }
  }]);

  return Api;
})();

exports.default = Api;

},{"./default-config":5,"./errors":6,"./util":12}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  endpointRegex: /(?:\:)([a-zA-Z]([a-zA-Z0-9]|-|_)*)/g,
  endpointPrefix: "",
  fetchReference: undefined,
  fetchConfig: {},
  thenChain: []
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  paramsShouldBeObject: new TypeError("Params should be an object or undefined."),
  endpointShouldBeObject: new TypeError("Endpoint is required and should be a string."),
  invalidRegex: new TypeError("Can't provide endpoint. Invalid regex."),
  invalidEndpointNode: new TypeError("Endpoint node (leaf) should be a string or an array with a string and an object"),
  traversingApiObject: new TypeError("Error when traversing api object. Expected object."),
  apiPrototypeShouldBeObject: new TypeError("Api prototype should be an object"),
  configShouldBeObject: new TypeError("Provided config should be an object"),
  prefixShouldBeString: new TypeError("Provided prefix should be a string"),
  fetchReferenceShouldBeFunction: new TypeError("Fetch reference should be a function"),
  fetchConfigShouldBeObject: new TypeError("Fetch config should be an object"),
  thenChainShouldBeArray: new TypeError("Then functions chain should be an array of functions"),

  cantFindFetch: new ReferenceError("Can't find fetch function. Please provide fetch polyfill"),
  cantFindObjectAssign: new ReferenceError("Can't find Object.assign function. Please provide Object.assign polyfill")
};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (prototype) {
  return function (response) {
    return new prototype(response);
  };
};

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (prototype) {
  return function (response) {
    return response.map(function (obj) {
      return new prototype(obj);
    });
  };
};

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (response) {
  return response.json();
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

var _parseJSON = require("./helpers/parseJSON");

var _parseJSON2 = _interopRequireDefault(_parseJSON);

var _mapTo = require("./helpers/mapTo");

var _mapTo2 = _interopRequireDefault(_mapTo);

var _decorateTo = require("./helpers/decorateTo");

var _decorateTo2 = _interopRequireDefault(_decorateTo);

var _throwErrors = require("./helpers/throwErrors");

var _throwErrors2 = _interopRequireDefault(_throwErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  parse: _api2.default.parse,
  helpers: {
    parseJSON: _parseJSON2.default,
    mapTo: _mapTo2.default,
    decorateTo: _decorateTo2.default,
    throwErrors: _throwErrors2.default
  }
};

},{"./api":4,"./helpers/decorateTo":7,"./helpers/mapTo":8,"./helpers/parseJSON":9,"./helpers/throwErrors":10}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

exports.default = {
  isObject: function isObject(variable) {
    return (typeof variable === "undefined" ? "undefined" : _typeof(variable)) === "object" && !(variable instanceof Array) && variable !== null;
  },

  isString: function isString(variable) {
    return typeof variable === "string";
  },

  isArray: function isArray(variable) {
    return variable instanceof Array;
  },

  isRegex: function isRegex(variable) {
    return variable instanceof RegExp;
  },

  isFunction: function isFunction(variable) {
    return typeof variable === "function";
  }

};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9hcGkuanNvbiIsImV4YW1wbGVzL2VzNi9pbmRleC5lczYiLCJleGFtcGxlcy9lczYvcG9zdC5lczYiLCJzcmMvYXBpLmpzIiwic3JjL2RlZmF1bHQtY29uZmlnLmpzIiwic3JjL2Vycm9ycy5qcyIsInNyYy9oZWxwZXJzL2RlY29yYXRlVG8uanMiLCJzcmMvaGVscGVycy9tYXBUby5qcyIsInNyYy9oZWxwZXJzL3BhcnNlSlNPTi5qcyIsInNyYy9oZWxwZXJzL3Rocm93RXJyb3JzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDVE0sSUFBSTtBQUVSLFdBRkksSUFBSSxHQUVNOzBCQUZWLElBQUk7O0FBR04sUUFBSSxDQUFDLEdBQUcsR0FBRyxjQUFTLEtBQUssZ0JBQVM7QUFDaEMsb0JBQWMsRUFBRSxxQ0FBcUM7QUFDckQsZUFBUyxFQUFFLENBQ1QsY0FBUyxPQUFPLENBQUMsV0FBVyxFQUM1QixjQUFTLE9BQU8sQ0FBQyxTQUFTLENBQzNCO0tBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUMxQjs7ZUFaRyxJQUFJOztxQ0FjUyxNQUFNLEVBQUM7QUFDdEIsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FDaEQsSUFBSSxDQUFDLGNBQVMsT0FBTyxDQUFDLEtBQUssZ0JBQU0sQ0FBQyxDQUNsQyxJQUFJLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFD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YTtBQUN0QixTQUFLLGlCQUFhO0FBQ2xCLGNBQVUsc0JBQWE7QUFDdkIsZUFBVyx1QkFBYTtHQUN6QjtDQUNGOzs7Ozs7Ozs7OztrQkNkYztBQUNiLFVBQVEsRUFBRSxrQkFBUyxRQUFRLEVBQUU7QUFDM0IsV0FBTyxRQUFPLFFBQVEseUNBQVIsUUFBUSxPQUFLLFFBQVEsSUFBSSxFQUFFLFFBQVEsWUFBWSxLQUFLLENBQUEsQUFBQyxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUM7R0FDMUY7O0FBRUQsVUFBUSxFQUFFLGtCQUFTLFFBQVEsRUFBRTtBQUMzQixXQUFPLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQTtHQUNwQzs7QUFFRCxTQUFPLEVBQUUsaUJBQVMsUUFBUSxFQUFFO0FBQzFCLFdBQU8sUUFBUSxZQUFZLEtBQUssQ0FBQztHQUNsQzs7QUFFRCxTQUFPLEVBQUUsaUJBQVMsUUFBUSxFQUFFO0FBQzFCLFdBQU8sUUFBUSxZQUFZLE1BQU0sQ0FBQztHQUNuQzs7QUFFRCxZQUFVLEVBQUUsb0JBQVMsUUFBUSxFQUFFO0FBQzdCLFdBQU8sT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFBO0dBQ3RDOztDQUVGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJQb3N0c1wiOiB7XG4gICAgXCJnZXRcIjogICAgICAgICAgXCIvcG9zdHMvOmlkXCIsXG4gICAgXCJwb3N0XCI6ICAgICAgICAgXCIvcG9zdHNcIixcbiAgICBcInB1dFwiOiAgICAgICAgICBcIi9wb3N0cy86aWRcIixcbiAgICBcInBhdGNoXCI6ICAgICAgICBcIi9wb3N0cy86aWRcIixcbiAgICBcImRlbGV0ZVwiOiAgICAgICBcIi9wb3N0cy86aWRcIixcbiAgICBcImdldEJ5VXNlcklkXCI6IFtcIi9wb3N0cz91c2VySWQ9OnVzZXJJZFwiLCB7XCJtZXRob2RcIjogXCJHRVRcIn1dLFxuICAgIFwiQ29tbWVudHNcIjoge1xuICAgICAgXCJnZXRcIjogIFwiL3Bvc3RzLzppZC9jb21tZW50c1wiXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQmVhdXRhcGkgZnJvbSBcIi4uLy4uL3NyYy9cIjtcbmltcG9ydCByb3V0ZXMgICBmcm9tIFwiLi4vYXBpLmpzb25cIjtcbmltcG9ydCBQb3N0ICAgICBmcm9tIFwiLi9wb3N0LmVzNlwiO1xuXG5jbGFzcyBNYWluIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkFQSSA9IEJlYXV0YXBpLnBhcnNlKHJvdXRlcywge1xuICAgICAgZW5kcG9pbnRQcmVmaXg6IFwiaHR0cDovL2pzb25wbGFjZWhvbGRlci50eXBpY29kZS5jb21cIixcbiAgICAgIHRoZW5DaGFpbjogW1xuICAgICAgICBCZWF1dGFwaS5oZWxwZXJzLnRocm93RXJyb3JzLFxuICAgICAgICBCZWF1dGFwaS5oZWxwZXJzLnBhcnNlSlNPTlxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdGhpcy5sb2FkUG9zdEJ5VXNlcklkKDMpO1xuICB9XG5cbiAgbG9hZFBvc3RCeVVzZXJJZCh1c2VySWQpe1xuICAgIHJldHVybiB0aGlzLkFQSS5Qb3N0cy5nZXRCeVVzZXJJZCh7dXNlcklkOiB1c2VySWR9KVxuICAgICAgLnRoZW4oQmVhdXRhcGkuaGVscGVycy5tYXBUbyhQb3N0KSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHBvc3RzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zdHNcIiwgcG9zdHMpO1xuICAgICAgfSk7XG4gIH1cblxufVxuXG5uZXcgTWFpbigpOyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvc3Qge1xuICBjb25zdHJ1Y3Rvcih7aWQsIHVzZXJJZCwgdGl0bGUsIGJvZHl9KSB7XG4gICAgdGhpcy5pZCAgICAgPSBpZDtcbiAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB0aGlzLnRpdGxlICA9IHRpdGxlO1xuICAgIHRoaXMuYm9keSAgID0gYm9keTtcbiAgICB0aGlzLmxlbmd0aCA9IHRpdGxlLmxlbmd0aCArIGJvZHkubGVuZ3RoO1xuICB9XG59IiwiaW1wb3J0IEVycm9ycyAgICAgICAgZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQgVXRpbCAgICAgICAgICBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgRGVmYXVsdENvbmZpZyBmcm9tIFwiLi9kZWZhdWx0LWNvbmZpZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcGkge1xuXG4gIHN0YXRpYyBwYXJzZShhcGlQcm90b3R5cGUsIHVzZXJCZWF1dGFwaUNvbmZpZyA9IHt9KSB7XG4gICAgaWYoIU9iamVjdC5hc3NpZ24pIHRocm93IEVycm9ycy5jYW50RmluZE9iamVjdEFzc2lnbjtcbiAgICBjb25zdCBiZWF1dGFwaUNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRDb25maWcsIHVzZXJCZWF1dGFwaUNvbmZpZyk7XG5cbiAgICBpZighVXRpbC5pc09iamVjdCh1c2VyQmVhdXRhcGlDb25maWcpKSAgICAgICAgICAgICAgICAgIHRocm93IEVycm9ycy5jb25maWdTaG91bGRCZU9iamVjdDtcbiAgICBpZighVXRpbC5pc09iamVjdChhcGlQcm90b3R5cGUpKSAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9ycy5hcGlQcm90b3R5cGVTaG91bGRCZU9iamVjdDtcbiAgICBpZighdXNlckJlYXV0YXBpQ29uZmlnLmZldGNoUmVmZXJlbmNlICYmICF3aW5kb3cuZmV0Y2gpIHRocm93IEVycm9ycy5jYW50RmluZEZldGNoO1xuICAgIGlmKGJlYXV0YXBpQ29uZmlnLmZldGNoUmVmZXJlbmNlICYmXG4gICAgICAgIVV0aWwuaXNGdW5jdGlvbihiZWF1dGFwaUNvbmZpZy5mZXRjaFJlZmVyZW5jZSkpICAgICB0aHJvdyBFcnJvcnMuZmV0Y2hSZWZlcmVuY2VTaG91bGRCZUZ1bmN0aW9uO1xuICAgIGlmKCFVdGlsLmlzUmVnZXgoYmVhdXRhcGlDb25maWcuZW5kcG9pbnRSZWdleCkpICAgICAgICAgdGhyb3cgRXJyb3JzLmludmFsaWRSZWdleDtcbiAgICBpZighVXRpbC5pc1N0cmluZyhiZWF1dGFwaUNvbmZpZy5lbmRwb2ludFByZWZpeCkpICAgICAgIHRocm93IEVycm9ycy5wcmVmaXhTaG91bGRCZVN0cmluZztcbiAgICBpZighVXRpbC5pc09iamVjdChiZWF1dGFwaUNvbmZpZy5mZXRjaENvbmZpZykpICAgICAgICAgIHRocm93IEVycm9ycy5mZXRjaENvbmZpZ1Nob3VsZEJlT2JqZWN0O1xuICAgIGlmKCFVdGlsLmlzQXJyYXkoYmVhdXRhcGlDb25maWcudGhlbkNoYWluKSkgICAgICAgICAgICAgdGhyb3cgRXJyb3JzLnRoZW5DaGFpblNob3VsZEJlQXJyYXk7XG5cbiAgICByZXR1cm4gQXBpLl9fcGFyc2VBcGlQcm90b3R5cGUoYXBpUHJvdG90eXBlLCB7fSwgYmVhdXRhcGlDb25maWcpO1xuICB9XG5cbiAgc3RhdGljIF9fcGFyc2VBcGlQcm90b3R5cGUobm9kZSwgYWNjLCBiZWF1dGFwaUNvbmZpZykge1xuICAgIGlmKCFVdGlsLmlzT2JqZWN0KG5vZGUpKSB0aHJvdyBFcnJvcnMudHJhdmVyc2luZ0FwaU9iamVjdDtcbiAgICBmb3IobGV0IGtleSBpbiBub2RlKSB7XG4gICAgICBpZihVdGlsLmlzT2JqZWN0KG5vZGVba2V5XSkpIHtcbiAgICAgICAgQXBpLl9fcGFyc2VBcGlQcm90b3R5cGUobm9kZVtrZXldLCBhY2Nba2V5XSA9IHt9LCBiZWF1dGFwaUNvbmZpZyk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgY29uc3QgW2VuZHBvaW50LCBlbmRwb2ludEZldGNoQ29uZmlnXSA9IEFwaS5fX2dldEVuZHBvaW50V2l0aEZldGNoQ29uZmlnKG5vZGVba2V5XSk7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RUeXBlQnlNZXRob2ROYW1lICAgICAgICAgPSBBcGkuX19nZXRSZXF1ZXN0VHlwZUJ5TWV0aG9kTmFtZShrZXkpO1xuICAgICAgICBjb25zdCBwcmVmaXhlZEVuZHBvaW50ICAgICAgICAgICAgICAgID0gQXBpLl9fcHJlZml4RW5kcG9pbnQoYmVhdXRhcGlDb25maWcuZW5kcG9pbnRQcmVmaXgsIGVuZHBvaW50KTtcbiAgICAgICAgY29uc3QgY29tYmluZWRGZXRjaENvbmZpZyAgICAgICAgICAgICA9IE9iamVjdC5hc3NpZ24oe21ldGhvZDogcmVxdWVzdFR5cGVCeU1ldGhvZE5hbWV9LCBiZWF1dGFwaUNvbmZpZy5mZXRjaENvbmZpZywgZW5kcG9pbnRGZXRjaENvbmZpZyk7XG4gICAgICAgIGNvbnN0IGZldGNoUmVmZXJlbmNlICAgICAgICAgICAgICAgICAgPSBiZWF1dGFwaUNvbmZpZy5mZXRjaFJlZmVyZW5jZSB8fCBmZXRjaDtcbiAgICAgICAgYWNjW2tleV0gPSBBcGkuX19wcm92aWRlRnVuY3Rpb24oe1xuICAgICAgICAgIGVuZHBvaW50OiAgICAgICAgICAgcHJlZml4ZWRFbmRwb2ludCxcbiAgICAgICAgICBmZXRjaENvbmZpZzogICAgICAgIGNvbWJpbmVkRmV0Y2hDb25maWcsXG4gICAgICAgICAgZmV0Y2hSZWZlcmVuY2U6ICAgICBmZXRjaFJlZmVyZW5jZSxcbiAgICAgICAgICBlbmRwb2ludFJlZ2V4OiAgICAgIGJlYXV0YXBpQ29uZmlnLmVuZHBvaW50UmVnZXgsXG4gICAgICAgICAgdGhlbkZ1bmN0aW9uc0NoYWluOiBiZWF1dGFwaUNvbmZpZy50aGVuQ2hhaW5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH1cblxuICBzdGF0aWMgX19wcm92aWRlRnVuY3Rpb24oe2VuZHBvaW50LCBmZXRjaENvbmZpZywgZmV0Y2hSZWZlcmVuY2UsIGVuZHBvaW50UmVnZXgsIHRoZW5GdW5jdGlvbnNDaGFpbn0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ocGFyYW1zLCBpbnZva2VGZXRjaENvbmZpZykge1xuICAgICAgaWYoIVV0aWwuaXNPYmplY3QocGFyYW1zKSAgICAgICAgICAgICYmIHBhcmFtcyAgICAgICAgICAgICE9PSB1bmRlZmluZWQpIHRocm93IEVycm9ycy5wYXJhbXNTaG91bGRCZU9iamVjdDtcbiAgICAgIGlmKCFVdGlsLmlzT2JqZWN0KGludm9rZUZldGNoQ29uZmlnKSAmJiBpbnZva2VGZXRjaENvbmZpZyAhPT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcnMuZmV0Y2hDb25maWdTaG91bGRCZU9iamVjdDtcbiAgICAgIGNvbnN0IHBhcmFtZXRlcml6ZWRFbmRwb2ludCA9IEFwaS5fX3BhcmFtZXRlcml6ZUVuZHBvaW50KGVuZHBvaW50LCBwYXJhbXMsIGVuZHBvaW50UmVnZXgpO1xuICAgICAgY29uc3QgY29tYmluZWRGZXRjaENvbmZpZyAgID0gT2JqZWN0LmFzc2lnbihmZXRjaENvbmZpZywgaW52b2tlRmV0Y2hDb25maWcpO1xuICAgICAgY29uc3QgZmV0Y2hQcm9taXNlICAgICAgICAgID0gZmV0Y2hSZWZlcmVuY2UocGFyYW1ldGVyaXplZEVuZHBvaW50LGNvbWJpbmVkRmV0Y2hDb25maWcpO1xuICAgICAgcmV0dXJuIEFwaS5fX3J1bkNoYWluT2ZUaGVuRnVuY3Rpb25zT25Qcm9taXNlKGZldGNoUHJvbWlzZSwgdGhlbkZ1bmN0aW9uc0NoYWluKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgX19ydW5DaGFpbk9mVGhlbkZ1bmN0aW9uc09uUHJvbWlzZShmZXRjaFByb21pc2UsIHRoZW5GdW5jdGlvbnNDaGFpbikge1xuICAgIHJldHVybiB0aGVuRnVuY3Rpb25zQ2hhaW4ucmVkdWNlKCgocHJvbWlzZSwgbWV0aG9kKSA9PiB7cmV0dXJuIHByb21pc2UudGhlbihtZXRob2QpfSksIGZldGNoUHJvbWlzZSk7XG4gIH1cblxuICBzdGF0aWMgX19nZXRFbmRwb2ludFdpdGhGZXRjaENvbmZpZyhub2RlKSB7XG4gICAgaWYoIShcbiAgICAgIFV0aWwuaXNTdHJpbmcobm9kZSkgfHxcbiAgICAgIChVdGlsLmlzQXJyYXkobm9kZSkgJiYgVXRpbC5pc1N0cmluZyhub2RlWzBdKSlcbiAgICApKSB0aHJvdyBFcnJvcnMuaW52YWxpZEVuZHBvaW50Tm9kZTtcbiAgICByZXR1cm4gVXRpbC5pc0FycmF5KG5vZGUpPyBub2RlIDogW25vZGUsIHt9XTtcbiAgfVxuXG4gIHN0YXRpYyBfX3ByZWZpeEVuZHBvaW50KHByZWZpeCA9IFwiXCIsIGVuZHBvaW50KSB7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0ke2VuZHBvaW50fWA7XG4gIH1cblxuICBzdGF0aWMgX19wYXJhbWV0ZXJpemVFbmRwb2ludChlbmRwb2ludCwgcGFyYW1zLCByZWdleCkge1xuICAgIHJldHVybiBlbmRwb2ludC5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihfLCBwYXJhbUluZGljYXRvcikge1xuICAgICAgcmV0dXJuIHBhcmFtcyA/IChwYXJhbXNbcGFyYW1JbmRpY2F0b3JdIHx8IFwiXCIpIDogXCJcIjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBfX2dldFJlcXVlc3RUeXBlQnlNZXRob2ROYW1lKG1ldGhvZE5hbWUpIHtcbiAgICBjb25zdCAgaXNOYW1lUmVxdWVzdFR5cGUgPSBbXCJERUxFVEVcIiwgXCJHRVRcIiwgXCJIRUFEXCIsIFwiT1BUSU9OU1wiLCBcIlBPU1RcIiwgXCJQVVRcIiwgXCJQQVRDSFwiXS5pbmRleE9mKG1ldGhvZE5hbWUudG9VcHBlckNhc2UoKSkgIT0gLTE7XG4gICAgcmV0dXJuIGlzTmFtZVJlcXVlc3RUeXBlID8gbWV0aG9kTmFtZS50b1VwcGVyQ2FzZSgpIDogXCJHRVRcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBlbmRwb2ludFJlZ2V4OiAgLyg/OlxcOikoW2EtekEtWl0oW2EtekEtWjAtOV18LXxfKSopL2csXG4gIGVuZHBvaW50UHJlZml4OiBcIlwiLFxuICBmZXRjaFJlZmVyZW5jZTogdW5kZWZpbmVkLFxuICBmZXRjaENvbmZpZzogICAge30sXG4gIHRoZW5DaGFpbjogICAgICBbXVxufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgcGFyYW1zU2hvdWxkQmVPYmplY3Q6ICAgICAgICAgICBuZXcgVHlwZUVycm9yKFwiUGFyYW1zIHNob3VsZCBiZSBhbiBvYmplY3Qgb3IgdW5kZWZpbmVkLlwiKSxcbiAgZW5kcG9pbnRTaG91bGRCZU9iamVjdDogICAgICAgICBuZXcgVHlwZUVycm9yKFwiRW5kcG9pbnQgaXMgcmVxdWlyZWQgYW5kIHNob3VsZCBiZSBhIHN0cmluZy5cIiksXG4gIGludmFsaWRSZWdleDogICAgICAgICAgICAgICAgICAgbmV3IFR5cGVFcnJvcihcIkNhbid0IHByb3ZpZGUgZW5kcG9pbnQuIEludmFsaWQgcmVnZXguXCIpLFxuICBpbnZhbGlkRW5kcG9pbnROb2RlOiAgICAgICAgICAgIG5ldyBUeXBlRXJyb3IoXCJFbmRwb2ludCBub2RlIChsZWFmKSBzaG91bGQgYmUgYSBzdHJpbmcgb3IgYW4gYXJyYXkgd2l0aCBhIHN0cmluZyBhbmQgYW4gb2JqZWN0XCIpLFxuICB0cmF2ZXJzaW5nQXBpT2JqZWN0OiAgICAgICAgICAgIG5ldyBUeXBlRXJyb3IoXCJFcnJvciB3aGVuIHRyYXZlcnNpbmcgYXBpIG9iamVjdC4gRXhwZWN0ZWQgb2JqZWN0LlwiKSxcbiAgYXBpUHJvdG90eXBlU2hvdWxkQmVPYmplY3Q6ICAgICBuZXcgVHlwZUVycm9yKFwiQXBpIHByb3RvdHlwZSBzaG91bGQgYmUgYW4gb2JqZWN0XCIpLFxuICBjb25maWdTaG91bGRCZU9iamVjdDogICAgICAgICAgIG5ldyBUeXBlRXJyb3IoXCJQcm92aWRlZCBjb25maWcgc2hvdWxkIGJlIGFuIG9iamVjdFwiKSxcbiAgcHJlZml4U2hvdWxkQmVTdHJpbmc6ICAgICAgICAgICBuZXcgVHlwZUVycm9yKFwiUHJvdmlkZWQgcHJlZml4IHNob3VsZCBiZSBhIHN0cmluZ1wiKSxcbiAgZmV0Y2hSZWZlcmVuY2VTaG91bGRCZUZ1bmN0aW9uOiBuZXcgVHlwZUVycm9yKFwiRmV0Y2ggcmVmZXJlbmNlIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpLFxuICBmZXRjaENvbmZpZ1Nob3VsZEJlT2JqZWN0OiAgICAgIG5ldyBUeXBlRXJyb3IoXCJGZXRjaCBjb25maWcgc2hvdWxkIGJlIGFuIG9iamVjdFwiKSxcbiAgdGhlbkNoYWluU2hvdWxkQmVBcnJheTogICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlbiBmdW5jdGlvbnMgY2hhaW4gc2hvdWxkIGJlIGFuIGFycmF5IG9mIGZ1bmN0aW9uc1wiKSxcblxuICBjYW50RmluZEZldGNoOiAgICAgICAgbmV3IFJlZmVyZW5jZUVycm9yKFwiQ2FuJ3QgZmluZCBmZXRjaCBmdW5jdGlvbi4gUGxlYXNlIHByb3ZpZGUgZmV0Y2ggcG9seWZpbGxcIiksXG4gIGNhbnRGaW5kT2JqZWN0QXNzaWduOiBuZXcgUmVmZXJlbmNlRXJyb3IoXCJDYW4ndCBmaW5kIE9iamVjdC5hc3NpZ24gZnVuY3Rpb24uIFBsZWFzZSBwcm92aWRlIE9iamVjdC5hc3NpZ24gcG9seWZpbGxcIiksXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIHJldHVybiBuZXcgcHJvdG90eXBlKHJlc3BvbnNlKTtcbiAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2UubWFwKGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG5ldyBwcm90b3R5cGUob2JqKTtcbiAgICB9KVxuICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyZXNwb25zZSkge1xuICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dClcbiAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufSIsImltcG9ydCBBcGkgICAgICAgICBmcm9tIFwiLi9hcGlcIjtcbmltcG9ydCBQYXJzZUpTT04gICBmcm9tIFwiLi9oZWxwZXJzL3BhcnNlSlNPTlwiO1xuaW1wb3J0IG1hcFRvICAgICAgIGZyb20gXCIuL2hlbHBlcnMvbWFwVG9cIjtcbmltcG9ydCBkZWNvcmF0ZVRvICBmcm9tIFwiLi9oZWxwZXJzL2RlY29yYXRlVG9cIjtcbmltcG9ydCB0aHJvd0Vycm9ycyBmcm9tIFwiLi9oZWxwZXJzL3Rocm93RXJyb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcGFyc2U6IEFwaS5wYXJzZSxcbiAgaGVscGVyczoge1xuICAgIHBhcnNlSlNPTjogICBQYXJzZUpTT04sXG4gICAgbWFwVG86ICAgICAgIG1hcFRvLFxuICAgIGRlY29yYXRlVG86ICBkZWNvcmF0ZVRvLFxuICAgIHRocm93RXJyb3JzOiB0aHJvd0Vycm9yc1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGlzT2JqZWN0OiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT09IFwib2JqZWN0XCIgJiYgISh2YXJpYWJsZSBpbnN0YW5jZW9mIEFycmF5KSAmJiB2YXJpYWJsZSAhPT0gbnVsbDtcbiAgfSxcblxuICBpc1N0cmluZzogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhcmlhYmxlID09PSBcInN0cmluZ1wiXG4gIH0sXG5cbiAgaXNBcnJheTogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICByZXR1cm4gdmFyaWFibGUgaW5zdGFuY2VvZiBBcnJheTtcbiAgfSxcblxuICBpc1JlZ2V4OiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgIHJldHVybiB2YXJpYWJsZSBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgfSxcblxuICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT09IFwiZnVuY3Rpb25cIlxuICB9XG5cbn0iXX0=
