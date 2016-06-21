import Util from "../../src/util";

describe("Source", function() {
  describe("util", function() {

    it("retruns true if variable is an object, but not an array/null", function() {
      [
        {value: [],        expectedResult: false},
        {value: Array,     expectedResult: false},
        {value: null,      expectedResult: false},
        {value: undefined, expectedResult: false},
        {value: 0,         expectedResult: false},
        {value: 'a',       expectedResult: false},
        {value: {},        expectedResult: true },
      ].forEach(function(testCase) {
        expect(Util.isObject(testCase.value)).toEqual(testCase.expectedResult);
      });
    });

    it("retruns true if variable is an array, but not an object", function() {
      [
        {value: [],        expectedResult: true },
        {value: Array,     expectedResult: false},
        {value: null,      expectedResult: false},
        {value: undefined, expectedResult: false},
        {value: 0,         expectedResult: false},
        {value: 'a',       expectedResult: false},
        {value: {},        expectedResult: false},
      ].forEach(function(testCase) {
        expect(Util.isArray(testCase.value)).toEqual(testCase.expectedResult);
      });
    });

    it("retruns true if variable is an array, but not an object", function() {
      [
        {value: [],        expectedResult: false},
        {value: Array,     expectedResult: false},
        {value: null,      expectedResult: false},
        {value: undefined, expectedResult: false},
        {value: 0,         expectedResult: false},
        {value: 'a',       expectedResult: true },
        {value: {},        expectedResult: false},
      ].forEach(function(testCase) {
        expect(Util.isString(testCase.value)).toEqual(testCase.expectedResult);
      });
    });

    it("retruns true if variable is a regex", function() {
      [
        {value: [],        expectedResult: false},
        {value: Array,     expectedResult: false},
        {value: null,      expectedResult: false},
        {value: undefined, expectedResult: false},
        {value: 0,         expectedResult: false},
        {value: 'a',       expectedResult: false},
        {value: {},        expectedResult: false},
        {value: /[a-z]/g,  expectedResult: true },
      ].forEach(function(testCase) {
        expect(Util.isRegex(testCase.value)).toEqual(testCase.expectedResult);
      });
    });

    it("retruns true if variable is a function", function() {
      [
        {value: [],            expectedResult: false},
        {value: null,          expectedResult: false},
        {value: undefined,     expectedResult: false},
        {value: 0,             expectedResult: false},
        {value: 'a',           expectedResult: false},
        {value: {},            expectedResult: false},
        {value: function() {}, expectedResult: true }
      ].forEach(function(testCase) {
        expect(Util.isFunction(testCase.value)).toEqual(testCase.expectedResult);
      });
    });

  });
});