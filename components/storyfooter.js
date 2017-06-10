import React from 'react'
import FontAwesome from 'react-fontawesome'


export default ({ githubLink }) => {
  const home = "/"
  return (
    <div className="row">
      <div id="footer">
        <div className='footer-top'>
          <a target="_blank" href={ githubLink }>
            <FontAwesome className='social-media-icon' name='github-alt' />
          </a>
          <a target="_blank" href="https://www.linkedin.com/in/nicholas-sypteras-0a24a969">
            <FontAwesome className='social-media-icon' name='linkedin' />
          </a>
        </div>
        <div className='footer-bottom'>
          <a className='home-link'
            href={ home }>nick sypteras</a>
        </div>
      </div>
    </div>
  )
}
