'use client';

import { slug } from 'github-slugger';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { formatDate } from 'pliny/utils/formatDate.js';
import type { Blog } from '@/utils/mdx';
import type { CoreContent } from '@/utils/mdx';

import { Link, Tag } from '@/components/ui';
import siteMetadata from '@/data/siteMetadata';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[];
  title: string;
  initialDisplayPosts?: CoreContent<Blog>[];
  pagination?: PaginationProps;
  tags?: Record<string, number>;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname.split('/')[1];

  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`} rel="prev">
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  tags,
}: ListLayoutProps) {
  const pathname = usePathname();
  const tagCounts = tags || {};
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);
  const [searchValue, setSearchValue] = useState('');
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ');
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });
  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts = initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts;
  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-500 font-bold uppercase">All Posts</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div>
            {/* START */}
            <div className="space-y-2 pt-6 pb-8 md:space-y-5">
              <div className="relative max-w-lg">
                <label>
                  <span className="sr-only">Search articles</span>
                  <input
                    aria-label="Search articles"
                    type="text"
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search articles"
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  />
                </label>
                <svg
                  className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            {/* END */}
            <ul className="mt-4 space-y-6">
              {!filteredBlogPosts.length && 'No posts found.'}
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post;
                return (
                  <li key={path} className="group relative">
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-30 dark:from-sky-400 dark:to-indigo-500"></div>
                    <article className="relative flex flex-col items-start justify-between rounded-2xl border border-gray-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md xl:flex-row xl:items-center dark:border-gray-800 dark:bg-gray-900/50">
                      <div className="w-full flex-1 space-y-3">
                        <dl className="mb-2">
                          <dt className="sr-only">Published on</dt>
                          <dd className="flex items-center text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <time dateTime={date} suppressHydrationWarning>
                              {formatDate(date, siteMetadata.locale)}
                            </time>
                          </dd>
                        </dl>
                        <div>
                          <h2 className="mb-2 text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/${path}`}
                              className="group-hover:text-primary-500 text-gray-900 transition-colors duration-200 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose line-clamp-2 max-w-none text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 xl:mt-0 xl:ml-6">
                        <Link
                          href={`/${path}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center text-sm font-medium transition-colors"
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
            {pagination && pagination.totalPages > 1 && !searchValue && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
