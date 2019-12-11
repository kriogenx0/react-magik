# Formsy wrapper for image picker without use of FormRow

Formsy = require 'formsy-react'
ImagePicker = require '../image-picker'

module.exports = React.createClass

  displayName: 'FormsyImageSelect'

  mixins: [Formsy.Mixin]

  propTypes:
    optionalText: PropTypes.string
    cropWidth: PropTypes.number
    cropHeight: PropTypes.number
    bleedWidth: PropTypes.number
    displayWidth: PropTypes.oneOf [PropTypes.string, PropTypes.number]
    displayHeight: PropTypes.oneOf [PropTypes.string, PropTypes.number]
    onChange: PropTypes.func

  componentDidMount: ->
    @setValue @props.value or null

  getDefaultProps: ->
    displayWidth: null
    displayHeight: null

  getInitialState: ->
    src: @props.value
    shouldPick: false

  handleImagePick: (blob, url) ->
    @setState {src: url, shouldPick: false}
    @setValue blob

    if typeof @props.onChange is 'function'
      @props.onChange blob, url

  handleImageRemove: ->
    @setState src: null
    @setValue null

  handleImageReplace: (e) ->
    e.preventDefault()
    @setState shouldPick: true

  triggerImageSelect: ->

  render: ->
    displayStyle = {
      width: @props.displayWidth or 'auto'
      height: @props.displayHeight or 'auto'
    }

    boxClassName = classNames
      "icr_picker": true

    child = React.Children.map @props.children, (child) =>
      React.addons.cloneWithProps child, @props

    <div className={boxClassName}>
      {if @props.showErrors
        for error, index in @getErrorMessages()
          <div className="icr_picker icr_picker_errors" key={index}>{error}</div>
      }
      <ImagePicker
        cropWidth={@props.cropWidth}
        cropHeight={@props.cropHeight}
        bleedWidth={@props.bleedWidth}
        onImagePick={@handleImagePick}
        shouldPick={@state.shouldPick}
      >
        {child}
      </ImagePicker>
    </div>
