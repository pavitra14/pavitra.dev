import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

const name = "Pavitra Behre";
export const siteTitle = "Pavitra Behre | Welcome";
export const shortIntro =
  "Software Development Engineer - I @ Amazon 🇮🇳";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:locale" content="en_US" />
        <meta
          name="description"
          content="Web Developer, Backend Engineer, Student"
        />
        <meta
          property="og:description"
          content="Web Developer, Backend Engineer, Student"
        />
        <link rel="canonical" href="index.html" />
        <meta property="og:url" content="https://pbehre.in/" />
        <meta property="og:site_name" content={siteTitle} />
      </Head>
      <div className="home">
        {home ? (
          <>
            <div className="blog-avatar" style= {{ backgroundImage: `url('/images/profile.jpg')`}} />
            <h1 className="blog-title">{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <div className="blog-avatar" style= {{ backgroundImage: `url('/images/profile.jpg')`}} />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className="blog-title">{name}</a>
              </Link>
            </h2>
          </>
        )}
      </div>
      <main>{children}</main>
      {!home && (
        <div className="back">
          <Link href="/">
            <a>Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
