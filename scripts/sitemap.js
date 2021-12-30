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

(async () => {
  const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${getAllPostIds()
          .map(({ params }) => {
            return `
                    <url>
                        <loc>${`https://pbehre.in/posts/${params.id}`}</loc>
                    </url>
                `;
          })
          .join("")}
    </urlset>
    `;

  fs.writeFileSync("public/sitemap.xml", createSitemap());
})();
