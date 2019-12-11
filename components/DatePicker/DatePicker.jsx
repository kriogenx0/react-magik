// moment = require 'moment'

import TextBox from 'lib/TextBox/TextBox';

import Calendar from './Calendar';

class DatePickerDialog extends React.Component {
  render() {
    if (!this.props || !this.props.open) return null;

    // console.log('this.props.date', this.props.date);

    return (
      <div className='c-date_picker_dialog'>
        <Calendar {...this.props} />
      </div>
    );
  }
}

export default class DatePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      date: null,
      dateValue: null
    };
  }

  handleFocus() {
    this.setState({ open: true });
  }

  handleBlur() {
    // this.setState({ open: false });
  }

  onDateSelect(date) {
    // console.log('date', date);
    this.setState({
      open: false,
      date: date,
      dateValue: date.mdy()
    });
  }

  render() {
    return (
      <div className='c-date_picker'>
        <TextBox
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          value={this.state.dateValue}
        />
        <DatePickerDialog
          open={this.state.open}
          date={this.state.date}
          onDateSelect={this.onDateSelect.bind(this)}
        />
      </div>
    );
  }
}

DatePicker.defaultProps = {
  selectDateRange: false,
  dateFormat: null,
  timeFormat: null
}
