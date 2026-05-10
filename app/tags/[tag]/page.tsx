import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { slug } from 'github-slugger';
import { getAllBlogs, getAllTags } from '@/utils/mdx';

import { ListLayout } from 'layouts';
import { genPageMetadata } from 'app/seo';
import siteMetadata from '@/data/siteMetadata';

export async function generateMetadata(props: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tag = decodeURI(params.tag);

  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const tagCounts = await getAllTags();

  const tagKeys = Object.keys(tagCounts);

  const paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }));

  return paths;
};

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const decodedTag = decodeURI(params.tag);

  // Capitalize first letter and convert space to dash
  const title = decodedTag[0].toUpperCase() + decodedTag.split(' ').join('-').slice(1);

  const allBlogs = await getAllBlogs();
  const filteredPosts = allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(decodedTag));

  if (filteredPosts.length === 0) {
    return notFound();
  }

  return <ListLayout posts={filteredPosts} title={title} />;
}
