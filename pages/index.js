import Head from "next/head";
import Layout, { siteTitle, shortIntro } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Blog from "../components/blog";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.links}>
        <a target="_blank" href="https://github.com/pavitra14">
          <button className={utilStyles.bigbutton}>GitHub</button>
        </a>
        <a target="_blank" href="https://www.linkedin.com/in/pavitrabehre">
          <button className={utilStyles.bigbutton}>linkedIn</button>
        </a>
        <a target="_blank" href="mailto:pavitra.behre@gmail.com">
          <button className={utilStyles.bigbutton}>Mail</button>
        </a>
        <a
          target="_blank"
          href="https://pbehre.in/resumes/Resume.pdf"
          alt="Pavitra Behre - Resume"
        >
          <button className={utilStyles.bigbutton}>Resume/CV</button>
        </a>
      </section>
      <section className={utilStyles.headingMd}>
        <p>{shortIntro}</p>
      </section>

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

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
