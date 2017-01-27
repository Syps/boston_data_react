import React, { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import SimpleChart from './simplechart'

const drawChart = (data, margin, width, height, tooltipOff, tooltipOn) => {

    const scatterDiv = new ReactFauxDOM.createElement('div')
    const scatterDomain = 'povertyPct'
    const scatterRange = 'violentCrimesPerThousandPpl'
    const cLabel = 'Neighborhood'
    const scatterDivId = '#scatter-canvas1'

    scatterDiv.setAttribute("id", scatterDivId)
    scatterDiv.setAttribute("class", 'chart-canvas')

    let xValue = (d) => d[scatterDomain],
        xScale = d3.scale.linear().range([0, width]),
        xMap = (d) => xScale(xValue(d)),
        xAxis = d3.svg.axis().scale(xScale).orient("bottom")


    let yValue = (d) => d[scatterRange],
        yScale = d3.scale.linear().range([height, 0]),
        yMap = (d) => yScale(yValue(d)),
        yAxis = d3.svg.axis().scale(yScale).orient("left")

    let cValue = (d) => d[scatterDomain],
        color = d3.scale.linear().range(['#f99f3e', '#db510d']).domain([0, 10])

    let scatterSVG = d3.select(scatterDiv).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

    const formattedValues = (d) => {
        return `(${xValue(d)}, ${yValue(d)})`
    }

    data.forEach((d) => {
        d[scatterDomain] = +d[scatterDomain]
        d[scatterRange] = +d[scatterRange]
    });

    data = data.filter((d) => d['Neighborhood'] !== 'West End')

    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1])
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1])

    scatterSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Pct Families in Poverty")

    scatterSVG.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Violent Crime Per Capita")


    scatterSVG.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 6)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", (d) => color(cValue(d)))
        .on("mouseover", (d) => {
            const tooltip = {
              displayData: {
                label: d[cLabel],
                domain: d[scatterDomain].toFixed(2),
                range: d[scatterRange].toFixed(2),
                text: ''
              },
              show: true,
              style: {
                left: `${d3.event.pageX + 5}px`,
                top: `${d3.event.pageY - 28}px`,
              },
              isBarChart: false
            }
            tooltipOn({tooltip: tooltip})
        })
        .on("mouseout", (d) => {
          tooltipOff()
        })
    return scatterDiv
}

export default (props) => {
  return <SimpleChart drawChart={ drawChart } { ...props } />
}
