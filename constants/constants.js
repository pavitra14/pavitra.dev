export default class Constants{
    static SITE_TITLE = "Pavitra Behre | Welcome";
    static USER_NAME = "Pavitra Behre"
    static SITE_DESCRIPTION= "Web Developer, Backend Engineer, Alien";
    static SHORT_INTRO = "Software Development Engineer @ Amazon 🇮🇳";

    static REMOTE_URL = "https://pavitra.dev";
    static DEV_URL = "http://localhost:3000";

    static BASE_URL = () => {
        if(process.env.mode == "DEV") {
            return this.DEV_URL;
        }
        return this.REMOTE_URL
    };

    static API_ROUTES = {
        getSortedPostsData: "/api/blog/getSortedPostsData",
        getPost: "/api/blog/getPost?id=",
        getAllPostIds: "/api/blog/getAllPostIds",
        search: "/api/search?q=",
        pageViews: "/api/pageViews?q="
    }

    static GET_ROUTE = (route) => {
        return this.BASE_URL() + this.API_ROUTES[route];
    }
};
