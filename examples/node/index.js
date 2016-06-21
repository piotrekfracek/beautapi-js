var fetch    = require('node-fetch');
var Beautapi = require('../../dist/beautapi-node.js');
var routes   = require('../api.json');

var Api = Beautapi.parse(routes, {
  endpointPrefix: "http://jsonplaceholder.typicode.com",
  fetchReference: fetch,
  thenChain: [
    Beautapi.helpers.throwErrors,
    Beautapi.helpers.parseJSON
  ]
});

Api.Posts.Comments.get({id: 5}).then(function(comments) {
  console.log(comments);
});