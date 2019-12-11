# tab component. used within a tab group

module.exports = React.createClass

  propTypes:
    name: PropTypes.string
    selected: PropTypes.bool
    alert: PropTypes.string

  displayName: 'Tab'

  render: ->
    <li className="c-tab tab_item #{if @props.alert then ('is-' + @props.alert) else ''}">
      <a href="javascript: void(0)" className="#{if @props.selected then 'is-active' else ''}" onClick={@props.onClick}>{@props.name}</a>
    </li>
