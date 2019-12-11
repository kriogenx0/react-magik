import Dater from './Dater';

import './Calendar.scss';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      days: null,
      dater: null,
      currentMonth: null,
      currentYear: null
    };
  }

  componentWillMount() {
    this.loadDater(new Dater(this.props.date || null));
  }

  handlePreviousClick() {
    this.loadDater(this.state.dater.previousMonth());
  }

  handleNextClick() {
    this.loadDater(this.state.dater.nextMonth());
  }

  handleMonthClick() {
    this.loadDater(this.state.dater.now());
  }

  selectDay(dayNumber) {
    const dater = this.state.dater.day(dayNumber);
    this.loadDater(dater);

    if (this.props.onDateSelect) {
      this.props.onDateSelect(dater);
    }
  }

  loadDater(dater) {
    if (dater)
      this.setState({
        dater: dater,
        currentDay: dater.day(),
        currentMonth: (dater.monthName() + '').substr(0,3),
        currentYear: (dater.year() + '').substr(2)
      });
  }

  renderCalendarMonth() {
    const days = [];

    let clone = this.state.dater.clone().lastDayOfMonth();
    let firstDayOfWeek = this.state.dater.clone().firstDayOfMonth().dayOfWeek();

    let daysInMonth = this.state.dater.daysInMonth();

    // POPULATE PREVIOUS DAYS
    for (var i = 0; i < firstDayOfWeek; i++) {
      days.push({
        value: null,
        active: false
      });
    }

    // POPULATE MONTH DAYS
    for (var i = 1; i <= daysInMonth; i++) {
      days.push({
        value: i,
        active: true,
        current: this.state.currentDay === i
      });
    }

    return _.map(days, (day, i) => {
      let dayClassName = `calendar-day ${day.active ? 'day-active' : 'day-inactive'}${day.current ? ' day-current' : ''}`;
      return (
        <div className={dayClassName} key={i} onClick={( () => { return this.selectDay(day.value); } )}>
          {day.value}
        </div>
      );
    });
  }

  render() {
    return (
      <div className='c-calendar'>
        <div>
          <div className='btn cal-prev' onClick={this.handlePreviousClick.bind(this)}>
            &larr;
          </div>
          <div className='btn cal-next' onClick={this.handleNextClick.bind(this)}>
            &rarr;
          </div>
          <div className='btn cal-month' onClick={this.handleMonthClick.bind(this)}>
            {this.state.currentMonth} {this.state.currentYear}
          </div>
        </div>
        {this.renderCalendarMonth()}
        <div className='clear' />
      </div>
    );
  }
}
