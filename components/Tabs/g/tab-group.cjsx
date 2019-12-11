# tab group component.
# accepts a json representation of tabs.
# json should be {name: 'tab name', content: 'tab content'}
# tab content can be another component.

Tab = require './tab'

module.exports = React.createClass

  displayName: 'Tab Group'

  propTypes:
    tabs: PropTypes.array
    initialIndex: PropTypes.number
    onIndexChange: PropTypes.func
    className: PropTypes.string

  getDefaultProps: ->
    tabs: []
    selectedIndex: 0
    onIndexChange: ->
    className: ''

  getInitialState: ->
    selectedIndex: @props.selectedIndex

  componentWillReceiveProps: (props) ->
    if props.selectedIndex
      @setState selectedIndex: props.selectedIndex

  handleClick: (index, e) ->
    e.preventDefault()
    @setState selectedIndex: index
    @props.onIndexChange index

  render: ->
    <div>
      <ul className="tab #{@props.className}">
        {for tab, i in @props.tabs
          selected = i is @state.selectedIndex
          <Tab name={tab.name} content={tab.content} alert={tab.alert} selected={selected} onClick={@handleClick.bind(@,i)} key={i}/>
        }
      </ul>
      <div>
        {for tab, i in @props.tabs
          <div key={i} className="#{if i != @state.selectedIndex then 'l-hidden' else ''}">{tab.content}</div>
        }
      </div>
    </div>
