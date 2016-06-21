import Api from "../../src/api";

describe("Source", function() {
  describe("Api.__getRequestTypeByMethodName", function() {

    it("returns request type based on node name", function() {
      [
        {value: "delete",  expectedResult: "DELETE" },
        {value: "Delete",  expectedResult: "DELETE" },
        {value: "DELETE",  expectedResult: "DELETE" },
        {value: "GET",     expectedResult: "GET"    },
        {value: "HEAD",    expectedResult: "HEAD"   },
        {value: "OPTIONS", expectedResult: "OPTIONS"},
        {value: "POST",    expectedResult: "POST"   },
        {value: "PUT",     expectedResult: "PUT"    },
        {value: "PATCH",   expectedResult: "PATCH"  },
        {value: "xxx",     expectedResult: "GET"    },
        {value: "",        expectedResult: "GET"    },
      ].forEach(function(testCase) {
        expect(Api.__getRequestTypeByMethodName(testCase.value)).toEqual(testCase.expectedResult);
      });
    });

  });
});