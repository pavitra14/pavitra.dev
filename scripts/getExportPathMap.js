const fs = require("fs");
const path = require("path");
const postsDirectory = path.join(process.cwd(), "posts");

function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

exports.getPath = async () => {
  const list = getAllPostIds();
  const pathMap = {
    "/": { page: "/" },
  };
  list.map(({ params }) => {
    pathMap[`/posts/${params.id}`] = {
      page: `/`,
      query: { slug: `posts/${params.id}` },
    };
  });
  return pathMap;
};
