import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import "prismjs/themes/prism.css";
import Image from "next/image";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: true,
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} />
        <meta property="og:locale" content="en_US" />
        <meta name="description" content={postData.excerpt} />
        <meta property="og:description" content={postData.excerpt} />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
      <a href="https://www.buymeacoffee.com/HOZtmqr" target="_blank">
        <Image
          src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
          alt="Buy Me A Coffee"
          height={60}
          width={217}
          unoptimized={true}
        />
      </a>
    </Layout>
  );
}
