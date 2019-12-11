# Date Picker component
# 2015-02-20T19:33:32.295641Z

# https://github.com/xdan/datetimepicker
require '../../../bower_components/datetimepicker/jquery.datetimepicker'
moment = require 'moment'

module.exports = React.createClass
  displayName: 'Date Picker'

  propTypes:
    name: React.PropTypes.string
    showDate: React.PropTypes.bool
    showTime: React.PropTypes.bool
    value: React.PropTypes.string
    defaultValue: React.PropTypes.string
    onChange: React.PropTypes.func
    onClose: React.PropTypes.func
    minDate: React.PropTypes.string
    maxDate: React.PropTypes.string
    placeholder: React.PropTypes.string
    isInline: React.PropTypes.bool
    align: React.PropTypes.string
    inputClass: React.PropTypes.string

  getDefaultProps: ->
    name: null
    showDate: true
    showTime: true
    value: null
    defaultValue: null
    onChange: ->
    onClose: ->
    minDate: null
    maxDate: null
    placeholder: ''
    isInline: false
    align: 'left'
    inputClass: null

  getInitialState: ->
    dbValue: @props.value or @props.defaultValue
    showDate: @props.showDate
    showTime: @props.showTime

  componentDidMount: ->
    @buildPicker()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.showDate isnt @props.showDate or nextProps.showTime isnt @props.showTime or nextProps.value isnt @state.dbValue or nextProps.minDate isnt @state.minDate
      $(@refs.datetime.getDOMNode()).datetimepicker 'destroy'
      @setState
        showDate: nextProps.showDate
        showTime: nextProps.showTime
        dbValue: nextProps.value
        minDate: nextProps.minDate
      , @buildPicker
    else
      @setState
        dbValue: nextProps.value
      , @setInputValue

  componentWillUnmount: ->
    $(@refs.datetime.getDOMNode()).datetimepicker 'destroy'

  momentDisplayFormat: ->
    if @state.showDate and @state.showTime
      'M/D/YY @ h:mmA'
    else if @state.showDate
      'M/D/YY'
    else if @state.showTime
      'h:mmA'

  pluginDisplayFormat: ->
    if @state.showDate and @state.showTime
      'n/j/y @ h:iA'
    else if @state.showDate
      'n/j/y'
    else if @state.showTime
      'h:iA'

  setInputValue: ->
    inputNode = @refs.datetime.getDOMNode()

    if @state.dbValue and moment(@state.dbValue).isValid()
      inputNode.value = moment(@state.dbValue).format(@momentDisplayFormat())
    else
      inputNode.value = ''

  buildPicker: ->
    pluginDisplayFormat = @pluginDisplayFormat()
    momentDisplayFormat = @momentDisplayFormat()

    @setInputValue()

    inputNode = @refs.datetime.getDOMNode()

    picker = null

    that = @

    if @props.minDate and moment(@props.minDate).isValid()
      minDate = moment(@props.minDate).startOf('day').toDate()

    if @props.maxDate and moment(@props.maxDate).isValid()
      maxDate = moment(@props.maxDate).endOf('day').toDate()

    if @props.defaultValue and moment(@props.defaultValue).isValid() and not inputNode.value
      defaultValue = moment(@props.defaultValue).format('YYYY/MM/DD')
    else
      defaultValue = null

    $(inputNode).datetimepicker(

      step: 30

      inline: @props.isInline

      # Overwrite of en i18n.
      i18n: en: dayOfWeek: ["SU", "M", "T", "W", "TH", "F", "SA"]

      # Attach near the input, not at the bottom of the body.
      parentID: @refs.dateWrap.getDOMNode()

      # Format the time on the right side.
      formatTime: 'g:i A',

      # Format the output that appears in the input.
      format: pluginDisplayFormat

      datepicker: @state.showDate
      timepicker: @state.showTime

      closeOnDateSelect: not @props.showTime

      minDate: minDate
      minTime: "12:00 AM"

      maxDate: maxDate
      maxTime: "11:59 PM"

      value: inputNode.value
      # defaultDate: defaultValue
      startDate: defaultValue if defaultValue
      defaultSelect: false
      scrollMonth: false

      onGenerate: ->
        picker = @
        picker.addClass 'ddn' unless that.props.isInline

        picker.find('.xdsoft_select').addClass 'ddn'

        if (not that.props.value or not that.refs.datetime.getDOMNode().value) and defaultValue
          picker.find('.xdsoft_current').removeClass 'xdsoft_current'

      onShow: (current_time) ->
        current_minutes = moment(current_time).minutes()

        # Turn off time highlight if it is not exact
        if current_minutes != 0 and current_minutes != 30
          picker.find('.xdsoft_time_variant').addClass 'is-imperfect'
        else
          picker.find('.xdsoft_time_variant').removeClass 'is-imperfect'

        # Use .ddn.is-visible styles on popup
        picker.addClass 'is-visible'
        picker.find('.xdsoft_select').addClass 'is-visible'

        if not that.state.dbValue
          picker.find('.xdsoft_calendar').addClass 'is-off-month'

        # The datetimepicker plugin will recognize javascript Date objects
        # but does not work with our format
        options = {}

        if inputNode.value
          options.value = inputNode.value

        picker.setOptions options

      onClose: (current_time) ->

        # Use .ddn.is-visible styles on popup
        picker.removeClass 'is-visible'
        picker.find('.xdsoft_select').removeClass 'is-visible'

        # I commented this out, because it was picking a date for user even if she didn't select anything (Josef)
        # dbValue = if current_time then moment(current_time).toISOString() else null
        # @setState dbValue: dbValue
        # @props.onChange dbValue
        # @props.onClose dbValue

      onChangeDateTime: (current_time) =>
        dbValue = if current_time then moment(current_time).toISOString() else null
        @setState dbValue: dbValue
        @props.onChange dbValue

      # Wait until the the plugin moves the .xdsoft_current class so there isn't a jump from previous date.
      onSelectDate: ->
        setTimeout (-> picker.find('.xdsoft_calendar').removeClass 'is-off-month'), 1

      onChangeMonth: (current_time) =>
        calendar = picker.find('.xdsoft_calendar')
        offClass = 'is-off-month'
        if moment(current_time).month() == moment(@state.dbValue).month()
          calendar.removeClass offClass
        else
          calendar.addClass offClass

    )

  render: ->
    <span>
      <div ref="dateWrap" className="dte #{if @props.align then 'is-' + @props.align else ''} #{if @props.showDate then 'date-enabled' else ''} #{if @props.showTime then 'time-enabled' else ''}">
        <input ref="datetime" className="txt #{if @props.inputClass then @props.inputClass else ''}" placeholder={@props.placeholder} />
        <input type="hidden" name={@props.name} value={@state.dbValue} onChange={->} />
      </div>
    </span>
