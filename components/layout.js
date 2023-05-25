import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Constants from "../constants/constants";

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
        {home ? (
          <>
            <meta property="og:title" content={Constants.SITE_TITLE} />
            <meta property="og:locale" content="en_US" />
            <meta name="description" content={Constants.SITE_DESCRIPTION} />
            <meta property="og:description" content={Constants.SITE_DESCRIPTION} />
          </>
        ): (<></>)}
        <link rel="canonical" href="index.html" />
        <meta property="og:url" content="https://pavitra.dev/" />
        <meta property="og:site_name" content={Constants.SITE_TITLE}  />
      </Head>
      <div className="home">
        {home ? (
          <>
            <div className="blog-avatar" style= {{ backgroundImage: `url('/images/profile.jpg')`}} />
            <h1 className="blog-title">{Constants.USER_NAME}</h1>
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
                <a className="blog-title">{Constants.USER_NAME}</a>
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
