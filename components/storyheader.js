import React from 'react'

export default ({ heading, subheading }) => {

  return (
      <header className="custom-post-heading">
        <div className="container">
          <div className="row">
            <h1 className="heading-txt">{ heading }</h1>
            <h3 className="subheading">{ subheading }</h3>
          </div>
        </div>
      </header>
  )
}
