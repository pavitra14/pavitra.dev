import 'css/tailwind.css';
import 'css/twemoji.css';
import 'pliny/search/algolia.css';
import 'react-medium-image-zoom/dist/styles.css';
import 'remark-github-blockquote-alert/alert.css';

import { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { SearchProvider, SearchConfig } from 'pliny/search/index.js';
// import { Analytics, AnalyticsConfig } from 'pliny/analytics/index.js';
import { SpeedInsights } from '@vercel/speed-insights/next';

import Header from '@/components/header';
import Footer from '@/components/footer';
import siteMetadata from '@/data/siteMetadata';
import { SectionContainer, TiltedGridBackground } from '@/components/ui';

import { ThemeProviders } from './theme-providers';
import { UmamiAnalytics } from '@/components/analytics/umami';

const FONT_OUTFIT = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || '';

  return (
    <html lang={siteMetadata.language} className={`${FONT_OUTFIT.variable} scroll-smooth`} suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/favicons/apple-touch-icon.png`} />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/dev.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/dev.png" />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link rel="mask-icon" href={`${basePath}/static/favicons/safari-pinned-tab.svg`} color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="dark:bg-dark bg-white pl-[calc(100vw-100%)] text-black antialiased dark:text-white">
        {/* Soft background glow blobs */}
        <div className="pointer-events-none fixed inset-0 z-[-2]">
          <div className="animate-blob absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 opacity-70 mix-blend-multiply blur-[100px] filter dark:bg-blue-600/20 dark:mix-blend-screen"></div>
          <div
            className="animate-blob absolute top-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 opacity-70 mix-blend-multiply blur-[100px] filter dark:bg-purple-600/20 dark:mix-blend-screen"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="animate-blob absolute -bottom-32 left-1/2 h-96 w-96 rounded-full bg-pink-500/10 opacity-70 mix-blend-multiply blur-[100px] filter dark:bg-pink-600/20 dark:mix-blend-screen"
            style={{ animationDelay: '4s' }}
          ></div>
        </div>
        <TiltedGridBackground className="inset-x-0 top-0 z-[-1] h-[60vh]" />

        <ThemeProviders>
          {/* <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} /> */}
          <UmamiAnalytics websiteId={siteMetadata.analytics?.umamiAnalytics?.umamiWebsiteId} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mt-20 mb-auto">{children}</main>
              <Footer />
            </SearchProvider>
          </SectionContainer>
          <SpeedInsights />
        </ThemeProviders>
      </body>
    </html>
  );
}
