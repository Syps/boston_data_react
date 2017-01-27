import React, { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import SimpleChart from './simplechart'

const drawChart = (data, margin, width, height, tooltipOff, tooltipOn) => {
  const barDiv = new ReactFauxDOM.createElement('div')
  const barDomain = 'Neighborhood'
  const barRange = 'shootings'
  const barDivId = "#bar-canvas1"

  barDiv.setAttribute("id", barDivId)
  barDiv.setAttribute("class", 'chart-canvas')

  const barSVG = d3.select(barDiv).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 120)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const barX = d3.scale.ordinal().rangeRoundBands([0, width], 0.5)
  const barY = d3.scale.linear().range([height, 0])

  const barXAxis = d3.svg.axis()
      .scale(barX)
      .orient("bottom")
      .ticks(0)

  const barYAxis = d3.svg.axis()
      .scale(barY)
      .orient("left")
      .ticks(12)

  data.forEach((d) => { d[barRange] = +d[barRange]})

  data = data.filter((d) => d['Neighborhood'] !== 'West End')
    .filter((d) => d[barRange] > 0)

  barX.domain(data.map((d) => d[barDomain]))
  barY.domain([0, d3.max(data, (d) => d[barRange])])

  barSVG.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(barXAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.5em")
      .attr("transform", "rotate(-55)")

  barSVG.append("g")
      .attr("class", "y axis")
      .call(barYAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")

  barSVG.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => barX(d[barDomain]))
      .attr("width", barX.rangeBand())
      .attr("y", (d) => barY(d[barRange]))
      .attr("height", (d, i) => height - barY(d[barRange]))
      .on("mouseover", (d) => {
        const tooltip = {
          displayData: {
            text: `${d[barRange]} shootings`
          },
          show: true,
          style: {
            left: `${d3.event.pageX + 5}px`,
            top: `${d3.event.pageY - 40}px`,
            fontSize: "15px"
          },
          isBarChart: true
        }
        tooltipOn({tooltip: tooltip})
      })
      .on("mouseout", (d) => {
          tooltipOff()
      })
      return barDiv
}

export default (props) => {
  return <SimpleChart drawChart={ drawChart } { ...props } />
}
