import Api    from "../../src/api";
import Errors from "../../src/errors";

describe("Source", function() {
  describe("api.__getEndpointWithFetchConfig", function() {

    it('returns array with endpoint and config object', function() {
      [
        {node: ["a", {}], expectedResult: ["a", {}]},
        {node: "a",       expectedResult: ["a", {}]},
        {node: ["a"],     expectedResult: ["a"]},
      ].forEach(function(testCase) {
        expect(Api.__getEndpointWithFetchConfig(testCase.node))
          .toEqual(testCase.expectedResult);
      });
    });

    it("throws error if node is not a string or an array", function() {
      [
        {node: [],        expectedError: Errors.invalidEndpointNode},
        {node: [0],       expectedError: Errors.invalidEndpointNode},
        {node: {},        expectedError: Errors.invalidEndpointNode},
        {node: null,      expectedError: Errors.invalidEndpointNode},
        {node: undefined, expectedError: Errors.invalidEndpointNode},
        {node: 0,         expectedError: Errors.invalidEndpointNode}
      ].forEach(function(testCase) {
        expect(function() {
          Api.__getEndpointWithFetchConfig(testCase.node)
        }).toThrow(testCase.expectedError);
      });
    });

  });
});