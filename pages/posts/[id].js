import Layout from "../../components/layout";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import "prismjs/themes/prism.css";
import Image from "next/image";
import Constants from "../../constants/constants";
import Views from "../../components/views";
import { Row, Col } from "react-bootstrap";

export async function getServerSideProps({ params }) {
  const route = Constants.GET_ROUTE("getPost");
  const res = await fetch(`${route}${params.id}`);
  const postData = await res.json();
  return {
    props: {
      postData,
    },
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
        <h1>{postData.title}</h1>
        
        <div>
          <small className={utilStyles.smalltext}>
              <Row className={utilStyles.lightText}>
                <Col>
                <Date dateString={postData.date} />
                <Views id={postData.id} classes={utilStyles.right}/>
                </Col>
              </Row>
              </small>
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
