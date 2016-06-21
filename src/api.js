import Errors        from "./errors";
import Util          from "./util";
import DefaultConfig from "./default-config";

export default class Api {

  static parse(model, userBeautapiConfig = {}) {
    if(!Object.assign) throw Errors.cantFindObjectAssign;
    const beautapiConfig = Object.assign({}, DefaultConfig, userBeautapiConfig);

    if(!Util.isObject(userBeautapiConfig))                  throw Errors.configShouldBeObject;
    if(!Util.isObject(model))                               throw Errors.modelShouldBeObject;
    if(!userBeautapiConfig.fetchReference && !window.fetch) throw Errors.cantFindFetch;
    if(beautapiConfig.fetchReference &&
       !Util.isFunction(beautapiConfig.fetchReference))     throw Errors.fetchReferenceShouldBeFunction;
    if(!Util.isRegex(beautapiConfig.endpointRegex))         throw Errors.invalidRegex;
    if(!Util.isString(beautapiConfig.endpointPrefix))       throw Errors.prefixShouldBeString;
    if(!Util.isObject(beautapiConfig.fetchConfig))          throw Errors.fetchConfigShouldBeObject;
    if(!Util.isArray(beautapiConfig.thenChain))             throw Errors.thenChainShouldBeArray;

    return Api.__parseModel(model, {}, beautapiConfig);
  }

  static __parseModel(node, acc, beautapiConfig) {
    if(!Util.isObject(node)) throw Errors.traversingApiObject;
    for(let key in node) {
      if(Util.isObject(node[key])) {
        Api.__parseModel(node[key], acc[key] = {}, beautapiConfig);
      }else{
        const [endpoint, endpointFetchConfig] = Api.__getEndpointWithFetchConfig(node[key]);
        const requestTypeByMethodName         = Api.__getRequestTypeByMethodName(key);
        const prefixedEndpoint                = Api.__prefixEndpoint(beautapiConfig.endpointPrefix, endpoint);
        const combinedFetchConfig             = Object.assign({method: requestTypeByMethodName}, beautapiConfig.fetchConfig, endpointFetchConfig);
        const fetchReference                  = beautapiConfig.fetchReference || fetch;
        acc[key] = Api.__provideFunction({
          endpoint:           prefixedEndpoint,
          fetchConfig:        combinedFetchConfig,
          fetchReference:     fetchReference,
          endpointRegex:      beautapiConfig.endpointRegex,
          thenFunctionsChain: beautapiConfig.thenChain
        });
      }
    }
    return acc;
  }

  static __provideFunction({endpoint, fetchConfig, fetchReference, endpointRegex, thenFunctionsChain}) {
    return function(params, invokeFetchConfig) {
      if(!Util.isObject(params)            && params            !== undefined) throw Errors.paramsShouldBeObject;
      if(!Util.isObject(invokeFetchConfig) && invokeFetchConfig !== undefined) throw Errors.fetchConfigShouldBeObject;
      const parameterizedEndpoint = Api.__parameterizeEndpoint(endpoint, params, endpointRegex);
      const combinedFetchConfig   = Api.__prepareBody(Object.assign(fetchConfig, invokeFetchConfig));
      const fetchPromise          = fetchReference(parameterizedEndpoint,combinedFetchConfig);
      return Api.__runChainOfThenFunctionsOnPromise(fetchPromise, thenFunctionsChain);
    }
  }

  static __prepareBody(fetchConfig) {
    if(typeof fetchConfig.body === 'object') {
      fetchConfig.body = JSON.stringify(fetchConfig.body);
      if(!fetchConfig.headers) fetchConfig.headers = {};
      if(!fetchConfig.headers['Content-Type']) fetchConfig.headers['Content-Type'] = 'application/json';
    }
    return fetchConfig;
  }

  static __runChainOfThenFunctionsOnPromise(fetchPromise, thenFunctionsChain) {
    return thenFunctionsChain.reduce(((promise, method) => {return promise.then(method)}), fetchPromise);
  }

  static __getEndpointWithFetchConfig(node) {
    if(!(
      Util.isString(node) ||
      (Util.isArray(node) && Util.isString(node[0]))
    )) throw Errors.invalidEndpointNode;
    return Util.isArray(node)? node : [node, {}];
  }

  static __prefixEndpoint(prefix = "", endpoint) {
    return `${prefix}${endpoint}`;
  }

  static __parameterizeEndpoint(endpoint, params, regex) {
    return endpoint.replace(regex, function(_, paramIndicator) {
      return params ? (params[paramIndicator] || "") : "";
    });
  }

  static __getRequestTypeByMethodName(methodName) {
    const  isNameRequestType = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH"].indexOf(methodName.toUpperCase()) != -1;
    return isNameRequestType ? methodName.toUpperCase() : "GET";
  }
}
