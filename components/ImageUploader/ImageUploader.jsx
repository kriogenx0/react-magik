// # Image Picker Component ties together File Picker and Image Crop components

// import ImageCrop from './image-crop';
import ImageCrop from './ImageCrop';

export default class ImageUploader extends React.Component {

  selectFile(callback, options) {
    options = options || { multiple: false, accept: null };
    const input = document.createElement('input');
    input.type = "file";

    if (options.multiple) input.multiple = true;

    if (options.accept) input.accept = options.accept;

    const handleFileSelect = (event) => {
      if (typeof callback == 'function')
        callback(options.multiple ? event.target.files : event.target.files[0]);

      input.removeEventListener('change', handleFileSelect);
    }

    input.addEventListener('change', handleFileSelect);

    input.click();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.shouldPick) {
      this.handleFileSelect();
    }
  }

  handleFileSelect() {
    this.selectFile(
      (file) => {
        this.setState({ file: file });
      },
      { accept: 'image/*' }
    );
  }

  handleClose() {
    if (this.isMounted()) this.setState({ file: null });
  }

  // # ImageCrop returns a file blob.
  handleCrop(blob) {
    // # Create an object URL so we can see the image
    newImg = document.createElement('img');
    url = URL.createObjectURL(blob);

    // # Cleanup
    newImg.onload = () => {
      URL.revokeObjectURL(url);
    };

    // # Load the image to trigger the cleanup
    newImg.src = url;

    // # Return blob and URL for convenience
    this.props.onImagePick(blob, url);
  }

  renderLayer() {
    if (this.state.file)
      return (
        <ImageCrop
          image={this.state.file}
          width={this.props.cropWidth}
          height={this.props.cropHeight}
          bleedWidth={this.props.bleedWidth}
          onClose={this.handleClose}
          onCrop={this.handleCrop}
        />
      );
    else
      return (
        <div />
      );
  }

  render() {
    return (
      <div onClick={this.handleFileSelect} className={this.props.className} style={{ backgroundColor: '#f00', height: '200px' }}>
        {this.props.children}
      </div>
    );
  }
}

// propTypes:
//   cropWidth: React.PropTypes.number
//   cropHeight: React.PropTypes.number
//   bleedWidth: React.PropTypes.number
//   onImagePick: React.PropTypes.func
//   className: React.PropTypes.string
//   shouldPick: React.PropTypes.bool
//
// getDefaultProps: ->
//   cropWidth: 640
//   cropHeight: 240
//   bleedWidth: 20
//   onImagePick: (blob) ->
//   className: null
//   shouldPick: false
//
// getInitialState: ->
//   file: null
