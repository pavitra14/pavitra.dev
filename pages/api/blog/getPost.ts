import getPostData from "@/scripts/getPost";
export default async (req, res) => {
    try {
        res.status(200).json(await getPostData(req.query.id));
    } catch (err) {
        return res.status(404).json({
            error: err.message
        });
    }
};