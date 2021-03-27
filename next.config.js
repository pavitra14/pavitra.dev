const { getPath } = require("./scripts/getExportPathMap");
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
  var props = {
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
    env: {
      mode: "",
    },
  };

  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== "1";

  if (isDev) {
    props.env.mode = "DEV";
  }
  if (isProd) {
    props.env.mode = "PROD";
  }
  return props;
};
