# Creates a list with items
# Each item can take:
# label - The text of the item
# action - The click action of the item
#
# Example - Mixtures of labels and actions
# items = [
#   {
#     label: User.firstName + ' ' + User.lastName
#   },
#   {
#     label: 'Logout'
#     action: ->
#       # Log user out
#   }
# ]

# label
# action

module.exports = React.createClass

  displayName: 'List'

  getDefaultProps: ->
    items: null

  propTypes:
    items: PropTypes.array

  render: ->

    return unless @props.items

    <ul className="lst">
      {for item, index in @props.items
        <li className="lst_row" key={index}>
          {if typeof item.action is 'function'
            <a href="javascript: void(0)" onClick={item.action.bind null, index, item}>{item.label}</a>
          else
            <span>{item.label}</span>
          }
        </li>
      }
    </ul>
