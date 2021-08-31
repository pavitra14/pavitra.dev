import Head from "next/head";
import Layout, { siteTitle, shortIntro } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Blog from "../components/blog";

function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="home">
      <p className="blog-description">{shortIntro}</p>
        <p className="blog-links">
        <a href="https://github.com/pavitra14" target="_blank">Github</a> | <a href="https://pbehre.in/resumes/Resume.pdf" target="_blank">Resume</a> | <a href="https://www.linkedin.com/in/pavitrabehre" target="_blank">LinkedIn</a>
      </p>
      </div>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>What I do?</h2>
        <p>I make computers go *beep bop beep boop* jk, love to write code, and making a piece of sand to perform whatever tasks I ask it to do is a great power. I use this power to be lazy :)</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <Blog blogData={allPostsData} />
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('http://pbehre.in:3001/blog/getSortedPostsData');
  const allPostsData = await res.json();
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      allPostsData,
    },
  }
}

export default Home