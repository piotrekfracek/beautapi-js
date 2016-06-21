import fetchMock     from "fetch-mock/es5/client";
import parseJSON     from "../../src/helpers/parseJSON"
import Api           from "../../src/api";

describe("Api", function() {
  describe("requests", function() {

  if(window.Request !== undefined) { // I can't mock Request in Safari and Phantom :/
    beforeEach(function() {
      fetchMock
        .mock('localhost:9999/',     'GET',  {text: "get200"})
        .mock('localhost:9999/',     'POST', {text: "post200"})
        .mock('localhost:9999/',     'PUT',  {text: "put200"})
        .mock('localhost:9999/id/1', 'GET',  {text: "get1"})
        .mock('localhost:9999/id/2', 'GET',  {text: "get2"})

      const apiPrototype = {
        methods: {
          get:  "/",
          post: "/",
          put:  "/"
        },
        params: {
          get: "/id/:id"
        },
        body: {
          post: "/body"
        }
      }
      this.api = Api.parse(apiPrototype, {
        endpointPrefix: "localhost:9999"
      })
    });

    it("sends requests using proper methods",function() {
      this.api.methods.get()
        .then(function(response) { expect(response.status).toEqual(200); return response; })
        .then(parseJSON)
        .then(function(response) { expect(response).toEqual({text: "get200"})});
      this.api.methods.post()
        .then(function(response) { expect(response.status).toEqual(200); return response; })
        .then(parseJSON)
        .then(function(response) { expect(response).toEqual({text: "post200"})});
      this.api.methods.put()
        .then(function(response) { expect(response.status).toEqual(200); return response; })
        .then(parseJSON)
        .then(function(response) { expect(response).toEqual({text: "put200"})});
    });

    it("sends parameterized requests",function() {
      this.api.params.get({id: 1})
        .then(function(response) { expect(response.status).toEqual(200)})
        .then(parseJSON)
        .then(function(response) { expect(response).toEqual({text: "get1"})});
      this.api.params.get({id: 2})
        .then(function(response) { expect(response.status).toEqual(200)})
        .then(parseJSON)
        .then(function(response) { expect(response).toEqual({text: "get2"})});
    });

    it("sends request with body", function(done) {
      fetchMock.mock('localhost:9999/body', 'POST', function(url, data) {
        expect(JSON.parse(data.body).number).toEqual(8);
        done();
      })
      this.api.body.post({}, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: 8
        })
      })
    });
  }

  });
});