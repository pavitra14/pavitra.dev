import Link from "next/link";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";

export default function Blog({ blogData }) {
  // some code...
  const ConditionalWrapper = ({ condition, linkref, title }) => {
    return (
      <Link href={linkref}>
        <a>{title}</a>
      </Link>
    );
//     return condition == "DEV" ? (
//       <Link href={linkref}>
//         <a>DEVMODE: {title}</a>
//       </Link>
//     ) : (
//       <Link href={linkref} as={linkref + ".html"}>
//         <a>{title}</a>
//       </Link>
//     );
  };
  return (
    <ul className={utilStyles.list}>
      {blogData.map(({ id, date, title, excerpt }) => (
        <li className={utilStyles.listItem} key={id}>
          <ConditionalWrapper
            condition={process.env.mode}
            linkref={`/posts/${id}`}
            title={title}
          />
          <p className={utilStyles.smalltext}>{excerpt}</p>
          <small className={utilStyles.lightText}>
            <Date dateString={date} />
          </small>
        </li>
      ))}
    </ul>
  );
}
