export default class ImageDropZone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.selectFileCallback = this.selectFileCallback.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
    if (this.props.defaultImageUrl) this.setState({ imageUrl: this.props.defaultImageUrl });
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.selectFileOnMount) {
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
    // console.log('selected file', file);

    // Read file properties
    var reader = new FileReader();
    reader.onload = (e) => {
      // console.log('FileReader event', e);
      this.props.onChange(file, e.target.result);
      this.setState({ imageUrl: e.target.result });
    };
    const fileData = reader.readAsDataURL(file);
    // console.log('fileData', fileData);

    this.setState({ file, fileData });
  }

  render() {
    const imageStyle = {
      backgroundImage: this.state.imageUrl ? `url(${this.state.imageUrl})` : null,
      height: this.props.height
    };

    return (
      <div className={'c-image_drop ' + this.props.className} onClick={this.handleFileSelect}>
        <div className='image_background' style={imageStyle} />
      </div>
    );
  }
}

ImageDropZone.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  selectFileOnMount: PropTypes.bool,
  defaultImageUrl: PropTypes.string,
  onChange: PropTypes.func
};

ImageDropZone.defaultProps = {
  height: 300,
  className: null,
  selectFileOnMount: false,
  defaultImageUrl: null,
  onChange: (fileBlob, imageUrl) => {}
};
