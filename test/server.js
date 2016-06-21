var posts      = require('./server-data.js');
var express    = require('express');
var bodyParser = require("body-parser");
var app        = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/posts', function (req, res) {
    return res.json(posts);
});

app.post('/posts/:id', function(req, res) {
    return res.status(400).send('Bad Request');
});

app.get('/posts/:id', function (req, res) {
    return res.json(posts[req.params.id]);
});

app.post('/posts', function (req, res) {
    return res.json(req.body);
});

app.listen(7897, function () {
  console.log('Example app listening on port 7897!');
});