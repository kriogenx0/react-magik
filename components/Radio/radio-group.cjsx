# A simple radio group. This should wrap a group of <Radio> components.
# pass "checked={true}" to one of the radio components to have it default to checked
# only include the name prop on this element, it will add the name to the children

module.exports = React.createClass

  propTypes:
    name: PropTypes.string
    orientation: PropTypes.string

  getDefaultProps: ->
    name: null
    orientation: "vertical"

  renderChildren: ->
    React.Children.map(@props.children, (child) =>
      React.addons.cloneWithProps(child, {
        name: @props.name
      })
    )

  render: ->
    <div className="group-chk #{if @props.orientation then 'group-chk-' + @props.orientation}">
      {@renderChildren()}
    </div>
