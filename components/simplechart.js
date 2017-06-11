import React, { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import Tooltip from './tooltip'

export default class SimpleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tooltip: {show: false}
    }
  }

  tooltipOff() {
    let {show, ...rest} = this.state.tooltip
    this.setState({tooltip: {show: false, ...rest}})
  }

  tooltipOn(updateState) {
    this.setState(updateState)
  }

  render() {
    const { data, margin, width, height, drawChart } = this.props
    return (
      <div>
      { drawChart(data, margin, width, height, ::this.tooltipOff, ::this.tooltipOn).toReact() }
      <Tooltip {...this.state.tooltip} />
      </div>
    )
  }
}
