var posts = require('./api/posts');
var express = require('express');
var app = express();
var compression = require('compression');
var helmet = require('helmet');

app.use(compression()); //Compress all routes

app.use(helmet());

app.get('/', (req, res) => res.end("Hello World, This is a backend api for public information."));
app.get('/blog/getAllPostIds', (req, res) => res.end(JSON.stringify(posts.getAllPostIds())));
app.get('/blog/getSortedPostsData', (req, res) => res.end(JSON.stringify(posts.getSortedPostsData())));
app.get('/blog/getPost/:id', async (req, res) => {
    const postData = await posts.getPostData(req.params.id)

    res.end(JSON.stringify(postData))
});

app.get('/blog/getCache', (req, res) => res.end(JSON.stringify(posts.getCache())));

var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("pbehrein api listening at http://pbehre.in:3001")
 })