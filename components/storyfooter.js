import React from 'react'


export default ({ githubLink }) => {
  return (
    <div className="row">
      <div id="footer">
          <span className="footer-item">
            [<a target="_blank" href={ githubLink }>code</a>]
          </span>
      </div>
    </div>
  )
}
