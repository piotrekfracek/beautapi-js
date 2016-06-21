import Api            from "../../src/api";
import DefaultConfig  from "../../src/default-config";
import Errors         from "../../src/errors";
import FetchPolyfill  from "isomorphic-fetch";
import AssignPolyfill from "object-assign";
import {Promise}      from "es6-promise";


let func;

describe("Source", function() {
  describe("api.__provideFunction", function() {

    describe("errors", function() {

      beforeEach(function() {
        func = Api.__provideFunction({
          endpoint:       '/',
          fetchReference: FetchPolyfill,
          endpointRegex:  DefaultConfig.endpointRegex
        });
      });

      it("returns function that should throw error if params is not an object or undefined", function() {
        [[],null,"fdf",0].forEach(function(testCase) {
          expect(function() {func(testCase)}).toThrow(Errors.paramsShouldBeObject);
        });
      });

      it("returns function that should throw error if fetch config is not an object or undefined", function() {
        [[],null,"fdf",0].forEach(function(testCase) {
          expect(function() {func({},testCase)}).toThrow(Errors.fetchConfigShouldBeObject);
        });
      });

    });

    describe("fetch", function() {

      beforeEach(function() {
        Object.assign = AssignPolyfill;
        window.fetch  = FetchPolyfill;
        fetch.Promise = Promise;
      });

      it("invokes fetch function with proper params", function() {
        spyOn(window,'fetch');
        const func = Api.__provideFunction({
          endpoint:           '/:id',
          fetchConfig:        {method: "POST"},
          fetchReference:     window.fetch,
          endpointRegex:      DefaultConfig.endpointRegex,
          thenFunctionsChain: []
        })
        func();
        expect(window.fetch).toHaveBeenCalledWith('/', {method: "POST"});
        func({id: 4});
        expect(window.fetch).toHaveBeenCalledWith('/4',{method: "POST"});
        func({},{method: "GET"});
        expect(window.fetch).toHaveBeenCalledWith('/', {method: "GET"});
      });

    });

  });
});