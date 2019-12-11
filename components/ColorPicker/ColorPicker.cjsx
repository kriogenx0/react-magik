
# Color Picker Component
# Use to select a hex value
# Expects an initial hex value and an array of colors for the palette

tinycolor = require 'tinycolor2'

Square = require './color-picker/color-picker-square'
Slider = require './color-picker/color-picker-slider'
Palette = require './color-picker/color-picker-palette'
helpers = require ('../../utils/cjsx_helpers')

module.exports = React.createClass
  displayName: 'ColorPicker'


  propTypes:
    name: React.PropTypes.string
    initialValue: React.PropTypes.string
    palette: React.PropTypes.array
    onValueChange: React.PropTypes.func


  getDefaultProps: ->
    name: 'color'
    initialValue: '#FFFFFF'
    palette: [
      '#F06060'
      '#60AAF0'
      '#60F06E'
      '#F0D860'
      '#60D8F0'
      '#CCCCCC'
      '#F0B460'
      '#9060F0'
      '#4A90E2'
      '#50E3C2'
      '#9B9B9B'
      '#000000'
    ]
    onValueChange: ->


  getInitialState: ->
    hex: null
    hue: null
    saturation: null
    lightness: null
    visible: false


  componentWillMount: ->
    initialColor = tinycolor @props.initialValue
    hsl = initialColor.toHsl()

    @setState
      hex: @props.initialValue
      hue: hsl.h
      saturation: hsl.s * 100
      lightness: hsl.l * 100


  componentWillUnmount: ->
    document.removeEventListener "click", @hidePanel


  setValue: (hex) ->
    @setState hex: hex
    @props.onValueChange hex


  setHex: (hex) ->
    @setValue hex.toUpperCase()

    if @props.updateColor
      @props.updateColor hex.toUpperCase()

    hsl = tinycolor(hex).toHsl()
    @setState
      hue: hsl.h
      saturation: hsl.s * 100
      lightness: hsl.l * 100


  setHue: (hue) ->
    @setState hue: hue
    @setValue tinycolor(
      h: hue
      s: @state.saturation
      l: @state.lightness
    ).toHexString().toUpperCase()


  setSaturation: (saturation) ->
    @setState saturation: saturation
    @setValue tinycolor(
      h: @state.hue
      s: saturation
      l: @state.lightness
    ).toHexString().toUpperCase()


  setLightness: (lightness) ->
    @setState lightness: lightness
    @setValue tinycolor(
      h: @state.hue
      s: @state.saturation
      l: lightness
    ).toHexString().toUpperCase()


  handleHexChange: (event) ->
    @setHex event.target.value


  handleHueChange: (event) ->
    @setHue @numericOrNull event.target.value


  handleSaturationChange: (event) ->
    @setSaturation @numericOrNull event.target.value


  handleLightnessChange: (event) ->
    @setLightness @numericOrNull event.target.value


  handleKeyPress: (event) ->
    if event.which is 13
      @hidePanel()


  # Convenience method to coerce a value to be a number or null instead of NaN
  numericOrNull: (value) ->
    value = parseFloat value
    if not $.isNumeric value
      value = null
    return value


  showPanel: (event) ->

    # Left click only
    if event.button != 0
      return

    @setState visible: true
    document.addEventListener "click", @hidePanel

    # Pretty sure this is not the best way to wait for panel node to render
    @refs.hex.getDOMNode().blur()
    input = @refs.panelHex.getDOMNode()
    helpers.selectRange(input, 1, 7)
    setTimeout(->
      input.focus()
    , 400)

    # Prevent focus on input under panel
    event.preventDefault()


  hidePanel: ->
    @setHex tinycolor(@state.hex).toHexString()
    @setState visible: false
    document.removeEventListener "click", @hidePanel


  preventPanelEventBubble: (event) ->
    event.nativeEvent.stopImmediatePropagation()


  handleSwatchSelect: (hex) ->
    @setState hex: hex, @hidePanel


  render: ->
    blotStyle = backgroundColor: @state.hex

    inputProps =
      type: "text"
      className: "txt"
      onKeyPress: @handleKeyPress

    <div className="cpr">
      <div className="cpr_blot" style={blotStyle} onClick={@showPanel}></div>
      <input className="txt cpr_input" ref="hex" value={@state.hex} onChange={@handleHexChange} onClick={@showPanel} name={@props.name} />
      <div className="cpr_panel ddn #{if @state.visible then 'is-visible' else ''}" onClick={@preventPanelEventBubble}>
        <section>
          <Square
            onSaturationChange={@setSaturation}
            onLightnessChange={@setLightness}
            hue={@state.hue}
            saturation={@state.saturation}
            lightness={@state.lightness}
          />
          <Slider
            onHueChange={@setHue}
            hue={@state.hue}
          />
        </section>
        <aside>
          <div className="cpr_blot is-small" style={blotStyle}></div>
          <input className="txt cpr_input" ref="panelHex" value={@state.hex} onChange={@handleHexChange} onKeyPress={@handleKeyPress} />
          <ul className="cpr_hsb">
            <li>
              <input value={@state.hue} onChange={@handleHueChange} {...inputProps} />
              <span>H</span>
            </li>
            <li>
              <input value={@state.saturation} onChange={@handleSaturationChange} {...inputProps} />
              <span>S</span>
            </li>
            <li>
              <input value={@state.lightness} onChange={@handleLightnessChange} {...inputProps} />
              <span>L</span>
            </li>
          </ul>
          <div className="cpr_split"></div>
          <Palette colors={@props.palette} onColorSelect={@handleSwatchSelect} />
        </aside>
      </div>
    </div>
