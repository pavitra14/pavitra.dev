import FuzzySearch from 'fuzzy-search';
import getSortedPostsData from "@/scripts/getSortedPostsData";

const searcher = new FuzzySearch(getSortedPostsData(), ['title'], {
    caseSensitive: false,
});

export default (res, req) => {
    req.end(JSON.stringify(searcher.search(res.query.q)));
}