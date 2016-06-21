export default {
  paramsShouldBeObject:           new TypeError("Params should be an object or undefined."),
  endpointShouldBeObject:         new TypeError("Endpoint is required and should be a string."),
  invalidRegex:                   new TypeError("Can't provide endpoint. Invalid regex."),
  invalidEndpointNode:            new TypeError("Endpoint node (leaf) should be a string or an array with a string and an object"),
  traversingApiObject:            new TypeError("Error when traversing api object. Expected object."),
  apiPrototypeShouldBeObject:     new TypeError("Api prototype should be an object"),
  configShouldBeObject:           new TypeError("Provided config should be an object"),
  prefixShouldBeString:           new TypeError("Provided prefix should be a string"),
  fetchReferenceShouldBeFunction: new TypeError("Fetch reference should be a function"),
  fetchConfigShouldBeObject:      new TypeError("Fetch config should be an object"),
  thenChainShouldBeArray:         new TypeError("Then functions chain should be an array of functions"),

  cantFindFetch:        new ReferenceError("Can't find fetch function. Please provide fetch polyfill"),
  cantFindObjectAssign: new ReferenceError("Can't find Object.assign function. Please provide Object.assign polyfill"),
}