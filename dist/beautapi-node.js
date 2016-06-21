"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function throwErrors(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function decorateTo(prototype) {
  return function (response) {
    return new prototype(response);
  };
}

function mapTo(prototype) {
  return function (response) {
    return response.map(function (obj) {
      return new prototype(obj);
    });
  };
}

function ParseJSON(response) {
  return response.json();
}

var Errors = {
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

var Util = {
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

var DefaultConfig = {
  endpointRegex: /(?:\:)([a-zA-Z]([a-zA-Z0-9]|-|_)*)/g,
  endpointPrefix: "",
  fetchReference: undefined,
  fetchConfig: {},
  thenChain: []
};

var Api = (function () {
  function Api() {
    _classCallCheck(this, Api);
  }

  _createClass(Api, null, [{
    key: "parse",
    value: function parse(model) {
      var userBeautapiConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!Object.assign) throw Errors.cantFindObjectAssign;
      var beautapiConfig = Object.assign({}, DefaultConfig, userBeautapiConfig);

      if (!Util.isObject(userBeautapiConfig)) throw Errors.configShouldBeObject;
      if (!Util.isObject(model)) throw Errors.modelShouldBeObject;
      if (!userBeautapiConfig.fetchReference && !window.fetch) throw Errors.cantFindFetch;
      if (beautapiConfig.fetchReference && !Util.isFunction(beautapiConfig.fetchReference)) throw Errors.fetchReferenceShouldBeFunction;
      if (!Util.isRegex(beautapiConfig.endpointRegex)) throw Errors.invalidRegex;
      if (!Util.isString(beautapiConfig.endpointPrefix)) throw Errors.prefixShouldBeString;
      if (!Util.isObject(beautapiConfig.fetchConfig)) throw Errors.fetchConfigShouldBeObject;
      if (!Util.isArray(beautapiConfig.thenChain)) throw Errors.thenChainShouldBeArray;

      return Api.__parseModel(model, {}, beautapiConfig);
    }
  }, {
    key: "__parseModel",
    value: function __parseModel(node, acc, beautapiConfig) {
      if (!Util.isObject(node)) throw Errors.traversingApiObject;
      for (var key in node) {
        if (Util.isObject(node[key])) {
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
        if (!Util.isObject(params) && params !== undefined) throw Errors.paramsShouldBeObject;
        if (!Util.isObject(invokeFetchConfig) && invokeFetchConfig !== undefined) throw Errors.fetchConfigShouldBeObject;
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
      if (!(Util.isString(node) || Util.isArray(node) && Util.isString(node[0]))) throw Errors.invalidEndpointNode;
      return Util.isArray(node) ? node : [node, {}];
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

var index = {
  parse: Api.parse,
  helpers: {
    parseJSON: ParseJSON,
    mapTo: mapTo,
    decorateTo: decorateTo,
    throwErrors: throwErrors
  }
};

exports.default = index;
module.exports = exports['default'];