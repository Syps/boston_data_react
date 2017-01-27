import React, { Component } from 'react'
import moment from 'moment'

export default class CalendarHeatmap extends Component {

  constructor(props) {
    super(props)

    if (!Array.prototype.find) {
      Array.prototype.find = function (predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    }

    const now = new Date(2015,7,9)
    const yearAgo = new Date(2015,0,1)

    this.state = {
      dayInfo: null,
      SQUARE_LENGTH: 15,
      SQUARE_PADDING: 2,
      dateRange: d3.time.days(yearAgo, now),
      monthRange: d3.time.months(moment(yearAgo).startOf('month').toDate(), now),
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    }
  }

  countForDate(data, d) {
    let count = 0
    const match = data.find((el, index) => moment(el.date).isSame(d.date, 'day'))

    if (match) {
      count = match.count
    }
    return count
  }

  rectX(d) {
    const { SQUARE_LENGTH, SQUARE_PADDING, dateRange } = this.state
    const cellDate = moment(d.date)
    const firstDate = moment(dateRange[0])

    const result = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
    return result * (SQUARE_LENGTH + SQUARE_PADDING)
  }

  rectY(d) {
    const MONTH_LABEL_PADDING = 6
    return MONTH_LABEL_PADDING + d.date.getDay() * (this.state.SQUARE_LENGTH + this.state.SQUARE_PADDING)
  }

  monthX(d) {
    const { dateRange, SQUARE_LENGTH, SQUARE_PADDING } = this.state
    let matchIndex = 0;
    dateRange.find((el, index) => {
      matchIndex = index;
      return moment(d).isSame(el, 'month') && moment(d).isSame(el, 'year');
    })

    return Math.floor(matchIndex / 6.8) * (SQUARE_LENGTH + SQUARE_PADDING)
  }

  monthY(d) {
    return 0
  }

  getDay(d, index) {
    const { SQUARE_LENGTH, SQUARE_PADDING } = this.state
    const transform = `translate(-8, ${(SQUARE_LENGTH + SQUARE_PADDING) * (index + 1)})`
    const style = {
      textAnchor: 'middle'
    }

    return (
      <text className='day-initial'
        style={style}
        key={d}
        transform={transform}
        dy={2}>{d}</text>
    )
  }

  getDays() {
    const { days } = this.state
    return days.filter((d, i) => i % 2).map((d, i) => this.getDay(d, i))
  }

  color(data, item) {
    const range = ['#ffffff', '#800000']
    const domain = [0, d3.max(data, (d) => d.count)]

    const clr = d3.scale.linear().range(range).domain(domain)
    return clr(this.countForDate(data, item))
  }


  getRects(data, mouseover) {
    return data.map((d) => this.rect(data, d, mouseover))
  }

  rect(data, d, mouseover) {
    const fill = this.color(data, d)

    return (
      <rect className="day-cell"
        width="15"
        height="15"
        key={+d.date}
        fill={fill}
        data-day={d.date.getDate()}
        data-month={d.date.getMonth()}
        data-count={d.count}
        x={this.rectX(d)}
        y={this.rectY(d)}
        onMouseOver={mouseover}></rect>
    )
  }

  getMonth(d) {
    const { months } = this.state
    return (
      <text className="month-name"
        key={'month' + d.getMonth()}
        x={this.monthX(d)}
        y={this.monthY(d)}>{ months[d.getMonth()] }</text>
    )
  }

  getMonths() {
    const { monthRange } = this.state
    return monthRange.map((month) => this.getMonth(month))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!!this.props.data
  }

  render() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    const { data, name, mouseover } = this.props

    const svgStyle = {
      width: 550,
      height: 130,
      padding: '36px'
    }

    return (
          <div>
          <svg className="calendar-heatmap" style={svgStyle}>
            { data ? this.getRects(data, mouseover) : null }
            { this.getMonths() }
            { this.getDays() }
          </svg>
          </div>
    )
  }
}
