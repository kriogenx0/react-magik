# Date Picker + Formsy
Formsy = require 'formsy-react'

DatePicker = require 'components/lib/date-picker'

module.exports = React.createClass
  displayName: 'DateTimeRange'

  mixins: [Formsy.Mixin]

  propTypes:
    minDate: React.PropTypes.string
    maxDate: React.PropTypes.string
    align: React.PropTypes.string
    placeholder: React.PropTypes.string
    showDate: React.PropTypes.bool
    showTime: React.PropTypes.bool
    defaultValue: React.PropTypes.string
    onChange: React.PropTypes.func

  getDefaultProps: ->
    minDate: null
    maxDate: null
    align: null
    placeholder: ''
    showDate: true
    showTime: true
    defaultValue: null
    onChange: ->

  handleChange: (value) ->
    @setValue
    @props.onChange(value)

  render: ->
    <DatePicker
      minDate={@props.minDate}
      maxDate={@props.maxDate}
      value={@getValue()}
      onChange={@handleChange}
      showDate={@props.showDate}
      showTime={@props.showTime}
      placeholder={@props.placeholder}
      defaultValue={@props.defaultValue}
      align={@props.align} />
