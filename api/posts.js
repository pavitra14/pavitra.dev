const remark = require("remark");
const html = require("remark-html");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const prism = require("remark-prism");
const { exec } = require("child_process");


const postsDirectory = path.join(process.cwd(), "posts");
const cacheFilePath = path.join(process.cwd(), "cache/data.js");

function getCache(cached = true) {
  if(fs.existsSync(cacheFilePath) && cached) {
    var data = require("../cache/data");
    var cache = data.cache;
    return cache
  }
  return {}
}
function getSortedPostsData(cached = true) {
  var cache = getCache(cached);
  if(cache.getSortedPostsData != undefined)
  {
    return cache.getSortedPostsData;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
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
  //Add to cache
  cache.getSortedPostsData = retVal;
  // Sort posts by date
  return cache.getSortedPostsData;
}

function getAllPostIds(cached = true) {
  var cache = getCache(cached);
  if(cache.getAllPostIds != undefined)
  {
    return cache.getAllPostIds;
  }
  const fileNames = fs.readdirSync(postsDirectory);
  var retVal = fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
  cache.getAllPostIds = retVal;
  return cache.getAllPostIds;
}

async function getPostData(id, cached = true) {
  var cache = getCache(cached);
  if(cache.postData == undefined)
  {
    cache.postData = {};
  }
  if(cache.postData != undefined && cache.postData[id] != undefined)
  {
    return cache.postData[id];
  }
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
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  var retVal = {
    id,
    contentHtml,
    ...matterResult.data,
  };
  cache.postData[id]=retVal;
  return retVal;
}

async function updateCache()
{
  exec("git restore .");
  exec("git pull");
  
  var newCache = {}
  var allIds = getAllPostIds(false);
  newCache.postData = {}
  for (let index = 0; index < allIds.length; index++) {
    const obj = allIds[index];
    let id = obj.params.id;
    let data = await getPostData(id, false);
    newCache.postData[id] = data
  }

  newCache.getAllPostIds = allIds;
  newCache.getSortedPostsData = getSortedPostsData(false);
  try {
    fs.readdirSync('cache')
  } catch (e) {
    fs.mkdirSync('cache')
  }
  let cacheFileContent = `export const cache = ${JSON.stringify(newCache)}`

  fs.writeFile('cache/data.js', cacheFileContent, function (err) {
    if (err) return console.log(err);
    console.log('Posts cached.');
    console.log(newCache.getSortedPostsData);
  });

  exec("npm install && npm run build")
  exec("sudo pm2 restart app")
  return fs.existsSync(cacheFilePath);
}
module.exports = { getAllPostIds, getPostData, getSortedPostsData, updateCache, getCache }
