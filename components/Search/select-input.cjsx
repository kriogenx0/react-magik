# SelectInput
# Basic select input component. You should pass a list of tuples as the `options` prop.
#
# Sample Usage:
#   <SelectInput
#     options=[{'value': 1, 'label': 'First Element'}, {'value': 2, 'label': 'Second Element'}, ....]
#     label="My Input"
#   />

# Options
# Options can either be
# 1. an array of strings and numbers
# 2. an array of objects having { label: "Label", value: "value" }

module.exports = React.createClass

  displayName: 'SelectInput'

  propTypes:
    options: PropTypes.array
    initialText: PropTypes.string
    onChange: PropTypes.func
    ref: PropTypes.string

  getDefaultProps: ->
    options: null
    initialText: null
    onChange: (value) ->
    ref: 'input'

  getInitialState: ->
    value: @props.value

  onChange: (e) ->
    value = e.target.value

    @setState value: value

    if @props.onChange
      @props.onChange value

  render: ->

    <select ref={@props.ref} onChange={@onChange} defaultValue={@props.defaultValue} value={@state.value} className="txt inp inp-select l-full-width">
      {if @props.initialText
        <option value="" key={0}>{@props.initialText}</option>
      }
      {if @props.options
        for option, index in @props.options
          <option value={option.value or option} key={index + 1}>{option.label or option}</option>
      }
    </select>
