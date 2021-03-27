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
};
