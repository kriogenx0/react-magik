
# Color Picker Saturation and Lightness Square
# Drag marker to return saturation and lightness
# Expects an initial hex value and callbacks for saturation and lightness changes

# Note, internally this component uses HSV, externally we use HSL

tinycolor = require 'tinycolor2'

module.exports = React.createClass
  displayName: 'ColorPickerSquare'


  propTypes:
    hue: React.PropTypes.number
    saturation: React.PropTypes.number
    lightness: React.PropTypes.number
    onSaturationChange: React.PropTypes.func
    onLightnessChange: React.PropTypes.func


  getDefaultProps: ->
    hue: 0
    saturation: 100
    lightness: 100
    onSaturationChange: ->
    onLightnessChange: ->


  getInitialState: ->
    moving: false
    saturation: null
    value: null


  componentWillMount: ->

    hsv = tinycolor(
      h: @props.hue
      s: @props.saturation
      l: @props.lightness
    ).toHsv()

    @setState
      saturation: hsv.s * 100
      value: hsv.v * 100


  componentDidUpdate: (props, state) ->

    moveStarted = @state.moving and not state.moving
    moveStopped = not @state.moving and state.moving

    if moveStarted
      document.addEventListener 'mousemove', @handleMouseMove
      document.addEventListener 'mouseup', @handleMouseUp
    else if moveStopped
      document.removeEventListener 'mousemove', @handleMouseMove
      document.removeEventListener 'mouseup', @handleMouseUp

    # Update internal saturation and value if external values change

    if props.saturation != @props.saturation
      saturation = @props.saturation

    if props.lightness != @props.lightness
      lightness = @props.lightness

    if saturation or lightness

      hsv = tinycolor(
        h: props.hue
        s: saturation || props.saturation
        l: lightness || props.lightness
      ).toHsv()

      if hsv.s * 100 != @state.saturation
        @setState saturation: hsv.s * 100

      if hsv.v * 100 != @state.value
        @setState value: hsv.v * 100


  handleMouseDown: (event) ->

    # Left click only
    if event.button != 0
      return

    @setState moving: true

    @setPos event


  handleMouseMove: (event) ->

    if not @state.moving
      return

    @setPos event


  handleMouseUp: (event) ->

    @setState moving: false


  setPos: (event) ->

    squareNode = @refs.square.getDOMNode()
    squareOffset = $(@refs.square.getDOMNode()).offset()

    pos =
      x: event.pageX - squareOffset.left
      y: event.pageY - squareOffset.top

    pos =
      x: Math.min(Math.max(pos.x, 0), @refs.square.getDOMNode().offsetWidth)
      y: Math.min(Math.max(pos.y, 0), @refs.square.getDOMNode().offsetHeight)

    saturation = pos.x / squareNode.offsetWidth * 100
    value = ((squareNode.offsetHeight - pos.y) / squareNode.offsetHeight * 100)

    @setState
      saturation: saturation
      value: value

    hsl = tinycolor(
      h: @props.hue
      s: saturation
      v: value
    ).toHsl()

    @props.onSaturationChange hsl.s * 100
    @props.onLightnessChange hsl.l * 100


  render: ->

    color = tinycolor(
      h: @props.hue
      s: 1
      l: 0.5
    )

    squareStyle =
      backgroundColor: color.toHexString()

    top = (@state.value - 100) * -1

    markerStyle =
      left: @state.saturation + "%"
      top: top + "%"

    <div className="cpr_square" ref="square" onMouseDown={@handleMouseDown} style={squareStyle}>
      <div className="cpr_marker" style={markerStyle}></div>
      <div className="cpr_square_val"></div>
      <div className="cpr_square_sat"></div>
    </div>
