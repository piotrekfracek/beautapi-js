import Api           from "../../src/api";
import DefaultConfig from "../../src/default-config";
import Errors        from "../../src/errors";

describe("Source", function() {
  describe("api.__parameterizeEndpoint", function() {

    it("returns full url for default regex", function() {
      [
        //Valid pattern
        {endpoint: "/:a/:b",     params: {a: "aa", b: "bb"},         expectedResult: "/aa/bb"},
        {endpoint: "/:a:b",      params: {a: "aa", b: "bb"},         expectedResult: "/aabb"},
        {endpoint: "/:a/:c",     params: {a: "aa", b: "bb"},         expectedResult: "/aa/"},
        {endpoint: "/",          params: {a: "aa", b: "bb"},         expectedResult: "/"},
        {endpoint: "/:a_a/:b-B", params: {"a_a": "aa", "b-B": "bb"}, expectedResult: "/aa/bb"},
        {endpoint: "/:a0c",      params: {"a0c": "aaa"},             expectedResult: "/aaa"},
        {endpoint: "/:a",        params: {},                         expectedResult: "/"},
        {endpoint: "/:a",        params: undefined,                  expectedResult: "/"},
        //Invalid pattern
        {endpoint: "/:0ac",      params: {"0ac": "aaa"},             expectedResult: "/:0ac"},
        {endpoint: "/:_ac",      params: {"_ac": "aaa"},             expectedResult: "/:_ac"},
      ].forEach(function(testCase) {
        expect(Api.__parameterizeEndpoint(
          testCase.endpoint,
          testCase.params,
          DefaultConfig.endpointRegex
        )).toEqual(testCase.expectedResult);
      });
    });

  });
});