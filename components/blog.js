import Link from "next/link";
import Date from "../components/date";
import Constants from "../constants/constants";
import utilStyles from "../styles/utils.module.css";
import { useCallback, useRef, useState } from 'react'
import styles from "./blog.module.css";
import Views from "./views";
import { Row, Col } from "react-bootstrap";

export default function Blog({ blogData }) {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(true)
  const [results, setResults] = useState(blogData)

  const searchEndpoint = (query) => `${Constants.GET_ROUTE('search')}${query}`

  const onChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query)
    if (query.length) {
      fetch(searchEndpoint(query))
        .then(res => res.json())
        .then(res => {
          setResults(res)
        })
    } else {
      setResults(blogData)
    }
  }, [])

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])


  return (
    <div>
      <div className={styles.searchBar}>
        <h2 
        className={`${styles.blogTitle}`}
        >Blog </h2>
        <input
          className={styles.search__input}
          onChange={onChange}
          onFocus={onFocus}
          placeholder='Search posts'
          type='text'
          value={query}
        />
      </div>

      { active && results.length > 0 && (
        
        <ul className={utilStyles.list}>
            {results.map(({ id, date, title, excerpt }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <p className={utilStyles.smalltext}>{excerpt}</p>
              <small className={utilStyles.smalltext}>
              <Row className={utilStyles.lightText}>
                <Col>
                <Date dateString={date} />
                <Views id={id} classes={utilStyles.right}/>
                </Col>
              </Row>
              </small>
            </li>
          ))}
        </ul>
      ) }
    </div>
  );
}
