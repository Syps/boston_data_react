import React, { Component } from 'react'
import LeafletChart from './leafletchart'

export default class MapContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectVal: 'povertyPct'
    }
  }

  onSelectChange(event) {
      this.setState({selectVal: event.target.value})
  }

  render() {

    const { neighborhoods } = this.props

    return (
      <div id="map-wrap">
        <div className="custom-selector">
          <select id="choropleth-select" onChange={::this.onSelectChange}>
            <option value="povertyPct">Families in Poverty (%)</option>
            <option value="unemploymentPct">Unemployment (%)</option>
            <option value="vCrime1000">Violent Crimes Per Thousand People</option>
            <option value="shootings">Shootings (January - August 2015)</option>
          </select>
        </div>
        <LeafletChart geojson={ neighborhoods } currentSelect={ this.state.selectVal }/>
      </div>
    )
  }
}
