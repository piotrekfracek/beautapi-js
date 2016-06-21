import Beautapi from "../../src/";
import routes   from "../api.json";
import Post     from "./post.es6";

class Main {

  constructor() {
    this.API = Beautapi.parse(routes, {
      endpointPrefix: "http://jsonplaceholder.typicode.com",
      thenChain: [
        Beautapi.helpers.throwErrors,
        Beautapi.helpers.parseJSON
      ]
    });

    this.loadPostByUserId(3);
  }

  loadPostByUserId(userId){
    return this.API.Posts.getByUserId({userId: userId})
      .then(Beautapi.helpers.mapTo(Post))
      .then(function(posts) {
        console.log("Posts", posts);
      });
  }

}

new Main();