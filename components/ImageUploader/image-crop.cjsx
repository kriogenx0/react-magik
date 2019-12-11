
# Image Crop Component
# Takes a file, returns a file (cropped)

AppConstants = require '../../constants/app-constants'
Tooltip = require 'components/lib/tooltip'


# Polyfill for canvas.toBlob
# allows creating an image from canvas
if !HTMLCanvasElement::toBlob
  Object.defineProperty HTMLCanvasElement.prototype, 'toBlob', value: (callback, type, quality) ->
    binStr = atob(@toDataURL(type, quality).split(',')[1])
    len = binStr.length
    arr = new Uint8Array(len)
    i = 0
    while i < len
      arr[i] = binStr.charCodeAt(i)
      i++
    callback new Blob([ arr ], type: type or 'image/png')
    return


# Scale Slider Component
# UI for changing the scale of an image to crop. Mimics input[type=range]

ScaleSlider = React.createClass
  displayName: 'ImageCropSlider'


  propTypes:
    value: React.PropTypes.number
    max: React.PropTypes.number
    min: React.PropTypes.number
    onChange: React.PropTypes.func


  getDefaultProps: ->
    value: 1
    max: 2
    min: 0
    onChange: ->


  getInitialState: ->
    moving: false


  componentDidUpdate: (props, state) ->

    moveStarted = @state.moving and not state.moving
    moveStopped = not @state.moving and state.moving

    if moveStarted
      document.addEventListener 'mousemove', @handleMouseMove
      document.addEventListener 'mouseup', @handleMouseUp
    else if moveStopped
      document.removeEventListener 'mousemove', @handleMouseMove
      document.removeEventListener 'mouseup', @handleMouseUp


  # Start moving the image
  handleMouseDown: (event) ->

    # Left click only
    if event.button != 0
      return

    @setState moving: true

    @handleMove event

    event.stopPropagation()
    event.preventDefault()


  # Update position of image while moving mouse
  handleMouseMove: (event) ->

    if not @state.moving
      return

    @handleMove event

    event.stopPropagation()
    event.preventDefault()


  handleMove: (event) ->
    slideNode = @refs.slide.getDOMNode()
    slideOffset = $(slideNode).offset().left
    slideWidth = slideNode.offsetWidth

    percent = (event.pageX - slideOffset) / slideWidth

    percent = Math.min(percent, 1)
    percent = Math.max(percent, 0)

    @props.onChange percent * @props.max


  # Stop moving the image
  handleMouseUp: (event) ->
    @setState moving: false
    event.stopPropagation()
    event.preventDefault()


  render: ->

    markerStyle =
      left: @props.value / @props.max * 100 + "%"

    <div className="icr_slide_wrap">
      <div className="icr_slide" ref="slide" onMouseDown={@handleMouseDown}>
        <div className="icr_tick is-left"></div>
        <div className="icr_tick is-mid"></div>
        <div className="icr_tick is-right"></div>
        <div className="icr_slide_marker" style={markerStyle}></div>
      </div>
    </div>


module.exports = React.createClass
  displayName: 'ImageCrop'


  propTypes:
    image: React.PropTypes.instanceOf File
    width: React.PropTypes.number
    height: React.PropTypes.number
    bleedWidth: React.PropTypes.number
    onCrop: React.PropTypes.func
    onClose: React.PropTypes.func


  getDefaultProps: ->
    image: null
    width: 640
    height: 640
    bleedWidth: 20
    onCrop: ->
    onClose: ->


  getInitialState: ->
    scale: 1
    element: new Image()
    size:
      width: 0
      height: 0
    pos:
      x: 0
      y: 0
    rel:
      x: 0
      y: 0
    visible: false


  componentDidMount: ->

    # Load and center image file in frame
    @state.element.addEventListener 'load', @centerImage
    @state.element.src = URL.createObjectURL @props.image

    @setState filename: @props.image.name

    # Let component mount before firing the visible animation trigger
    setTimeout ( =>
      @setState visible: true
    ), 100

    # Prevent body scrolling
    $('body').addClass 'bdy is-overlay-visible'


  # If you leave before image loads, abort
  componentWillUnmount: ->
    @state.element.removeEventListener 'load', @centerImage

    # Allow body scolling
    $('body').removeClass 'bdy is-overlay-visible'


  # Center image and constrain
  centerImage: (event) ->
    if event
      event.preventDefault()

    canvasWidth = @props.width
    canvasHeight = @props.height
    canvasRatio = canvasWidth / canvasHeight

    imageWidth = @state.element.width
    imageHeight = @state.element.height
    imageRatio = imageWidth / imageHeight

    scale = @state.scale

    # Constrain image width
    if canvasRatio > imageRatio and imageWidth > canvasWidth
      scale = canvasWidth / imageWidth

    # Constrain image height
    if imageRatio > canvasRatio and imageHeight > canvasHeight
      scale = canvasHeight / imageHeight

    # Scale down the image to fit in frame
    if scale
      @setState scale: scale

    # Position image in the center of the frame
    pos =
      x: (canvasWidth - imageWidth * scale) / 2
      y: (canvasHeight - imageHeight * scale) / 2

    @setState
      size:
        width: imageWidth
        height: imageHeight
      pos: pos


  # Add and remove event listeners for moving image
  componentDidUpdate: (props, state) ->

    moveStarted = @state.moving and not state.moving
    moveStopped = not @state.moving and state.moving

    if moveStarted
      document.addEventListener 'mousemove', @onMouseMove
      document.addEventListener 'mouseup', @onMouseUp
    else if moveStopped
      document.removeEventListener 'mousemove', @onMouseMove
      document.removeEventListener 'mouseup', @onMouseUp


  # Start moving the image
  startDrag: (event) ->

    # Left click only
    if event.button != 0
      return

    # Save initial coords to compare while dragging
    @setState
      moving: true
      rel:
        x: event.pageX - @state.pos.x
        y: event.pageY - @state.pos.y

    event.stopPropagation()
    event.preventDefault()


  # Stop moving the image
  onMouseUp: (event) ->
    @setState moving: false
    event.stopPropagation()
    event.preventDefault()


  # Update position of image while moving mouse
  onMouseMove: (event) ->

    if not @state.moving
      return

    # Calculate new coords delta from initial
    x = event.pageX - @state.rel.x
    y = event.pageY - @state.rel.y

    # Move the image
    @setState pos: @constrain x, y

    event.stopPropagation()
    event.preventDefault()


  # Keep image on the canvas
  # Pass in scale if the state isn't going to be set in time
  constrain: (x, y, scale = @state.scale) ->

    if @state.size.width * scale > @props.width
      minX = (@state.size.width * scale - @props.width) * -1
      maxX = 0
    else
      minX = 0
      maxX = @props.width - @state.size.width * scale

    if @state.size.height * scale > @props.height
      minY = (@state.size.height * scale - @props.height) * -1
      maxY = 0
    else
      minY = 0
      maxY = @props.height - @state.size.height * scale

    x = Math.max(x, minX)
    x = Math.min(x, maxX)

    y = Math.max(y, minY)
    y = Math.min(y, maxY)

    x: x
    y: y


  # Scale image, make sure it stays in the frame
  setScale: (newScale) ->

    isSmall = @state.size.width < @props.width or @state.size.height < @props.height

    if isSmall and newScale < 1
      newScale = 1

    oldScale = @state.scale

    oldWidth = @state.size.width * oldScale
    oldHeight = @state.size.height * oldScale

    newWidth = @state.size.width * newScale
    newHeight = @state.size.height * newScale

    if @props.width > newWidth and not isSmall
      newWidth = @props.width
      newScale = newWidth / @state.size.width

    else if @props.height > newHeight and not isSmall
      newHeight = @props.height
      newScale = newHeight / @state.size.height

    @setState scale: newScale

    xMovement = (newWidth - oldWidth) / 2
    yMovement = (newHeight - oldHeight) / 2

    x = @state.pos.x - xMovement
    y = @state.pos.y - yMovement

    @setState pos: @constrain x, y, newScale


  # Shortcut to full size image
  fullSize: (event) ->
    if event
      event.preventDefault()
    @setScale 1


  # Throw image onto canvas, crop
  crop: ->
    canvas = @refs.canvas.getDOMNode()
    context = canvas.getContext('2d')

    # start with blank white canvas
    context.clearRect 0, 0, @props.width, @props.height
    context.fillStyle = "white"
    context.fillRect 0, 0, @props.width, @props.height

    # draw user image to match framed version
    dx = @state.pos.x
    dy = @state.pos.y
    dWidth = @state.size.width * @state.scale
    dHeight = @state.size.height * @state.scale

    context.drawImage @state.element, dx, dy, dWidth, dHeight

    # return cropped image
    canvas.toBlob (blob) =>
      blob.filename = @state.filename.substr(0, @state.filename.lastIndexOf(".")) + ".jpg"
      @props.onCrop blob
    , "image/jpeg", 0.95

    # mission complete, close crop dialog
    @close()


  # Close overlay
  close: ->
    @setState visible: false

    setTimeout ( =>
      @props.onClose()
    ), AppConstants.ANIM_SPEED_FAST


  # Close overlay on click
  handleClose: (event) ->
    @close()
    event.preventDefault()


  render: ->

    # Determines the size of the crop area
    frameStyle =
      height: @props.height
      width: @props.width

    controlStyle =
      if @props.width < 300
        width: 300
        marginTop: 30
      else
        width: @props.width

    screenStyle =
      borderWidth: @props.bleedWidth

    # Determines size and position of image / ghost image
    imageStyle =
      width: @state.size.width * @state.scale
      height: @state.size.height * @state.scale
      left: @state.pos.x
      top: @state.pos.y

    ghostStyle = imageStyle
    ghostStyle.backgroundImage = "url(" + @state.element.src + ")"

    <div className="icr #{if @state.visible then 'is-visible' else ''} #{if @props.width < 400 then 'is-small'}">
      <div className="icr_close"  onClick={@handleClose}></div>
      <div className="icr_modal">
        <h2>Position and Size Image</h2>
        <h3>Drag and resize the image within the dimensions as desired.</h3>
        <div ref="canvas" className="icr_frame" style={frameStyle}>
          <div ref="ghost" className="icr_ghost" style={ghostStyle} />
          <div className="icr_window">
            <img ref="image" className="icr_image" src={@state.element.src} style={imageStyle} />
            <div ref="screen" className="icr_screen" style={screenStyle} onMouseDown={@startDrag} />
          </div>
          <div className="icr_guide is-vert is-left"></div>
          <div className="icr_guide is-vert is-center"></div>
          <div className="icr_guide is-vert is-right"></div>
          <div className="icr_guide is-horiz is-top"></div>
          <div className="icr_guide is-horiz is-middle"></div>
          <div className="icr_guide is-horiz is-bottom"></div>
        </div>
        <div className="icr_control" style={controlStyle}>
          <div className="icr_control_range">
            <i className="icn icn-image-size-small" />
            <i className="icn icn-image-size-large" />
            <ScaleSlider min=0 max=2 value={@state.scale} onChange={@setScale} />
          </div>
          <div className="icr_control_size">
            <Tooltip className="icr_control_size_button cursor-pointer" onClick={@centerImage} title="Center image in the crop area." gravity="s">
              <i className="icn icn-image-size-reset l-v-align-middle"  />
            </Tooltip>
            <Tooltip className="icr_control_size_button cursor-pointer" onClick={@fullSize} title="Show uploaded image's original dimensions." gravity="s">
              <i className="icn icn-image-size-original l-v-align-middle" />
            </Tooltip>
          </div>
        </div>
        <div className="icr_btns">
          <button type="button" className="btn" onClick={@handleClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={@crop}>Crop and Save</button>
        </div>
        <canvas ref="canvas" className="icr_canvas" width={@props.width} height={@props.height} />
      </div>
    </div>
