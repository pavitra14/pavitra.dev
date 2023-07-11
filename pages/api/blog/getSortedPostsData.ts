import getSortedPostsData from "@/scripts/getSortedPostsData";
export default async (req, res) => {
    try {
        res.status(200).json(getSortedPostsData())
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};