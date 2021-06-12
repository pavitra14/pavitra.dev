var posts = require('./api/posts');
var express = require('express');
var app = express();
var compression = require('compression');
app.use(compression()); //Compress all routes

app.get('/', (req, res) => res.end("Hello World, This is a backend api for public information."));
app.get('/blog/getAllPostIds', (req, res) => res.end(JSON.stringify(posts.getAllPostIds())));
app.get('/blog/getSortedPostsData', (req, res) => res.end(JSON.stringify(posts.getSortedPostsData())));
app.get('/blog/getPost/:id', (req, res) => res.end(JSON.stringify(posts.getPostData(req.params.id))));

app.get('/blog/getCache', (req, res) => res.end(JSON.stringify(posts.getCache())));

var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })