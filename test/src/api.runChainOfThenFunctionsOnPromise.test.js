import Api       from "../../src/api";
import {Promise} from "es6-promise";

describe("Source", function() {
  describe("api.__runChainOfThenFunctionsOnPromise", function() {

    it('runs chain of functions and returns promise', function(done) {
      const promise = new Promise(function(resolve) {
        resolve(5);
      });
      const double  = function(number) { return number*2 };
      const minus2  = function(number) { return number-2 };
      Api.__runChainOfThenFunctionsOnPromise(promise, [double,minus2])
        .then(function(response) {
          expect(response).toEqual(8);
          done();
        });
    });

    it('returns promise', function(done) {
      const promise = new Promise(function(resolve) {
        resolve(5);
      });
      Api.__runChainOfThenFunctionsOnPromise(promise, [])
        .then(function(response) {
          expect(response).toEqual(5);
          done();
        });
    });

  });
});