// # Renders a rich text editor. This uses the "Redactor" rich text editor library
// # with the scss completely re-written.

import './redactor-lib';
import './Redactor.scss';

export default class Redactor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: props.value
    };

    this.setFocus = this.setFocus.bind(this);
  }

  componentDidMount() {
    this.createRedactorObject();
  }

  componentWillReceiveProps(props) {
    // this.setValue props.value
  }

  componentWillUnmount() {
    this.redactor.redactor('core.destroy');
  }

  setFocus(shouldFocus) {
    this.setState({ focused: shouldFocus });
  }

  handleChange(event) {
    this.onChangeCallback(event.target.value);
  }

  createRedactorObject() {
    // this.redactor = $(this.refs.textarea.getDOMNode()).redactor({
    this.redactor = $(this.refs.textarea).redactor({
      buttons: this.props.buttons,
      formatting: this.props.formatting,
      placeholder: this.props.placeholder,
      maxHeight: this.props.maxHeight,
      value: this.props.value,
      focusCallback() {
        this.setFocus(true);
      },
      blurCallback() {
        this.setFocus(false);
      },
      changeCallback() {
        this.onChangeCallback(this.getValue());
      }
    });
  }

  getValue() {
    this.redactor.redactor('code.get');
  }

  onChangeCallback(value) {
    if (this.props.onChange)
      this.props.onChange(value);
  }

  setValue(value) {
    if (this.redactor) {
      this.redactor.redactor('insert.set', value || '');
    }
  }

  render() {
    const className = 'c-redactor' + (this.state.focused ? ' rte-focused' : '');

    return (
      <div className={className}>
        <textarea ref="textarea" name={this.props.name} onChange={this.handleChange} value={this.props.value} />
      </div>
    );
  }
}

Redactor.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  buttons: PropTypes.array,
  formatting: PropTypes.array,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func
};

Redactor.getDefaultProps = {
  value: null,
  name: null,
  placeholder: null,
  buttons: ['formatting', 'bold', 'italic', 'unorderedlist', 'link', 'html'],
  formatting: ['p', 'h1', 'h2', 'h3'],
  maxHeight: 260,
  onChange: () => {}
};
