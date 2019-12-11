# Renders the an autocomplete input
Avatar = require './avr'
Track = require './trk'

BaseModel = require 'models/base-model'
TrackModel = require 'models/track-model'

module.exports = React.createClass
  displayName: 'Autocomplete Row'

  propTypes:
    isFocused: PropTypes.bool
    data: PropTypes.object
    onClick: PropTypes.func
    type: PropTypes.oneOf(['person', 'color'])

  getDefaultProps: ->
    isFocused: false
    data: {}
    onClick: ->
    type: null

  getInitialState: ->
    type: @props.type
    title: @props.data.title
    color: @props.data.color

  componentWillMount: ->
    newState = {}

    if @props.data instanceof BaseModel
      newState.title = @props.data.get 'name'
      # @props.data.on 'change', @forceUpdate

    if @props.data instanceof TrackModel
      newState.type = 'color'
      newState.color = @props.data.get 'color'

    if Object.keys(newState).length
      @setState newState

  # componentWillUnmount: ->
  #   if @props.data instanceof BaseModel
  #     @props.data.off 'change', @forceUpdate

  handleClick: (e) ->
    e.preventDefault()

  render: ->

    if @state.type is null
      <li className="lst_row #{@props.isFocused and 'is-focused'}">
        <a tabIndex="-1" href="#" onClick={@handleClick} onMouseDown={@props.onClick}>{@state.title}</a>
      </li>
    else if @props.type is "person"
      <li className="lst_row #{@props.isFocused and 'is-focused'}">
        <a className="lst_row_content" tabIndex="-1" href="#" onClick={@handleClick} onMouseDown={@props.onClick}>
          <div className="l-table">
            <div className="l-table-row l-full-width">
              <div className="l-table-cell l-h-right-padded l-v-align-middle">
                <Avatar size={30} url={@props.data.url}/>
              </div>
              <div className="l-table-cell l-full-width l-v-align-middle">
                <p className="strong">{@props.data.title}</p>
                <p className="deemphasized">{@props.data.value}</p>
              </div>
            </div>
          </div>
        </a>
      </li>
    else if @state.type is 'color'
      <li className="lst_row #{@props.isFocused and 'is-focused'}">
        <a className="lst_row_content" tabIndex="-1" href="#" onClick={@handleClick} onMouseDown={@props.onClick}>
          <div className="l-table">
            <div className="l-table-row l-full-width">
              <div className="l-table-cell l-h-right-padded l-v-align-middle">
                <Track color={@state.color} />
              </div>
              <div className="l-table-cell l-full-width l-v-align-middle">
                <p className="strong">{@state.title}</p>
              </div>
            </div>
          </div>
        </a>
      </li>
