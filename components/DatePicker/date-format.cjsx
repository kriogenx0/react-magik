# Formats a date time value with moment js.

# <DateFormat date=your.date format="M/D/YY (Moment JS format)" fromNow=false />

Moment = require 'moment'

module.exports = React.createClass
  displayName: 'DateFormat'

  propTypes:
    date: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(Date)
      React.PropTypes.string
    ])
    format: React.PropTypes.string
    fromNow: React.PropTypes.bool
    empty: React.PropTypes.string

  getDefaultProps: ->
    date: null
    format: 'MMMM D, YYYY'
    fromNow: false
    empty: ''

  render: ->
    <span>
      {if @props.date
        if @props.fromNow
          Moment(@props.date).fromNow()
        else
          Moment(@props.date).format(@props.format)
      else
        @props.empty
      }
    </span>
