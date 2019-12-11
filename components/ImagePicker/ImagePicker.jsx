import Button from '../Button/Button';

import './ImagePicker.scss';

export default class ImagePicker extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {};
    this.imageSelected = false;
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.defaultImageUrl && !this.imageSelected) {
      this.loadImage(props.defaultImageUrl);
    }
  }

  handleFileSelect(event) {
    let file = event.target.files;
    // TODO support for multiple
    if (file instanceof FileList) {
      file = file[0];
    }
    if (!file) return;

    this.imageSelected = true;
    this.loadImage(file);
    this.props.onChange(file);
  }

  // fileBlob or imageUrl or base64
  loadImage(fileBlob) {
    if (typeof fileBlob == 'object') {
      this.setState({ imageUrl: '', loading: true });

      if (!FileReader) {
        console.error('Browser not supported.');
        this.setState({ loading: false });
        return;
      }

      const reader = new FileReader();
      // const timeout = setTimeout(function() {
      //      alert('FileReader not functioning');
      // }, 500);
      reader.onload = (e) => {
        // clearTimeout(timeout);
        const imageEncoded = e.target.result;
        this.setState({ imageUrl: imageEncoded, loading: false });
        // console.log('FileReader event', e);
        // console.log('imageEncoded', imageEncoded);
      };
      const fileData = reader.readAsDataURL(fileBlob);
    } else {
      this.setState({ imageUrl: fileBlob });
    }
  }

  handleRemove(e) {
    if (e) e.preventDefault();
    this.imageSelected = false;
    this.setState({ imageUrl: null });
    this.props.onChange(null);
  }

  render() {
    const { imageUrl, loading } = this.state;

    const imageStyle = {
      backgroundImage: imageUrl ? `url('${imageUrl}')` : '',
      height: this.props.height
    };

    return (
      <div className={'c-image_picker' + (this.props.className ? ` ${this.props.className}` : '')} >
        { imageUrl ?
          <div className='image_picker-remove' onClick={this.handleRemove}>
            <i className='fa fa-trash' />
          </div>
          : null
        }
        <input type='file' onChange={this.handleFileSelect} accept={this.props.accept} />
        <div className='image_background' style={imageStyle}>
          {(()=>{
            if (loading) return (<i className='fa fa-circle-o-notch' />);
            else if (!imageUrl) return (<i className='icon fa fa-cloud-upload' />);
          })()}
        </div>
      </div>
    );
  }
}

ImagePicker.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  defaultImageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func
};

ImagePicker.defaultProps = {
  height: 300,
  className: null,
  defaultImageUrl: null,
  accept: 'image/*',
  onChange: (fileBlob, imageUrl) => {}
};
