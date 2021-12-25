export default class Constants{

    static REMOTE_URL = "https://pbehre.in";
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
        getAllPostIds: "/api/blog/getAllPostIds"
    }

    static GET_ROUTE = (route) => {
        return this.BASE_URL() + this.API_ROUTES[route];
    }
};