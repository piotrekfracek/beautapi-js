import AssignPolyfill from "object-assign";
import parseJSON      from "../../src/helpers/parseJSON"
import throwErrors    from "../../src/helpers/throwErrors"
import Api            from "../../src/api";
import posts          from "../server-data.js";
import FetchPolyfill  from 'isomorphic-fetch';
import {Promise}      from "es6-promise";

describe("Api", function() {
  beforeEach(function() {
    Object.assign = AssignPolyfill;
    this.model = {
      getAll: ["/posts", {method: "GET"}],
      get:    "/posts/:id",
      post:   "/posts",
      bad:    ["/posts/:id", {method: "POST"}]
    };
    this.api = Api.parse(this.model, {
      fetchReference: FetchPolyfill,
      endpointPrefix: "http://0.0.0.0:7897",
    });
  });

  describe("with backend", function() {

    it("responses with all posts", function(done) {
      this.api.getAll()
        .then(parseJSON)
        .then(function(response){
          expect(response).toEqual(posts)
          done();
        })
    });

    it("responses with single post", function(done) {
      this.api.get({id:1})
        .then(parseJSON)
        .then((response) => {
          expect(response).toEqual(posts[1])
          done();
        })
    });

    it("responses with echo", function(done) {
      var newPost = {id: 4, text: "D"};
      this.api.post({id: 4}, {
        body:  newPost
      })
        .then(parseJSON)
        .then((response) => {
          expect(response).toEqual(newPost)
          done();
        })
    });

    it("catches error", function(done) {
      this.api.bad({id:9})
        .then(throwErrors)
        .catch((err) => {
          expect(err.message).toEqual("Bad Request")
          expect(err.response.status).toEqual(400);
          done();
        })
    })

  });
});