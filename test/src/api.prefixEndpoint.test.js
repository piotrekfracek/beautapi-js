import Api from "../../src/api";

describe("Source", function() {
  describe("api.__prefixEndpoint", function() {

    it('returns prefixed endpoint', function() {
      [
        {prefix: "a", endpoint: "b", expectedResult: "ab"},
        {prefix: "a", endpoint: "",  expectedResult: "a"},
        {prefix: "",  endpoint: "b", expectedResult: "b"},
        {prefix: "",  endpoint: "",  expectedResult: ""}
      ].forEach(function(testCase) {
        expect(Api.__prefixEndpoint(testCase.prefix, testCase.endpoint))
          .toEqual(testCase.expectedResult);
      });
    });

  });
});