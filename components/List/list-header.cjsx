# Describes a list header component, belonging within a list component (.lst)

module.exports = React.createClass
  displayName: 'List Header'

  propTypes:
    title: PropTypes.string

  render: ->
    <li className="lst_header">
      <h5 className="lst_header_title">{@props.title}</h5>
    </li>
