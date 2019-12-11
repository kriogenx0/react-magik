
# Color Picker Hue Slider
# Slide handle to change HUE (0-360)
# Expects an initial hex value and a callback for hue changes

tinycolor = require 'tinycolor2'

module.exports = React.createClass
  displayName: 'ColorPickerSlider'


  propTypes:
    hue: React.PropTypes.number
    onHueChange: React.PropTypes.func


  getDefaultProps: ->
    hue: 180
    onHueChange: ->


  getInitialState: ->
    moving: false
    hue: null


  componentWillMount: ->
    @setState hue: @props.hue


  componentDidUpdate: (props, state) ->

    moveStarted = @state.moving and not state.moving
    moveStopped = not @state.moving and state.moving

    if moveStarted
      document.addEventListener 'mousemove', @handleMouseMove
      document.addEventListener 'mouseup', @handleMouseUp
    else if moveStopped
      document.removeEventListener 'mousemove', @handleMouseMove
      document.removeEventListener 'mouseup', @handleMouseUp

    if @props.hue != @state.hue
      @setState hue: @props.hue


  handleMouseDown: (event) ->

    # Left click only
    if event.button != 0
      return

    @setState moving: true

    @setHueFromEvent event


  handleMouseMove: (event) ->

    if not @state.moving
      return

    @setHueFromEvent event


  handleMouseUp: (event) ->
    @setState moving: false


  setHueFromEvent: (event) ->

    sliderNode = @refs.slider.getDOMNode()
    sliderOffset = $(@refs.slider.getDOMNode()).offset()

    pos = event.pageX - sliderOffset.left
    pos = Math.max(pos, 0)
    pos = Math.min(pos, sliderNode.offsetWidth)

    hue = parseInt pos / sliderNode.offsetWidth * 360

    @props.onHueChange hue

    @setState hue: hue


  render: ->

    sliderStyle =
      left: @state.hue / 360 * 100 + "%"

    <div className="cpr_rainbow" ref="slider" onMouseDown={@handleMouseDown}><div className="cpr_slide" style={sliderStyle}></div></div>
