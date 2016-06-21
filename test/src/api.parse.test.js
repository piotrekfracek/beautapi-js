import Api            from "../../src/api";
import Errors         from "../../src/errors";
import AssignPolyfill from "object-assign";
import FetchPolyfill  from "isomorphic-fetch";


describe("Source", function() {
  describe("api.parse", function() {

    it("throws error if can't find fetch", function() {
      window.fetch  = undefined;
      Object.assign = function() {};
      expect(function() {Api.parse({})}).toThrow(Errors.cantFindFetch);
    });

    it("throws error if can't find Object.assign", function() {
      window.fetch  = function() {};
      Object.assign = undefined;
      expect(function() {Api.parse({})}).toThrow(Errors.cantFindObjectAssign);
    });

    describe("when fetch and assign are provided", function() {

      beforeEach(function() {
        window.fetch  = FetchPolyfill;
        Object.assign = AssignPolyfill;
      });

      it("throws error if provided api prototype isn't an object", function() {
        ["", 0, [], undefined, null].forEach(function(testCase) {
          expect(function() {Api.parse(testCase)}).toThrow(Errors.modelShouldBeObject);
        });
      });

      it("throws error if provided config isn't an object", function() {
        ["",0,[],null].forEach(function(testCase) {
          expect(function() {Api.parse({},testCase)}).toThrow(Errors.configShouldBeObject);
        });
      });

      it("throws error if regex is invalid", function() {
        [[],null,{},0,"a",undefined].forEach(function(testCase) {
          expect(function() {Api.parse({},{endpointRegex: testCase})}).toThrow(Errors.invalidRegex);
        });
      });

      it("throws error if endpointPrefix isn't a string", function() {
        [[],null,{},0,undefined].forEach(function(testCase) {
          expect(function() {Api.parse({},{endpointPrefix: testCase})}).toThrow(Errors.prefixShouldBeString);
        });
      });

      it("throws error if fetchReference isn't a function", function() {
        [[],{},1,'x'].forEach(function(testCase) {
          expect(function() {Api.parse({},{fetchReference: testCase})}).toThrow(Errors.fetchReferenceShouldBeFunction);
        });
      });

      it("throws error if fetchConfig isn't an object", function() {
        [[],1,'x', undefined, null].forEach(function(testCase) {
          expect(function() {Api.parse({},{fetchConfig: testCase})}).toThrow(Errors.fetchConfigShouldBeObject);
        });
      });

      it("throws error if thenChain isn't an object", function() {
        [{},1,'x', undefined, null].forEach(function(testCase) {
          expect(function() {Api.parse({},{thenChain: testCase})}).toThrow(Errors.thenChainShouldBeArray);
        });
      });

    });

  });
});