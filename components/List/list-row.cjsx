module.exports = React.createClass
  displayName: 'FilterSectionList'

  handleClick: (e) ->
    e.preventDefault()
    if @props.onChange
      @props.onChange(@props.value)

  render: ->
    value = @props.value
    <li className="lst_row #{if @props.selected is true then 'is-selected' else ''}">
      <a href="#" onClick={@handleClick}>{@props.name}</a>
    </li>
