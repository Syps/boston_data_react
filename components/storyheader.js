import React from 'react'

export default ({ heading, subheading, date }) => {

  return (
      <header className="custom-post-heading">
        <div className="container">
          <div className="row">
            <h1 className="heading-txt">{ heading }</h1>
            <h3 className="subheading">{ subheading }</h3>
            <h4 className="heading-date">{ date }</h4>
          </div>
        </div>
      </header>
  )
}
