import Head from "next/head";
import Layout from "@/components/layout";
import utilStyles from "@/styles/utils.module.css";
import Blog from "@/components/blog";
import Constants from "@/constants/constants";
import ErrorPage from 'next/error';
import {fetchAndCache} from "@/scripts/UpstashCache";
function Home({ allPostsData }) {
  if (allPostsData.error) {
    const errMessage = "Internal Server Error - " + allPostsData.msg;
    return <ErrorPage statusCode={500} title={errMessage} />
  }
  return (
    <Layout home>
      <Head>
        <title>{Constants.SITE_TITLE}</title>
      </Head>
      <div className="home">
        <p className="blog-description">{Constants.SHORT_INTRO}</p>
        <p className="blog-links">
          <a href="https://github.com/pavitra14" target="_blank">Github</a> | <a href="https://pavitra.dev/resumes/Resume_2025.pdf" target="_blank">Resume</a> | <a href="https://www.linkedin.com/in/pavitrabehre" target="_blank">LinkedIn</a>
        </p>
      </div>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>What I do?</h2>
        <p>I make computers go *beep bop beep boop* jk, love to write code, and making a piece of sand to perform whatever tasks I ask it to do is a great power. I use this power to be lazy :)</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Blog blogData={allPostsData} />
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    const route = Constants.GET_ROUTE("getSortedPostsData");
    const res = await fetchAndCache(route);
    const allPostsData = await res;
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        allPostsData,
      },
    }
  } catch (err) {
    return {
      props: {
        allPostsData: {
          error: true,
          msg: err.message
        }
      }
    }
  }
}

export default Home
