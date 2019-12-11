import fileTyper from '../_utilities/filetyper';
import Button from '../Button/Button';

import './FilePicker.scss';

export default class FilePicker extends React.Component {

  constructor(p, c) {
    super(p, c);
    this.state = {
      files: null
    };
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleButtonFileSelect = this.handleButtonFileSelect.bind(this);
    this.selectFileCallback = this.selectFileCallback.bind(this);
    this.handleRemoveFile = this.handleRemoveFile.bind(this);
  }

  componentWillMount() {
    this.loadDefaultValue(this.props.defaultValue);
  }

  componentWillReceiveProps(props) {
    if (props.defaultValue && props.defaultValue !== this.props.defaultValue)
      this.loadDefaultValue(props.defaultValue);
  }

  loadDefaultValue(value) {
    let files;
    if (!value)
      files = null
    else if (Array.isArray(value))
      files = value;
    else
      files = [value];

    _.each(files, (file, i) => {
      if (typeof file == 'string') {
        const fileTyperObj = fileTyper(file);
        files[i] = {
          name: file,
          defaultLoaded: true,
          typeClass: _.get(fileTyperObj, 'fileClass')
          // TODO detectTypeClass
        };
      }
    });

    this.setState({ files });
  }

  loadType(fileType) {
    if (fileType == 'image' || fileType == 'audio') {
      return fileType + '/*';
    } else {
      return null;
    }
  }

  detectTypeClass(type) {
    return type.split('/')[0];
  }

  selectFile() {
    const accept = this.loadType(this.props.fileType);

    // Create Input
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = !!this.props.multiple;
    if (accept) input.accept = accept;

    const component = this;
    const handleFileSelect = (event) => {
      component.selectFileCallback(event.target.files);
      input.removeEventListener('change', handleFileSelect);
    }
    input.addEventListener('change', handleFileSelect);
    input.click();
  }

  selectFileCallback(newFiles) {
    let files;
    if (this.props.multiple) {
      files = this.state.files || [];
      _.each(newFiles, (file) => {
        console.log('selectFileCallback', file);
        file.typeClass = this.detectTypeClass(file.type);
        files.push(file);
      });
    } else {
      files = newFiles;
      files[0].typeClass = this.detectTypeClass(files[0].type);
    }
    this.updateFiles(files);
  }

  readFile(file, callback = ()=>{}) {
    // Read file properties
    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log('FileReader event', e);
      // this.props.onChange(file, e.target.result);
      // this.setState({ fileReaderTarget: e.target.result });
      callback(e.target.result);
    };
    const fileReader = reader.readAsDataURL(file);
    // console.log('fileReader', fileReader);
  }

  loadIcon(file) {
    if (!file || typeof file !== 'object') {
      return 'file'
    } else if (file.typeClass == 'audio') {
      return 'volume-up';
    } else if (file.typeClass == 'image') {
      return 'image';
    } else if (file.typeClass == 'video') {
      return 'video-camera';
    } else {
      return 'file';
    }
  }

  updateFiles(files) {
    this.setState({ files });
    this.props.onChange(files);
  }

  handleRemoveFile(file) {
    const files = _.without(this.state.files, file);
    this.updateFiles(files);
  }

  handleButtonFileSelect() {
    this.selectFile();
  }

  handleFileSelect(event) {
    const { files } = event.target;
    this.updateFiles(files);
    /*
    let file = event.target.files;
    // TODO support for multiple
    if (file instanceof FileList) {
      file = file[0];
    }
    if (!file) return;
    */

    // this.loadFile(file);
    // this.props.onChange(file);
  }

  // fileBlob or imageUrl or base64
  /*
  loadFile(fileBlob) {
    if (typeof fileBlob == 'object') {
      // TODO LOADING UNTIL IMAGE IS READ
      this.setState({ imageUrl: '' });

      if (!FileReader) return;

      const reader = new FileReader();
      // const timeout = setTimeout(function() {
      //      alert('FileReader not functioning');
      // }, 500);
      reader.onload = (e) => {
        // clearTimeout(timeout);
        const imageEncoded = e.target.result;
        this.setState({ imageUrl: imageEncoded });
        // console.log('FileReader event', e);
        // console.log('imageEncoded', imageEncoded);
      };
      const fileData = reader.readAsDataURL(fileBlob);
    } else {
      this.setState({ imageUrl: fileBlob });
    }
  }
  */

  render() {
    const buttonLabel = !this.props.multiple && this.state.files && this.state.files.length ? 'Change File' : 'Select File';
    return (
      <div className={`c-file_picker${this.props.className ? ' ' + this.props.className : ''}`}>
        {/*<input type='file' onChange={this.handleFileSelect} accept={this.props.accept} />*/}
        <Button className='file_picker-select' onClick={this.handleButtonFileSelect}>
          {buttonLabel}
        </Button>
        {_.map(this.state.files, (file, i) => {
          const fileIcon = this.loadIcon(file);
          return (
            <div className='file_picker-file' key={i}>
              <div className='file-icon'>
                <i className={`fa fa-${fileIcon}`} />
              </div>
              <div className='file-name'>
                {file.name}
              </div>
              <Button onClick={this.handleRemoveFile.bind(this, file)}>
                <i className='fa fa-times' />
              </Button>
            </div>
          );
        })}
      </div>
    );
  }
}

FilePicker.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  fileType: PropTypes.string,
  multiple: PropTypes.bool
};

FilePicker.defaultProps = {
  className: null,
  defaultValue: null,
  onChange: (fileBlob, imageUrl) => {},
  fileType: null,
  multiple: false
};
