import React from 'react'

export default (props) => {

    const { displayData, show, style, isBarChart } = props

    const tooltipClass = `tooltip${(show ? ' show' : '')}`

    const inner = () => {

    return !!displayData ? (isBarChart ? displayData.text :
      (
        <div className="tthd"><h5 className="tth">{ displayData.label }</h5>
          <br/>
          <p>{ displayData.domain }% of families in poverty</p>
          <p>{ displayData.range } violent crimes per 1,000 people</p>
        </div>
      )
    ) : <div></div>
    }

    return (
      <div className={ tooltipClass } style={style}>
        { inner() }
      </div>
    )
}
