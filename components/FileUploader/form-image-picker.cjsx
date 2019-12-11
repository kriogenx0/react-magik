# Formsy wrapper for image picker

Formsy = require 'formsy-react'
FormRow = require "../forms/form-row"

ImagePicker = require '../image-picker'

module.exports = React.createClass
  displayName: 'FormsyImagePicker'

  mixins: [Formsy.Mixin]

  propTypes:
    label: PropTypes.string
    optionalText: PropTypes.string
    cropWidth: PropTypes.number
    cropHeight: PropTypes.number
    bleedWidth: PropTypes.number
    displayWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    displayHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])

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

  handleImageRemove: ->
    @setState src: null
    @setValue null

  handleImageReplace: (e) ->
    e.preventDefault()
    @setState shouldPick: true, =>
      @setState shouldPick: false

  render: ->
    displayStyle = {
      width: @props.displayWidth or 'auto'
      height: @props.displayHeight or 'auto'
    }

    <FormRow isFlush={true} label={@props.label} optionalText={@props.optionalText} errors={@getErrorMessages()} showError={@showError()}>
      {if @state.src
        <div className="icr_picker">
          <ImagePicker
            cropWidth={@props.cropWidth}
            cropHeight={@props.cropHeight}
            bleedWidth={@props.bleedWidth}
            onImagePick={@handleImagePick}
            shouldPick={@state.shouldPick}>
            <img src={@state.src} style={displayStyle}/>
          </ImagePicker>

          <button type="button" className="btn btn-small" onClick={@handleImageRemove}>Remove</button>
          <button type="button" className="btn btn-small l-h-left-half-spaced" onClick={@handleImageReplace}>Change</button>
        </div>
      else
        <ImagePicker
          cropWidth={@props.cropWidth}
          cropHeight={@props.cropHeight}
          bleedWidth={@props.bleedWidth}
          onImagePick={@handleImagePick}>
            <button type="button" className="btn">Select File</button>
        </ImagePicker>
      }
      {if @props.description
        <p>{@props.description}</p>
      }
    </FormRow>
