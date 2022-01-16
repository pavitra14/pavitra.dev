import useSWR from 'swr';
import Constants from "../constants/constants";

export default function Views({ id, classes }) {
    const q = id;
    const route = Constants.GET_ROUTE("pageViews");
    const {
        data
    } = useSWR(`${route}${q}`, async url => {
        const res = await fetch(url);
        return res.json();
    }, {
        revalidateOnFocus: false
    });
    const views = data?.pageViews || 0;

    return (
        <span className={classes}>{views} views</span>
    );
}