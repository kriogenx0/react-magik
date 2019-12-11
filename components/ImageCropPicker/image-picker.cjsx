
# Image Picker Component ties together File Picker and Image Crop components

ImageCrop = require 'components/lib/image-crop'

LayeredComponentMixin = require 'mixins/layered-component-mixin'

Overlay = require 'components/lib/overlay'
CurrentUserStore = require 'stores/current-user-store'

module.exports = React.createClass
  displayName: 'ImagePicker'

  mixins: [LayeredComponentMixin, FilePickerMixin]

  selectFile: (callback = ((file) ->), options = { multiple: false, accept: null }) ->
    input = document.createElement('input')
    input.type = "file"

    if options.multiple
      input.multiple = true

    if options.accept
      input.accept = options.accept

    handleFileSelect = (event) ->
      if options.multiple
        callback event.target.files
      else
        callback event.target.files[0]

      input.removeEventListener 'change', handleFileSelect

    input.addEventListener 'change', handleFileSelect

    input.click()

  propTypes:
    cropWidth: PropTypes.number
    cropHeight: PropTypes.number
    bleedWidth: PropTypes.number
    onImagePick: PropTypes.func
    className: PropTypes.string
    shouldPick: PropTypes.bool

  getDefaultProps: ->
    cropWidth: 640
    cropHeight: 240
    bleedWidth: 20
    onImagePick: (blob) ->
    className: null
    shouldPick: false

  getInitialState: ->
    file: null

  componentWillReceiveProps: (newProps) ->
    if newProps.shouldPick
      @handleFileSelect()

  handleFileSelect: ->
    @selectFile (file) =>
      @setState file: file
    , accept: 'image/*'

  handleClose: ->
    if @isMounted()
      @setState file: null

  # ImageCrop returns a file blob.
  handleCrop: (blob) ->

    # Create an object URL so we can see the image
    newImg = document.createElement "img"
    url = URL.createObjectURL blob

    # Cleanup
    newImg.onload = -> URL.revokeObjectURL url

    # Load the image to trigger the cleanup
    newImg.src = url

    # Return blob and URL for convenience
    @props.onImagePick blob, url

  renderLayer: ->
    if @state.file
      <ImageCrop
        image={@state.file}
        width={@props.cropWidth}
        height={@props.cropHeight}
        bleedWidth={@props.bleedWidth}
        onClose={@handleClose}
        onCrop={@handleCrop}
      />
    else
      <div />

  render: ->
    <div onClick={@handleFileSelect} className={@props.className}>
      {@props.children}
    </div>
