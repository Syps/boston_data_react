import React, { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import CalendarHeatmap from './heatmap'

export default class CalendarViz extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dayData: null
    }
  }

  mouseOverRect(d) {
    this.setState({dayData: {
      'day': d.target.getAttribute('data-day'),
      'month': d.target.getAttribute('data-month'),
      'count': d.target.getAttribute('data-count')
    }})
  }

  render() {
    const { name, data } = this.props
    const { dayData } = this.state
    const monthNames = ["January", "February", "March",
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December"]

    let infoHeader
    let infoText

    if (dayData) {
      infoHeader = `${monthNames[dayData['month']]} ${dayData['day']}`
      infoText = `${dayData.count} violent crime incident${+dayData.count === 1 ? "" : "s"}`
    }

    const dayInfo = dayData ? (
      <div className="cal-data" id="cd1">
        <h2>{ infoHeader }</h2>
        <p>{ infoText }</p>
      </div>
    ) : null

    return (
      <div className="row">
          <h2 className="chart-heading">{ name }</h2>
          <div className="calendar-chart">
            <CalendarHeatmap data={ data } mouseover={::this.mouseOverRect} />
            { dayInfo }
          </div>
      </div>
    )
  }
}
