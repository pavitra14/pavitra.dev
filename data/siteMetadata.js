const siteMetadata = {
  title: 'Pavitra Behre - Welcome',
  author: 'Pavitra Behre',
  fullName: 'Pavitra Behre',
  headerTitle: "Pavitra's Blog",
  description: '"The best way to predict the future is to invent it." - Alan Kay',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://pavitra.dev',
  analyticsURL: 'https://cloud.umami.is/share/u8Ni325JPpfn9aDq/pavitra.dev',
  siteRepo: 'https://github.com/pavitra14/pavitra.dev',
  siteLogo: '/static/images/avatar.jpg',
  image: '/static/images/avatar.jpg',
  socialBanner: '/static/images/avatar.jpg',
  email: 'me@pavitra.dev',
  github: 'https://github.com/pavitra14',
  facebook: '',
  linkedin: 'https://www.linkedin.com/in/pavitrabehre',
  twitter: '',
  youtube: '',
  locale: 'en-US',
  stickyNav: false,
  socialAccounts: {
    github: 'pavitra14',
    linkedin: 'pavitrabehre',
    facebook: '',
  },
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'title',
      reactions: '0',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
      inputPosition: 'bottom',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      // path to load documents to search
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
};

module.exports = siteMetadata;
