
# Color Picker Palette
# Click on a color to return that HEX value
# Expects an initial array of colors and a callback for color selection

module.exports = React.createClass
  displayName: 'ColorPickerPalette'


  propTypes:
    colors: React.PropTypes.array
    onColorSelect: React.PropTypes.func


  getDefaultProps: ->
    colors: []
    onColorSelect: ->


  handleClick: (color, event) ->
    @props.onColorSelect color


  render: ->

    swatches = @props.colors.map (color, index) =>
      swatchStyle = backgroundColor: color
      <li style={swatchStyle} onClick={@handleClick.bind(null, color)} key={index} />

    <ul className="cpr_palette">
      {swatches}
    </ul>
