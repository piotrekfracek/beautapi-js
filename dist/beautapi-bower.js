(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    value: function parse(model) {
      var userBeautapiConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!Object.assign) throw _errors2.default.cantFindObjectAssign;
      var beautapiConfig = Object.assign({}, _defaultConfig2.default, userBeautapiConfig);

      if (!_util2.default.isObject(userBeautapiConfig)) throw _errors2.default.configShouldBeObject;
      if (!_util2.default.isObject(model)) throw _errors2.default.modelShouldBeObject;
      if (!userBeautapiConfig.fetchReference && !window.fetch) throw _errors2.default.cantFindFetch;
      if (beautapiConfig.fetchReference && !_util2.default.isFunction(beautapiConfig.fetchReference)) throw _errors2.default.fetchReferenceShouldBeFunction;
      if (!_util2.default.isRegex(beautapiConfig.endpointRegex)) throw _errors2.default.invalidRegex;
      if (!_util2.default.isString(beautapiConfig.endpointPrefix)) throw _errors2.default.prefixShouldBeString;
      if (!_util2.default.isObject(beautapiConfig.fetchConfig)) throw _errors2.default.fetchConfigShouldBeObject;
      if (!_util2.default.isArray(beautapiConfig.thenChain)) throw _errors2.default.thenChainShouldBeArray;

      return Api.__parseModel(model, {}, beautapiConfig);
    }
  }, {
    key: "__parseModel",
    value: function __parseModel(node, acc, beautapiConfig) {
      if (!_util2.default.isObject(node)) throw _errors2.default.traversingApiObject;
      for (var key in node) {
        if (_util2.default.isObject(node[key])) {
          Api.__parseModel(node[key], acc[key] = {}, beautapiConfig);
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

},{"./default-config":3,"./errors":4,"./util":10}],2:[function(require,module,exports){
"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Beautapi = _index2.default;

},{"./index":9}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (prototype) {
  return function (response) {
    return new prototype(response);
  };
};

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (response) {
  return response.json();
};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./api":1,"./helpers/decorateTo":5,"./helpers/mapTo":6,"./helpers/parseJSON":7,"./helpers/throwErrors":8}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBpLmpzIiwic3JjL2Jvd2VyLmpzIiwic3JjL2RlZmF1bHQtY29uZmlnLmpzIiwic3JjL2Vycm9ycy5qcyIsInNyYy9oZWxwZXJzL2RlY29yYXRlVG8uanMiLCJzcmMvaGVscGVycy9tYXBUby5qcyIsInNyYy9oZWxwZXJzL3BhcnNlSlNPTi5qcyIsInNyYy9oZWxwZXJzL3Rocm93RXJyb3JzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0lxQixHQUFHO1dBQUgsR0FBRzswQkFBSCxHQUFHOzs7ZUFBSCxHQUFHOzswQkFFVCxLQUFLLEVBQTJCO1VBQXpCLGtCQUFrQix5REFBRyxFQUFFOztBQUN6QyxVQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLGlCQUFPLG9CQUFvQixDQUFDO0FBQ3JELFVBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSwyQkFBaUIsa0JBQWtCLENBQUMsQ0FBQzs7QUFFNUUsVUFBRyxDQUFDLGVBQUssUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQW1CLE1BQU0saUJBQU8sb0JBQW9CLENBQUM7QUFDMUYsVUFBRyxDQUFDLGVBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFnQyxNQUFNLGlCQUFPLG1CQUFtQixDQUFDO0FBQ3pGLFVBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0saUJBQU8sYUFBYSxDQUFDO0FBQ25GLFVBQUcsY0FBYyxDQUFDLGNBQWMsSUFDN0IsQ0FBQyxlQUFLLFVBQVUsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQU0sTUFBTSxpQkFBTyw4QkFBOEIsQ0FBQztBQUNwRyxVQUFH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TyxRQUFPLFFBQVEseUNBQVIsUUFBUSxPQUFLLFFBQVEsSUFBSSxFQUFFLFFBQVEsWUFBWSxLQUFLLENBQUEsQUFBQyxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUM7R0FDMUY7O0FBRUQsVUFBUSxFQUFFLGtCQUFTLFFBQVEsRUFBRTtBQUMzQixXQUFPLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQTtHQUNwQzs7QUFFRCxTQUFPLEVBQUUsaUJBQVMsUUFBUSxFQUFFO0FBQzFCLFdBQU8sUUFBUSxZQUFZLEtBQUssQ0FBQztHQUNsQzs7QUFFRCxTQUFPLEVBQUUsaUJBQVMsUUFBUSxFQUFFO0FBQzFCLFdBQU8sUUFBUSxZQUFZLE1BQU0sQ0FBQztHQUNuQzs7QUFFRCxZQUFVLEVBQUUsb0JBQVMsUUFBUSxFQUFFO0FBQzdCLFdBQU8sT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFBO0dBQ3RDOztDQUVGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBFcnJvcnMgICAgICAgIGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IFV0aWwgICAgICAgICAgZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IERlZmF1bHRDb25maWcgZnJvbSBcIi4vZGVmYXVsdC1jb25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBpIHtcblxuICBzdGF0aWMgcGFyc2UobW9kZWwsIHVzZXJCZWF1dGFwaUNvbmZpZyA9IHt9KSB7XG4gICAgaWYoIU9iamVjdC5hc3NpZ24pIHRocm93IEVycm9ycy5jYW50RmluZE9iamVjdEFzc2lnbjtcbiAgICBjb25zdCBiZWF1dGFwaUNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRDb25maWcsIHVzZXJCZWF1dGFwaUNvbmZpZyk7XG5cbiAgICBpZighVXRpbC5pc09iamVjdCh1c2VyQmVhdXRhcGlDb25maWcpKSAgICAgICAgICAgICAgICAgIHRocm93IEVycm9ycy5jb25maWdTaG91bGRCZU9iamVjdDtcbiAgICBpZighVXRpbC5pc09iamVjdChtb2RlbCkpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9ycy5tb2RlbFNob3VsZEJlT2JqZWN0O1xuICAgIGlmKCF1c2VyQmVhdXRhcGlDb25maWcuZmV0Y2hSZWZlcmVuY2UgJiYgIXdpbmRvdy5mZXRjaCkgdGhyb3cgRXJyb3JzLmNhbnRGaW5kRmV0Y2g7XG4gICAgaWYoYmVhdXRhcGlDb25maWcuZmV0Y2hSZWZlcmVuY2UgJiZcbiAgICAgICAhVXRpbC5pc0Z1bmN0aW9uKGJlYXV0YXBpQ29uZmlnLmZldGNoUmVmZXJlbmNlKSkgICAgIHRocm93IEVycm9ycy5mZXRjaFJlZmVyZW5jZVNob3VsZEJlRnVuY3Rpb247XG4gICAgaWYoIVV0aWwuaXNSZWdleChiZWF1dGFwaUNvbmZpZy5lbmRwb2ludFJlZ2V4KSkgICAgICAgICB0aHJvdyBFcnJvcnMuaW52YWxpZFJlZ2V4O1xuICAgIGlmKCFVdGlsLmlzU3RyaW5nKGJlYXV0YXBpQ29uZmlnLmVuZHBvaW50UHJlZml4KSkgICAgICAgdGhyb3cgRXJyb3JzLnByZWZpeFNob3VsZEJlU3RyaW5nO1xuICAgIGlmKCFVdGlsLmlzT2JqZWN0KGJlYXV0YXBpQ29uZmlnLmZldGNoQ29uZmlnKSkgICAgICAgICAgdGhyb3cgRXJyb3JzLmZldGNoQ29uZmlnU2hvdWxkQmVPYmplY3Q7XG4gICAgaWYoIVV0aWwuaXNBcnJheShiZWF1dGFwaUNvbmZpZy50aGVuQ2hhaW4pKSAgICAgICAgICAgICB0aHJvdyBFcnJvcnMudGhlbkNoYWluU2hvdWxkQmVBcnJheTtcblxuICAgIHJldHVybiBBcGkuX19wYXJzZU1vZGVsKG1vZGVsLCB7fSwgYmVhdXRhcGlDb25maWcpO1xuICB9XG5cbiAgc3RhdGljIF9fcGFyc2VNb2RlbChub2RlLCBhY2MsIGJlYXV0YXBpQ29uZmlnKSB7XG4gICAgaWYoIVV0aWwuaXNPYmplY3Qobm9kZSkpIHRocm93IEVycm9ycy50cmF2ZXJzaW5nQXBpT2JqZWN0O1xuICAgIGZvcihsZXQga2V5IGluIG5vZGUpIHtcbiAgICAgIGlmKFV0aWwuaXNPYmplY3Qobm9kZVtrZXldKSkge1xuICAgICAgICBBcGkuX19wYXJzZU1vZGVsKG5vZGVba2V5XSwgYWNjW2tleV0gPSB7fSwgYmVhdXRhcGlDb25maWcpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGNvbnN0IFtlbmRwb2ludCwgZW5kcG9pbnRGZXRjaENvbmZpZ10gPSBBcGkuX19nZXRFbmRwb2ludFdpdGhGZXRjaENvbmZpZyhub2RlW2tleV0pO1xuICAgICAgICBjb25zdCByZXF1ZXN0VHlwZUJ5TWV0aG9kTmFtZSAgICAgICAgID0gQXBpLl9fZ2V0UmVxdWVzdFR5cGVCeU1ldGhvZE5hbWUoa2V5KTtcbiAgICAgICAgY29uc3QgcHJlZml4ZWRFbmRwb2ludCAgICAgICAgICAgICAgICA9IEFwaS5fX3ByZWZpeEVuZHBvaW50KGJlYXV0YXBpQ29uZmlnLmVuZHBvaW50UHJlZml4LCBlbmRwb2ludCk7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkRmV0Y2hDb25maWcgICAgICAgICAgICAgPSBPYmplY3QuYXNzaWduKHttZXRob2Q6IHJlcXVlc3RUeXBlQnlNZXRob2ROYW1lfSwgYmVhdXRhcGlDb25maWcuZmV0Y2hDb25maWcsIGVuZHBvaW50RmV0Y2hDb25maWcpO1xuICAgICAgICBjb25zdCBmZXRjaFJlZmVyZW5jZSAgICAgICAgICAgICAgICAgID0gYmVhdXRhcGlDb25maWcuZmV0Y2hSZWZlcmVuY2UgfHwgZmV0Y2g7XG4gICAgICAgIGFjY1trZXldID0gQXBpLl9fcHJvdmlkZUZ1bmN0aW9uKHtcbiAgICAgICAgICBlbmRwb2ludDogICAgICAgICAgIHByZWZpeGVkRW5kcG9pbnQsXG4gICAgICAgICAgZmV0Y2hDb25maWc6ICAgICAgICBjb21iaW5lZEZldGNoQ29uZmlnLFxuICAgICAgICAgIGZldGNoUmVmZXJlbmNlOiAgICAgZmV0Y2hSZWZlcmVuY2UsXG4gICAgICAgICAgZW5kcG9pbnRSZWdleDogICAgICBiZWF1dGFwaUNvbmZpZy5lbmRwb2ludFJlZ2V4LFxuICAgICAgICAgIHRoZW5GdW5jdGlvbnNDaGFpbjogYmVhdXRhcGlDb25maWcudGhlbkNoYWluXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWNjO1xuICB9XG5cbiAgc3RhdGljIF9fcHJvdmlkZUZ1bmN0aW9uKHtlbmRwb2ludCwgZmV0Y2hDb25maWcsIGZldGNoUmVmZXJlbmNlLCBlbmRwb2ludFJlZ2V4LCB0aGVuRnVuY3Rpb25zQ2hhaW59KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHBhcmFtcywgaW52b2tlRmV0Y2hDb25maWcpIHtcbiAgICAgIGlmKCFVdGlsLmlzT2JqZWN0KHBhcmFtcykgICAgICAgICAgICAmJiBwYXJhbXMgICAgICAgICAgICAhPT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcnMucGFyYW1zU2hvdWxkQmVPYmplY3Q7XG4gICAgICBpZighVXRpbC5pc09iamVjdChpbnZva2VGZXRjaENvbmZpZykgJiYgaW52b2tlRmV0Y2hDb25maWcgIT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3JzLmZldGNoQ29uZmlnU2hvdWxkQmVPYmplY3Q7XG4gICAgICBjb25zdCBwYXJhbWV0ZXJpemVkRW5kcG9pbnQgPSBBcGkuX19wYXJhbWV0ZXJpemVFbmRwb2ludChlbmRwb2ludCwgcGFyYW1zLCBlbmRwb2ludFJlZ2V4KTtcbiAgICAgIGNvbnN0IGNvbWJpbmVkRmV0Y2hDb25maWcgICA9IE9iamVjdC5hc3NpZ24oZmV0Y2hDb25maWcsIGludm9rZUZldGNoQ29uZmlnKTtcbiAgICAgIGNvbnN0IGZldGNoUHJvbWlzZSAgICAgICAgICA9IGZldGNoUmVmZXJlbmNlKHBhcmFtZXRlcml6ZWRFbmRwb2ludCxjb21iaW5lZEZldGNoQ29uZmlnKTtcbiAgICAgIHJldHVybiBBcGkuX19ydW5DaGFpbk9mVGhlbkZ1bmN0aW9uc09uUHJvbWlzZShmZXRjaFByb21pc2UsIHRoZW5GdW5jdGlvbnNDaGFpbik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIF9fcnVuQ2hhaW5PZlRoZW5GdW5jdGlvbnNPblByb21pc2UoZmV0Y2hQcm9taXNlLCB0aGVuRnVuY3Rpb25zQ2hhaW4pIHtcbiAgICByZXR1cm4gdGhlbkZ1bmN0aW9uc0NoYWluLnJlZHVjZSgoKHByb21pc2UsIG1ldGhvZCkgPT4ge3JldHVybiBwcm9taXNlLnRoZW4obWV0aG9kKX0pLCBmZXRjaFByb21pc2UpO1xuICB9XG5cbiAgc3RhdGljIF9fZ2V0RW5kcG9pbnRXaXRoRmV0Y2hDb25maWcobm9kZSkge1xuICAgIGlmKCEoXG4gICAgICBVdGlsLmlzU3RyaW5nKG5vZGUpIHx8XG4gICAgICAoVXRpbC5pc0FycmF5KG5vZGUpICYmIFV0aWwuaXNTdHJpbmcobm9kZVswXSkpXG4gICAgKSkgdGhyb3cgRXJyb3JzLmludmFsaWRFbmRwb2ludE5vZGU7XG4gICAgcmV0dXJuIFV0aWwuaXNBcnJheShub2RlKT8gbm9kZSA6IFtub2RlLCB7fV07XG4gIH1cblxuICBzdGF0aWMgX19wcmVmaXhFbmRwb2ludChwcmVmaXggPSBcIlwiLCBlbmRwb2ludCkge1xuICAgIHJldHVybiBgJHtwcmVmaXh9JHtlbmRwb2ludH1gO1xuICB9XG5cbiAgc3RhdGljIF9fcGFyYW1ldGVyaXplRW5kcG9pbnQoZW5kcG9pbnQsIHBhcmFtcywgcmVnZXgpIHtcbiAgICByZXR1cm4gZW5kcG9pbnQucmVwbGFjZShyZWdleCwgZnVuY3Rpb24oXywgcGFyYW1JbmRpY2F0b3IpIHtcbiAgICAgIHJldHVybiBwYXJhbXMgPyAocGFyYW1zW3BhcmFtSW5kaWNhdG9yXSB8fCBcIlwiKSA6IFwiXCI7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgX19nZXRSZXF1ZXN0VHlwZUJ5TWV0aG9kTmFtZShtZXRob2ROYW1lKSB7XG4gICAgY29uc3QgIGlzTmFtZVJlcXVlc3RUeXBlID0gW1wiREVMRVRFXCIsIFwiR0VUXCIsIFwiSEVBRFwiLCBcIk9QVElPTlNcIiwgXCJQT1NUXCIsIFwiUFVUXCIsIFwiUEFUQ0hcIl0uaW5kZXhPZihtZXRob2ROYW1lLnRvVXBwZXJDYXNlKCkpICE9IC0xO1xuICAgIHJldHVybiBpc05hbWVSZXF1ZXN0VHlwZSA/IG1ldGhvZE5hbWUudG9VcHBlckNhc2UoKSA6IFwiR0VUXCI7XG4gIH1cbn1cbiIsImltcG9ydCBCZWF1dGFwaSBmcm9tIFwiLi9pbmRleFwiO1xud2luZG93LkJlYXV0YXBpID0gQmVhdXRhcGk7IiwiZXhwb3J0IGRlZmF1bHQge1xuICBlbmRwb2ludFJlZ2V4OiAgLyg/OlxcOikoW2EtekEtWl0oW2EtekEtWjAtOV18LXxfKSopL2csXG4gIGVuZHBvaW50UHJlZml4OiBcIlwiLFxuICBmZXRjaFJlZmVyZW5jZTogdW5kZWZpbmVkLFxuICBmZXRjaENvbmZpZzogICAge30sXG4gIHRoZW5DaGFpbjogICAgICBbXVxufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgcGFyYW1zU2hvdWxkQmVPYmplY3Q6ICAgICAgICAgICBuZXcgVHlwZUVycm9yKFwiUGFyYW1zIHNob3VsZCBiZSBhbiBvYmplY3Qgb3IgdW5kZWZpbmVkLlwiKSxcbiAgZW5kcG9pbnRTaG91bGRCZU9iamVjdDogICAgICAgICBuZXcgVHlwZUVycm9yKFwiRW5kcG9pbnQgaXMgcmVxdWlyZWQgYW5kIHNob3VsZCBiZSBhIHN0cmluZy5cIiksXG4gIGludmFsaWRSZWdleDogICAgICAgICAgICAgICAgICAgbmV3IFR5cGVFcnJvcihcIkNhbid0IHByb3ZpZGUgZW5kcG9pbnQuIEludmFsaWQgcmVnZXguXCIpLFxuICBpbnZhbGlkRW5kcG9pbnROb2RlOiAgICAgICAgICAgIG5ldyBUeXBlRXJyb3IoXCJFbmRwb2ludCBub2RlIChsZWFmKSBzaG91bGQgYmUgYSBzdHJpbmcgb3IgYW4gYXJyYXkgd2l0aCBhIHN0cmluZyBhbmQgYW4gb2JqZWN0XCIpLFxuICB0cmF2ZXJzaW5nQXBpT2JqZWN0OiAgICAgICAgICAgIG5ldyBUeXBlRXJyb3IoXCJFcnJvciB3aGVuIHRyYXZlcnNpbmcgYXBpIG9iamVjdC4gRXhwZWN0ZWQgb2JqZWN0LlwiKSxcbiAgYXBpUHJvdG90eXBlU2hvdWxkQmVPYmplY3Q6ICAgICBuZXcgVHlwZUVycm9yKFwiQXBpIHByb3RvdHlwZSBzaG91bGQgYmUgYW4gb2JqZWN0XCIpLFxuICBjb25maWdTaG91bGRCZU9iamVjdDogICAgICAgICAgIG5ldyBUeXBlRXJyb3IoXCJQcm92aWRlZCBjb25maWcgc2hvdWxkIGJlIGFuIG9iamVjdFwiKSxcbiAgcHJlZml4U2hvdWxkQmVTdHJpbmc6ICAgICAgICAgICBuZXcgVHlwZUVycm9yKFwiUHJvdmlkZWQgcHJlZml4IHNob3VsZCBiZSBhIHN0cmluZ1wiKSxcbiAgZmV0Y2hSZWZlcmVuY2VTaG91bGRCZUZ1bmN0aW9uOiBuZXcgVHlwZUVycm9yKFwiRmV0Y2ggcmVmZXJlbmNlIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpLFxuICBmZXRjaENvbmZpZ1Nob3VsZEJlT2JqZWN0OiAgICAgIG5ldyBUeXBlRXJyb3IoXCJGZXRjaCBjb25maWcgc2hvdWxkIGJlIGFuIG9iamVjdFwiKSxcbiAgdGhlbkNoYWluU2hvdWxkQmVBcnJheTogICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlbiBmdW5jdGlvbnMgY2hhaW4gc2hvdWxkIGJlIGFuIGFycmF5IG9mIGZ1bmN0aW9uc1wiKSxcblxuICBjYW50RmluZEZldGNoOiAgICAgICAgbmV3IFJlZmVyZW5jZUVycm9yKFwiQ2FuJ3QgZmluZCBmZXRjaCBmdW5jdGlvbi4gUGxlYXNlIHByb3ZpZGUgZmV0Y2ggcG9seWZpbGxcIiksXG4gIGNhbnRGaW5kT2JqZWN0QXNzaWduOiBuZXcgUmVmZXJlbmNlRXJyb3IoXCJDYW4ndCBmaW5kIE9iamVjdC5hc3NpZ24gZnVuY3Rpb24uIFBsZWFzZSBwcm92aWRlIE9iamVjdC5hc3NpZ24gcG9seWZpbGxcIiksXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIHJldHVybiBuZXcgcHJvdG90eXBlKHJlc3BvbnNlKTtcbiAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2UubWFwKGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG5ldyBwcm90b3R5cGUob2JqKTtcbiAgICB9KVxuICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyZXNwb25zZSkge1xuICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dClcbiAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufSIsImltcG9ydCBBcGkgICAgICAgICBmcm9tIFwiLi9hcGlcIjtcbmltcG9ydCBQYXJzZUpTT04gICBmcm9tIFwiLi9oZWxwZXJzL3BhcnNlSlNPTlwiO1xuaW1wb3J0IG1hcFRvICAgICAgIGZyb20gXCIuL2hlbHBlcnMvbWFwVG9cIjtcbmltcG9ydCBkZWNvcmF0ZVRvICBmcm9tIFwiLi9oZWxwZXJzL2RlY29yYXRlVG9cIjtcbmltcG9ydCB0aHJvd0Vycm9ycyBmcm9tIFwiLi9oZWxwZXJzL3Rocm93RXJyb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcGFyc2U6IEFwaS5wYXJzZSxcbiAgaGVscGVyczoge1xuICAgIHBhcnNlSlNPTjogICBQYXJzZUpTT04sXG4gICAgbWFwVG86ICAgICAgIG1hcFRvLFxuICAgIGRlY29yYXRlVG86ICBkZWNvcmF0ZVRvLFxuICAgIHRocm93RXJyb3JzOiB0aHJvd0Vycm9yc1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGlzT2JqZWN0OiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT09IFwib2JqZWN0XCIgJiYgISh2YXJpYWJsZSBpbnN0YW5jZW9mIEFycmF5KSAmJiB2YXJpYWJsZSAhPT0gbnVsbDtcbiAgfSxcblxuICBpc1N0cmluZzogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhcmlhYmxlID09PSBcInN0cmluZ1wiXG4gIH0sXG5cbiAgaXNBcnJheTogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICByZXR1cm4gdmFyaWFibGUgaW5zdGFuY2VvZiBBcnJheTtcbiAgfSxcblxuICBpc1JlZ2V4OiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgIHJldHVybiB2YXJpYWJsZSBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgfSxcblxuICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT09IFwiZnVuY3Rpb25cIlxuICB9XG5cbn0iXX0=
