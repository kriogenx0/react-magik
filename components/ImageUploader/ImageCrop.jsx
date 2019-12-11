
// # Image Crop Component
// # Takes a file, returns a file (cropped)

// AppConstants = require '../../constants/app-constants'
import Tooltip from 'lib/Tooltip/Tooltip';

import './canvas_toblob';
import ScaleSlider from './ScaleSlider';

export default class ImageCrop extends React.Component {

  componentDidMount() {

    this.state.element.addEventListener('load', this.centerImage);
    this.state.element.src = URL.createObjectURL(this.props.image);

    this.setState({ filename: this.props.image.name });

    setTimeout(() => {
      this.setState({
        visible: true
      });
    }, 100);

    $('body').addClass('bdy is-overlay-visible');
  }

  // # If you leave before image loads, abort
  componentWillUnmount() {
    this.state.element.removeEventListener('load', this.centerImage);

    // # Allow body scolling
    $('body').removeClass('bdy is-overlay-visible');
  }


  // # Center image and constrain
  centerImage(event) {
    if (event) event.preventDefault();

    let canvasHeight, canvasRatio, canvasWidth, imageHeight, imageRatio, imageWidth, pos, scale;

    canvasWidth = this.props.width;
    canvasHeight = this.props.height;
    canvasRatio = canvasWidth / canvasHeight;
    imageWidth = this.state.element.width;
    imageHeight = this.state.element.height;
    imageRatio = imageWidth / imageHeight;
    scale = this.state.scale;

    if (canvasRatio > imageRatio && imageWidth > canvasWidth) {
      scale = canvasWidth / imageWidth;
    }

    if (imageRatio > canvasRatio && imageHeight > canvasHeight) {
      scale = canvasHeight / imageHeight;
    }

    if (scale) {
      this.setState({
        scale: scale
      });
    }

    pos = {
      x: (canvasWidth - imageWidth * scale) / 2,
      y: (canvasHeight - imageHeight * scale) / 2
    };

    this.setState({
      size: {
        width: imageWidth,
        height: imageHeight
      },
      pos: pos
    });
  }


  // # Add and remove event listeners for moving image
  componentDidUpdate(props, state) {

    const moveStarted = this.state.moving && !state.moving;
    const moveStopped = !this.state.moving && state.moving;

    if (moveStarted) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (moveStopped) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  // # Start moving the image
  startDrag(event) {

    // # Left click only
    if (event.button != 0) return;

    // # Save initial coords to compare while dragging
    this.setState({
      moving: true,
      rel: {
        x: event.pageX - this.state.pos.x,
        y: event.pageY - this.state.pos.y
      }
    });

    event.stopPropagation();
    event.preventDefault();
  }

  // # Stop moving the image
  onMouseUp(event) {
    this.setState({ moving: false });
    event.stopPropagation();
    event.preventDefault();
  }

  // # Update position of image while moving mouse
  onMouseMove(event) {
    if (!this.state.moving) return;

    // # Calculate new coords delta from initial
    x = event.pageX - this.state.rel.x;
    y = event.pageY - this.state.rel.y;

    // # Move the image
    this.setState({ pos: this.constrain(x, y) });

    event.stopPropagation();
    event.preventDefault();
  }


  // # Keep image on the canvas
  // # Pass in scale if the state isn't going to be set in time
  constrain(x, y, scale) {
    scale || (scale = this.state.scale);

    if (this.state.size.width * scale > this.props.width) {
      minX = (this.state.size.width * scale - this.props.width) * -1;
      maxX = 0;
    } else {
      minX = 0;
      maxX = this.props.width - this.state.size.width * scale;
    }

    if (this.state.size.height * scale > this.props.height) {
      minY = (this.state.size.height * scale - this.props.height) * -1;
      maxY = 0;
    } else {
      minY = 0;
      maxY = this.props.height - this.state.size.height * scale;
    }

    x = Math.max(x, minX);
    x = Math.min(x, maxX);

    y = Math.max(y, minY);
    y = Math.min(y, maxY);

    return {
      x: x,
      y: y
    };
  }

  // # Scale image, make sure it stays in the frame
  setScale(newScale) {

    let isSmall = this.state.size.width < this.props.width || this.state.size.height < this.props.height;
    var newScale;

    if (isSmall && newScale < 1) newScale = 1;

    oldScale = this.state.scale

    oldWidth = this.state.size.width * oldScale
    oldHeight = this.state.size.height * oldScale

    newWidth = this.state.size.width * newScale
    newHeight = this.state.size.height * newScale

    if (this.props.width > newWidth && !isSmall) {
      newWidth = this.props.width;
      newScale = newWidth / this.state.size.width;
    } else if (this.props.height > newHeight && !isSmall) {
      newHeight = this.props.height;
      newScale = newHeight / this.state.size.height;
    }

    this.setState({ scale: newScale });

    let xMovement = (newWidth - oldWidth) / 2;
    let yMovement = (newHeight - oldHeight) / 2;

    x = this.state.pos.x - xMovement;
    y = this.state.pos.y - yMovement;

    this.setState({ pos: this.constrain(x, y, newScale) });

  }

  // # Shortcut to full size image
  fullSize(event) {
    if (event) event.preventDefault();
    this.setScale(1);
  }

  // # Throw image onto canvas, crop
  crop() {
    canvas = this.refs.canvas.getDOMNode();
    context = canvas.getContext('2d');

    // # start with blank white canvas
    context.clearRect(0, 0, this.props.width, this.props.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, this.props.width, this.props.height);

    // # draw user image to match framed version
    dx = this.state.pos.x;
    dy = this.state.pos.y;
    dWidth = this.state.size.width * this.state.scale;
    dHeight = this.state.size.height * this.state.scale;

    context.drawImage(this.state.element, dx, dy, dWidth, dHeight);

    // # return cropped image
    canvas.toBlob( (blob) => {
      blob.filename = this.state.filename.substr(0, this.state.filename.lastIndexOf(".")) + ".jpg";
      this.props.onCrop(blob);
    }, "image/jpeg", 0.95);

    // # mission complete, close crop dialog
    this.close();
  }


  // # Close overlay
  close() {
    this.setState({ visible: false });

    setTimeout(() => {
      this.props.onClose();
    }, 200);
  }


  // # Close overlay on click
  handleClose(event) {
    this.close();
    event.preventDefault();
  }

  render() {

    // # Determines the size of the crop area
    frameStyle = {
      height: this.props.height,
      width: this.props.width
    };

    controlStyle = this.props.width < 300 ? { width: 300, marginTop: 30 } : { width: this.props.width };

    screenStyle = {
      borderWidth: this.props.bleedWidth
    };

    // # Determines size and position of image / ghost image
    imageStyle = {
      width: this.state.size.width * this.state.scale,
      height: this.state.size.height * this.state.scale,
      left: this.state.pos.x,
      top: this.state.pos.y
    };

    ghostStyle = imageStyle;
    ghostStyle.backgroundImage = "url(" + this.state.element.src + ")";

    return (

      <div className="icr #{if this.state.visible then 'is-visible' else ''} #{if this.props.width < 400 then 'is-small'}">
        <div className="icr_close"  onClick={this.handleClose}></div>
        <div className="icr_modal">
          <h2>Position and Size Image</h2>
          <h3>Drag and resize the image within the dimensions as desired.</h3>
          <div ref="canvas" className="icr_frame" style={frameStyle}>
            <div ref="ghost" className="icr_ghost" style={ghostStyle} />
            <div className="icr_window">
              <img ref="image" className="icr_image" src={this.state.element.src} style={imageStyle} />
              <div ref="screen" className="icr_screen" style={screenStyle} onMouseDown={this.startDrag} />
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
              <ScaleSlider min="0" max="2" value={this.state.scale} onChange={this.setScale} />
            </div>
            <div className="icr_control_size">
              <Tooltip className="icr_control_size_button cursor-pointer" onClick={this.centerImage} title="Center image in the crop area." gravity="s">
                <i className="icn icn-image-size-reset l-v-align-middle"  />
              </Tooltip>
              <Tooltip className="icr_control_size_button cursor-pointer" onClick={this.fullSize} title="Show uploaded image's original dimensions." gravity="s">
                <i className="icn icn-image-size-original l-v-align-middle" />
              </Tooltip>
            </div>
          </div>
          <div className="icr_btns">
            <button type="button" className="btn" onClick={this.handleClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={this.crop}>Crop and Save</button>
          </div>
          <canvas ref="canvas" className="icr_canvas" width={this.props.width} height={this.props.height} />
        </div>
      </div>
    );
  }
}



      // propTypes:
      //   image: React.PropTypes.instanceOf File
      //   width: React.PropTypes.number
      //   height: React.PropTypes.number
      //   bleedWidth: React.PropTypes.number
      //   onCrop: React.PropTypes.func
      //   onClose: React.PropTypes.func
      //
      //
      // getDefaultProps: ->
      //   image: null
      //   width: 640
      //   height: 640
      //   bleedWidth: 20
      //   onCrop: ->
      //   onClose: ->
      //
      //
      // getInitialState: ->
      //   scale: 1
      //   element: new Image()
      //   size:
      //     width: 0
      //     height: 0
      //   pos:
      //     x: 0
      //     y: 0
      //   rel:
      //     x: 0
      //     y: 0
      //   visible: false
      //
