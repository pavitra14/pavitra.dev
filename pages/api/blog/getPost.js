var posts = require('../../../api/posts');
export default async (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    const postData = await posts.getPostData(req.query.id)
    res.end(JSON.stringify(postData))
}