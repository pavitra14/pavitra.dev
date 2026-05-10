import matter from 'gray-matter';
import GithubSlugger, { slug } from 'github-slugger';
import readingTime from 'reading-time';
import { listS3Objects, getS3Object } from './s3';
import siteMetadata from '@/data/siteMetadata';

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>;

export interface Blog {
  title: string;
  date: string;
  tags: string[];
  lastmod?: string;
  draft?: boolean;
  summary?: string;
  images?: string[] | string;
  authors?: string[];
  layout?: string;
  canonicalUrl?: string;
  slug: string;
  path: string;
  type: string;
  readingTime?: any;
  toc?: any;
  structuredData?: any;
  body: {
    raw: string;
  };
}

export interface Author {
  name: string;
  avatar: string;
  occupation: string;
  company: string;
  email: string;
  twitter: string;
  linkedin: string;
  github: string;
  layout: string;
  slug: string;
  body: {
    raw: string;
  };
}

import { unstable_cache } from 'next/cache';

function generateToc(content: string) {
  const slugger = new GithubSlugger();
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
  const headings = Array.from(contentWithoutCodeBlocks.matchAll(/^(#{2,6})\s+(.+)$/gm));
  return headings.map((match) => {
    const depth = match[1].length;
    const value = match[2].trim();
    const plainText = value.replace(/[*_~`]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    return { value: plainText, url: `#${slugger.slug(plainText)}`, depth };
  });
}

export const getAllBlogs = unstable_cache(
  async (): Promise<Blog[]> => {
    const objects = await listS3Objects('blogs/');
    const blogs: Blog[] = [];

    for (const obj of objects) {
      if (!obj.Key || !obj.Key.endsWith('.mdx')) continue;

      const rawContent = await getS3Object(obj.Key);
      if (!rawContent) continue;

      const { data, content } = matter(rawContent);
      const slug = obj.Key.replace('blogs/', '').replace('.mdx', '');

      blogs.push({
        title: data.title || 'Untitled',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        tags: data.tags || [],
        lastmod: data.lastmod ? new Date(data.lastmod).toISOString() : undefined,
        draft: data.draft || false,
        summary: data.summary || '',
        images: data.images || [],
        authors: data.authors || ['default'],
        layout: data.layout || 'PostLayout',
        canonicalUrl: data.canonicalUrl,
        slug,
        path: `blog/${slug}`,
        type: 'Blog',
        readingTime: readingTime(content),
        toc: generateToc(content),
        body: {
          raw: content,
        },
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          datePublished: data.date,
          dateModified: data.lastmod || data.date,
          description: data.summary,
          image: data.images ? data.images[0] : siteMetadata.socialBanner,
          url: `${siteMetadata.siteUrl}/blog/${slug}`,
        },
      });
    }

    // Filter drafts and sort by date descending
    return blogs
      .filter((post) => post.draft !== true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  ['all-blogs'],
  { tags: ['blogs'] }
);

export const getBlogBySlug = unstable_cache(
  async (slug: string): Promise<Blog | null> => {
    const key = `blogs/${slug}.mdx`;
    const rawContent = await getS3Object(key);
    if (!rawContent) return null;

    const { data, content } = matter(rawContent);

    return {
      title: data.title || 'Untitled',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      tags: data.tags || [],
      lastmod: data.lastmod ? new Date(data.lastmod).toISOString() : undefined,
      draft: data.draft || false,
      summary: data.summary || '',
      images: data.images || [],
      authors: data.authors || ['default'],
      layout: data.layout || 'PostLayout',
      canonicalUrl: data.canonicalUrl,
      slug,
      path: `blog/${slug}`,
      type: 'Blog',
      readingTime: readingTime(content),
      toc: generateToc(content),
      body: {
        raw: content,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        datePublished: data.date,
        dateModified: data.lastmod || data.date,
        description: data.summary,
        image: data.images ? data.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/blog/${slug}`,
      },
    };
  },
  ['blog-by-slug'],
  { tags: ['blogs'] }
);

export const getAllAuthors = unstable_cache(
  async () => {
    const objects = await listS3Objects('authors/');
    const authors: Author[] = [];

    for (const obj of objects) {
      if (!obj.Key || !obj.Key.endsWith('.mdx')) continue;

      const rawContent = await getS3Object(obj.Key);
      if (!rawContent) continue;

      const { data, content } = matter(rawContent);
      const slug = obj.Key.replace('authors/', '').replace('.mdx', '');

      authors.push({
        name: data.name || 'Author',
        avatar: data.avatar || '',
        occupation: data.occupation || '',
        company: data.company || '',
        email: data.email || '',
        twitter: data.twitter || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        layout: data.layout || '',
        slug,
        body: {
          raw: content,
        },
      });
    }

    return authors;
  },
  ['all-authors'],
  { tags: ['authors'] }
);

export const getAllTags = unstable_cache(async (): Promise<Record<string, number>> => {
  const blogs = await getAllBlogs();
  const tagCount: Record<string, number> = {};

  blogs.forEach((file) => {
    if (file.tags) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });
  return tagCount;
});

export const getHomepageSettings = unstable_cache(
  async () => {
    try {
      const settingsStr = await getS3Object('settings/homepage.json');
      if (settingsStr) {
        return JSON.parse(settingsStr);
      }
    } catch (err) {
      console.error('No homepage settings found', err);
    }
    return {};
  },
  ['homepage-settings'],
  { tags: ['settings'] }
);
