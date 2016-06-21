var routes = {
  "Posts": {
    "get":          "/posts/:id",
    "post":         "/posts",
    "put":          "/posts/:id",
    "patch":        "/posts/:id",
    "delete":       "/posts/:id",
    "getByUserId": ["/posts?userId=:userId", {"method": "GET"}],
    "Comments": {
      "get":  "/posts/:id/comments"
    }
  }
}

var API = Beautapi.parse(routes, {
  endpointPrefix: "http://jsonplaceholder.typicode.com"
});

API.Posts.Comments.get({id: 5})
  .then(Beautapi.helpers.parseJSON)
  .then(function(comments) {
    console.log(comments);
    console.table(comments);
  });