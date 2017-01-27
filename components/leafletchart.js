import React, { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import Tooltip from './tooltip'
import L from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import Choropleth from 'react-leaflet-choropleth'
import Control from 'react-leaflet-control'

export default class LeafletChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      neighborhoodLayerStyle: {
                color: '#fff',
                weight: 2,
                fillOpacity: 0.8,
                dashArray: 3
      },
      currentNeighborhood: null
    }
  }

  highlightFeature(e) {
    const layer = e.target

    const { Name, pop, povertyPct, shootings, unemploymentPct, vCrime1000 } = layer.feature.properties

    layer.setStyle({
        weight: 5,
        color: '#fff',
        dashArray: '',
        fillOpacity: 0.7
    })

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    this.setState({currentNeighborhood:
      { Name, pop, povertyPct, shootings, unemploymentPct, vCrime1000 }
    })

  }

  resetHighlight(e) {
      const layer = e.target

      layer.setStyle(this.state.neighborhoodLayerStyle)
  }

  onEachFeature(feature, layer) {
      layer.on({
          mouseover: ::this.highlightFeature,
          mouseout: ::this.resetHighlight
      })
  }

  valForScreenSize (small, large) {
    if (document.documentElement.clientWidth > 1400) {
        return large
    }
    return small
  }

  getZoom() {
      return this.valForScreenSize(11, 11)
  }

  getCoords() {
      return this.valForScreenSize([42.317, -70.97], [42.317, -70.87])
  }

  invalidateSize() {
    this.refs.map.leafletElement.invalidateSize()
  }


  render() {

    const { neighborhoodLayerStyle, currentNeighborhood } = this.state
    let { currentSelect, geojson } = this.props

    currentSelect = this.props.currentSelect
    if (geojson && geojson.features) {
      geojson.features = geojson.features.filter((d) => d.properties.Name != "Harbor Islands")
    }

    const choropleth = geojson ? (
      <Choropleth
         data={geojson}
         valueProperty={(feature) => feature.properties[currentSelect]}
         scale={['white', 'red']}
         steps={10}
         mode='q'
         style={ neighborhoodLayerStyle }
         onEachFeature={::this.onEachFeature}
       />
    ) : null

    const info = currentNeighborhood ?
        currentNeighborhood.pop ? (
          <div className="info">
        		<h4>{currentNeighborhood.Name}</h4>
        		<br />
        		<p>Families in Poverty: {currentNeighborhood.povertyPct}%</p>
            <p>Unemployment: {currentNeighborhood.unemploymentPct}%</p>
            <p>Violent Crimes / 1000 People: {currentNeighborhood.vCrime1000}</p>
            <p>Shootings: {currentNeighborhood.shootings}</p>
          </div>
        )
        : (
          <div className="info">
      		  <h4>{currentNeighborhood.Name}</h4>
          </div>
        ) : (
          <div className="info"><h4>Hover over a neighborhood</h4></div>
        )

    return (
        <Map ref="map" center={this.getCoords()} zoom={this.getZoom()}
        scrollWheelZoom={false} doubleClickZoom={false}>
         <TileLayer
           attribution=''
           url='https://api.mapbox.com/styles/v1/syps/ciwf776k3003t2plk320qq8if/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3lwcyIsImEiOiJjaXdmNzIxeW8wODJ5Mm9vYnR4czY3bzYxIn0.UaUvDxbvMdYqrSuuTBjJ4g'
         />
         { choropleth }
         <Control position="topright" >
            { info }
        </Control>
       </Map>
    )
  }

  // leaflet tile render bug workaround
  componentDidMount() {
    window.setTimeout(() => this.refs.map.leafletElement.setView(this.getCoords(), 11.5),1)
  }

}
