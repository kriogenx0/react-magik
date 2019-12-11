import SegmentedControl from '../SegmentedControl/SegmentedControl';
import ComboBox from '../ComboBox/ComboBox';

import './TimePicker.scss';

export default class TimePicker extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {
      hour: 0,
      minute: 0,
      pm: false
    };

    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handlePmChange = this.handlePmChange.bind(this);

    this.generateTimes();
  }

  generateTimes() {
    this.hours = _.times(12, n => n + 1);

    this.minutes = [];
    let time = 0;
    while (time < 60) {
      this.minutes.push(time || '00');
      time += this.props.minuteInterval;
    }
  }

  componentWillMount() {
    this.loadValue(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadValue(props);
  }

  loadValue(props) {
    if (props.value === null) return;
    console.log('loadValue', props.value);

    let { value } = props;
    if (typeof(value) === 'object' && value.fullDate) value = value.fullDate;
    const split = value.split(':');
    // console.log('loadValue split', props.value, split);
    const fullHour = parseInt(split[0]);
    // console.log('fullHour', fullHour);
    let hour = fullHour % 12;
    if (!hour) hour = 12;

    this.hour = hour;
    this.minute = !split[1] || split[1] == 'undefined' ? '00' : split[1];
    this.pm = fullHour > 11;

    this.updateState();
  }

  exportValue() {
    let { hour, pm } = this;
    if (!this.props.twentyFourHour) {
      hour = parseInt(hour) % 12;
      if (!hour) hour = 12;
      pm = ' ' + (this.pm || this.hour > 11 ? 'pm' : 'am');
    } else {
      pm = '';
    }
    return hour + ':' + this.minute + pm;
  }

  fullDate() {
    // console.log('fullDate this', this.hour, this.minute, this.pm);
    const h = parseInt(this.hour);
    const hour = (this.pm ? (h + 12) : h) % 24;
    return hour + ':' + this.minute;
  }

  handleHourChange(hour) {
    this.hour = parseInt(hour);
    this.updateStateAndChange();
  }

  handleMinuteChange(minute) {
    this.minute = parseInt(minute);
    this.updateStateAndChange();
  }

  handlePmChange(tabIndex) {
    this.pm = !!tabIndex;
    this.updateStateAndChange();
  }

  updateStateAndChange() {
    const { hour, minute, pm } = this;

    const timeObject = {
      hour,
      minute,
      pm,
      fullDate: this.fullDate(),
      formatted: this.exportValue()
    };

    // console.log('timeObject', timeObject);
    this.setState(timeObject);
    this.props.onChange(timeObject);
  }

  updateState() {
    const { hour, minute, pm } = this;
    this.setState({ hour, minute, pm });
  }

  render() {
    return (
      <div className='c-time_picker'>
        <div className='time_picker-hour'>
          <ComboBox name='time_hour' items={this.hours} defaultValue={this.state.hour} onSelect={this.handleHourChange} onChange={this.handleHourChange} />
        </div>
        <div className='time_picker-div'>:</div>
        <div className='time_picker-minute'>
          <ComboBox name='time_minute' items={this.minutes} defaultValue={this.state.minute || '00'} onSelect={this.handleMinuteChange} onChange={this.handleMinuteChange} />
        </div>
        <SegmentedControl tabs={TimePicker.pmSelections} onChange={this.handlePmChange} selectedTabIndex={this.state.pm ? 1 : 0} />
      </div>
    );
  }

}

TimePicker.defaultProps = {
  twentyFourHour: false,
  value: null,
  hour: null,
  minute: null,
  pickSeconds: false,
  minuteInterval: 15,
  onChange: () => {}
}

TimePicker.pmSelections = ['am', 'pm'];
