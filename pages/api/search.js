import FuzzySearch from 'fuzzy-search';

var api = require("../../api/posts");
var cache = api.getCache();

const searcher = new FuzzySearch(cache.getSortedPostsData, ['title'], {
    caseSensitive: false,
});

export default (res, req) => {
    req.end(JSON.stringify(searcher.search(res.query.q)));
}