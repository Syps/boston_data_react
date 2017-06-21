import React, { Component } from 'react'
import StoryHeader from './components/storyheader'
import StoryFooter from './components/storyfooter'
import ScatterPlot from './components/scatter'
import BarChart from './components/barchart'
import MapContainer from './components/mapcontainer'
import CalendarViz from './components/calendarviz'
import CalendarHeatmap from './components/heatmap'
import d3 from 'd3'

export default class BostonStory extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      neighborhood: [],
      calendarData: []
    }
  }

  loadCSV() {
    return new Promise((resolve, reject) => {
      d3.csv('/csv/averages_2015.csv', (er, data) => {
        if (!er) {
          resolve(data)
        }
        reject(er)
      })
    })
  }

  loadCSV2() {
    return new Promise((resolve, reject) => {
      d3.csv('/csv/neighborhood_crime_cmp.csv', (er, data) => {
        if (!er) {
          resolve(data)
        }
        reject(er)
      })
    })
  }

  loadJSON() {
    return new Promise((resolve, reject) => {
      d3.json('/json/neighborhoods.json', (er, data) => {
        resolve(data)
      })
    })
  }

  valForScreenSize (small, large) {
    if (document.documentElement.clientWidth > 1400) {
        return large
    }
    return small
  }

  getSimpleChartDimens() {
    let margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    }

    let width = this.valForScreenSize(700, 960) - margin.left - margin.right
    let height = this.valForScreenSize(365, 500) - margin.top - margin.bottom

    return {
      margin: margin,
      width: width,
      height: height
    }
  }

  getCalendarData(data) {
    const dataSets = {
      'Brighton': [],
      'Fenway': [],
      'Roxbury': []
    }

    data.forEach((d) => {
        const n = dataSets[d['Neighborhood']]
        const obj = {}
        const _date = d['date_str']

        const month = (_date.substring(0, 2)) - 1;
        const day = +_date.substring(3, 5);
        const year = 2015;

        obj['date'] = new Date(year, month, day);
        obj['count'] = d['violent'];
        n.push(obj);
    })

    return dataSets
  }

  componentDidMount() {
    this.loadCSV()
      .then((data) => this.setState({data: data}))
      .then(this.loadJSON)
      .then((data) => this.setState({neighborhoods: data}))
      .then(this.loadCSV2)
      .then((data) => this.getCalendarData(data))
      .then((calendarData) => this.setState({calendarData: calendarData}))
  }

  render() {

    const chartDimens = this.getSimpleChartDimens()

    const heading = 'Poverty and Crime in Boston'
    const subheading = 'January 1 - August 10, 2015'
    const date = 'December 2016'
    const githubLink = 'https://github.com/Syps/boston_data'

    return (

      <div>
        <StoryHeader heading={ heading } subheading={ subheading } date={ date }/>
        <div className="container">

          <div className="row">
            <p>Many of the discussions in my Social Justice class this semester focused on the issues of poverty and violence. I learned a lot from these discussions; they also showed me how little I had previously understood about the prevalence of poverty
                and violence in Boston.</p>

            <p>I decided to leverage public data sets to educate myself and hopefully others in this area.</p>

            <p>In the charts below, I’ve visualized several pieces of 2015 crime and poverty data from the US Census Bureau and the City of Boston. I learned a lot in the process of exploring this data, and hope this site can be informative to others as
                well.
            </p>
            <br />
            <br />
          </div>

          <div className="row">
            <div className="chart-heading">Violent Crime and Poverty</div>

            <ScatterPlot data={ this.state.data } { ...chartDimens }/>

            <p> The scatter plot above charts violent crimes per thousand people as a function of poverty rate in each Boston neighborhood. Hover over the dots to display the numbers for that neighborhood.</p>
            <p>I was surprised to see that Roxbury has the highest rate of violent crime in Boston, considering its proximity to Northeastern. Perhaps more surprising however, was Mission Hill’s high poverty rate and its relatively low crime rate.</p>

            <p>I tried to investigate this further by mining BPD FIO data. Unfortunately, the FIO dataset does not include exact location data, so it is impossible to see which FIO activity took place in Mission Hill. My guess is that the low crime rate
                is a product of gentrification. Many students have moved to Mission Hill, pushing existing residents out. In light of this trend, it is possible that Northeastern pushes BPD to police more heavily there.</p>

            <p>As we discussed in class, the chart suggests a positive relationship between poverty and crime, though this trend isn’t illustrated as strongly as shooting data.</p>
            <br />
          </div>

          <div className="row">

            <div className="chart-heading">Shootings - January to August 2015</div>

            <BarChart data={ this.state.data } { ...chartDimens }/>

            <p>Here, the dichotomy between poor and wealthy Boston neighborhoods is better illustrated. We can see that the top 3 poorest neighborhoods from above (Dorchester, Mattapan, Roxbury) have higher rates of shootings than any other neighborhoods.
                For Dorchester and Roxbury, the difference is astronomical (8- and 6-fold, respectively).</p>
            <br />

            <p>The following heatmap illustrates the distribution of poverty and crime across Boston. Use the selector on top to pick criteria for the heatmap, then hover over a neighborhood to reveal stats. You may have to adjust the zoom or drag the map
                to fit your screen size.</p>
            <br />
          </div>
        </div>

        <MapContainer neighborhoods={this.state.neighborhoods}/>

          <div className="container bottom-container">
            <div className="row">
                <p>By playing with the map, it was interesting to see that the Boston neighborhoods where I and many other Northeastern students hang out the most (Back Bay, Downtown, Chinatown) all have the lowest poverty rates.</p>
                <p>It thus becomes clear how even in a city as small as Boston, the distribution of poverty and gentrification create a divide in perceptions of the city. Residents of communities like Roxbury and Dorchester experience relatively high rates of
                    poverty and its effects, while it is easy for students like myself to remain unaware.</p>

                <p>Take for instance, the calendar heat maps below, which plot violent crimes committed from January to August 2015 in three different communities. Brighton and Roxbury have relatively equal populations, but lie on different ends of the economic
                    spectrum. Fenway is a smaller community right next to Northeastern home to many students such as myself. Hover over the calendar to see crime numbers for a given day.</p>
                <br />
            </div>

            <CalendarViz name='Fenway' data={this.state.calendarData['Fenway']} />
            <CalendarViz name='Brighton' data={this.state.calendarData['Brighton']} />
            <CalendarViz name='Roxbury' data={this.state.calendarData['Roxbury']} />

            <div className="row">
                <p>Most days on the first two calendars are white, meaning no violent crimes occurred. On the other hand, only 9 days occurred in which no violent crimes were reported in Roxbury over the 8 month period. The heat map coloring is also relative
                    to each neighborhood. This means that the darkest square for Brighton indicates a day where 3 crimes were committed, whereas 13 crimes were committed in Roxbury’s darkest square.</p>
                <p>A discussion we had in class is also of note here. Specifically, we discussed how poor communities with higher crime rates often have less trust of the police and report crimes less frequently. Meanwhile, it is not hard to image that residents
                    of Brighton and Fenway will likely report a violent crime if they see one. So the difference may be even more significant than the heat maps suggest. </p>
                <br />
            </div>


            <div className="row">
                <h2 className="chart-heading">Conclusion</h2>
                <br />
                <p>Exploring and visualizing this data was a meaningful experience and I would like to continue the process. The US Census bureau has a lot to offer and I look forward to seeing the City of Boston’s data portal continue to grow. I will likely
                    continue to play with this site in the future and hopefully further my understanding of these topics.</p>
                <br />
            </div>
          </div>
          <StoryFooter githubLink={ githubLink } />

      </div>

  )



  }
}
