'use client';

import Snowfall from 'react-snowfall';
import { formatDate } from 'pliny/utils/formatDate.js';
// import NewsletterForm from 'pliny/ui/NewsletterForm.js';

import siteMetadata from '@/data/siteMetadata';
import { Tag, Link, Twemoji } from '@/components/ui';
import { Avatar, Heading, ShortDescription } from '@/components/homepage';

const MAX_DISPLAY = 5;

export default function Home({ posts, settings }: { posts: any[]; settings?: any }) {
  const dynamicDescription = settings?.description || siteMetadata.description;

  return (
    <div className="relative">
      <Snowfall
        snowflakeCount={60}
        style={{
          zIndex: -1,
          width: '100vw',
          height: '100vh',
          position: 'fixed',
        }}
      />

      {/* Introduce myself */}
      <div className="mt-8 md:mt-8 dark:divide-gray-700">
        <div className="flex flex-col justify-between md:my-4 md:pb-8 xl:flex-row">
          <Avatar pictureUrl={settings?.pictureUrl} />
          <div className="my-auto ml-4 flex flex-col text-lg leading-8 text-gray-600 dark:text-gray-400">
            <Heading />
            <ShortDescription description={dynamicDescription} resumeLink={settings?.resumeLink} />
            <p className="flex">
              <span className="mr-2">Happy reading</span>
              <Twemoji emoji="clinking-beer-mugs" />
            </p>
          </div>
        </div>
      </div>

      {/* List all post */}
      <div className="mt-16 sm:mt-24">
        <div className="space-y-4 md:space-y-6">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-3xl leading-9 font-extrabold tracking-tight text-gray-900 text-transparent sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:from-white dark:to-gray-400 dark:text-gray-100">
            Recent Posts
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{siteMetadata.description}</p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post;
            return (
              <li key={slug} className="group relative flex">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-30 dark:from-sky-400 dark:to-indigo-500"></div>
                <article className="relative flex w-full flex-col items-start justify-between rounded-2xl border border-gray-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50">
                  <div className="w-full space-y-4">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="flex items-center text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <svg
                          className="mr-1.5 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div>
                      <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
                        <Link
                          href={`/blog/${slug}`}
                          className="group-hover:text-primary-500 text-gray-900 transition-colors duration-200 dark:text-gray-100"
                        >
                          {title}
                        </Link>
                      </h2>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>
                    <div className="prose line-clamp-3 max-w-none text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {summary}
                    </div>
                  </div>
                  <div className="mt-6 text-sm font-medium">
                    <Link
                      href={`/blog/${slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center transition-colors"
                      aria-label={`Read "${title}"`}
                    >
                      Read more
                      <svg
                        className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="mt-12 flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center rounded-full px-6 py-3 text-white shadow-sm transition-colors duration-200 hover:shadow-md"
            aria-label="All posts"
          >
            View All Posts
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
