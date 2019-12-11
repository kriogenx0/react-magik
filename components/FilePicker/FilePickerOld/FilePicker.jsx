import Button from '../Button/Button';

// import './FilePicker.scss';

export default class FilePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileReader: null,
      fileReaderTarget: null
    };
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.selectFileCallback = this.selectFileCallback.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
    if (this.props.defaultFile) this.setState({ file: this.props.defaultFile });
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (this.props.fileType) this.loadType(this.props.fileType);
    if (props.selectFileOnMount) {
      this.handleFileSelect();
    }
  }

  handleFileSelect() {
    this.selectFile(this.selectFileCallback, this.accept);
  }

  loadType(fileType) {
    if (fileType == 'image') {
      this.accept = 'image/*';
    } else if (fileType == 'audio') {
      this.accept = 'audio/*';
    } else {
      this.accept = null;
    }
  }

  selectFile(callback, options) {
    options = options || { multiple: false, accept: this.accept };

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
      this.setState({ fileReaderTarget: e.target.result });
    };
    const fileReader = reader.readAsDataURL(file);
    // console.log('fileReader', fileReader);
    this.setState({ file, fileReader });
  }

  removeFile() {
    this.setState({ file: null, fileReader: null, fileReaderTarget: null });
  }

  render() {
    return (
      <div className={'c-file_picker ' + this.props.className}>
        <Button onClick={this.handleFileSelect}>
          Select File
        </Button>
        {(() => {
          if (this.state.file) {
            return (
              <div>
                <div>
                  {_.get(this.state, 'file.name')}
                </div>
                <Button onClick={this.removeFile}>
                  Remove File
                </Button>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

FilePicker.propTypes = {
  className: PropTypes.string,
  selectFileOnMount: PropTypes.bool,
  defaultFile: PropTypes.string,
  onChange: PropTypes.func,
  fileType: PropTypes.string
};

FilePicker.defaultProps = {
  className: null,
  selectFileOnMount: false,
  defaultFile: null,
  onChange: (fileBlob, imageUrl) => {},
  fileType: null
};
