import Link from "next/link";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";

export default function Blog({ blogData }) {
  return (
    <ul className={utilStyles.list}>
      {blogData.map(({ id, date, title, excerpt }) => (
        <li className={utilStyles.listItem} key={id}>
          <Link href={`/posts/${id}.html`}>
            <a>{title}</a>
          </Link>
          <p className={utilStyles.smalltext}>{excerpt}</p>
          <small className={utilStyles.lightText}>
            <Date dateString={date} />
          </small>
        </li>
      ))}
    </ul>
  );
}
