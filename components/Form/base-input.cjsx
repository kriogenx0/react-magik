# Renders a modular, re-usable `input` field that abstracts boilerplate logic and UI patterns.

module.exports = React.createClass
  componentDidMount: ->
    if @props.autoSelect
      @refs.input.getDOMNode().focus()

  render: ->
    <div>
      <input
        ref="input"
        type={@props.inputType}
        name={@props.fieldName}
        className="txt l-full-width #{if @props.centered then 'l-text-align-center' else ''}"
        placeholder={@props.displayName}
        style={marginBottom: "10px"}/>
    </div>
