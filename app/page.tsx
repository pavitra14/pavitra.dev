import { getAllBlogs, getHomepageSettings } from '@/utils/mdx';
import Main from './Main';

export default async function Page() {
  const posts = await getAllBlogs();
  const settings = await getHomepageSettings();

  return <Main posts={posts} settings={settings} />;
}
