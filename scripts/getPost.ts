import remark from "remark";
import html from "remark-html";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import prism from "remark-prism";

const postsDirectory = path.join(process.cwd(), "posts");
type PostData = {
    id: string;
    contentHtml: string;
    data?: { [key: string]: any }
}

async function getPostData(id: string) {
    // id = id.slice(0, -5);
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .use(prism)
      .process(matterResult.content);

    const contentHtml = processedContent.toString()
    // Combine the data with the id and contentHtml
    var retVal : PostData = {
      id,
      contentHtml,
      ...matterResult.data,
    };
    return retVal;
  }

  export default getPostData