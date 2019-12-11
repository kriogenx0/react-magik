# A simple radio button. Should nearly always be part of the <RadioGroup> component

module.exports = Radio = React.createClass

  propTypes:
    checked: PropTypes.bool
    name: PropTypes.string
    value: PropTypes.oneOfType([
      PropTypes.string
      PropTypes.bool
    ])
    label: PropTypes.string
    onClick: PropTypes.func
    onChange: PropTypes.func

  getDefaultProps: ->
    onChange: ->

  render: ->
    <label className="chk chk-radio">
      <input ref="componentRadio" type="radio" checked={@props.checked} name={@props.name} value={@props.value} onClick={@props.onClick} onChange={@props.onChange} />
      <span className="chk_indicator" />
      <span>{@props.title}</span>
      <span>&nbsp;</span>
      <span>{@props.label}</span>
    </label>
