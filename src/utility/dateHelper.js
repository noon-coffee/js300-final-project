class DateHelper {
  static monthNamesShort = [
    "Jan", 
    "Feb", 
    "Mar", 
    "Apr", 
    "May", 
    "Jun",
    "Jul", 
    "Aug", 
    "Sep", 
    "Oct", 
    "Nov", 
    "Dec"
  ];

  static getCalendarDateString = (date) => { 
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  static getCalendarDateParts = (calendarDateString) => {
    const dateParts = calendarDateString.split('-');
    return ({
      yearNum: +dateParts[0],
      monthNum: +dateParts[1],
      dayNum: +dateParts[2]
    });
  }

  static formatExpenseDate = (monthNum, dayNum, yearNum) => 
    `${String(monthNum).padStart(2, '0')}/${String(dayNum).padStart(2, '0')}/${yearNum}`;

  static getMonthYearOptions = (startCalendarDateString, endCalendarDateString) => {
    let options = [];
    const numMonthsInYear = 12;
    const startCalendarDateParts = DateHelper.getCalendarDateParts(startCalendarDateString);
    const endCalendarDateParts = DateHelper.getCalendarDateParts(endCalendarDateString);
    const startMonthNum = startCalendarDateParts.monthNum;
    const startYearNum = startCalendarDateParts.yearNum;
    const endMonthNum = endCalendarDateParts.monthNum;
    const endYearNum = endCalendarDateParts.yearNum;

    for (let year = startYearNum; year <= endYearNum; year++) {
      for (let month = (year === startYearNum) ? startMonthNum : 1; month <= numMonthsInYear; month++) {
        if (year === endYearNum && month > endMonthNum) {
          break;
        }
        options.push({
          value: `${year}-${month}`,
          display: `${year}-${DateHelper.monthNamesShort[month - 1]}`
        });
      }
    }
    return options;
  }

  static formatMonthYearOptionValue = (yearNum, monthNum) => `${yearNum}-${monthNum}`;

  static getMonthYearOptionParts = (monthYearOptionValue) => {
    const yearMonthParts = monthYearOptionValue.split('-')
    return({
      yearNum: +yearMonthParts[0],
      monthNum: +yearMonthParts[1]
    })
  }
}

export default DateHelper;