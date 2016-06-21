import Api from "../../src/api";
import {Promise} from "es6-promise";

describe("Api", function() {

  beforeEach(function() {
    this.apiPrototype = {
      a: {
        aa: {
          aaa: '/aaa',
          aab: ['/aab'],
          aac: ['/aac', {method: 'POST'}],
          aad: {
            aada: "/aada"
          }
        },
        ab: {
          get:    '/:id',
          put:    '/:id/:limit',
          post:   '/',
          delete: ['/delete', {method: 'POST'}]
        }
      }
    }
  });

  it("returns full Beautapi object based on prototype", function() {
    this.api = Api.parse(this.apiPrototype);
    [
      {reference: this.api.a,             shouldBe: 'object'  },
      {reference: this.api.a.aa,          shouldBe: 'object'  },
      {reference: this.api.a.aa.aaa,      shouldBe: 'function'},
      {reference: this.api.a.aa.aab,      shouldBe: 'function'},
      {reference: this.api.a.aa.aac,      shouldBe: 'function'},
      {reference: this.api.a.aa.aad,      shouldBe: 'object'  },
      {reference: this.api.a.aa.aad.aada, shouldBe: 'function'},
      {reference: this.api.a.ab,          shouldBe: 'object'  },
      {reference: this.api.a.ab.get,      shouldBe: 'function'},
      {reference: this.api.a.ab.put,      shouldBe: 'function'},
      {reference: this.api.a.ab.post,     shouldBe: 'function'},
      {reference: this.api.a.ab.delete,   shouldBe: 'function'},
    ].forEach(function(testCase) {
      expect(typeof testCase.reference).toEqual(testCase.shouldBe);
    });
  });

  it("invokes fetch with proper parameters", function() {
    spyOn(window,'fetch');
    this.api = Api.parse(this.apiPrototype, {
      endpointPrefix: 'localhost:9999',
      fetchReference: window.fetch,
      fetchConfig: {xxx: "xxx"}
    });

    this.api.a.aa.aaa();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/aaa',    {xxx: "xxx", method: "GET"});
    this.api.a.aa.aab();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/aab',    {xxx: "xxx", method: "GET"});
    this.api.a.aa.aac();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/aac',    {xxx: "xxx", method: "POST"});
    this.api.a.aa.aad.aada();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/aada',   {xxx: "xxx", method: "GET"});
    this.api.a.ab.get();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/',       {xxx: "xxx", method: "GET"});
    this.api.a.ab.get({id: 4});
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/4',      {xxx: "xxx", method: "GET"});
    this.api.a.ab.put({id: 2, limit: 3});
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/2/3',    {xxx: "xxx", method: "PUT"});
    this.api.a.ab.put({id: 2});
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/2/',     {xxx: "xxx", method: "PUT"});
    this.api.a.ab.post();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/',       {xxx: "xxx", method: "POST"});
    this.api.a.ab.delete();
    expect(window.fetch).toHaveBeenCalledWith('localhost:9999/delete', {xxx: "xxx", method: "POST"});
  });

  it("invokes fetch and chain of then functions", function(done) {
    const chain = {
      af: function(number) { return number*2 },
      bf: function(number) { return number-2 },
    }
    const fakeFetch = function() {
      return new Promise(function(resolve) {
        resolve(5);
      });
    };
    this.api = Api.parse(this.apiPrototype, {
      fetchReference: fakeFetch,
      thenChain: Object.keys(chain).map(key => chain[key])
    });
    this.api.a.ab.get().then(function(response) {
      expect(response).toEqual(8);
      done();
    });

  });

});