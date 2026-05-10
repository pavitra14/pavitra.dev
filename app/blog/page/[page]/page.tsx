import ListLayout from '@/layouts/ListLayoutWithTags';
import { getAllBlogs, getAllTags } from '@/utils/mdx';

const POSTS_PER_PAGE = 5;

export const generateStaticParams = async () => {
  const allBlogs = await getAllBlogs();
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));

  return paths;
};

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const posts = await getAllBlogs();
  const tags = await getAllTags();
  const pageNumber = parseInt(params.page as string);
  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      tags={tags}
      title="All Posts"
    />
  );
}
