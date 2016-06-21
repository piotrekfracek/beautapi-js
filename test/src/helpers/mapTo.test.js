import mapTo     from "../../../src/helpers/mapTo";
import {Promise} from "es6-promise";


describe("Helpers", function() {
  describe("mapTo", function() {

    it("returns array of decorated object", function(done) {

      class Movie {
        constructor({id, name}) {
          this.id     = id;
          this.name   = name;
          this.static = "static";
        }
      }

      const promise = new Promise(function(resolve) {
        resolve([
          {id: 1, name: "A"},
          {id: 2, name: "B"},
        ])
      });

      promise
        .then(mapTo(Movie))
        .then(function(movie) {
          expect(movie).toEqual(
            [
            new Movie({
              id:     1,
              name:   "A",
              static: "static"
            }),
            new Movie({
              id:     2,
              name:   "B",
              static: "static"
            })
            ]
          );
          done();
        });

    });

  });
});