const { getPath } = require("./scripts/getExportPathMap");
module.exports = {
  images: {
    loader: "imgix",
    path: "https://example.com/myaccount/",
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./scripts/sitemap");
    }

    return config;
  },

  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return getPath();
  },
};
