import Head from "next/head";
import Layout, { siteTitle, shortIntro } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section id="links">
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
        <p>I write the logic which makes your app *really* work.</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
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
