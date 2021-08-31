import React from 'react'
import { RichText, Link } from 'prismic-reactjs'
import { headerStyles } from 'styles'

/**
 * Homepage header component
 */
const Header = ({ image, headline, description, home_data, github, resume, linkedin }) => {
  return (
    <div className="home">
      <div className="blog-avatar" style={{ backgroundImage: `url(${image.url})` }} />
      <h1 className="blog-title">{RichText.asText(headline)}</h1>
      <p className="blog-description">{RichText.asText(description)}</p>
      
      <p className="blog-links">
        <a href={github} target="_blank">Github</a> | <a href={resume} target="_blank">Resume</a> | <a href={linkedin} target="_blank">LinkedIn</a>
      </p>
      <style jsx global>{headerStyles}</style>
    </div>
  )
}

export default Header
