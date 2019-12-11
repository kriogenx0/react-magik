import Button from '../Button/Button';

import './ImagePicker.scss';

export default class ImagePicker extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {};
    this.imageSelected = false;

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
    if (props.defaultImageUrl && !this.imageSelected) {
      this.setState({ imageUrl: props.defaultImageUrl });
    }
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
      console.log('input val', input.value);
      console.log('handling file select', event);
      if (typeof callback == 'function' && _.has(event, 'target.files')) {
        callback(options.multiple ? event.target.files : event.target.files[0]);
      }
      input.removeEventListener('change', handleFileSelect);
    }
    console.log('clicking');
    input.addEventListener('click', handleFileSelect);
    input.click();
  }

  selectFileCallback(file) {
    console.log('selected file', file);

    // Read file properties
    var reader = new FileReader();
    // const timeout = setTimeout(function() {
    //      alert('FileReader not functioning');
    // }, 500);
    reader.onload = (e) => {
      // clearTimeout(timeout);
      this.imageSelected = true;
      const imageEncoded = e.target.result;
      this.props.onChange(file, imageEncoded);
      this.setState({ imageUrl: imageEncoded });

      console.log('FileReader event', e);
      console.log('imageEncoded', imageEncoded);
    };
    const fileData = reader.readAsDataURL(file);
    console.log('fileData', fileData);

    this.setState({ file, fileData });
  }

  render() {
    const { imageUrl } = this.state;

    const imageStyle = {
      backgroundImage: imageUrl ? `url('${imageUrl}')` : '',
      height: this.props.height
    };

    return (
      <div className={'c-image_picker' + (this.props.className ? ` ${this.props.className}` : '')} >
        <input type='file' onChange={e => console.log('change', e)} />
        <div className='image_background' style={imageStyle} />
      </div>
    );
  }
}

ImagePicker.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  selectFileOnMount: PropTypes.bool,
  defaultImageUrl: PropTypes.string,
  onChange: PropTypes.func
};

ImagePicker.defaultProps = {
  height: 300,
  className: null,
  selectFileOnMount: false,
  defaultImageUrl: null,
  onChange: (fileBlob, imageUrl) => {}
};
