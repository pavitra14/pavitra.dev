import fs from "fs";
import path from "path";
import matter, { GrayMatterFile } from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");
type SortedPostDataArray = Partial<GrayMatterFile<string> & {
    id: string;
    date?: Date;
}>[]

function getSortedPostsData() : SortedPostDataArray {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData: SortedPostDataArray = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        var id = fileName.replace(/\.md$/, "");

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        // id = `${id}.html`;
        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
        };
    });
    var retVal = allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
    return retVal;
}

export default getSortedPostsData;