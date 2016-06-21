import decorateTo from "../../../src/helpers/decorateTo";
import {Promise}  from "es6-promise";


describe("Helpers", function() {
  describe("decorateTo", function() {

    it("returns decorated object", function(done) {

      class Movie {
        constructor({id, name}) {
          this.id     = id;
          this.name   = name;
          this.static = "static";
        }
      }

      const promise = new Promise(function(resolve) {
        resolve({
          id:   4,
          name: "Test"
        })
      });

      promise
        .then(decorateTo(Movie))
        .then(function(movie) {
          expect(movie).toEqual(
            new Movie({
              id:     4,
              name:   "Test",
              static: "static"
            })
          );
          done();
        });

    });

  });
});