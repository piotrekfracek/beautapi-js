# Beautapi

Manage your endpoints in elegant way. Built on top of [fetch](https://fetch.spec.whatwg.org/).

![https://img.shields.io/npm/v/beautapi.svg](https://img.shields.io/npm/v/beautapi.svg) [![Bower](https://img.shields.io/bower/v/beautapi.svg?maxAge=2592000)]() [![Code Climate](https://codeclimate.com/github/piotrekfracek/beautapi-js/badges/gpa.svg)](https://codeclimate.com/github/piotrekfracek/beautapi-js) [![Build Status](https://travis-ci.org/piotrekfracek/beautapi-js.svg?branch=master)](https://travis-ci.org/piotrekfracek/beautapi-js)

Beautapi is a small library that allows you to keep all endpoints in a single place and use them with pleasure. All you have to do is write down paths and configure api to your needs.

## Installation

### NPM

```shell
npm install beautapi
```

### Bower

```shell
bower install beautapi
```



## Getting started

```javascript
const Beautapi = require("beautapi");
const Fetch = require("node-fetch"); // NODE ENV: Node doesn't have window.fetch method.*

// Create api model
const model = {
    Movies: {
        getAll: "/movies",
        get: "movies/:id",
        create: ["/movies", { method: "POST" }]
    }
};

// Configure Beautapi
const config = {
    endpointPrefix: "http://api.myserver.com",
    fetchReference: Fetch,
    thenChain: [
        Beautapi.helpers.throwErrors,
        Beautapi.helpers.parseJSON
    ]
};

// Create api object
const Api = Beautapi.parse(model, config);

// Use it
Api.Movies.getAll().then();
Api.Movies.get({id: 12}).then();
Api.Movies.create({}, {
    body: {name: "Titanic"}
}.then();
                  
// Use it with class, like a boss
class MovieClass {
    constructor({id, title, year}) {
    	this.id = id;
     	this.title = title;
    	this.year = year;
    }
    getTitle() {
        return this.title;
    }
}
Api.Movies.get({id: 10})
    .then(Beautapi.helpers.decorateTo(MovieClass))
    .then((movie) => { console.log(movie.getTitle()) })
    .catch((err) =>  { console.error(err) })
```

*The most of modern browsers have fetch method, but it's good idea to provide polyfill (for example https://github.com/github/fetch). If you want to run beautapi in node enviroment you have to provide special node-fetch polyfill.

#### Live examples

[**Node**](https://tonicdev.com/piotrekfracek/beautapi-example)

[**Script tag**](http://jsbin.com/dikilureje/edit?html,js,console)



## Documentation

### Beautapi.parse(model[, config]) : Api

#### model (Object)

**Required**

Model describes how api should look like. Beautapi will create endpoints based on model. It can be flat or multi-level object.

```javascript
const Api = Beautapi.parse({
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
})

// Api.Posts.get({id: 10}).then((response) => { ... })
// Api.Posts.getByUserId({id: 99}).then((response) => { ... })
// Api.Posts.Comments.get({id: 53}).then((response) => { ... })
```

If leaf is a string beautapi will create reuqest method using value as path and key as a method (case innsensitive) and name. It will match methods like "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH. Otherwise "GET" will be used.

If leaf is an array beautapi will create request method using first value as path, second value as fetch config and key as a name.

Path can take parameters preceded by a colon.

#### config (Object)

**Optional**

| Name           | Type            | Description                              | Default                                  |
| -------------- | --------------- | ---------------------------------------- | ---------------------------------------- |
| endpointRegex  | regex           | Regex used to parsing endpoint parameters. | `/(?:\:)([a-zA-Z]([a-zA-Z0-9]\|-\|_)*)/g` |
| endpointPrefix | string          | String that will be added to every endpoint at the beginning. | `""`                                     |
| fetchReference | function        | Reference to the fetch function. If defined it will be used instead of default fetch function. | ```undefined```                          |
| fetchConfig    | object          | Config passed to fetch function.         | `{}`                                     |
| thenChain      | array[function] | Array of functions that will be passed as callback of Promise.then method. So you don't have to call them manually every time. | `[]`                                     |

Example:

```javascript
import fetch from "fetch";

const model = {
  Users: {
    search: ["/users/{keyword}", {method: "GET"}]
  }
}

const parseJSON = function(response) {
  return response.json()
}

const Api = Beautapi.parse(model, {
  endpointRegex:  /(?:\{)([a-zA-Z]([a-zA-Z0-9]|-|_)*)(?:\})/g
  endpointPrefix: "http://localhost:3000",
  fetchReference: fetch,
  fetchConfig: {
    headers: {
   		'Accept': 'application/json',
    	'Content-Type': 'application/json'
    }
  },
  thenChain: [parseJSON]
})

//Usage
Api.Users.search({keyword: "admin123"}) // GET http://localhost:3000/users/admin123
	// .then(parseJSON) will be called here because it has been added to thenChain array
	.then((response) => {
  		console.log(response);
	})
```

#### Return (Object)

Returned object has the same structure as model, but instead of strings and arrays at leaf positions it has functions.

```javascript
const Api = Beautapi.parse({
  "Posts": {
    "get":          "/posts/:id",
    "post":         "/posts",
    "getByUserId": ["/posts?userId=:userId", {"method": "GET"}],
    "Comments": {
      "get":  "/posts/:id/comments"
    }
  }
})

// Api == {
//   Posts: {
//     get:         function([params, fetchConfig]),
//     post:        function([params, fetchConfig]),
//     getByUserId: function([params, fetchConfig]),
//     Comments: {
//       get: function([params, fetchConfig])
//     }
//   }
// }

```

Each function can take two parameters:

##### params (Object)

It allows you to pass values to the endpoint

```javascript
const Api = Beautapi.parse({
  "Posts": {
    "get":          "/posts/:id",
  }
})

Api.Posts.get({id: 10})
```

##### fetchConfig (Object)

It allows you to assign something (or override) to the fetch configuration for this single invocation.

```javascript
const Api = Beautapi.parse(...);

const data = {
  title: "Lorem ipsum",
  text: "abc"
};

Api.Posts.post({}, {
  body: data
});
```

Note that you don't have to stringify data object. Beautapi will convert it and it'll add Content-Type header.

##### Return (Promise)

Fetch function return is returned (Promise).



### Helpers

Helpers are little functions that you would probably use as Promise.then callbacks.

#### parseJSON

Parse response to JSON

```javascript
Api.Post.get({id: 1}).then(Beautapi.helpers.parseJSON)
```

#### throwErrors

Throw error when response status is not 2xx

```javascript
Api.Post.get({id: 1}).then(Beautapi.helpers.throwErrors)
```

#### mapTo

It maps response array to class instances.

```javascript
class Post {
  constructor({id, userId, title, body}) {
    this.id     = id;
    this.userId = userId;
    this.title  = title;
    this.body   = body;
    this.length = title.length + body.length;
  }
}

API.Posts.getAll().then(Beautapi.helpers.mapTo(Post))
```

#### decorateTo

Same as mapTo, but for single object (not array).

```javascript
class Post {
  constructor({id, userId, title, body}) {
    this.id     = id;
    this.userId = userId;
    this.title  = title;
    this.body   = body;
    this.length = title.length + body.length;
  }
}

API.Posts.get({id: 1}).then(Beautapi.helpers.decorateTo(Post))
```

