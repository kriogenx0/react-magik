// # Image Picker Component ties together File Picker and Image Crop components

import ImageCrop from '../ImageCrop/ImageCrop';

import './ImagePicker.scss';

export default class ImagePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.selectFileCallback = this.selectFileCallback.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.pickOnMount) {
      this.handleFileSelect();
    }
  }

  handleFileSelect() {
    this.selectFile(this.selectFileCallback, { accept: 'image/*' });
  }

  selectFile(callback, options) {
    options = options || { multiple: false, accept: null };

    // Create Input
    const input = document.createElement('input');
    input.type = 'file';
    if (options.multiple) input.multiple = true;
    if (options.accept) input.accept = options.accept;

    const handleFileSelect = (event) => {
      if (typeof callback == 'function') {
        callback(options.multiple ? event.target.files : event.target.files[0]);
      }
      input.removeEventListener('change', handleFileSelect);
    }
    input.addEventListener('change', handleFileSelect);
    input.click();
  }

  selectFileCallback(file) {
    console.log('selected file', file);

    // Read file properties
    var reader = new FileReader();
    reader.onload = (e) => {
      console.log('e', e);
      this.setState({ imageResult: e.target.result });
    };
    const fileData = reader.readAsDataURL(file);
    console.log('fileData', fileData);

    this.setState({ file, fileData });
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
    if (this.state.imageResult) {
      const imageStyle = {
        backgroundImage: this.state.imageResult,
        height: this.props.height
      };
      return (<div style={imageStyle} />);
      /*
      return (
        <div>
          <img src={this.state.imageResult} />
        </div>
      );
      */
    }
    else if (this.state.file) {
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
    } else {
      return null;
    }
  }

  render() {
    const style = {
      height: this.props.height + 'px'
    };

    return (
      <div className={'c-image_picker ' + this.props.className} style={style} onClick={this.handleFileSelect}>
        {this.renderLayer()}
        {/* this.props.children */}
      </div>
    );
  }
}

ImagePicker.propTypes = {
  cropWidth: PropTypes.number,
  cropHeight: PropTypes.number,
  bleedWidth: PropTypes.number,
  onImagePick: PropTypes.func,
  className: PropTypes.string,
  pickOnMount: PropTypes.bool
};

ImagePicker.defaultProps = {
  height: 300,
  cropWidth: 640,
  cropHeight: 240,
  bleedWidth: 20,
  onImagePick: (blob) => {},
  className: null,
  pickOnMount: false
};
