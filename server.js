const express = require('express')
const next = require('next')
var posts = require('./api/posts');
var compression = require('compression');
var helmet = require('helmet');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(compression()); //Compress all routes
  server.use(helmet());

  //API Routes
  server.get('/blog/getAllPostIds', (req, res) => res.end(JSON.stringify(posts.getAllPostIds())));
  server.get('/blog/getSortedPostsData', (req, res) => res.end(JSON.stringify(posts.getSortedPostsData())));
  server.get('/blog/getPost/:id', async (req, res) => {
      const postData = await posts.getPostData(req.params.id)

      res.end(JSON.stringify(postData))
  });

  server.post('/blog/updateCache', (req, res) => res.end(JSON.stringify(posts.updateCache())));

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})