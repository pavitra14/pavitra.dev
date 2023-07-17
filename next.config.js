const { getPath } = require("./scripts/getExportPathMap");
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
  var props = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        require("./scripts/sitemap");
      }

      return config;
    },
    env: {
      mode: "",
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      VERCEL: process.env.VERCEL
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
