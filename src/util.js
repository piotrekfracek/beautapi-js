export default {
  isObject: function(variable) {
    return typeof variable === "object" && !(variable instanceof Array) && variable !== null;
  },

  isString: function(variable) {
    return typeof variable === "string"
  },

  isArray: function(variable) {
    return variable instanceof Array;
  },

  isRegex: function(variable) {
    return variable instanceof RegExp;
  },

  isFunction: function(variable) {
    return typeof variable === "function"
  }

}