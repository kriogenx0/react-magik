import numeral from 'numeral';

import './NumericField.scss';

export default class NumericField extends React.Component {

  constructor(props) {
    super(props);

    this.previousValue = null;
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    this.whenTypingFormatFunction = NumericField.loadFormatFunction(props.whenTypingFormat || NumericField.defaultWhenTypingFormatFunction);
    this.format = NumericField.loadFormatFunction(props.format || props.onBlurFormat);

    this.setState({
      value: this.format(props.value)
    });
  }

  handleOnChange(event) {
    if (!event.target) { return; }

    var val = event.target.value;

    val = this.whenTypingFormatFunction(val);

    if (val !== null) {
      this.setState({ value: val });

      if (this.props.onChange) {
        this.props.onChange(val);
      }
    }
  }

  handleOnFocus(e) {
    var val;
    // ONLY FIRST TIME
    if (this.previousValue === null && this.props.focusValue !== null) {
      val = this.props.focusValue;
      this.setState({ value: val });
    } else {
      val = e.target.value;
    }

    if (this.props.onFocus) {
      this.props.onFocus(e.target.value, this.previousValue);
    }

    this.previousValue = val;
  }

  handleOnBlur(event) {
    var val = this.state.value;
    val = this.format(val);
    this.setState({ value: val });

    if (this.props.onBlur) {
      this.props.onBlur(val);
    }
    if (this.props.onBlurChange && this.previousValue !== val) {
      this.props.onBlurChange(val, this.previousValue);
    }
  }

  render() {
    return (
      <div className="component-numericfield">
        <input type="text" {...this.props}
               onChange={(e)=>{this.handleOnChange(e)}}
               onFocus={(e)=>{this.handleOnFocus(e)}}
               onBlur={(e)=>{this.handleOnBlur(e)}}
               value={this.state.value}
        />
      </div>
    );
  }

}

NumericField.formats = {
  integer: (v) => {
    return numeral(v).format('0');
  },
  twoDecimal: (v) => {
    return numeral(v).format('0.00');
  },
  numeral: (value, format) => {
    return numeral(value).format(format);
  }
};

NumericField.loadFormatFunction = (format) => {
  // IF FUNCTION
  if (typeof format === 'function') {
    return format;
  }
  // IF formats EXISTS
  else if (NumericField.formats[format]) {
    return NumericField.formats[format];
  }
  // USE numeral
  else if (NumericField.formats.numeral && format) {
    return (v) => {
      return NumericField.formats.numeral(v, format);
    };
  }
  // EMPTY FUNCTION
  else {
    return (value) => { return value };
  }
};

NumericField.numeralRegex = new RegExp('^\\d*\\.?\\d*$');

NumericField.defaultWhenTypingFormatFunction = (val) => {
  // need to do this, otherwise parsing fails when trying to parse the value "."
  if (val === '.') { val = '0.'; }

  // block invalid character input by returning null
  if (!NumericField.numeralRegex.test(val)) {
    val = null;
  }

  return val;
};

NumericField.defaultProps = {
  onChange: null,
  onBlurFormat: 'integer',
  focusValue: null
};

NumericField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onBlurChange: PropTypes.func,
  focusValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  whenTypingFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
  onBlurFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
  // format is an alias for onBlurFormat, it has been deprecated
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func])
};
