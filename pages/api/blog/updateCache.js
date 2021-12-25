var posts = require('../../../api/posts');
export default async (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    const cacheResult = await posts.updateCache();
    res.end(JSON.stringify(cacheResult))
}