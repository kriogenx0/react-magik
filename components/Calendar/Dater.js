class Dater {
  constructor(date) {
    this.load(date);
  }

  factory(date) {
    return new Dater(date);
  }

  clone() {
    return this.factory(this.date.getTime());
  }

  cloneDate() {
    return new Date(this.date.getTime());
  }

  // FORMATS
  format() {
    return this.mdy();
  }

  mdy() {
    return this.month() + '/' + this.day() + '/' + this.year();
  }

  // GETTER SETTER
  day(dayNumber) {
    if (typeof dayNumber !== 'undefined') {
      this.date.setDate(dayNumber);
      return this;
    } else {
      return this.date.getDate();
    }
  }

  // GETTING
  dayOfWeek() {
    return this.date.getDay();
  }

  month() {
    return this.date.getMonth() + 1;
  }

  monthName() {
    return Dater.monthList[this.month() - 1];
  }

  year() {
    return this.date.getFullYear();
  }

  daysInMonth() {
    return this.clone().lastDayOfMonth().date.getDate();
  }

  // MUTATING
  load(date) {
    if (date instanceof Dater)
      this.date = date.date;
    else if (date)
      this.date = date instanceof Date ? date : new Date(date);
    else
      this.date = new Date();
  }

  now() {
    this.load();
    return this;
  }

  firstDayOfMonth() {
    this.date.setDate(1);
    return this;
  }

  nextMonth(increment) {
    this.date.setMonth(this.date.getMonth() + (increment || 1));
    return this;
  }

  previousMonth(increment) {
    return this.nextMonth((increment || 1) * -1);
  }

  lastDayOfMonth() {
    this.nextMonth().date.setDate(0);
    return this;
  }

}

Dater.dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
Dater.dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
Dater.monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default Dater;
