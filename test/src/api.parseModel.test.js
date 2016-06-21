import Api            from "../../src/api";
import Errors         from "../../src/errors";
import DefaultConfig  from "../../src/default-config";

describe("Source", function() {
  describe("api.__provideFunction", function() {

    describe("errors", function() {

      it("throws error if node is not an object", function() {
        expect(function() { Api.__parseModel([], {}, {}); }).toThrow(Errors.traversingApiObject);
      });

    });

    describe("fetch", function() {

      it("invokes Api.__provideFunction with proper params", function() {
        spyOn(Api,'__provideFunction');
        Api.__parseModel({a: ["A", {body: "B"}]}, {}, DefaultConfig);
        expect(Api.__provideFunction).toHaveBeenCalledWith({
          endpoint:           "A",
          fetchConfig:        {method: "GET", body: "B"},
          fetchReference:     window.fetch,
          endpointRegex:      DefaultConfig.endpointRegex,
          thenFunctionsChain: DefaultConfig.thenChain
        });
      });

    });

  });
});